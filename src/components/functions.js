export function timestamp() {
    const datetime = new Date()
    const hours = datetime.getHours()
    const minutes = datetime.getMinutes()
    const seconds = datetime.getSeconds()
    const stamp = hours * 60 * 60 + minutes * 60 + seconds
    return stamp
}

export function timeleft(timeleft) {
    const hours = Math.floor(timeleft / 3600)
    const timeleftAfterHours = timeleft - hours * 3600
    const minutes = Math.floor(timeleftAfterHours / 60)
    const timeleftAfterMinutes = timeleftAfterHours - minutes * 60
    const seconds = timeleftAfterMinutes
    if (hours === 0 && minutes === 0) return seconds + "s"
    if (hours === 0) return minutes + "m " + seconds + "s"
    return hours + "h " + minutes + "m " + seconds + "s"
}

export function getTransportColor(transport) {
    switch (transport) {
        case 3: // bus            
            return '#007AC9'
        case 109: // train            
            return '#8C54A2'
        case 0: // tram            
            return '#00985F'
        case 1: // subway            
            return '#FF6319'
        case 4: // ferry            
            return '#00B9E4'
        default:
            return '#00B9E4'
    }
}

export function getTransportType(transport) {
    switch (transport) {
        case 3:
            return "(Bus stop)"
        case 109:
            return "(Train station)"
        case 0:
            return "(Tram stop)"
        case 1:
            return "(Subway station)"
        case 4:
            return "(Ferry stop)"
        default:
            return "(Ferry stop)"
    }
}

export function getTransportButtonStyle(transport) {
    switch (transport) {
        case 3: // bus            
            return "btn-bus"
        case 109: // train            
            return "btn-train"
        case 0: // tram            
            return "btn-tram"
        case 1: // subway            
            return "btn-sub"
        case 4: // ferry            
            return "btn-ferry"
        default:
            return "btn-ferry"
    }
}