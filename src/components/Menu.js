import { Button, Navbar, Nav } from 'react-bootstrap'

const Menu = ({ clientDb, user, setUser, setForm }) => {
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
                            color: 'white',
                        }}
                        onClick={() => setForm('login')}
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
                            color: 'white',
                        }}
                        onClick={() => {
                            setUser(null)
                            localStorage.clear()
                            clientDb.resetStore()
                            setForm('main')
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
                                    color: 'white',
                                }}
                                onClick={() => setForm('main')}
                            >
                                <u
                                    style={{
                                        margin: 'auto',
                                    }}
                                >
                                    Search
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
