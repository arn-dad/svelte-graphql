const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');


module.exports = {
  createUser: args => User.findOne({
    email: args.userInput.email,
  })
    .then((user) => {
      if (user) {
        throw new Error('User exists already');
      }
      return bcrypt.hash(args.userInput.password, 12);
    })
    .then((hasedPass) => {
      const user = new User({
        email: args.userInput.email,
        password: hasedPass,
      });
      return user.save();
    })
    .then(result => ({ ...result._doc, password: null, id: result.id }))
    .catch((err) => { throw err; }),
  login: async ({ email: userEmail, password }) => {
    console.log('TCL: email, password', userEmail, password);
    const user = await User.findOne({ email: userEmail });
    console.log('TCL: user', user);

    if (!user) {
      throw new Error('User does not exist!');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    console.log('TCL: isEqual', isEqual);

    if (!isEqual) {
      throw new Error('User does not exist!');
    }
    console.log('TCL: isEqual', isEqual);
    const token = jwt.sign({ userId: user.id, email: user.email }, 'secretkey', {
      expiresIn: '1h',
    });

    return {
      userId: user.id, token, tokenExpiration: 1,
    };
  },
};
