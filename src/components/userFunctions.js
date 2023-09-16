import { LOGIN, CREATE_ACCOUNT, GET_ME } from '../queries/userQueries'
import { setForm } from '../reducers/formReducer'
import { clearAllButInitialStops } from '../reducers/stopReducer'
import { setUser } from '../reducers/userReducer'

export const createLoginFunction = (clientDatabase) => {
    const login = (username, password, dispatch) => {
        clientDatabase
            .mutate({
                mutation: LOGIN,
                variables: { username, password },
            })
            .then((result) => {
                const newToken = result.data.login.value
                localStorage.setItem('jumptonext-user-token', newToken)
                dispatch(setForm('main'))
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return login
}

export const createLogoutFunction = (clientDatabase, clientDigitransit) => {
    const logout = (dispatch) => {
        dispatch(setUser(null))
        localStorage.clear()
        clientDigitransit.resetStore()
        clientDatabase.resetStore()
        dispatch(dispatch(clearAllButInitialStops()))
        dispatch(setForm('Login'))
    }

    return logout
}

export const createCreateAccountFunction = (clientDatabase) => {
    const createAccount = (username, password, dispatch) => {
        clientDatabase
            .mutate({
                mutation: CREATE_ACCOUNT,
                variables: { username, password },
            })
            .then((result) => {
                dispatch(setForm('Login'))
            })
            .catch((error) => {
                console.log(error)
            })
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
