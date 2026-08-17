import express = require('express');

const createApolloServer = require('./graphql');
const { expressMiddleware } = require('@as-integrations/express5');
const { UserService } = require('./services/UserService');

async function startApolloServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
  });

  const apolloServer = await createApolloServer();
  app.use('/graphql', expressMiddleware(apolloServer, {
    context: async ({ req }: { req: express.Request }) => {
      const token = req.headers.authorization || '';
      try {
        const decoded = UserService.decodeJWT(token);
        return { userId: decoded.userId };
      } catch (error) {
        return {};
      }
    },
  }));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startApolloServer().catch((error) => {
  console.error('Error starting the server:', error);
});