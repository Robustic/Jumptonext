import { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'

const LoginForm = ({ form, login }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    if (form !== 'login') {
        return <></>
    }

    const submit = async (event) => {
        event.preventDefault()
        login(username, password)
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
