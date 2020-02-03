import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Table from 'react-bootstrap/Table'
import Image from 'react-bootstrap/Image'
import '../index.css'
import Map from './Map'
import { ALL_STOPS, NEXTS } from '../queries/queries'
import pic from '../pictures/logo192.png'

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

function getTransportColor(transport) {
    switch (transport) {
        case 3:
            // bus
            return '#007AC9'
        case 109:
            // train
            return '#8C54A2'
        case 0:
            // tram
            return '#00985F'
        case 1:
            // subway
            return '#FF6319'
        case 4:
            // ferry
            return '#00B9E4'
        default:
            return '#00B9E4'
    }
}

function getTransportButtonStyle(transport) {
    switch (transport) {
        case 3:
            // bus
            return "btn-bus"
        case 109:
            // train
            return "btn-train"
        case 0:
            // tram
            return "btn-tram"
        case 1:
            // subway
            return "btn-sub"
        case 4:
            // ferry
            return "btn-ferry"
        default:
            return "btn-bus"
    }
}

const NextForLine = ({ routeShortName, realtimeArrival, currentTimestamp, headsign, transportColor, realtime }) => {
    const transportStyle = {
        color: transportColor,
        display: 'inline'
    }
    const transportStyleBolded = {
        color: transportColor,
        fontWeight: 'bold',
        display: 'inline'
    }
    if (realtime === true) {
        return (
            <>
                <p style={transportStyleBolded}>{routeShortName}{' '}</p>
                <p style={transportStyle}>{headsign}</p>
                <p className='realtimestyle'> {timeleft(realtimeArrival - currentTimestamp)}</p>
                <p className='black'>{' ; '}</p>
            </>
        )
    } else {
        return (
            <>
                <p style={transportStyleBolded}>{routeShortName}{' '}</p>
                <p style={transportStyle}>{headsign}</p>
                <p className='notrealtimestyle'> ({timeleft(realtimeArrival - currentTimestamp)})</p>
                <p className='black'>{' ; '}</p>
            </>
        )
    }
}

const NextsForLine = ({ nextstops, currentTimestamp, transportColor }) => {
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
                    transportColor={transportColor}
                    realtime={next.realtime}
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
    const transportColor = getTransportColor(data.stop.vehicleType)
    const transportStyle = {
        color: transportColor
    }
    const transportButtonStyle = getTransportButtonStyle(data.stop.vehicleType)
    return (
        <tr key={gtfsId}>
            <td>
                <Button className={transportButtonStyle} size="sm" onClick={setStopFunction}>
                    {code}
                </Button>
            </td>
            <td style={transportStyle}>{name}</td>
            <td>
                <NextsForLine
                    nextstops={data.stop.stoptimesWithoutPatterns}
                    key={data.stop.gtfsId}
                    currentTimestamp={currentTimestamp}
                    transportColor={transportColor}
                />
            </td>
        </tr>
    )
}

const Next = ({ routeShortName, realtimeArrival, currentTimestamp, headsign, transportColor, realtime }) => {
    const transportStyle = {
        color: transportColor
    }
    const transportStyleBold = {
        color: transportColor,
        fontWeight: 'bold'
    }
    if (realtime === true) {
        return (
            <tr>
                <td style={transportStyleBold} width={'50px'}>{routeShortName}</td>
                <td style={transportStyle} width={'40%'}>{headsign}</td>
                <td className='realtimestylewithendline'>{timeleft(realtimeArrival - currentTimestamp)}</td>
            </tr>
        )
    } else {
        return (
            <tr>
                <td style={transportStyleBold} width={'50px'}>{routeShortName}</td>
                <td style={transportStyle} width={'40%'}>{headsign}</td>
                <td className='notrealtimestylewithendline'>({timeleft(realtimeArrival - currentTimestamp)})</td>
            </tr>
        )
    }
}

const Nexts = ({ nexttimes, currentTimestamp, transportColor }) => {

    const nextToView = nexttimes
        .sort()
        .filter(next => (next.realtimeArrival && next.realtimeArrival > currentTimestamp))

    return (
        <Table bordered size="sm">
            <thead>
                <tr>
                    <th className='tableheaderwithendlinebold' width={'70px'}>Line</th>
                    <th className='tableheaderwithendlinebold' width={'40%'}>Line name</th>
                    <th className='tableheaderwithendlinebold'>Estimated time left (green color for realtime)</th>
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
                        transportColor={transportColor}
                        realtime={next.realtime}
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
    const transportColor = getTransportColor(data.stop.vehicleType)
    const transportStyle = {
        color: transportColor,
        fontSize: '1.17em',
        marginTop: '1em',
        marginBottom: '1em',
        marginLeft: 0,
        marginRight: 0,
        fontWeight: 'bold'
    }
    return (
        <>
            <Table>
                <tbody>
                    <tr>
                        <td style={transportStyle} >{data.stop.code} {data.stop.name}</td>
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
                transportColor={transportColor}
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

    const [mapMarkers, setMapMarkers] = useState([])

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

    const mapBoundsChanged = (bounds) => {
        console.log('this.state.currentZoomLevel ->', bounds)
        const swLat = bounds._southWest.lat
        const swLng = bounds._southWest.lng
        const neLat = bounds._northEast.lat
        const neLng = bounds._northEast.lng
        const filteredStops = data.stops
            .filter(stop => (swLat < stop.lat && stop.lat < neLat && swLng < stop.lon && stop.lon < neLng))
            .filter((i, index) => (index < 100))
        console.log(filteredStops)
        setMapMarkers(filteredStops)
    }

    if (loading) {
        return (
            <div className='bg-silver'>
                <Row className="justify-content-md-center">
                    <p className='start'>Loading...</p>
                </Row>
                <Row className="justify-content-md-center">
                    <Image src={pic} roundedCircle />
                </Row>
            </div>
        )
    }
    if (error) return <p>Error, ALL_STOPS query returns error.</p>
    if (selectedStop) {
        const clearStopFunction = () => {
            setStop()
        }
        return (
            <div className='container'>
                <div className='bg-white pl-3 pr-3 pb-1'>
                    <Map
                        coord={[x, y]}
                        mapBoundsChanged={mapBoundsChanged}
                        mapMarkers={mapMarkers} />
                    <Stop
                        key={selectedStop}
                        gtfsId={selectedStop}
                        clearStopFunction={clearStopFunction}
                        currentTimestamp={currentTimestamp}
                    />
                </div>
            </div>
        )
    } else {
        return (
            <div className='container'>
                <div className='bg-white pl-3 pr-3 pb-1'>
                    <Map
                        coord={[x, y]}
                        mapBoundsChanged={mapBoundsChanged}
                        mapMarkers={mapMarkers}
                    />
                    <div className='pt-3'>
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
                    </div>
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
                </div>
            </div>
        )
    }
}

export default StopSearch