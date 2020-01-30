import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import '../index.css'
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
    // if (hours < 0) {
    //     console.log("timeleft: " + timeleft)
    //     console.log("hours: " + hours)
    //     console.log("minutes: " + minutes)
    //     console.log("seconds: " + seconds)
    // }
    if (hours === 0 && minutes === 0) return seconds + "s"
    if (hours === 0) return minutes + "m " + seconds + "s"
    return hours + "h " + minutes + "m " + seconds + "s"
}

const NextForLine = ({ routeShortName, realtimeArrival, currentTimestamp, headsign }) => {
    return (
        <>
            <p className='busstylebold'>{routeShortName}{' '}</p>
            <p className='busstyle'>{headsign}</p>
            <p className='realtimestyle'> {timeleft(realtimeArrival - currentTimestamp)}</p>
            <p className='black'>{' ; '}</p>
        </>
    )
}

const NextsForLine = ({ nextstops, currentTimestamp }) => {
    const nextToView = nextstops
        .sort()
        .filter(next => (next.realtimeArrival && next.realtimeArrival > currentTimestamp))

    return (
        <>
            {nextToView.map(next => (
                <NextForLine
                    key={next.trip.id}
                    routeShortName={next.trip.routeShortName}
                    realtimeArrival={next.realtimeArrival}
                    currentTimestamp={currentTimestamp}
                    headsign={next.headsign}
                />
            ))
            }
        </>
    )
}

const StopLine = ({ name, code, gtfsId, setStop, currentTimestamp }) => {
    const { loading, error, data } = useQuery(NEXTS, {
        variables: { idToSearch: gtfsId }
    })
    const setStopFunction = () => {
        setStop(gtfsId)
    }
    if (loading) return <tr><td>Loading...</td></tr>
    else if (error) return <tr><td>Error, NEXTS query returns error.</td></tr>
    return (
        <tr key={gtfsId}>
            <td width={'70px'}>
                <Button variant="primary" size="sm" onClick={setStopFunction}>
                    {code}
                </Button>
            </td>
            <td className='busstylewithendline' width={'20%'}>{name}</td>
            <td>
                <NextsForLine
                    nextstops={data.stop.stoptimesWithoutPatterns}
                    key={data.stop.gtfsId}
                    currentTimestamp={currentTimestamp}
                />
            </td>
        </tr>
    )
}

const Next = ({ routeShortName, realtimeArrival, currentTimestamp, headsign }) => {
    return (
        <tr>
            <td className='busstylewithendlinebold' width={'50px'}>{routeShortName}</td>
            <td className='busstylewithendline' width={'40%'}>{headsign}</td>
            <td className='realtimestylewithendline'>{timeleft(realtimeArrival - currentTimestamp)}</td>
        </tr>
    )
}

const Nexts = ({ nexttimes, currentTimestamp }) => {

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
                        realtimeArrival={next.realtimeArrival}
                        currentTimestamp={currentTimestamp}
                        headsign={next.headsign}
                    />
                ))
                }
            </tbody>
        </Table>
    )
}

const Stop = ({ gtfsId, clearStopFunction, currentTimestamp }) => {
    const { loading, error, data } = useQuery(NEXTS, {
        variables: { idToSearch: gtfsId },
        pollInterval: 20000
    })

    if (loading) return <p>Loading...</p>
    else if (error) return <p>Error, ALL_STOPS query returns error.</p>
    return (
        <>
            <h4>{data.stop.code} {data.stop.name}</h4>
            <Button variant="primary" onClick={clearStopFunction}>
                Reselect stop
            </Button>
            <Nexts
                key={gtfsId}
                nexttimes={data.stop.stoptimesWithoutPatterns}
                currentTimestamp={currentTimestamp}
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
            .filter(stop => stop.name.toLowerCase().includes(str) || (stop.code && stop.code.toLowerCase().includes(str)))
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

    const [currentTimestamp, setcurrentTimestamp] = useState(0)
    setTimeout(
        () => setcurrentTimestamp(timestamp()),
        1000
    )

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
                    currentTimestamp={currentTimestamp}
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
                                currentTimestamp={currentTimestamp}
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