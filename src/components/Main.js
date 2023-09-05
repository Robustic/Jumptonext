import React, { useEffect } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import Image from 'react-bootstrap/Image'
import { useDispatch, useSelector } from 'react-redux'
import '../index.css'

import StopMap from './StopMap'
import { ALL_STOPS, LOGIN, CREATE_ACCOUNT, GET_ME } from '../queries/queries'
import pic from '../pictures/logo192.png'
import ManyStopsTable from './ManyStopsTable'
import SearchStop from './SearchStop'
import SingleStopTable from './SingleStopTable'
import LoginOrSigninForm from './LoginOrSigninForm'
import Menu from './Menu'
import { setStops, clearAllButInitialStops } from '../reducers/stopReducer'
import { setUser } from '../reducers/userReducer'
import { setForm } from '../reducers/formReducer'

const Main = ({ clientDb }) => {
    const dispatch = useDispatch()
    const clientDt = useApolloClient()

    const { data, loading, error } = useQuery(ALL_STOPS)

    const user = useSelector(({ user }) => user)
    const form = useSelector(({ form }) => form)
    const filteredStops = useSelector(({ stops }) => stops.filteredStops)
    const selectedStop = useSelector(({ stops }) => stops.selectedStop)

    const token = localStorage.getItem('jumptonext-user-token')
        ? localStorage.getItem('jumptonext-user-token')
        : null

    const allStops = data ? data.stops : []

    const favouriteStops =
        allStops && user
            ? allStops.filter((s) => user.favouriteStops.includes(s.gtfsId))
            : []

    useEffect(() => {
        dispatch(setStops(allStops))
    }, [allStops])

    useEffect(() => {
        if (clientDb) {
            clientDb
                .query({ query: GET_ME, fetchPolicy: 'network-only' })
                .then((result) => {
                    dispatch(setForm('main'))
                    dispatch(setUser(result.data.me))
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
    }, [token])

    if (loading) {
        return (
            <div className="bg-silver">
                <div className="flex-container center">
                    <p className="start-view-text">Loading...</p>
                </div>
                <div>
                    <Image
                        className="start-view-image"
                        src={pic}
                        roundedCircle
                    />
                </div>
            </div>
        )
    } else if (error)
        return (
            <p>
                Error, ALL_STOPS query returns error. Check your network
                connection status.
            </p>
        )

    const login = (username, password) => {
        clientDb
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

    const logout = () => {
        dispatch(setUser(null))
        localStorage.clear()
        clientDt.resetStore()
        clientDb.resetStore()
        dispatch(dispatch(clearAllButInitialStops()))
        dispatch(setForm('Login'))
    }

    const createAccount = (username, password) => {
        clientDb
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

    const choiceForm = () => {
        switch (form) {
            case 'Login': {
                return (
                    <LoginOrSigninForm
                        actionOnSubmit={login}
                        formText={'Login'}
                    />
                )
            }
            case 'Create account': {
                return (
                    <LoginOrSigninForm
                        actionOnSubmit={createAccount}
                        formText={'Create account'}
                    />
                )
            }
            case 'main': {
                if (selectedStop) {
                    return (
                        <div>
                            <StopMap />
                            <SingleStopTable clientDb={clientDb} />
                        </div>
                    )
                }
                return (
                    <div>
                        <StopMap />
                        <SearchStop />
                        <ManyStopsTable stopsToShowInTable={filteredStops} />
                    </div>
                )
            }
            case 'favourites': {
                if (selectedStop) {
                    return (
                        <div>
                            <StopMap />
                            <SingleStopTable clientDb={clientDb} />
                        </div>
                    )
                }
                return (
                    <div>
                        <StopMap />
                        <ManyStopsTable stopsToShowInTable={favouriteStops} />
                    </div>
                )
            }
        }
    }

    return (
        <div className="container">
            <div className="bg-white pl-3 pr-3 pb-3">
                <Menu logout={logout} />
                {choiceForm()}
            </div>
        </div>
    )
}

export default Main
