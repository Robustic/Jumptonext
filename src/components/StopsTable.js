import React from 'react'
import { useQuery } from '@apollo/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import '../index.css'
import { NEXTS } from '../queries/queries'
import { useDispatch, useSelector } from 'react-redux'

import {
    timeLeftString,
    getTransportColor,
    getTransportButtonStyle,
} from './functions'
import { setViewCenterCoordinates } from '../reducers/stopReducer'

const StopsTableRowsNext = ({
    routeShortName,
    timeLeftString,
    headsign,
    transportColor,
    realtime,
}) => {
    const transportStyle = {
        color: transportColor,
        display: 'inline',
    }
    const transportStyleBolded = {
        color: transportColor,
        fontWeight: 'bold',
        display: 'inline',
    }
    const style = realtime === true ? 'realtimestyle' : 'notrealtimestyle'
    return (
        <div>
            <p style={transportStyleBolded}>{routeShortName} </p>
            <p style={transportStyle}>{headsign}</p>
            <p className={style}> {timeLeftString}</p>
            <p className="semicolon">{' ; '}</p>
        </div>
    )
}

const StopsTableRowsNexts = ({
    nextstops,
    currentTimestamp,
    transportColor,
}) => {
    const nextToView = nextstops
        .map((o) => o)
        .sort()
        .filter(
            (next) =>
                next.realtimeDeparture &&
                next.realtimeDeparture > currentTimestamp,
        )
    return (
        <>
            {nextToView.map((next) => (
                <StopsTableRowsNext
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
        </>
    )
}

const StopsTableRows = ({ name, code, gtfsId, currentTimestamp }) => {
    const dispatch = useDispatch()

    const { loading, error, data } = useQuery(NEXTS, {
        variables: { idToSearch: gtfsId },
        pollInterval: 10000,
    })

    const setStopFunction = () => {
        dispatch(
            setViewCenterCoordinates({
                selectedStop: gtfsId,
                bounds: { x: data.stop.lat, y: data.stop.lon },
            }),
        )
    }

    if (loading)
        return (
            <tr>
                <td>Loading...</td>
            </tr>
        )
    else if (error)
        return (
            <tr>
                <td>Error, NEXTS query returns error.</td>
            </tr>
        )
    const transportColor = getTransportColor(data.stop.vehicleType)
    const transportStyle = {
        color: transportColor,
    }
    const transportButtonStyle = getTransportButtonStyle(data.stop.vehicleType)
    return (
        <tr key={gtfsId}>
            <td>
                <Button
                    className={transportButtonStyle}
                    size="sm"
                    onClick={setStopFunction}
                >
                    {code}
                </Button>
            </td>
            <td style={transportStyle}>{name}</td>
            <td>
                <StopsTableRowsNexts
                    nextstops={data.stop.stoptimesWithoutPatterns}
                    key={data.stop.gtfsId}
                    currentTimestamp={currentTimestamp}
                    transportColor={transportColor}
                />
            </td>
        </tr>
    )
}

const StopsTable = ({ stopsToShowInTable, currentTimestamp }) => {
    if (stopsToShowInTable.length === 0) {
        return <></>
    }

    return (
        <Table bordered size="sm">
            <thead>
                <tr>
                    <th className="tableheaderwithendlinebold" width={'70px'}>
                        Stop
                    </th>
                    <th className="tableheaderwithendlinebold" width={'20%'}>
                        Stop name
                    </th>
                    <th className="tableheaderwithendlinebold">
                        Line code, Line name, Estimated time left
                    </th>
                </tr>
            </thead>
            <tbody>
                {stopsToShowInTable.map((stop) => (
                    <StopsTableRows
                        key={stop.gtfsId}
                        name={stop.name}
                        code={stop.code}
                        gtfsId={stop.gtfsId}
                        currentTimestamp={currentTimestamp}
                    />
                ))}
            </tbody>
        </Table>
    )
}

export default StopsTable
