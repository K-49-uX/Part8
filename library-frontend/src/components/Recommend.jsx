import { useQuery } from '@apollo/client/react'
import { ME, ALL_BOOKS } from '../queries'

const Recommend = ({ show }) => {
  const userResult = useQuery(ME, {
    skip: !show,
  })

  const favoriteGenre = userResult.data?.me?.favoriteGenre

  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !show || !favoriteGenre,
  })

  if (!show) {
    return null
  }

  if (userResult.loading || (favoriteGenre && booksResult.loading)) {
    return <div>loading...</div>
  }

  const books = booksResult.data?.allBooks || []

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <b>{favoriteGenre}</b>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author?.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend