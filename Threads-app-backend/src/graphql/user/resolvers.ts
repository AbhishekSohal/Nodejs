const { UserService } = require('../../services/user');

const queries = {
  getUserToken: async (_: any, payload: any) => {
    const token = await UserService.getUserToken(payload);
    return token;
  },
  getCurrentLoggedInUser: async(_:any, __:any, context: any)=>{
    if (!context.userId) {
      throw new Error('Not authenticated');
    }
    return UserService.getUserById(context.userId);
  }
};

const mutations = {
  createUser: async (_: any, payload: any) => {
    const res = await UserService.createUser(payload);
    return res.id;
  }
};

const resolvers = {
  Query: queries,
  Mutation: mutations
};

module.exports = resolvers;