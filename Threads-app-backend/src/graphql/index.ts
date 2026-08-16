const { ApolloServer } = require('@apollo/server');
const User = require('./user');

async function createApolloServer() {
  const server = new ApolloServer({
    typeDefs: `
      type Query {
        ${User.queries}
      }

      type Mutation {
        ${User.mutations}
      }
    `,
    resolvers: {
      Query: User.resolvers.Query,
      Mutation: User.resolvers.Mutation,
    },
  });

  await server.start();
  return server;
}

module.exports = createApolloServer;