const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const qraphQlSchima = require('./graphql/schema');
const qraphQlResolvers = require('./graphql/resolvers');
const isAuth = require('./middleware/is-auth');

const app = express();


app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use(
  '/graphql',
  graphqlHttp({
    schema: qraphQlSchima,
    rootValue: qraphQlResolvers,
    graphiql: true,
  }),
);

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASS
  }@testdb-ikkcw.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
)
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    throw err;
  });
