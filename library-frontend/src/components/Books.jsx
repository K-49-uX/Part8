import { useState } from 'react'

const Books = ({ show, books }) => {
  const [selectedGenre, setSelectedGenre] = useState('all genres')

  if (!show) {
    return null
  }

  // Extract all unique genres from the books list
  const allGenres = Array.from(
    new Set(books.flatMap((book) => book.genres || []))
  )

  // Filter books based on the selected genre
  const filteredBooks =
    selectedGenre === 'all genres'
      ? books
      : books.filter((b) => b.genres && b.genres.includes(selectedGenre))

  return (
    <div>
      <h2>books</h2>

      {selectedGenre !== 'all genres' && (
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
          {filteredBooks.map((b) => (
            <tr key={b.id || b.title}>
              <td>{b.title}</td>
              <td>{b.author ? b.author.name : ''}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 15 }}>
        {allGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </button>
        ))}
        <button onClick={() => setSelectedGenre('all genres')}>
          all genres
        </button>
      </div>
    </div>
  )
}

export default Books