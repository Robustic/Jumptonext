import Main from './components/Main'
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { GET_SUB } from './queries/userQueries'
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

const dbUri =
    process.env.REACT_APP_USE_DB === 'test'
        ? process.env.REACT_APP_TEST_DB_URL
        : process.env.REACT_APP_PRODUCTION_DB_URL

const dtUri = process.env.REACT_APP_DIGITR_URL

const subText = process.env.REACT_APP_SUB

const httpLinkDb = createHttpLink({
    uri: dbUri,
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
        const newHeaders = {
            headers: {
                ...headers,
            },
        }
        newHeaders.headers[subText] = response.data.sub.sub
        return newHeaders
    })

    const httpLinkDt = createHttpLink({
        uri: dtUri,
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
                <Main clientDatabase={clientDatabase} />
            </ApolloProvider>
        </main>
    )
}

export default App
