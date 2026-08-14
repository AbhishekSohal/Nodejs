import express = require("express");
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const { prisma } = require('./lib/db');

async function startApolloServer() {
    const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const typeDefs = `
  type Query {
    hello: String
    sayHello(name: String!): String
  }
  type Mutation {
    createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
    sayHello: (_: any, { name }: { name: string }) => `Hello, ${name}!`,
  },
  Mutation: {
    createUser: async (_: any, { firstName, lastName, email, password }: { firstName: string; lastName: string; email: string; password: string }) => {
      await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password,
          salt: "randomsalt", // In a real application, generate a proper salt and hash the password
        },
      });
      return true;

    }
  }
};

// Create GraphQL server
const server = new ApolloServer({
  
  typeDefs,
  resolvers,
});
// Start the server
await server.start();

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.use('/graphql', expressMiddleware(server));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
}

startApolloServer().catch((error) => {
  console.error('Error starting the server:', error);
});