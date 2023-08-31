import Button from 'react-bootstrap/Button'

import LoginForm from './LoginForm'

const LoggedIn = ({ clientDb, user, setUser }) => {
    const logout = () => {
        setUser(null)
        localStorage.clear()
        clientDb.resetStore()
    }

    const username = user ? user.username : ''

    return (
        <div>
            <Button variant="primary" onClick={logout}>
                Logout
            </Button>
            <p>'{username}' logged in</p>
        </div>
    )
}

const LoginLogout = ({ clientDb, user, setUser }) => {
    if (user) {
        return <LoggedIn clientDb={clientDb} user={user} setUser={setUser} />
    }

    return (
        <div>
            <Button variant="primary" onClick={() => console.log('login')}>
                Login
            </Button>
            <LoginForm clientDb={clientDb} setUser={setUser} />
        </div>
    )
}

const LinkBar = ({ clientDb, user, setUser }) => {
    return <LoginLogout clientDb={clientDb} user={user} setUser={setUser} />
}

export default LinkBar
