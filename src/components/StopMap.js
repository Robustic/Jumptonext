import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import MapMarker from './MapMarker'

const StopMap = ({ center, mapBoundsChanged, mapMarkers, setStop, form }) => {
    const [map, setMap] = useState(null)
    const [x, y] = center

    const onMove = useCallback(() => {
        if (map) {
            mapBoundsChanged(map.getBounds())
        }
    }, [map, mapBoundsChanged])

    useEffect(() => {
        if (map) {
            map.on('move', onMove)
            return () => {
                map.off('move', onMove)
            }
        }
    }, [map, onMove])

    useEffect(() => {
        if (map) {
            map.setView([x, y])
        }
    }, [map, x, y])

    useEffect(() => {
        if (map) {
            mapBoundsChanged(map.getBounds())
        }
    }, [map])

    const displayMap = useMemo(
        () => (
            <MapContainer
                ref={setMap}
                center={center}
                minZoom={10}
                zoom={17}
                maxZoom={19}
                attributionControl={true}
                zoomControl={true}
                doubleClickZoom={true}
                scrollWheelZoom={true}
                dragging={true}
                animate={true}
                easeLinearity={0.35}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {mapMarkers.map((marker) => (
                    <MapMarker
                        marker={marker}
                        setStop={setStop}
                        key={marker.gtfsId}
                    />
                ))}
            </MapContainer>
        ),
        [center, mapMarkers, setStop],
    )

    if (form !== 'main' && form != 'favourites') {
        return <></>
    }

    return <div>{displayMap}</div>
}

export default StopMap
