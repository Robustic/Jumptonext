import React from 'react'
import StopSearch from './components/StopSearch'
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
    gql,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { GET_SUB } from './queries/queries'
import env from 'react-dotenv'

const authLinkDb = setContext((_, { headers }) => {
    const token = localStorage.getItem('jumptonext-user-token')
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : null,
        },
    }
})

const httpLinkDb = createHttpLink({
    uri: 'https://jumptonext-backend.onrender.com',
})

const clientDb = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLinkDb.concat(httpLinkDb),
})

const response = await clientDb.query({ query: GET_SUB })

const authLinkDt = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            'digitransit-subscription-key': response.data.sub.sub,
        },
    }
})

const httpLinkDt = createHttpLink({
    uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
})

const clientDt = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLinkDt.concat(httpLinkDt),
})

const App = () => {
    return (
        <main>
            <ApolloProvider client={clientDt}>
                <StopSearch clientDb={clientDb} />
            </ApolloProvider>
        </main>
    )
}

export default App
