import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import '../index.css'
import { NEXTS } from '../queries/queries'
import { timeleft, getTransportColor, getTransportButtonStyle } from './functions'

const StopsTableRowsNext = ({ routeShortName, realtimeDeparture, currentTimestamp, headsign, transportColor, realtime }) => {
    const transportStyle = {
        color: transportColor,
        display: 'inline'
    }
    const transportStyleBolded = {
        color: transportColor,
        fontWeight: 'bold',
        display: 'inline'
    }
    const style = realtime === true ?
        'realtimestyle' :
        'notrealtimestyle'
    const bracketOpen = realtime === true ?
        "" :
        "("
    const bracketClose = realtime === true ?
        "" :
        ")"
    const timeString = bracketOpen + timeleft(realtimeDeparture - currentTimestamp) + bracketClose
    return (
        <div>
            <p style={transportStyleBolded}>{routeShortName}{' '}</p>
            <p style={transportStyle}>{headsign}</p>
            <p className={style}> {timeString}</p>
            <p className='semicolon'>{' ; '}</p>
        </div>
    )
}

const StopsTableRowsNexts = ({ nextstops, currentTimestamp, transportColor }) => {
    const nextToView = nextstops
        .sort()
        .filter(next => (next.realtimeDeparture && next.realtimeDeparture > currentTimestamp))
    return (
        <>
            {nextToView.map(next => (
                <StopsTableRowsNext
                    key={next.trip.id}
                    routeShortName={next.trip.routeShortName}
                    realtimeDeparture={next.realtimeDeparture}
                    currentTimestamp={currentTimestamp}
                    headsign={next.headsign}
                    transportColor={transportColor}
                    realtime={next.realtime}
                />
            ))
            }
        </>
    )
}

const StopsTableRows = ({ name, code, gtfsId, setStop, currentTimestamp }) => {
    const { loading, error, data } = useQuery(NEXTS, {
        variables: { idToSearch: gtfsId }
    })
    const setStopFunction = () => {
        setStop(gtfsId, data.stop.lat, data.stop.lon)
    }
    if (loading) return <tr><td>Loading...</td></tr>
    else if (error) return <tr><td>Error, NEXTS query returns error.</td></tr>
    const transportColor = getTransportColor(data.stop.vehicleType)
    const transportStyle = {
        color: transportColor
    }
    const transportButtonStyle = getTransportButtonStyle(data.stop.vehicleType)
    return (
        <tr key={gtfsId}>
            <td>
                <Button                    
                    className={transportButtonStyle}
                    size="sm" onClick={setStopFunction}>
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

const StopsTable = ({ findStop, setStop, currentTimestamp }) => {
    return (
        <Table bordered size="sm">
            <thead>
                <tr>
                    <th className='tableheaderwithendlinebold' width={'70px'}>Stop</th>
                    <th className='tableheaderwithendlinebold' width={'20%'}>Stop name</th>
                    <th className='tableheaderwithendlinebold'>Line code, Line name, Estimated time left</th>
                </tr>
            </thead>
            <tbody>
                {findStop.map(stop => (
                    <StopsTableRows
                        key={stop.gtfsId}
                        name={stop.name}
                        code={stop.code}
                        gtfsId={stop.gtfsId}
                        setStop={setStop}
                        currentTimestamp={currentTimestamp}
                    />
                ))}
            </tbody>
        </Table>
    )
}

export default StopsTable