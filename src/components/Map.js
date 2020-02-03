import React from 'react'
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet'
import { stopIcon } from './Icon'

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mapBoundsChanged: this.props.mapBoundsChanged
        }
    }
    componentDidMount() {
        const leafletMap = this.leafletMap.leafletElement
        leafletMap.on('zoomend', () => {
            this.handleBoundsChange(leafletMap.getBounds(), leafletMap.getZoom())
        })
        leafletMap.on('moveend', () => {
            this.handleBoundsChange(leafletMap.getBounds(), leafletMap.getZoom())
        })
        this.handleBoundsChange(leafletMap.getBounds(), leafletMap.getZoom())
    }
    handleBoundsChange(newBounds, newZoomLevel) {
        this.state.mapBoundsChanged(newBounds, newZoomLevel)
    }

    render() {
        return (
            <LeafletMap
                ref={m => { this.leafletMap = m }}
                center={this.props.coord}
                minZoom={8}
                zoom={16}
                maxZoom={17}
                attributionControl={true}
                zoomControl={true}
                doubleClickZoom={true}
                scrollWheelZoom={true}
                dragging={true}
                animate={true}
                easeLinearity={0.35}
            >
                <TileLayer
                    url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {this.props.mapMarkers
                    .map(marker => (
                        <Marker
                            position={[marker.lat, marker.lon]}
                            key={marker.gtfsId}
                            icon={stopIcon(marker.vehicleType)}
                        >
                            <Popup>
                                {marker.code}
                            </Popup>
                        </Marker>
                    ))
                }
            </LeafletMap>
        );
    }
}

export default Map