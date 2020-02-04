import React from 'react'
import { Marker } from 'react-leaflet'
import { stopIcon } from './StopIcon'

class MapMarker extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            setStop: this.props.setStop
        }
    }
    handleMarkerClicked = event => {
        this.state.setStop(this.props.marker.gtfsId, this.props.marker.lat, this.props.marker.lon)
    }

    render() {
        return (
            <Marker
                ref={m => { this.marker = m }}
                position={[this.props.marker.lat, this.props.marker.lon]}
                key={this.props.marker.gtfsId}
                icon={stopIcon(this.props.marker.vehicleType)}
                onClick={this.handleMarkerClicked}
            >
            </Marker >
        )
    }
}

export default MapMarker