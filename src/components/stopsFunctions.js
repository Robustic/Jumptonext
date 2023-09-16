import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'react-bootstrap/Image'
import loadingPicture from '../pictures/logo192.png'

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

    const loadingMessage = loading ? (
        <div className="bg-silver">
            <div className="flex-container center">
                <p className="start-view-text">Loading...</p>
            </div>
            <div>
                <Image
                    className="start-view-image"
                    src={loadingPicture}
                    roundedCircle
                />
            </div>
        </div>
    ) : null

    const errorMessage = error ? (
        <p>
            Error, ALL_STOPS query returns error. Check your network connection
            status.
        </p>
    ) : null

    return { favouriteStops, loadingMessage, errorMessage }
}
