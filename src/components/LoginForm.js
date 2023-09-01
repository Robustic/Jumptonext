import { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'

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
                const token = result.data.login.value
                setToken(token)
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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Form onSubmit={submit} style={{ width: 200 }}>
                <Form.Group>
                    <InputGroup
                        style={{ paddingTop: 10, paddingBottom: 10 }}
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    >
                        <Form.Control type="text" placeholder="Username" />
                    </InputGroup>
                    <InputGroup
                        style={{ paddingBottom: 10 }}
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    >
                        <Form.Control type="password" placeholder="Password" />
                    </InputGroup>
                    <Button
                        type="submit"
                        style={{
                            width: '100%',
                            marginTop: 5,
                            marginBottom: 10,
                        }}
                    >
                        Login
                    </Button>
                </Form.Group>
            </Form>
        </div>
    )
}

export default LoginForm
