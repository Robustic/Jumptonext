import { ALL_STOPS, NEXTS } from '../queries/stopQueries'

export const mock_ALL_STOPS = {
    request: {
        query: ALL_STOPS,
    },
    result: () => {
        return {
            data: {
                stops: [
                    {
                        gtfsId: 'HSL:6150221',
                        name: 'Louhosmäki',
                        lat: 60.20219,
                        lon: 24.35642,
                        code: 'Ki1521',
                        zoneId: 'D',
                        vehicleType: 3,
                    },
                    {
                        gtfsId: 'HSL:1310602',
                        name: 'Lauttasaari',
                        lat: 60.159443,
                        lon: 24.8785,
                        code: '0012',
                        zoneId: 'A',
                        vehicleType: 1,
                    },
                    {
                        gtfsId: 'HSL:1310109',
                        name: 'Lauttasaaren kirkko',
                        lat: 60.15817,
                        lon: 24.87228,
                        code: '1029',
                        zoneId: 'A',
                        vehicleType: 3,
                    },
                    {
                        gtfsId: 'HSL:1310105',
                        name: 'Lauttasaarentie (M)',
                        lat: 60.16055,
                        lon: 24.87946,
                        code: '1025',
                        zoneId: 'A',
                        vehicleType: 3,
                    },
                ],
            },
        }
    },
}

export const mock_NEXTS_1310109 = {
    request: {
        query: NEXTS,
        variables: {
            idToSearch: 'HSL:1310109',
        },
    },
    result: () => {
        return {
            data: {
                stop: {
                    name: 'Lauttasaaren kirkko',
                    gtfsId: 'HSL:1310109',
                    code: '1029',
                    lat: 60.15817,
                    lon: 24.87228,
                    zoneId: 'A',
                    vehicleType: 3,
                    stoptimesWithoutPatterns: [
                        {
                            scheduledArrival: 55920,
                            realtimeArrival: 56028,
                            arrivalDelay: 108,
                            scheduledDeparture: 55920,
                            realtimeDeparture: 56035,
                            departureDelay: 115,
                            realtime: true,
                            realtimeState: 'UPDATED',
                            serviceDay: 1580940000,
                            headsign: 'Katajaharju',
                            trip: {
                                id: 'VHJpcDpIU0w6MTAyMF8yMDIwMDIwNV9Ub18xXzE1MTg=',
                                routeShortName: '20',
                            },
                        },
                        {
                            scheduledArrival: 56640,
                            realtimeArrival: 56640,
                            arrivalDelay: 0,
                            scheduledDeparture: 56640,
                            realtimeDeparture: 56640,
                            departureDelay: 0,
                            realtime: false,
                            realtimeState: 'SCHEDULED',
                            serviceDay: 1580940000,
                            headsign: 'Katajaharju',
                            trip: {
                                id: 'VHJpcDpIU0w6MTAyMF8yMDIwMDIwNV9Ub18xXzE1Mjk=',
                                routeShortName: '20',
                            },
                        },
                        {
                            scheduledArrival: 57360,
                            realtimeArrival: 57360,
                            arrivalDelay: 0,
                            scheduledDeparture: 57360,
                            realtimeDeparture: 57360,
                            departureDelay: 0,
                            realtime: false,
                            realtimeState: 'SCHEDULED',
                            serviceDay: 1580940000,
                            headsign: 'Katajaharju',
                            trip: {
                                id: 'VHJpcDpIU0w6MTAyMF8yMDIwMDIwNV9Ub18xXzE1NDE=',
                                routeShortName: '20',
                            },
                        },
                        {
                            scheduledArrival: 58080,
                            realtimeArrival: 58080,
                            arrivalDelay: 0,
                            scheduledDeparture: 58080,
                            realtimeDeparture: 58080,
                            departureDelay: 0,
                            realtime: false,
                            realtimeState: 'SCHEDULED',
                            serviceDay: 1580940000,
                            headsign: 'Katajaharju',
                            trip: {
                                id: 'VHJpcDpIU0w6MTAyMF8yMDIwMDIwNV9Ub18xXzE1NTM=',
                                routeShortName: '20',
                            },
                        },
                        {
                            scheduledArrival: 58860,
                            realtimeArrival: 58860,
                            arrivalDelay: 0,
                            scheduledDeparture: 58860,
                            realtimeDeparture: 58860,
                            departureDelay: 0,
                            realtime: false,
                            realtimeState: 'SCHEDULED',
                            serviceDay: 1580940000,
                            headsign: 'Katajaharju',
                            trip: {
                                id: 'VHJpcDpIU0w6MTAyMF8yMDIwMDIwNV9Ub18xXzE2MDY=',
                                routeShortName: '20',
                            },
                        },
                    ],
                },
            },
        }
    },
}

