import L from 'leaflet'
import busstop from '../pictures/busstop.png'
import trainstop from '../pictures/trainstop.png'
import tramstop from '../pictures/tramstop.png'
import substop from '../pictures/substop.png'
import ferrystop from '../pictures/ferrystop.png'

function getStopIcon(transportType) {
    switch (transportType) {
        case 'BUS':
            return busstop
        case 'RAIL':
            return trainstop
        case 'TRAM':
            return tramstop
        case 'SUBWAY':
            return substop
        case 'FERRY':
            return ferrystop
        default:
            return ferrystop
    }
}

export function stopIcon(transportType) {
    const icon = new L.Icon({
        iconUrl: getStopIcon(transportType),
        iconRetinaUrl: getStopIcon(transportType),
        iconAnchor: [0, 0],
        popupAnchor: [0, 0],
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
        iconSize: new L.Point(20, 20),
        className: 'leaflet-div-icon',
    })
    return icon
}
