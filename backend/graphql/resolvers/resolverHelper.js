const DataLoader = require('dataloader');

const User = require('../../models/user');
const Event = require('../../models/event');
const { dateToString, Console } = require('../../helpers');

const event = async (eventsIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventsIds } });
    return events.map(event => transformEvent(event));
  } catch (err) {
    throw err;
  }
};

const eventLoader = new DataLoader((eventsIds) => { // EventLoader
  return event(eventsIds);
});

const userLoader = new DataLoader((userIds) => { // UserLoader
  return User.find({ _id: { $in: userIds } });
});

const user = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      createEvents: eventLoader.loadMany.bind(this, user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

const transformEvent = event => ({
  ...event._doc,
  _id: event.id,
  date: dateToString(event._doc.date),
  creator: user.bind(this, event.creator),
});

const singleEvent = async (eventId) => {
  try {
    const event = await eventLoader.load(eventId);

    return event;
  } catch (err) {
    Console.log('TCL: singleEvent -> err', err);
  }
};

const transformBooking = booking => ({
  ...booking._doc,
  _id: booking._id,
  user: user.bind(this, booking._doc.user),
  event: singleEvent.bind(this, booking._doc.event),
  createdAt: dateToString(booking._doc.createdAt),
  updatedAt: dateToString(booking._doc.updatedAt),
});

exports.user = user;
exports.event = event;
exports.singleEvent = singleEvent;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
