import React from 'react'
import { useQuery } from '@apollo/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import '../index.css'
import { NEXTS } from '../queries/queries'
import {
    timeLeftString,
    getTransportColor,
    getTransportType,
} from './functions'

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
    const style =
        realtime === true
            ? 'realtimestylewithendline'
            : 'notrealtimestylewithendline'
    return (
        <tr>
            <td style={transportStyleBold} width={'50px'}>
                {routeShortName}
            </td>
            <td style={transportStyle} width={'40%'}>
                {headsign}
            </td>
            <td className={style}>{timeLeftString}</td>
        </tr>
    )
}

const Nexts = ({ nexttimes, currentTimestamp, transportColor }) => {
    const nextToView = nexttimes
        .sort()
        .filter(
            (next) =>
                next.realtimeDeparture &&
                next.realtimeDeparture > currentTimestamp
        )

    return (
        <Table bordered size="sm">
            <thead>
                <tr>
                    <th className="tableheaderwithendlinebold" width={'70px'}>
                        Line
                    </th>
                    <th className="tableheaderwithendlinebold" width={'40%'}>
                        Line name
                    </th>
                    <th className="tableheaderwithendlinebold">
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
                            next.realtime
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

const StopTable = ({ gtfsId, clearStopFunction, currentTimestamp }) => {
    const { loading, error, data } = useQuery(NEXTS, {
        variables: { idToSearch: gtfsId },
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
    return (
        <>
            <Table>
                <tbody>
                    <tr>
                        <td style={transportStyle}>
                            {data.stop.code} {data.stop.name} {transportType}
                        </td>
                        <td>
                            <Button
                                variant="primary"
                                onClick={clearStopFunction}
                            >
                                Reselect stop
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </Table>
            <Nexts
                key={gtfsId}
                nexttimes={data.stop.stoptimesWithoutPatterns}
                currentTimestamp={currentTimestamp}
                transportColor={transportColor}
            />
        </>
    )
}

export default StopTable
