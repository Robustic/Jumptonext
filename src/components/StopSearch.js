import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import { ALL_STOPS, NEXTS } from '../queries/queries'

function timestamp() {
    const dateTime = new Date().getTime()
    const timestamp = Math.floor(dateTime / 1000)
    var datetime = new Date(timestamp * 1000)
    var hours = datetime.getHours()
    var minutes = datetime.getMinutes()
    var seconds = datetime.getSeconds()
    const stamp = hours * 60 * 60 + minutes * 60 + seconds
    return stamp
}

function timeleft(timeleft) {
    const hours = Math.floor(timeleft / 3600)
    const timeleftAfterHours = timeleft - hours * 3600
    const minutes = Math.floor(timeleftAfterHours / 60)
    const timeleftAfterMinutes = timeleftAfterHours - minutes * 60
    const seconds = timeleftAfterMinutes
    if (hours === 0 && minutes === 0) return seconds + "s"
    if (hours === 0) return minutes + "m " + seconds + "s"
    return hours + "h " + minutes + "m " + seconds + "s"
}

const NextForLine = ({ routeShortName, scheduledArrival, currentTimestamp }) => {
    return (
        <>
            <>{routeShortName}- {timeleft(scheduledArrival - currentTimestamp)},{' '}</>
        </>
    )
}

const NextsForLine = ({ nextstops }) => {
    const currentTimestamp = timestamp()
    const nextToView = nextstops
        .sort()
        .filter(next => (next.realtimeArrival && next.realtimeArrival > currentTimestamp))

    return (
        <>
            {nextToView.map(next => (
                <NextForLine
                    key={next.trip.id}
                    routeShortName={next.trip.routeShortName}
                    scheduledArrival={next.scheduledArrival}
                    currentTimestamp={currentTimestamp}
                />
            ))
            }
        </>
    )
}

const StopLine = ({ name, code, gtfsId, setStop }) => {
    const { loading, error, data } = useQuery(NEXTS, {
        variables: { idToSearch: gtfsId },
    })
    const setStopFunction = () => {
        console.log(gtfsId)
        setStop(gtfsId)
    }
    if (loading) return <tr><td>Loading...</td></tr>
    else if (error) return <tr><td>Error, NEXTS query returns error.</td></tr>
    return (
        <tr key={gtfsId}>
            <td width={'15%'}>
                <Button variant="primary" size="sm" onClick={setStopFunction}>
                    {code}
                </Button>
            </td>
            <td width={'35%'}>{name}</td>
            <td width={'50%'}>
                <NextsForLine
                    nextstops={data.stop.stoptimesWithoutPatterns}
                    key={data.stop.gtfsId}
                />
            </td>
        </tr>
    )
}

const Next = ({ routeShortName, scheduledArrival, currentTimestamp }) => {
    return (
        <tr>
            <td>{routeShortName}</td>
            <td>{timeleft(scheduledArrival - currentTimestamp)}</td>
        </tr>
    )
}

const Nexts = ({ nexttimes }) => {
    const currentTimestamp = timestamp()
    const nextToView = nexttimes
        .sort()
        .filter(next => (next.realtimeArrival && next.realtimeArrival > currentTimestamp))

    return (
        <Table striped>
            <tbody>
                {nextToView.map(next => (
                    <Next
                        key={next.trip.id}
                        routeShortName={next.trip.routeShortName}
                        scheduledArrival={next.scheduledArrival}
                        currentTimestamp={currentTimestamp}
                    />
                ))
                }
            </tbody>
        </Table>
    )
}

const Stop = ({ gtfsId, clearStopFunction }) => {
    const { loading, error, data } = useQuery(NEXTS, {
        variables: { idToSearch: gtfsId },
    })
    if (loading) return <p>Loading...</p>
    else if (error) return <p>Error, ALL_STOPS query returns error.</p>
    return (
        <>
            <h4>{data.stop.code} Ohoi {data.stop.name}</h4>
            <Button variant="primary" onClick={clearStopFunction}>
                Reselect stop
            </Button>
            <Nexts
                key={gtfsId}
                nexttimes={data.stop.stoptimesWithoutPatterns}
            />
        </>
    )
}

const StopSearch = () => {
    const { loading, error, data } = useQuery(ALL_STOPS)

    const [findStopForm, setFindStopForm] = useState([])
    const [findStop, setFindStop] = useState([])
    const [selectedStop, setSelectedStop] = useState()

    const handleFindStopChange = (event) => {
        const written = event.target.value
        const str = written.toLowerCase()
        const filteredStops = data.stops
            .filter(stop => stop.name.toLowerCase().includes(str) || (stop.code && stop.code.includes(str)))
            .sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                return 0;
            })
            .filter((i, index) => (index < 10))
        setFindStop(filteredStops)
        setFindStopForm(written)
    }

    const setStop = (stopId) => {
        setSelectedStop(stopId)
    }

    if (loading) return <p>Loading...</p>
    else if (error) return <p>Error, ALL_STOPS query returns error.</p>

    if (selectedStop) {
        const clearStopFunction = () => {
            setStop()
        }
        return (
            <div className='container'>
                <Stop
                    key={selectedStop}
                    gtfsId={selectedStop}
                    clearStopFunction={clearStopFunction}
                />
            </div>
        )
    } else {
        return (
            <div className='container'>
                <h3>Pysäkit</h3>
                <input
                    value={findStopForm}
                    onChange={handleFindStopChange}
                />
                <Table striped>
                    <tbody>
                        {findStop.map(stop => (
                            <StopLine
                                key={stop.gtfsId}
                                name={stop.name}
                                code={stop.code}
                                gtfsId={stop.gtfsId}
                                setStop={setStop}
                            />
                        ))
                        }
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default StopSearch