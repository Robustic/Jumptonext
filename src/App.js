import React from 'react'
import StopSearch from './components/StopSearch'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'

const client = new ApolloClient({
    uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
})

const App = () => {
    return (
        <main>
            <section className="container">
                <ApolloProvider client={client} >
                    <StopSearch />
                </ApolloProvider>
            </section>
        </main>
    )
}

export default App