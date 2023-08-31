import { useState } from 'react'

import { LOGIN, GET_ME } from '../queries/queries'

const LoginForm = ({ clientDb, user, setUser, form, setForm }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [token, setToken] = useState('')

    if (form !== 'login') {
        return <></>
    }

    const submit = async (event) => {
        event.preventDefault()

        clientDb
            .mutate({
                mutation: LOGIN,
                variables: { username: username, password: password },
            })
            .then((result) => {
                setToken(result.data.login.value)
            })
            .catch((error) => {
                console.log(error)
            })

        if (token) {
            localStorage.setItem('jumptonext-user-token', token)
            clientDb
                .query({ query: GET_ME })
                .then((result) => {
                    setUser(result.data.me)
                    setForm('main')
                })
                .catch((error) => {
                    return (
                        <p>
                            Error, GET_ME query returns error. Check your
                            network connection status: {error}
                        </p>
                    )
                })
        }
    }

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    username{' '}
                    <input
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password{' '}
                    <input
                        type="password"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

export default LoginForm
