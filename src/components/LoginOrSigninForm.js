import { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'

const LoginOrSigninForm = ({ form, login, formText }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    if (form !== formText) {
        return <></>
    }

    const submit = async (event) => {
        event.preventDefault()
        login(username, password)
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
                        {formText}
                    </Button>
                </Form.Group>
            </Form>
        </div>
    )
}

export default LoginOrSigninForm
