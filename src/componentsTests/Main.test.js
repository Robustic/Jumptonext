import React, { useEffect } from 'react'
import { MockedProvider } from '@apollo/client/testing'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import wait from 'waait'
import Main from '../components/Main'
import { Provider } from 'react-redux'
import { useDispatch } from 'react-redux'

import store from '../store'
import { clearAllButInitialStops } from '../reducers/stopReducer'
import { setCurrentTimestamp } from '../reducers/timestampReducer'

import {
    mock_ALL_STOPS,
    mock_NEXTS_1310602,
    mock_NEXTS_6150221,
    mock_NEXTS_1310109,
    mock_NEXTS_1310105,
} from './queries.mock'

describe('Search is working properly', () => {
    const CleanedMain = () => {
        const dispatch = useDispatch()

        useEffect(() => {
            dispatch(clearAllButInitialStops())
        }, [])

        useEffect(() => {
            dispatch(setCurrentTimestamp())
        }, [])

        return <Main />
    }

    const user = userEvent.setup()

    let component
    let container
    let queryByText
    let getByText

    var MockDate = require('mockdate')

    beforeAll(() => {
        const timeHEL = 1579790109347 // 2020-01-23T14:35:09+00:00
        const timeUTC = timeHEL - 2 * 3600000
        MockDate.set(timeUTC)
    })

    beforeEach(() => {
        component = render(
            <Provider store={store}>
                <MockedProvider
                    mocks={[
                        mock_ALL_STOPS,
                        mock_NEXTS_1310602,
                        mock_NEXTS_6150221,
                        mock_NEXTS_1310109,
                        mock_NEXTS_1310105,
                        mock_NEXTS_1310105,
                        mock_NEXTS_1310105,
                    ]}
                    addTypename={false}
                >
                    <CleanedMain />
                </MockedProvider>
            </Provider>,
        )
        container = component.container
        queryByText = component.queryByText
        getByText = component.getByText
    })

    test('Search is working properly', async () => {
        const { getByPlaceholderText } = component
        expect(container).toHaveTextContent('Loading...')
        await wait(10)

        const input = getByPlaceholderText(
            "Example: 'Vallilan varikko', '3024', 'E4114'...",
        )

        await user.type(input, 'l')

        expect(container).toHaveTextContent(
            'Line code, Line name, Estimated time left',
        )
        expect(container).toHaveTextContent('Error, NEXTS query returns error.')
        expect(container).toHaveTextContent('Lauttasaaren kirkko')
        expect(container).toHaveTextContent('Lauttasaari')
        expect(container).toHaveTextContent('43m 3s')
        expect(queryByText('(43m 3s)')).not.toBeInTheDocument()

        expect(container).toHaveTextContent('Louhosmäki')

        await user.clear(input)
        await user.type(input, 'lo')

        expect(
            queryByText('Error, NEXTS query returns error.'),
        ).not.toBeInTheDocument()
        expect(queryByText('Lauttasaari')).not.toBeInTheDocument()
        expect(queryByText('43m 3s')).not.toBeInTheDocument()

        expect(container).toHaveTextContent('Louhosmäki')
        expect(container).toHaveTextContent('908')
        expect(container).toHaveTextContent('Kaislampi via Veikkola')
        expect(container).toHaveTextContent('1h 12m 5s')
        expect(queryByText('(1h 12m 5s)')).not.toBeInTheDocument()

        await user.clear(input)
        await user.type(input, 'l')

        expect(container).toHaveTextContent('Lauttasaaren kirkko')
        await user.click(getByText('Ki1521'))

        expect(queryByText('Lauttasaari')).not.toBeInTheDocument()
        expect(queryByText('43m 3s')).not.toBeInTheDocument()
    })

    test('From Stop view return to the general view works', async () => {
        const { getByPlaceholderText } = component
        expect(container).toHaveTextContent('Loading...')
        await wait(10)

        const input = getByPlaceholderText(
            "Example: 'Vallilan varikko', '3024', 'E4114'...",
        )

        await user.type(input, 'l')
        await user.click(getByText('Ki1521'))

        expect(container).toHaveTextContent('Louhosmäki')
        expect(queryByText('Lauttasaari')).not.toBeInTheDocument()

        await user.click(getByText('Reselect stop'))

        expect(container).toHaveTextContent('Louhosmäki')
        expect(container).toHaveTextContent('Lauttasaari')
    })

    afterAll(() => {
        MockDate.reset()
    })
})
