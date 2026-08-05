const Author = require('./models/author')
const Book = require('./models/book')

const resolvers = {
  Query: {
    authorCount: async () => Author.collection.countDocuments(),
    bookCount: async () => Book.collection.countDocuments(),
    allBooks: async () => {
      return Book.find({}).populate('author')
    },
    allAuthors: async () => {
      return Author.find({})
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }

      const book = new Book({ ...args, author: author._id })
      await book.save()

      return book.populate('author')
    },
  },
}

module.exports = resolvers