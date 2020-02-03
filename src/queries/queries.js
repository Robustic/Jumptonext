import { gql } from 'apollo-boost'

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
`;

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
`;

