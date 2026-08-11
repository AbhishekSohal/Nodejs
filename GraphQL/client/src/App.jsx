import { gql, useQuery } from '@apollo/client';

const query = gql`
  query GetTodos {
    getTodos {
        id
        title
        completed
        user {
            id
            name
        }
    }
  }
`;

function App() {
    const { loading, error, data } = useQuery(query);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <main className="shell">
          <section className="hero-copy" style={{ width: 'min(720px, 100%)' }}>
            <p className="eyebrow">Apollo Client</p>
            <h1>GraphQL data is connected.</h1>
            <p className="lede">The query below is running against http://localhost:4000/graphql.</p>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </section>
        </main>
    );
}

export default App;
