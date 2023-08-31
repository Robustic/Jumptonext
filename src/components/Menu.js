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
                        style={{ paddingLeft: 10, color: 'white' }}
                        onClick={() => setForm('login')}
                    >
                        <u>Login</u>
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
                <Navbar.Text style={{ paddingLeft: 10, color: 'white' }}>
                    <b>{user.username}</b> logged in
                </Navbar.Text>
                <Nav.Item>
                    <Navbar.Text
                        style={{ paddingLeft: 10, color: 'white' }}
                        onClick={() => {
                            setUser(null)
                            localStorage.clear()
                            clientDb.resetStore()
                            setForm('main')
                        }}
                    >
                        <u>Logout</u>
                    </Navbar.Text>
                </Nav.Item>
            </>
        )
    }

    return (
        <div className="menu">
            <Navbar
                className="navbar navbar-dark"
                collapseOnSelect
                expand="lg"
                style={{ backgroundColor: '#205095', paddingLeft: 10 }}
            >
                <Navbar.Toggle
                    style={{ borderColor: 'white' }}
                    aria-controls="responsive-navbar-nav"
                />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Item>
                            <Navbar.Text
                                style={{ paddingLeft: 10, color: 'white' }}
                                onClick={() => setForm('main')}
                            >
                                <u>Search</u>
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
