const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const cors = require('cors');
const axios = require('axios');

const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
  }
  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
    user: User!
  }

  type Query {
    getTodos: [Todo!]!
    getUsers: [User!]!
    getUser(id: ID!): User // Fetch a single user by ID
  }
`;



const resolvers = {
    Todo: {
        user: async (parent) => {
            const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${parent.userId}`);
            return response.data;
        }
    },
  Query: {
    getTodos: async () => (await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
    getUsers: async () => (await axios.get('https://jsonplaceholder.typicode.com/users')).data,
    getUser: async (_, { id }) => {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
        return response.data;
      } catch (error) {
        console.error(error);
        return null; // Return null if user not found or an error occurs
      }
  },
}};

async function startApolloServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  app.use(cors());
  app.use(express.json());
  await server.start();
  app.use('/graphql', expressMiddleware(server));
  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  });
}

startApolloServer().catch((error) => {
  console.error(error);
  process.exit(1);
});