import React from 'react'
import { useQuery } from '@apollo/client'
import { useDispatch, useSelector } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import '../index.css'

import { NEXTS } from '../queries/stopQueries'
import {
    ADD_TO_FAVOURITES,
    REMOVE_FROM_FAVOURITES,
} from '../queries/userQueries'
import {
    timeLeftString,
    getTransportColor,
    getTransportType,
} from './commonFunctions'
import { setFavouriteStopsForUser } from '../reducers/userReducer'
import { setSelectedStop } from '../reducers/stopReducer'
import { setCurrentTimestamp } from '../reducers/timestampReducer'

const Next = ({
    routeShortName,
    timeLeftString,
    headsign,
    transportColor,
    realtime,
}) => {
    const transportStyle = {
        color: transportColor,
    }
    const transportStyleBold = {
        color: transportColor,
        fontWeight: 'bold',
    }
    const styleForTime =
        realtime === true ? { color: 'green' } : { color: '#606060' }

    return (
        <tr>
            <td style={transportStyleBold} width={'50px'}>
                {routeShortName}
            </td>
            <td style={transportStyle} width={'40%'}>
                {headsign}
            </td>
            <td style={styleForTime}>{timeLeftString}</td>
        </tr>
    )
}

const Nexts = ({ nexttimes, transportColor }) => {
    const dispatch = useDispatch()
    setTimeout(() => dispatch(setCurrentTimestamp()), 1000)

    const currentTimestamp = useSelector(
        ({ currentTimestamp }) => currentTimestamp,
    )

    const nextToView = nexttimes
        .map((o) => o)
        .sort()
        .filter(
            (next) =>
                next.realtimeDeparture &&
                next.realtimeDeparture > currentTimestamp,
        )

    return (
        <Table size="sm" style={{ marginBottom: 0 }}>
            <thead>
                <tr>
                    <th
                        className="tableheaderwithendlinebold"
                        width={'70px'}
                        style={{ color: '#404040' }}
                    >
                        Line
                    </th>
                    <th
                        className="tableheaderwithendlinebold"
                        width={'40%'}
                        style={{ color: '#404040' }}
                    >
                        Line name
                    </th>
                    <th
                        className="tableheaderwithendlinebold"
                        style={{ color: '#404040' }}
                    >
                        Estimated time left. Green color for realtime (brackets
                        for scheduled).
                    </th>
                </tr>
            </thead>
            <tbody>
                {nextToView.map((next) => (
                    <Next
                        key={next.trip.id}
                        routeShortName={next.trip.routeShortName}
                        timeLeftString={timeLeftString(
                            currentTimestamp,
                            next.realtimeDeparture,
                            next.realtime,
                        )}
                        headsign={next.headsign}
                        transportColor={transportColor}
                        realtime={next.realtime}
                    />
                ))}
            </tbody>
        </Table>
    )
}

const SingleStopTable = ({ clientDatabase }) => {
    const dispatch = useDispatch()

    const user = useSelector(({ user }) => user)
    const selectedStop = useSelector(({ stops }) => stops.selectedStop)

    const { loading, error, data } = useQuery(NEXTS, {
        variables: { idToSearch: selectedStop },
        pollInterval: 10000,
    })

    if (loading) return <p>Loading...</p>
    else if (error) return <p>Error, NEXTS query returns error.</p>

    const transportType = getTransportType(data.stop.vehicleType)
    const transportColor = getTransportColor(data.stop.vehicleType)
    const transportStyle = {
        color: transportColor,
        fontSize: '1.17em',
        marginTop: '1em',
        marginBottom: '1em',
        marginLeft: 0,
        marginRight: 0,
        fontWeight: 'bold',
    }

    const addToFavourites = (newFavouriteStop) => {
        clientDatabase
            .mutate({
                mutation: ADD_TO_FAVOURITES,
                variables: { newFavouriteStop },
            })
            .then((result) => {
                dispatch(setFavouriteStopsForUser(result.data.addFavouriteStop))
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const removeFromFavourites = (favouriteStopToRemove) => {
        clientDatabase
            .mutate({
                mutation: REMOVE_FROM_FAVOURITES,
                variables: { favouriteStopToRemove },
            })
            .then((result) => {
                dispatch(
                    setFavouriteStopsForUser(result.data.removeFavouriteStop),
                )
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const inFavourites = user
        ? user.favouriteStops.includes(String(selectedStop))
        : false

    const AddToFavourites = ({
        addToFavourites,
        removeFromFavourites,
        selectedStop,
    }) => {
        if (addToFavourites) {
            return (
                <Button
                    variant="success"
                    onClick={() => addToFavourites(selectedStop)}
                >
                    Add to favourites
                </Button>
            )
        }
        if (removeFromFavourites) {
            return (
                <Button
                    variant="danger"
                    onClick={() => removeFromFavourites(selectedStop)}
                >
                    Remove from favourites
                </Button>
            )
        }
        return <></>
    }

    return (
        <div style={{ paddingTop: 10 }}>
            <Table borderless style={{ marginBottom: 10 }}>
                <tbody>
                    <tr>
                        <td style={transportStyle}>
                            {data.stop.code} {data.stop.name} {transportType}
                        </td>
                        <td>
                            <Button
                                style={{ margin: 5 }}
                                variant="primary"
                                onClick={() => dispatch(setSelectedStop())}
                            >
                                Reselect stop
                            </Button>
                            <AddToFavourites
                                style={{ margin: 5 }}
                                addToFavourites={
                                    user && !inFavourites && addToFavourites
                                }
                                removeFromFavourites={
                                    user && inFavourites && removeFromFavourites
                                }
                                selectedStop={data.stop.gtfsId}
                            />
                        </td>
                    </tr>
                </tbody>
            </Table>
            <Nexts
                key={selectedStop}
                nexttimes={data.stop.stoptimesWithoutPatterns}
                transportColor={transportColor}
            />
        </div>
    )
}

export default SingleStopTable
