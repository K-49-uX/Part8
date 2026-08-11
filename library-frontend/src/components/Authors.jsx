import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const Authors = ({ show, token, setError }) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const result = useQuery(ALL_AUTHORS);

  const [changeBorn] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      if (setError) {
        setError(
          error.graphQLErrors?.[0]?.message || "Failed to update author",
        );
      }
    },
  });

  if (!show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const authors = result.data?.allAuthors || [];

  const submit = async (event) => {
    event.preventDefault();
    const selectedName = name || (authors[0] ? authors[0].name : "");

    changeBorn({
      variables: {
        name: selectedName,
        setBornTo: parseInt(born, 10),
      },
    });

    setName("");
    setBorn("");
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {token && (
        <div>
          <h3>Set birthyear</h3>
          <form onSubmit={submit}>
            <div>
              <label htmlFor="author-select">name</label>
              <select
                id="author-select"
                name="name"
                value={name || (authors[0] ? authors[0].name : "")}
                onChange={({ target }) => setName(target.value)}
              >
                {authors.map((a) => (
                  <option key={a.name} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="born">born</label>
              <input
                id="born"
                type="number"
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Authors;
