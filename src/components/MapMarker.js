import React from 'react'
import { Marker } from 'react-leaflet'
import { useDispatch } from 'react-redux'

import { stopIcon } from './StopIcon'
import { setViewCenterCoordinates } from '../reducers/stopReducer'

const MapMarker = ({ marker }) => {
    const dispatch = useDispatch()
    const handleMarkerClicked = (event) => {
        dispatch(
            setViewCenterCoordinates({
                selectedStop: marker.gtfsId,
                bounds: { x: marker.lat, y: marker.lon },
            }),
        )
    }

    return (
        <Marker
            position={[marker.lat, marker.lon]}
            key={marker.gtfsId}
            icon={stopIcon(marker.vehicleType)}
            eventHandlers={{
                click: handleMarkerClicked,
            }}
        ></Marker>
    )
}

export default MapMarker
