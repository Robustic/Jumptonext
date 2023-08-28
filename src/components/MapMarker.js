import React from 'react'
import { Marker } from 'react-leaflet'
import { stopIcon } from './StopIcon'

const MapMarker = ({ marker, setStop }) => {
    const handleMarkerClicked = (event) => {
        setStop(marker.gtfsId, marker.lat, marker.lon)
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
