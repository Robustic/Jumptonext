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
    return {
        headers: {
            ...headers,
            'digitransit-subscription-key': env.DIGI_TRANSIT_DESCRIPTION,
        },
    }
})

const httpLink = createHttpLink({
    uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
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
