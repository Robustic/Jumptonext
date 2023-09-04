import { Navbar, Nav } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import { setForm } from '../reducers/formReducer'
import {
    stopSearchStringChanged,
    clearAllButInitialStops,
} from '../reducers/stopReducer'

const Menu = ({ logout, setSelectedStop }) => {
    const dispatch = useDispatch()

    const user = useSelector(({ user }) => user)
    const form = useSelector(({ form }) => form)

    const login = () => {
        if (user) {
            return null
        }

        return (
            <>
                <Nav.Item>
                    <Navbar.Text
                        style={{
                            height: '100%',
                            display: 'flex',
                            paddingLeft: 10,
                            color: form === 'Login' ? 'yellow' : 'white',
                        }}
                        onClick={() => dispatch(setForm('Login'))}
                    >
                        <u
                            style={{
                                margin: 'auto',
                            }}
                        >
                            Login
                        </u>
                    </Navbar.Text>
                </Nav.Item>
                <Nav.Item>
                    <Navbar.Text
                        style={{
                            height: '100%',
                            display: 'flex',
                            paddingLeft: 10,
                            color:
                                form === 'Create account' ? 'yellow' : 'white',
                        }}
                        onClick={() => dispatch(setForm('Create account'))}
                    >
                        <u
                            style={{
                                margin: 'auto',
                            }}
                        >
                            Create account
                        </u>
                    </Navbar.Text>
                </Nav.Item>
            </>
        )
    }

    const currentUserInfo = () => {
        if (!user) {
            return null
        }

        return (
            <>
                <Nav.Item>
                    <Navbar.Text
                        style={{
                            height: '100%',
                            display: 'flex',
                            paddingLeft: 10,
                            color: form === 'favourites' ? 'yellow' : 'white',
                        }}
                        onClick={() => {
                            dispatch(clearAllButInitialStops())
                            dispatch(setForm('favourites'))
                        }}
                    >
                        <u
                            style={{
                                margin: 'auto',
                            }}
                        >
                            Favourite stops
                        </u>
                    </Navbar.Text>
                </Nav.Item>
                <Nav.Item>
                    <Navbar.Text
                        style={{
                            height: '100%',
                            display: 'flex',
                            paddingLeft: 10,
                            color: 'white',
                        }}
                        onClick={() => {
                            dispatch(clearAllButInitialStops())
                            logout
                        }}
                    >
                        <u
                            style={{
                                margin: 'auto',
                            }}
                        >
                            Logout
                        </u>
                    </Navbar.Text>
                </Nav.Item>
                <Navbar.Text
                    style={{ display: 'flex', paddingLeft: 10, color: 'white' }}
                >
                    <b
                        style={{
                            margin: 'auto',
                        }}
                    >
                        {user.username}
                    </b>
                    <p
                        style={{
                            margin: 'auto',
                            paddingLeft: 5,
                        }}
                    >
                        logged in
                    </p>
                </Navbar.Text>
            </>
        )
    }

    return (
        <div className="menu">
            <Navbar
                className="navbar navbar-dark"
                collapseOnSelect
                expand="lg"
                style={{
                    backgroundColor: '#205095',
                    paddingLeft: 10,
                }}
            >
                <Navbar.Toggle
                    style={{ borderColor: 'white' }}
                    aria-controls="responsive-navbar-nav"
                />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Item>
                            <Navbar.Text
                                style={{
                                    display: 'flex',
                                    fontSize: 20,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    color: 'white',
                                }}
                            >
                                <b
                                    style={{
                                        margin: 'auto',
                                    }}
                                >
                                    Jumptonext
                                </b>
                            </Navbar.Text>
                        </Nav.Item>
                        <Nav.Item>
                            <Navbar.Text
                                style={{
                                    height: '100%',
                                    display: 'flex',
                                    paddingLeft: 10,
                                    color: form === 'main' ? 'yellow' : 'white',
                                }}
                                onClick={() => {
                                    dispatch(clearAllButInitialStops())
                                    dispatch(setForm('main'))
                                }}
                            >
                                <u
                                    style={{
                                        margin: 'auto',
                                    }}
                                >
                                    Search stops
                                </u>
                            </Navbar.Text>
                        </Nav.Item>
                        {login()}
                        {currentUserInfo()}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default Menu
