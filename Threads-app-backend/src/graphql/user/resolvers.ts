const queries = {
  hello: () => 'Hello from Threads backend!'
};

const mutations = {
  createUser: async (_: any, { firstName, lastName, email, password }: any) => {
    return `User created successfully: ${firstName} ${lastName} (${email})`;
  }
};

const resolvers = {
  Query: queries,
  Mutation: mutations
};

module.exports = resolvers;