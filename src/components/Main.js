import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Image from 'react-bootstrap/Image'
import { useDispatch, useSelector } from 'react-redux'
import '../index.css'

import StopMap from './StopMap'
import { ALL_STOPS, LOGIN, CREATE_ACCOUNT, GET_ME } from '../queries/queries'
import pic from '../pictures/logo192.png'
import StopsTable from './StopsTable'
import StopTable from './StopTable'
import LoginOrSigninForm from './LoginOrSigninForm'
import Menu from './Menu'
import { timestamp } from './functions'
import {
    setStops,
    stopSearchStringChanged,
    setSelectedStop,
} from '../reducers/stopReducer'
import { setUser } from '../reducers/userReducer'
import { setForm } from '../reducers/formReducer'

const Search = () => {
    const dispatch = useDispatch()
    const stopSearchString = useSelector(({ stops }) => stops.stopSearchString)

    const handleFindStopChange = (event) => {
        if (event.target.value) {
            dispatch(stopSearchStringChanged(event.target.value))
        } else if (event.target.value === '') {
            dispatch(stopSearchStringChanged())
        }
    }

    return (
        <Form>
            <Form.Group>
                <InputGroup
                    style={{ paddingBottom: 10 }}
                    value={stopSearchString}
                    onChange={handleFindStopChange}
                >
                    <InputGroup.Text>Search</InputGroup.Text>
                    <Form.Control
                        type="text"
                        placeholder="Example: 'Vallilan varikko', '3024', 'E4114'..."
                    />
                </InputGroup>
            </Form.Group>
        </Form>
    )
}

const SelectTable = ({ currentTimestamp, stopsToShowInTable, clientDb }) => {
    const dispatch = useDispatch()
    const selectedStop = useSelector(({ stops }) => stops.selectedStop)

    if (selectedStop && selectedStop != '') {
        const clearStopFunction = () => {
            dispatch(setSelectedStop())
        }
        return (
            <div>
                <StopTable
                    key={selectedStop}
                    gtfsId={selectedStop}
                    clearStopFunction={clearStopFunction}
                    currentTimestamp={currentTimestamp}
                    clientDb={clientDb}
                />
            </div>
        )
    }

    return (
        <div className="pt-3">
            <Search />
            <StopsTable
                stopsToShowInTable={stopsToShowInTable}
                currentTimestamp={currentTimestamp}
            />
        </div>
    )
}

const Main = ({ clientDb }) => {
    const dispatch = useDispatch()
    const { data, loading, error } = useQuery(ALL_STOPS)

    const user = useSelector(({ user }) => user)
    const form = useSelector(({ form }) => form)
    const filteredStops = useSelector(({ stops }) => stops.filteredStops)
    const stopsInsideMapBounds = useSelector(
        ({ stops }) => stops.stopsInsideMapBounds,
    )

    const [currentTimestamp, setcurrentTimestamp] = useState(timestamp())
    setTimeout(() => setcurrentTimestamp(timestamp()), 1000)

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
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const logout = () => {
        dispatch(setUser(null))
        localStorage.clear()
        clientDb.resetStore()
        dispatch(setForm('main'))
        dispatch(setSelectedStop(null))
        dispatch(stopSearchStringChanged())
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
                return (
                    <div>
                        <StopMap mapMarkers={stopsInsideMapBounds} />
                        <SelectTable
                            currentTimestamp={currentTimestamp}
                            stopsToShowInTable={filteredStops}
                            clientDb={clientDb}
                        />
                    </div>
                )
            }
            case 'favourites': {
                return (
                    <div>
                        <StopMap mapMarkers={stopsInsideMapBounds} />
                        <SelectTable
                            currentTimestamp={currentTimestamp}
                            stopsToShowInTable={favouriteStops}
                            clientDb={clientDb}
                        />
                    </div>
                )
            }
        }
    }

    return (
        <div className="container">
            <div className="bg-white pl-3 pr-3 pb-1">
                <Menu logout={logout} setSelectedStop={setSelectedStop} />
                {choiceForm()}
            </div>
        </div>
    )
}

export default Main
