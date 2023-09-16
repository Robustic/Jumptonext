import { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { useDispatch } from 'react-redux'

const LoginOrSigninForm = ({ actionOnSubmit, formText }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    const submit = async (event) => {
        event.preventDefault()
        setUsername('')
        setPassword('')
        actionOnSubmit(username, password, dispatch)
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Form onSubmit={submit} style={{ padding: 10, width: 200 }}>
                <b
                    style={{
                        fontSize: 20,
                    }}
                >
                    {formText}
                </b>
                <Form.Group>
                    <InputGroup
                        id="username"
                        style={{ paddingTop: 10, paddingBottom: 10 }}
                    >
                        <Form.Control
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={({ target }) => setUsername(target.value)}
                        />
                    </InputGroup>
                    <InputGroup id="password" style={{ paddingBottom: 10 }}>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={({ target }) => setPassword(target.value)}
                        />
                    </InputGroup>
                    <Button
                        id={
                            formText === 'Login'
                                ? 'login-button'
                                : 'create-account-button'
                        }
                        type="submit"
                        style={{
                            width: '100%',
                            marginTop: 5,
                            marginBottom: 10,
                        }}
                    >
                        {formText}
                    </Button>
                </Form.Group>
            </Form>
        </div>
    )
}

export default LoginOrSigninForm
