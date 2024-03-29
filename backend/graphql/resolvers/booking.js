const Event = require('../../models/event');
const Booking = require('../../models/booking');

const { transformBooking, transformEvent } = require('./resolverHelper');
const { Console } = require('../../helpers');

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized!');
    }
    try {
      const booking = await Booking.find({ user: req.userId });
      const mapedBookings = booking.map(booking => transformBooking(booking));
      console.log('TCL: mapedBookings', mapedBookings);

      return mapedBookings;
    } catch (error) {
      Console.log('TCL: error', error);
      throw error;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized!');
    }
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent,
    });
    const result = await booking.save();

    return transformBooking(result);
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized!');
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = transformEvent(booking.event);

      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (error) {
      throw error;
    }
  },
};
