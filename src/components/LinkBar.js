import Button from 'react-bootstrap/Button'
import { useQuery, useApolloClient } from '@apollo/client'

import LoginForm from './LoginForm'
import { GET_ME } from '../queries/queries'

const LoggedIn = ({ token, setToken }) => {
    const client = useApolloClient()

    const { loading, error, data } = useQuery(GET_ME)

    const logout = () => {
        setToken(null)
        localStorage.clear()
        client.resetStore()
    }

    const username =
        loading === false || data.me === false ? '' : data.me.username

    return (
        <div>
            <Button variant="primary" onClick={logout}>
                Logout
            </Button>
            <p>'{username}' logged in</p>
        </div>
    )
}

const LoginLogout = ({ token, setToken }) => {
    if (token) {
        return <LoggedIn token={token} setToken={setToken} />
    }

    return (
        <div>
            <Button variant="primary" onClick={() => console.log('login')}>
                Login
            </Button>
            <LoginForm setToken={setToken} />
        </div>
    )
}

const LinkBar = ({ token, setToken }) => {
    return <LoginLogout token={token} setToken={setToken} />
}

export default LinkBar
