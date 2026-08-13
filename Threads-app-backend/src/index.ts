import express = require("express");
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');

async function startApolloServer() {
    const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const typeDefs = `
  type Query {
    hello: String
    sayHello(name: String!): String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
    sayHello: (_: any, { name }: { name: string }) => `Hello, ${name}!`,
  },
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