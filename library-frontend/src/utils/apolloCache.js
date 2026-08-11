import { ALL_BOOKS } from '../queries'

export const addBookToCache = (cache, addedBook) => {
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery({ query: ALL_BOOKS }, (data) => {
    if (!data) {
      return { allBooks: [addedBook] }
    }

    const bookExists = data.allBooks.some((b) => b.id === addedBook.id)

    if (bookExists) {
      return data
    }

    return {
      allBooks: uniqByTitle(data.allBooks.concat(addedBook)),
    }
  })
}