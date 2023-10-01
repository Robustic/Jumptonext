import {
    LOGIN,
    CREATE_ACCOUNT,
    REMOVE_ACCOUNT,
    GET_ME,
} from '../queries/userQueries'
import { setForm } from '../reducers/formReducer'
import { clearAllButInitialStops } from '../reducers/stopReducer'
import { setUser } from '../reducers/userReducer'
import { setNotification } from '../reducers/notificationReducer'

export const loginFunction = (clientDatabase) => {
    const login = (username, password, dispatch) => {
        clientDatabase
            .mutate({
                mutation: LOGIN,
                variables: { username, password },
            })
            .then((result) => {
                const newToken = result.data.login.value
                localStorage.setItem('jumptonext-user-token', newToken)
                dispatch(setNotification(username + ' logged in', 5, 'success'))
                dispatch(setForm('main'))
            })
            .catch((error) => {
                dispatch(
                    setNotification('Wrong username or password!', 5, 'danger'),
                )
            })
    }

    return login
}

export const logoutFunction = (clientDatabase, clientDigitransit) => {
    const logout = (dispatch) => {
        dispatch(setUser(null))
        localStorage.clear()
        clientDigitransit.resetStore()
        clientDatabase.resetStore()
        dispatch(dispatch(clearAllButInitialStops()))
        dispatch(setNotification('Logged out', 5, 'success'))
        dispatch(setForm('Login'))
    }

    return logout
}

export const removeAccountFunction = (clientDatabase, clientDigitransit) => {
    const removeAccount = (username, dispatch) => {
        clientDatabase
            .mutate({
                mutation: REMOVE_ACCOUNT,
                variables: { username },
            })
            .then(() => {
                dispatch(setUser(null))
                localStorage.clear()
                clientDigitransit.resetStore()
                clientDatabase.resetStore()
                dispatch(dispatch(clearAllButInitialStops()))
                dispatch(
                    setNotification(
                        "Account '" + username + "' removed",
                        5,
                        'success',
                    ),
                )
                dispatch(setForm('Login'))
            })
            .catch((error) => {
                dispatch(
                    setNotification(
                        'Could not to remove account!',
                        5,
                        'danger',
                    ),
                )
            })
    }

    return removeAccount
}

export const createAccountFunction = (clientDatabase) => {
    const createAccount = (username, password, dispatch) => {
        if (username.length < 8) {
            dispatch(
                setNotification(
                    'Username have to be at least 8 characters long!',
                    5,
                    'danger',
                ),
            )
        } else if (password.length < 10) {
            dispatch(
                setNotification(
                    'Password have to be at least 10 characters long!',
                    5,
                    'danger',
                ),
            )
        } else {
            clientDatabase
                .mutate({
                    mutation: CREATE_ACCOUNT,
                    variables: { username, password },
                })
                .then((result) => {
                    dispatch(
                        setNotification(
                            "New account '" + username + "' created",
                            5,
                            'success',
                        ),
                    )
                    dispatch(setForm('Login'))
                })
                .catch((error) => {
                    dispatch(
                        setNotification(
                            'Username already exists!',
                            5,
                            'danger',
                        ),
                    )
                })
        }
    }

    return createAccount
}

export const checkUser = async (clientDatabase, dispatch) => {
    if (clientDatabase) {
        await clientDatabase
            .query({ query: GET_ME, fetchPolicy: 'network-only' })
            .then((result) => {
                dispatch(setForm('main'))
                dispatch(setUser(result.data.me))
            })
            .catch((error) => {
                return {
                    checkUserResultError: (
                        <p>
                            Error, GET_ME query returns error. Check your
                            network connection status: {error}
                        </p>
                    ),
                }
            })
    }
}
