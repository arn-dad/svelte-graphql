const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString, Console } = require('../../helpers');
const { transformEvent } = require('./resolverHelper');

module.exports = {
  events: () => Event.find()
    .then(events => events.map(event => transformEvent(event)))
    .catch((err) => {
      Console.log(err);
      throw err;
    }),
  createEvent: async (args, req) => {
    Console.log('TCL: req.isAuth', req.isAuth, req.userId);
    if (!req.isAuth) {
      throw new Error('Unauthorized!');
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: dateToString(args.eventInput.date),
      creator: req.userId,
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const creator = await User.findById(req.userId);

      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      Console.log(err);
      throw err;
    }
  },
};