const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const server = new ApolloServer({});
  app.use(bodyParser.json());
  app.use(cors());
  await server.start()
  app.use('/graphql', expressMiddleware(server));
  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  });
}