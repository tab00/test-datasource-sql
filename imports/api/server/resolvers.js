export const resolvers = {
  Query: {
    // books: async (root, args, { dataSources, user }) => {
    books: async (root, args, context) => {
      console.log(`Query context: ${JSON.stringify(context)}`)
      // if (!context.user) throw new Error("Please log in.")

      const books = await context.dataSources.dsBooks.getBooks(context.user ? { idOfOwner: context.user._id } : {}) //Meteor user available because of https://github.com/apollographql/meteor-integration
      return books
    }
  },
}
