import React from "react"
import { MockedProvider } from "@apollo/react-testing"
import { render, fireEvent} from '@testing-library/react'
import wait from "waait"
import StopSearch from '../components/StopSearch'

import {
    mock_ALL_STOPS,
    mock_NEXTS_1310602,
    mock_NEXTS_6150221,
    mock_NEXTS_1310109
} from './queries.mock'


describe('Search is working properly', () => {
    var MockDate = require('mockdate');
    const timeHEL = 1579790109347 // 2020-01-23T14:35:09+00:00
    const timeUTC = timeHEL - 2 * 3600000
    MockDate.set(timeUTC)

    const component = render(
        <MockedProvider mocks={[
            mock_ALL_STOPS,
            mock_NEXTS_1310602,
            mock_NEXTS_6150221,
            mock_NEXTS_1310109
        ]
        } addTypename={false}>
            <StopSearch />
        </MockedProvider>
    )
    const container = component.container
    const queryByText = component.queryByText
    const getByText = component.getByText
    const { getByPlaceholderText } = component

    test('Search is working properly', async () => {
        expect(container).toHaveTextContent('Loading...')

        await wait(0)
        expect(container).toHaveTextContent(
            'Line code, Line name, Estimated time left'
        )        

        const input = getByPlaceholderText(
            "Example: -Vallilan varikko-, -3024-, -E4114-..."
        )

        fireEvent.change(input, { target: { value: "l" } })
        await wait(0)

        expect(container).toHaveTextContent('Error, NEXTS query returns error.')
        expect(container).toHaveTextContent('Lauttasaaren kirkko')
        expect(container).toHaveTextContent('Lauttasaari')
        expect(container).toHaveTextContent('43m 3s')
        expect(queryByText('(43m 3s)')).not.toBeInTheDocument()

        expect(container).toHaveTextContent('Louhosmäki')

        fireEvent.change(input, { target: { value: "lo" } })
        await wait(0)

        expect(queryByText('Error, NEXTS query returns error.')).not.toBeInTheDocument()
        expect(queryByText('Lauttasaari')).not.toBeInTheDocument()
        expect(queryByText('43m 3s')).not.toBeInTheDocument()

        expect(container).toHaveTextContent('Louhosmäki')
        expect(container).toHaveTextContent('908')
        expect(container).toHaveTextContent('Kaislampi via Veikkola')
        expect(container).toHaveTextContent('1h 12m 5s')        
        expect(queryByText('(1h 12m 5s)')).not.toBeInTheDocument()

        fireEvent.change(input, { target: { value: "l" } })
        await wait(0)

        expect(container).toHaveTextContent('Lauttasaaren kirkko')
        fireEvent.click(getByText('Ki1521'))

        await wait(0)
        expect(queryByText('Lauttasaari')).not.toBeInTheDocument()
        expect(queryByText('43m 3s')).not.toBeInTheDocument()

        // component.debug()

    })
})

