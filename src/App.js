import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import 'bootstrap/dist/css/bootstrap.min.css'
import Table from 'react-bootstrap/Table'
import { ALL_STOPS, NEXTS } from './queries/queries'

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
    if (hours === 0 && minutes === 0) return ":" + seconds
    if (hours === 0) return ":" + minutes + ":" + seconds
    return hours + ":" + minutes + ":" + seconds
}

const Nexts = ({ nextstops }) => {
    const currentTimestamp = timestamp()
    const nextToView = nextstops
        .sort()
        .filter(next => (next.realtimeArrival && next.realtimeArrival > currentTimestamp))

    return (
        <>
            {nextToView.map(next => (
                <>{next.trip.routeShortName}- {timeleft(next.scheduledArrival - currentTimestamp)},{' '}</>
            ))
            }
        </>
    )
}

const Stop = ({ name, code, gtfsId }) => {
    const { loading, error, data } = useQuery(NEXTS, {
        variables: { idToSearch: gtfsId },
    });
    if (loading) return <tr><td>Loading...</td></tr>
    else if (error) return <tr><td>Error, NEXTS query returns error.</td></tr>
    return (
        <tr key={gtfsId}>
            <td>{code}</td>
            <td>{name}</td>
            <td>{gtfsId}</td>
            <td>
                <Nexts
                    nextstops={data.stop.stoptimesWithoutPatterns}
                    key={data.stop.gtfsId + "stop"}
                />
            </td>
        </tr>
    )
}

const App = () => {
    const { loading, error, data } = useQuery(ALL_STOPS)

    const [findStopForm, setFindStopForm] = useState([])
    const [findStop, setFindStop] = useState([])

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

    if (loading) return <p>Loading...</p>
    else if (error) return <p>Error, ALL_STOPS query returns error.</p>

    return (
        <div class="container">
            <h3>Pysäkit</h3>
            <input
                value={findStopForm}
                onChange={handleFindStopChange}
            />
            <Table striped>
                <tbody>
                    {findStop.map(stop => (
                        <Stop
                            name={stop.name}
                            code={stop.code}
                            gtfsId={stop.gtfsId}
                            key={stop.gtfsId}
                        />
                    ))
                    }
                </tbody>
            </Table>
        </div >
    )
}

export default App