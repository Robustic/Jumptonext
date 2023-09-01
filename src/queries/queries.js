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

export const GET_SUB = gql`
    query {
        sub {
            sub
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

export const CREATE_ACCOUNT = gql`
    mutation createUser($username: String!, $password: String!) {
        createUser(username: $username, password: $password) {
            id
            username
        }
    }
`

export const ADD_TO_FAVOURITES = gql`
    mutation addFavouriteStop($newFavouriteStop: String!) {
        addFavouriteStop(newFavouriteStop: $newFavouriteStop) {
            favouriteStops
        }
    }
`

export const REMOVE_FROM_FAVOURITES = gql`
    mutation removeFavouriteStop($favouriteStopToRemove: String!) {
        removeFavouriteStop(favouriteStopToRemove: $favouriteStopToRemove) {
            favouriteStops
        }
    }
`
