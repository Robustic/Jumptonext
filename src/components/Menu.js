import { Navbar, Nav } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import { setForm } from '../reducers/formReducer'
import { clearAllButInitialStops } from '../reducers/stopReducer'

const NavbarItem = ({ currentForm, linkToForm, whenClicked, text }) => {
    return (
        <Nav.Item>
            <Navbar.Text
                style={{
                    height: '100%',
                    display: 'flex',
                    paddingLeft: 10,
                    color: currentForm === linkToForm ? 'yellow' : 'white',
                }}
                onClick={whenClicked}
            >
                <u
                    style={{
                        margin: 'auto',
                    }}
                >
                    <strong>{text}</strong>
                </u>
            </Navbar.Text>
        </Nav.Item>
    )
}

const Menu = ({ logout }) => {
    const dispatch = useDispatch()

    const user = useSelector(({ user }) => user)
    const form = useSelector(({ form }) => form)

    const Login = () => {
        if (user) {
            return null
        }

        return (
            <>
                <NavbarItem
                    currentForm={form}
                    linkToForm={'Login'}
                    whenClicked={() => dispatch(setForm('Login'))}
                    text={'Login'}
                />
                <NavbarItem
                    currentForm={form}
                    linkToForm={'Create account'}
                    whenClicked={() => dispatch(setForm('Create account'))}
                    text={'Create account'}
                />
            </>
        )
    }

    const CurrentUserInfo = () => {
        if (!user) {
            return null
        }

        return (
            <>
                <NavbarItem
                    currentForm={form}
                    linkToForm={'favourites'}
                    whenClicked={() => {
                        dispatch(clearAllButInitialStops())
                        dispatch(setForm('favourites'))
                    }}
                    text={'Favourite stops'}
                />
                <NavbarItem
                    currentForm={form}
                    linkToForm={'login'}
                    whenClicked={() => {
                        dispatch(clearAllButInitialStops())
                        logout(dispatch)
                    }}
                    text={'Logout'}
                />
                <NavbarItem
                    currentForm={form}
                    linkToForm={'account-settings'}
                    whenClicked={() => {
                        dispatch(clearAllButInitialStops())
                        dispatch(setForm('account-settings'))
                    }}
                    text={'Account settings'}
                />
                <Navbar.Text
                    style={{ display: 'flex', paddingLeft: 10, color: 'white' }}
                >
                    <p
                        style={{
                            margin: 'auto',
                            paddingLeft: 5,
                        }}
                    >
                        <strong>{user.username}</strong> logged in
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
                        <NavbarItem
                            currentForm={form}
                            linkToForm={'main'}
                            whenClicked={() => {
                                dispatch(clearAllButInitialStops())
                                dispatch(setForm('main'))
                            }}
                            text={'Search stops'}
                        />
                        {Login()}
                        {CurrentUserInfo()}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default Menu
