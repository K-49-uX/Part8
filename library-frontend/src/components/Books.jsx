import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = ({ show }) => {
  const [selectedGenre, setSelectedGenre] = useState(null)

  // Query to obtain all unique genres
  const allBooksResult = useQuery(ALL_BOOKS)

  // Query sent to the server with the specific genre variable
  const filteredResult = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
  })

  if (!show) {
    return null
  }

  if (allBooksResult.loading || filteredResult.loading) {
    return <div>loading...</div>
  }

  const allBooks = allBooksResult.data?.allBooks || []
  const books = filteredResult.data?.allBooks || []

  // Extract unique genres across all books
  const genres = Array.from(new Set(allBooks.flatMap((b) => b.genres || [])))

  return (
    <div>
      <h2>books</h2>

      {selectedGenre && (
        <p>
          in genre <b>{selectedGenre}</b>
        </p>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.id || b.title}>
              <td>{b.title}</td>
              <td>{b.author ? b.author.name : ''}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 15 }}>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setSelectedGenre(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setSelectedGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books