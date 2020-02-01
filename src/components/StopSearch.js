import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Table from 'react-bootstrap/Table'
import '../index.css'
import Map from './Map'
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
        setStop(gtfsId, data.stop.lat, data.stop.lon)
    }
    if (loading) return <tr><td>Loading...</td></tr>
    else if (error) return <tr><td>Error, NEXTS query returns error.</td></tr>
    return (
        <tr key={gtfsId}>
            <td>
                <Button variant="primary" size="sm" onClick={setStopFunction}>
                    {code}
                </Button>
            </td>
            <td className='busstylewithendline'>{name}</td>
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
        <Table bordered size="sm">
            <thead>
                    <tr>
                        <th className='tableheaderwithendlinebold' width={'70px'}>Line</th>
                        <th className='tableheaderwithendlinebold' width={'40%'}>Line name</th>
                        <th className='tableheaderwithendlinebold'>Estimated time left</th>
                    </tr>
                </thead>
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
            <Table>                
                <tbody>
                    <tr>
                        <td className='mainheader' >{data.stop.code} {data.stop.name}</td>
                        <td>
                            <Button variant="primary" onClick={clearStopFunction}>
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
            />
        </>
    )
}

const Showtable = ({ findStop, setStop, currentTimestamp, findStopForm }) => {
    if (findStopForm.length > 0) {
        return (
            findStop.map(stop => (
                <StopLine
                    key={stop.gtfsId}
                    name={stop.name}
                    code={stop.code}
                    gtfsId={stop.gtfsId}
                    setStop={setStop}
                    currentTimestamp={currentTimestamp}
                />
            ))
        )
    } else return <tr><td className='tableheaderwithendlinebold'>-</td><td className='tableheaderwithendlinebold'>No entries</td><td></td></tr>
}

const StopSearch = () => {
    const { loading, error, data } = useQuery(ALL_STOPS)

    const [findStopForm, setFindStopForm] = useState([])
    const [findStop, setFindStop] = useState([])
    const [selectedStop, setSelectedStop] = useState()

    const [x, setX] = useState(60.171298)
    const [y, setY] = useState(24.941671)

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

    const setStop = (stopId, newx, newy) => {
        if (stopId && newx && newy) {
            setX(newx)
            setY(newy)
        }
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
                <Map coord={[x, y]} />
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
            <>
                <Map
                    coord={[x, y]}
                />
                <h5>Find stop to jump to the next</h5>
                <Form>
                    <Form.Group>
                        <InputGroup
                            value={findStopForm}
                            onChange={handleFindStopChange}
                        >
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputSearchPrepend">Search</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                                type="text"
                                placeholder="Example: &quot;Vallilan varikko&quot;, &quot;3024, &quot;E4114&quot;..." />
                        </InputGroup>
                    </Form.Group>
                </Form>
                <div>
                    <Table bordered size="sm">
                        <thead>
                            <tr>
                                <th className='tableheaderwithendlinebold' width={'70px'}>Stop</th>
                                <th className='tableheaderwithendlinebold' width={'20%'}>Stop name</th>
                                <th className='tableheaderwithendlinebold'>Line code, Line name, Estimated time left</th>
                            </tr>
                        </thead>
                        <tbody>
                            <Showtable
                                findStopForm={findStopForm}
                                findStop={findStop}
                                setStop={setStop}
                                currentTimestamp={currentTimestamp}
                            ></Showtable>
                        </tbody>
                    </Table>
                </div >
            </>
        )
    }
}

export default StopSearch