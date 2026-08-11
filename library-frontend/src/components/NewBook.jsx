import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'

const NewBook = ({ show, setPage }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    update: (cache, response) => {
      const addedBook = response.data.addBook

      // Helper function to update the cache for specific query variables
      const updateBookCache = (variables) => {
        cache.updateQuery({ query: ALL_BOOKS, variables }, (data) => {
          if (!data) return null
          // Avoid duplicate entries
          const isDuplicate = data.allBooks.some((b) => b.id === addedBook.id)
          if (isDuplicate) return data
          return {
            allBooks: data.allBooks.concat(addedBook),
          }
        })
      }

      // Update the unfiltered books query cache
      updateBookCache()
      updateBookCache({ genre: null })

      // Update cache for each genre the new book belongs to
      addedBook.genres.forEach((g) => {
        updateBookCache({ genre: g })
      })
    },
    onError: (error) => {
      console.error(error.message)
    },
  })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    createBook({
      variables: {
        title,
        author,
        published: parseInt(published),
        genres,
      },
    })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
    setPage('books')
  }

  const addGenre = () => {
    if (genre.trim()) {
      setGenres(genres.concat(genre.trim()))
      setGenre('')
    }
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook