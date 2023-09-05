import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { useDispatch, useSelector } from 'react-redux'

import MapMarker from './MapMarker'
import { mapBoundsChanged } from '../reducers/stopReducer'

const StopMap = () => {
    const dispatch = useDispatch()

    const stopsInsideMapBounds = useSelector(
        ({ stops }) => stops.stopsInsideMapBounds,
    )
    const { x, y } = useSelector(({ stops }) => stops.viewCenterCoordinates)

    const [map, setMap] = useState(null)

    const simplifyBounds = (bounds) => {
        return {
            _southWest: {
                lat: bounds._southWest.lat,
                lng: bounds._southWest.lng,
            },
            _northEast: {
                lat: bounds._northEast.lat,
                lng: bounds._northEast.lng,
            },
        }
    }

    const onMove = useCallback(() => {
        if (map) {
            dispatch(mapBoundsChanged(simplifyBounds(map.getBounds())))
        }
    }, [map])

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
            dispatch(mapBoundsChanged(simplifyBounds(map.getBounds())))
        }
    }, [map])

    const displayMap = useMemo(
        () => (
            <MapContainer
                ref={setMap}
                center={[x, y]}
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
                {stopsInsideMapBounds.map((marker) => (
                    <MapMarker marker={marker} key={marker.gtfsId} />
                ))}
            </MapContainer>
        ),
        [x, y, stopsInsideMapBounds],
    )

    return <div>{displayMap}</div>
}

export default StopMap
