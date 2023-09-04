import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Image from 'react-bootstrap/Image'
import '../index.css'

import StopMap from './StopMap'
import {
    ALL_STOPS,
    LOGIN,
    CREATE_ACCOUNT,
    GET_ME,
    ADD_TO_FAVOURITES,
    REMOVE_FROM_FAVOURITES,
} from '../queries/queries'
import pic from '../pictures/logo192.png'
import StopsTable from './StopsTable'
import StopTable from './StopTable'
import LoginOrSigninForm from './LoginOrSigninForm'
import Menu from './Menu'
import { timestamp } from './functions'

const Search = ({ form, findStopForm, handleFindStopChange }) => {
    if (form !== 'main') {
        return <></>
    }
    return (
        <Form>
            <Form.Group>
                <InputGroup
                    style={{ paddingBottom: 10 }}
                    value={findStopForm}
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

const SelectTable = ({
    selectedStop,
    setStop,
    currentTimestamp,
    findStopForm,
    handleFindStopChange,
    findStop,
    form,
    user,
    showFavourites = false,
    addToFavourites,
    removeFromFavourites,
}) => {
    if (
        (form !== 'main' && form !== 'favourites') ||
        (form === 'main' && showFavourites) ||
        (form === 'favourites' && !showFavourites)
    ) {
        return <></>
    }

    if (selectedStop && selectedStop != '') {
        const inFavourites = user
            ? user.favouriteStops.includes(String(selectedStop))
            : false
        const clearStopFunction = () => {
            setStop()
        }
        return (
            <div>
                <StopTable
                    key={selectedStop}
                    gtfsId={selectedStop}
                    clearStopFunction={clearStopFunction}
                    currentTimestamp={currentTimestamp}
                    addToFavourites={user && !inFavourites && addToFavourites}
                    removeFromFavourites={
                        user && inFavourites && removeFromFavourites
                    }
                />
            </div>
        )
    }

    return (
        <div className="pt-3">
            <Search
                form={form}
                findStopForm={findStopForm}
                handleFindStopChange={handleFindStopChange}
            />
            <StopsTable
                findStop={findStop}
                setStop={setStop}
                currentTimestamp={currentTimestamp}
            />
        </div>
    )
}

const StopSearch = ({ clientDb, stops }) => {
    const [form, setForm] = useState('main')

    const [user, setUser] = useState(null)

    const [findStopForm, setFindStopForm] = useState()
    const [findStop, setFindStop] = useState([])
    const [selectedStop, setSelectedStop] = useState()

    const [x, setX] = useState(60.171298)
    const [y, setY] = useState(24.941671)

    const [mapMarkers, setMapMarkers] = useState([])

    const token = localStorage.getItem('jumptonext-user-token')
        ? localStorage.getItem('jumptonext-user-token')
        : null

    const favouriteStops =
        stops && user
            ? stops.filter((s) => user.favouriteStops.includes(s.gtfsId))
            : []

    useEffect(() => {
        if (clientDb) {
            clientDb
                .query({ query: GET_ME, fetchPolicy: 'network-only' })
                .then((result) => {
                    setForm('main')
                    setUser(result.data.me)
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

    const handleFindStopChange = (event) => {
        if (event.target.value) {
            const written = event.target.value
            const str = written.toLowerCase()
            const filteredStops = stops
                .filter(
                    (stop) =>
                        stop.name.toLowerCase().includes(str) ||
                        (stop.code && stop.code.toLowerCase().includes(str)),
                )
                .sort((a, b) => {
                    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
                    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
                    return 0
                })
                .filter((i, index) => index < 10)
            setFindStop(filteredStops)
            setFindStopForm(written)
        } else {
            setFindStop([])
            setFindStopForm()
        }
    }

    const setStop = (stopId, newx, newy) => {
        if (stopId && newx && newy) {
            setX(newx)
            setY(newy)
        }
        setSelectedStop(stopId)
        if (!stopId) {
        }
    }

    const [currentTimestamp, setcurrentTimestamp] = useState(timestamp())
    setTimeout(() => setcurrentTimestamp(timestamp()), 1000)

    const mapBoundsChanged = (bounds) => {
        const swLat = bounds._southWest.lat
        const swLng = bounds._southWest.lng
        const neLat = bounds._northEast.lat
        const neLng = bounds._northEast.lng
        const filteredStops = stops
            .filter(
                (stop) =>
                    swLat < stop.lat &&
                    stop.lat < neLat &&
                    swLng < stop.lon &&
                    stop.lon < neLng,
            )
            .filter((i, index) => index < 100)
        setMapMarkers(filteredStops)
    }

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
        console.log('taalla *******************')
        setUser(null)
        localStorage.clear()
        clientDb.resetStore()
        setForm('main')
        setSelectedStop(null)
        setFindStop([])
    }

    const createAccount = (username, password) => {
        clientDb
            .mutate({
                mutation: CREATE_ACCOUNT,
                variables: { username, password },
            })
            .then((result) => {
                setForm('Login')
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const addToFavourites = (newFavouriteStop) => {
        clientDb
            .mutate({
                mutation: ADD_TO_FAVOURITES,
                variables: { newFavouriteStop },
            })
            .then((result) => {
                setUser(result.data.addFavouriteStop)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const removeFromFavourites = (favouriteStopToRemove) => {
        clientDb
            .mutate({
                mutation: REMOVE_FROM_FAVOURITES,
                variables: { favouriteStopToRemove },
            })
            .then((result) => {
                setUser(result.data.removeFavouriteStop)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <div className="container">
            <div className="bg-white pl-3 pr-3 pb-1">
                <Menu
                    clientDb={clientDb}
                    user={user}
                    setUser={setUser}
                    form={form}
                    setForm={setForm}
                    logout={logout}
                    setFindStop={setFindStop}
                    setSelectedStop={setSelectedStop}
                />
                {
                    <LoginOrSigninForm
                        form={form}
                        login={login}
                        formText={'Login'}
                    />
                }
                {
                    <LoginOrSigninForm
                        form={form}
                        login={createAccount}
                        formText={'Create account'}
                    />
                }
                {
                    <div>
                        <StopMap
                            center={[x, y]}
                            mapBoundsChanged={mapBoundsChanged}
                            mapMarkers={mapMarkers}
                            setStop={setStop}
                            form={form}
                        />
                        <SelectTable
                            user={user}
                            selectedStop={selectedStop}
                            setStop={setStop}
                            currentTimestamp={currentTimestamp}
                            findStopForm={findStopForm}
                            handleFindStopChange={handleFindStopChange}
                            findStop={findStop}
                            form={form}
                            showFavourites={false}
                            addToFavourites={addToFavourites}
                            removeFromFavourites={removeFromFavourites}
                        />
                        <SelectTable
                            user={user}
                            selectedStop={selectedStop}
                            setStop={setStop}
                            currentTimestamp={currentTimestamp}
                            findStopForm={''}
                            handleFindStopChange={handleFindStopChange}
                            findStop={favouriteStops}
                            form={form}
                            showFavourites={true}
                            addToFavourites={addToFavourites}
                            removeFromFavourites={removeFromFavourites}
                        />
                    </div>
                }
            </div>
        </div>
    )
}

const Main = ({ clientDb }) => {
    const { data, loading, error } = useQuery(ALL_STOPS)

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

    return <StopSearch clientDb={clientDb} stops={data.stops} />
}

export default Main
