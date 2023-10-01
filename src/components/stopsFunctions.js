import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { useDispatch, useSelector } from 'react-redux'

import { ALL_STOPS } from '../queries/stopQueries'
import { setStops } from '../reducers/stopReducer'

export const queryStops = () => {
    const dispatch = useDispatch()

    const { data, loading, error } = useQuery(ALL_STOPS)
    const allStops = data ? data.stops : []

    useEffect(() => {
        dispatch(setStops(allStops))
    }, [allStops])

    const user = useSelector(({ user }) => user)
    const favouriteStops =
        allStops && user
            ? allStops.filter((s) => user.favouriteStops.includes(s.gtfsId))
            : []

    const loadingMessage = loading ? 'Loading...' : null

    const errorMessage = error
        ? 'Error, ALL_STOPS query returns error. Check your network connection status.'
        : null

    return { favouriteStops, loadingMessage, errorMessage }
}
