const { AuthenticationError, ForbiddenError } = require("./utils/errors");

const resolvers = {
  Query: {
    user: async (_, { id }, { dataSources }) => {
      const user = await dataSources.accountsAPI.getUser(id);
      if (!user) {
        throw new Error("No user found for this Id");
      }
      return user;
    },
    me: async (_, __, { dataSources, userId }) => {
      if (!userId) throw AuthenticationError();
      const user = await dataSources.accountsAPI.getUser(userId);
      return user;
    },
  },
  Mutation: {
    updateProfile: async (
      _,
      { updateProfileInput },
      { dataSources, userId }
    ) => {
      if (!userId) throw AuthenticationError();
      try {
        const updatedUser = await dataSources.accountsAPI.updateUser({
          userId,
          userInfo: updateProfileInput,
        });
        return {
          code: 200,
          success: true,
          message: "Profile successfully updated!",
          user: updatedUser,
        };
      } catch (err) {
        return {
          code: 400,
          success: false,
          message: err,
        };
      }
    },
  },
  User: {
    __resolveType(user) {
      return user.role;
    },
  },
  Host: {
    __resolveReference: (user, { dataSources }) => {
      return dataSources.accountsAPI.getUser(user.id);
    },
  },
  Guest: {
    __resolveReference: (user, { dataSources }) => {
      return dataSources.accountsAPI.getUser(user.id);
    },
  },
};

module.exports = resolvers;
