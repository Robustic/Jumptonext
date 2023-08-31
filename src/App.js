import React, { useState, useEffect } from 'react'
import Main from './components/Main'
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

const token = localStorage.getItem('jumptonext-user-token')
    ? localStorage.getItem('jumptonext-user-token').toString()
    : null

const App = () => {
    const [clientDb, setClientDb] = useState(null)
    const [clientDt, setClientDt] = useState(null)

    useEffect(() => {
        const authLinkDb = setContext((_, { headers }) => {
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

        const clientDatabase = new ApolloClient({
            cache: new InMemoryCache(),
            link: authLinkDb.concat(httpLinkDb),
        })

        setClientDb(clientDatabase)

        if (!clientDt) {
            clientDatabase.query({ query: GET_SUB }).then((response) => {
                const authLinkDt = setContext((_, { headers }) => {
                    return {
                        headers: {
                            ...headers,
                            'digitransit-subscription-key':
                                response.data.sub.sub,
                        },
                    }
                })

                const httpLinkDt = createHttpLink({
                    uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
                })

                setClientDt(
                    new ApolloClient({
                        cache: new InMemoryCache(),
                        link: authLinkDt.concat(httpLinkDt),
                    }),
                )
            })
        }
    }, [token])

    if (!clientDt || !clientDb) {
        return <main></main>
    }

    return (
        <main>
            <ApolloProvider client={clientDt}>
                <Main clientDb={clientDb} />
            </ApolloProvider>
        </main>
    )
}

export default App