export const mock_NEXTS_1310602 = {
    request: {
        query: NEXTS,
        variables: {
            idToSearch: 'HSL:1310602',
        },
    },
    result: () => {
        return {
            data: {
                stop: {
                    name: 'Lauttasaari',
                    gtfsId: 'HSL:1310602',
                    code: '0012',
                    lat: 60.159443,
                    lon: 24.8785,
                    zoneId: 'A',
                    vehicleType: 1,
                    stoptimesWithoutPatterns: [
                        {
                            scheduledArrival: 54840,
                            realtimeArrival: 55067,
                            arrivalDelay: 227,
                            scheduledDeparture: 54840,
                            realtimeDeparture: 55092,
                            departureDelay: 252,
                            realtime: true,
                            realtimeState: 'UPDATED',
                            serviceDay: 1580940000,
                            headsign: 'Tapiola',
                            trip: {
                                id: 'VHJpcDpIU0w6MzFNMl8yMDIwMDIwNV9Ub18yXzE0NDc=',
                                routeShortName: 'M2',
                            },
                        },
                        {
                            scheduledArrival: 54960,
                            realtimeArrival: 55167,
                            arrivalDelay: 207,
                            scheduledDeparture: 54960,
                            realtimeDeparture: 55192,
                            departureDelay: 232,
                            realtime: true,
                            realtimeState: 'UPDATED',
                            serviceDay: 1580940000,
                            headsign: 'Matinkylä',
                            trip: {
                                id: 'VHJpcDpIU0w6MzFNMV8yMDIwMDIwNV9Ub18yXzE0NTA=',
                                routeShortName: 'M1',
                            },
                        },
                        {
                            scheduledArrival: 55140,
                            realtimeArrival: 55207,
                            arrivalDelay: 67,
                            scheduledDeparture: 55140,
                            realtimeDeparture: 55232,
                            departureDelay: 92,
                            realtime: true,
                            realtimeState: 'UPDATED',
                            serviceDay: 1580940000,
                            headsign: 'Tapiola',
                            trip: {
                                id: 'VHJpcDpIU0w6MzFNMl8yMDIwMDIwNV9Ub18yXzE0NTI=',
                                routeShortName: 'M2',
                            },
                        },
                    ],
                },
            },
        }
    },
}

export const mock_NEXTS_6150221 = {
    request: {
        query: NEXTS,
        variables: {
            idToSearch: 'HSL:6150221',
        },
    },
    result: () => {
        return {
            data: {
                stop: {
                    name: 'Louhosmäki',
                    gtfsId: 'HSL:6150221',
                    code: 'Ki1521',
                    lat: 60.20219,
                    lon: 24.35642,
                    zoneId: 'D',
                    vehicleType: 3,
                    stoptimesWithoutPatterns: [
                        {
                            scheduledArrival: 53220,
                            realtimeArrival: 53356,
                            arrivalDelay: 136,
                            scheduledDeparture: 53220,
                            realtimeDeparture: 53358,
                            departureDelay: 138,
                            realtime: true,
                            realtimeState: 'UPDATED',
                            serviceDay: 1580940000,
                            headsign: 'Kaislampi via Veikkola',
                            trip: {
                                id: 'VHJpcDpIU0w6NjkwOEtfMjAyMDAyMDVfVG9fMV8xNDMw',
                                routeShortName: '908K',
                            },
                        },
                        {
                            scheduledArrival: 56820,
                            realtimeArrival: 56820,
                            arrivalDelay: 0,
                            scheduledDeparture: 56820,
                            realtimeDeparture: 56834,
                            departureDelay: 0,
                            realtime: true,
                            realtimeState: 'UPDATED',
                            serviceDay: 1580940000,
                            headsign: 'Kaislampi via Veikkola',
                            trip: {
                                id: 'VHJpcDpIU0w6NjkwOF8yMDIwMDIwNV9Ub18xXzE1MzA=',
                                routeShortName: '908',
                            },
                        },
                        {
                            scheduledArrival: 56880,
                            realtimeArrival: 56880,
                            arrivalDelay: 0,
                            scheduledDeparture: 56880,
                            realtimeDeparture: 56880,
                            departureDelay: 0,
                            realtime: false,
                            realtimeState: 'SCHEDULED',
                            serviceDay: 1580940000,
                            headsign: 'Veikkola',
                            trip: {
                                id: 'VHJpcDpIU0w6NjkwOV8yMDIwMDIwNV9Ub18yXzE1MzQ=',
                                routeShortName: '909',
                            },
                        },
                        {
                            scheduledArrival: 60240,
                            realtimeArrival: 60240,
                            arrivalDelay: 0,
                            scheduledDeparture: 60240,
                            realtimeDeparture: 60240,
                            departureDelay: 0,
                            realtime: false,
                            realtimeState: 'SCHEDULED',
                            serviceDay: 1580940000,
                            headsign: 'Veikkola',
                            trip: {
                                id: 'VHJpcDpIU0w6NjkwOV8yMDIwMDIwNV9Ub18yXzE2MzA=',
                                routeShortName: '909',
                            },
                        },
                        {
                            scheduledArrival: 60420,
                            realtimeArrival: 60420,
                            arrivalDelay: 0,
                            scheduledDeparture: 60420,
                            realtimeDeparture: 60420,
                            departureDelay: 0,
                            realtime: false,
                            realtimeState: 'SCHEDULED',
                            serviceDay: 1580940000,
                            headsign: 'Kaislampi via Veikkola',
                            trip: {
                                id: 'VHJpcDpIU0w6NjkwOF8yMDIwMDIwNV9Ub18xXzE2MzA=',
                                routeShortName: '908',
                            },
                        },
                    ],
                },
            },
        }
    },
}

export const mock_NEXTS_1310105 = {
    request: {
        query: NEXTS,
        variables: {
            idToSearch: 'HSL:1310105',
        },
    },
    error: new Error('Error, NEXTS query returns error.'),
}
