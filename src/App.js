import Main from './components/Main'
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
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

const clientDatabase = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLinkDb.concat(httpLinkDb),
})

const giveclientDigitransfer = async () => {
    const response = await clientDatabase.query({
        query: GET_SUB,
        fetchPolicy: 'network-only',
    })
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

    return new ApolloClient({
        cache: new InMemoryCache(),
        link: authLinkDt.concat(httpLinkDt),
    })
}

const clientDigitransfer = await giveclientDigitransfer()

const App = () => {
    if (!clientDigitransfer || !clientDatabase) {
        return <main></main>
    }

    return (
        <main>
            <ApolloProvider client={clientDigitransfer}>
                <Main clientDb={clientDatabase} />
            </ApolloProvider>
        </main>
    )
}

export default App
