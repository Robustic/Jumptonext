import { gql } from '@apollo/client'

export const ALL_STOPS = gql`
    query {
        stops {
            gtfsId
            name
            lat
            lon
            code
            zoneId
            vehicleType
        }
    }
`

export const NEXTS = gql`
    query getStop($idToSearch: String!) {
        stop(id: $idToSearch) {
            name
            gtfsId
            code
            lat
            lon
            zoneId
            vehicleType
            stoptimesWithoutPatterns {
                scheduledArrival
                realtimeArrival
                arrivalDelay
                scheduledDeparture
                realtimeDeparture
                departureDelay
                realtime
                realtimeState
                serviceDay
                headsign
                trip {
                    id
                    routeShortName
                }
            }
        }
    }
`

export const GET_ME = gql`
    query {
        me {
            id
            username
            favouriteStops
        }
    }
`

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            value
        }
    }
`
