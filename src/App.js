import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import 'bootstrap/dist/css/bootstrap.min.css'
import Table from 'react-bootstrap/Table';

const ALL_STOPS = gql`
    query {
        stops {
            gtfsId
            name
            code
            lat
            lon
            zoneId
        }
    }
`

const NEXT_BUSSES = gql`
    query getStop($idToSearch: String!) {
        stop(id: $idToSearch) {
          name
          gtfsId
            stoptimesWithoutPatterns {
            scheduledArrival
            realtimeArrival
            arrivalDelay
            scheduledDeparture
            realtimeDeparture
            departureDelay
            realtime
            realtimeState
            serviceDay
            headsign
            trip {
                id
                routeShortName
            }
          }
        }  
      }
`

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

const Stop = ({ name, code, gtfsId, client }) => {
    const { loading, error, data } = useQuery(NEXT_BUSSES, {
        variables: { idToSearch: gtfsId },
    });
    if (loading) return <tr><td>Loading...</td></tr>
    else if (error) return <tr><td>Error :(</td></tr>
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

const App = ({ client }) => {
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
    else if (error) return <p>Error :(</p>

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
                            client={client}
                        />
                    ))
                    }
                </tbody>
            </Table>
        </div >
    )
}

export default App