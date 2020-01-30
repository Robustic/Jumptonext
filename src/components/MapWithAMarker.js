import React from 'react'
import GoogleMaps from "simple-react-google-maps"

const MapWithAMarker = (props) => {
    return (
        <GoogleMaps
            apiKey={process.env.REACT_APP_GOOGLE_KEY}
            style={{ height: "400px", width: "100%" }}
            zoom={6}
            center={{ lat: 37.4224764, lng: -122.0842499 }}
            markers={{ lat: 37.4224764, lng: -122.0842499 }} //optional
        />
    )
}

export default MapWithAMarker