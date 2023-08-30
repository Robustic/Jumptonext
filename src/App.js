import React from 'react'
import StopSearch from './components/StopSearch'
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import env from 'react-dotenv'

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('jumptonext-user-token')
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : null,
        },
    }
})

const httpLink = createHttpLink({
    uri: 'http://localhost:4000',
})

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
})

const App = () => {
    return (
        <main>
            <ApolloProvider client={client}>
                <StopSearch />
            </ApolloProvider>
        </main>
    )
}

export default App
