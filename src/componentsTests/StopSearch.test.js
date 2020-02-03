import React from "react"
import { MockedProvider } from "@apollo/react-testing"
import { render, fireEvent, act } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import wait from "waait"
import StopSearch from '../components/StopSearch'

import { ALL_STOPS, NEXTS } from '../queries/queries'

const mock_ALL_STOPS =
{
  request: {
    query: ALL_STOPS,
  },
  result: () => {
    //
    return {
      data: {
        stops: [
          {
            gtfsId: "HSL: 6150221",
        name: "Louhosmäki",
            lat: 60.20219,
            lon: 24.35642,
            code: "Ki1521",
            zoneId: "D",
            vehicleType: 3
          },
          {
            gtfsId: "HSL:1310602",
            name: "Lauttasaari",
            lat: 60.159443,
            lon: 24.8785,
            code: "0012",
            zoneId: "A",
            vehicleType: 1
          },
        ]
      }
    }
  }
};


const mock_NEXTS =
{
  request: {
    query: NEXTS,
    variables: {
      id: 'HSL:6150219'
    }
  },
  result: () => {
    // do something, such as recording that this function has been called
    // ...
    return {
      data: {
        stop: {
          name: 'Louhosmäki',
          gtfsId: 'HSL:6150219',
          code: 'Ki1519',
          lat: 60.202282,
          lon: 24.358088,
          zoneId: "D",
          vehicleType: 3,
          stoptimesWithoutPatterns: [
            {
              scheduledArrival: 56160,
              realtimeArrival: 56160,
              arrivalDelay: 0,
              scheduledDeparture: 56160,
              realtimeDeparture: 56160,
              departureDelay: 0,
              realtime: false,
              realtimeState: 'SCHEDULED',
              serviceDay: 1580162400,
              headsign: 'Kauhala',
              trip: {
                id: 'VHJpcDpIU0w6NjkwOV8yMDIwMDEyN19UaV8xXzE1MTU=',
                routeShortName: '909',
              }
            }
          ]
        }
      }
    }
  }
};

describe('and the component is loading', () => {
  it("should render without error", async () => {
    const component = render(
      <MockedProvider mocks={[mock_ALL_STOPS, mock_NEXTS]} addTypename={false}>
        <StopSearch />
      </MockedProvider>
    )

    act(() => {
      expect(component.container).toHaveTextContent(
        'Loading...'
      )
    })

    await act(async () => {
      await wait(0)
      //component.debug()
      expect(component.container).toHaveTextContent(
        'Line code, Line name, Estimated time left'
      )
    })
  })
})

