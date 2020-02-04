import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import 'bootstrap/dist/css/bootstrap.min.css'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Image from 'react-bootstrap/Image'
import '../index.css'
import Map from './Map'
import { ALL_STOPS } from '../queries/queries'
import pic from '../pictures/logo192.png'
import StopsTable from './StopsTable'
import StopTable from './StopTable'
import { timestamp } from './functions'

const SelectTable = ({ selectedStop, setStop, currentTimestamp, findStopForm, handleFindStopChange, findStop }) => {
    if (selectedStop) {
        const clearStopFunction = () => {
            setStop()
        }
        return (
            <div>
                <StopTable
                    key={selectedStop}
                    gtfsId={selectedStop}
                    clearStopFunction={clearStopFunction}
                    currentTimestamp={currentTimestamp}
                />
            </div>
        )
    } else {
        return (
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
                <StopsTable
                    findStop={findStop}
                    setStop={setStop}
                    currentTimestamp={currentTimestamp}
                />
            </div >
        )
    }
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
        const swLat = bounds._southWest.lat
        const swLng = bounds._southWest.lng
        const neLat = bounds._northEast.lat
        const neLng = bounds._northEast.lng
        const filteredStops = data.stops
            .filter(stop => (swLat < stop.lat && stop.lat < neLat && swLng < stop.lon && stop.lon < neLng))
            .filter((i, index) => (index < 100))
        setMapMarkers(filteredStops)
    }

    if (loading) {
        return (
            <div className='bg-silver'>
                <div className="flex-container center">
                    <p className='start-view-text'>Loading...</p>
                </div>
                <div >
                    <Image className='start-view-image' src={pic} roundedCircle />
                </div>
            </div>
        )
    } else if (error) return <p>Error, ALL_STOPS query returns error. Check your network connection status.</p>

    return (
        <div className='container'>
            <div className='bg-white pl-3 pr-3 pb-1'>
                <Map
                    coord={[x, y]}
                    mapBoundsChanged={mapBoundsChanged}
                    mapMarkers={mapMarkers}
                    setStop={setStop}
                />
                <SelectTable
                    selectedStop={selectedStop}
                    setStop={setStop}
                    currentTimestamp={currentTimestamp}
                    findStopForm={findStopForm}
                    handleFindStopChange={handleFindStopChange}
                    findStop={findStop}
                />
            </div>
        </div>
    )
}

export default StopSearch