import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useApolloClient } from '@apollo/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../index.css'

import LoginOrSigninForm from './LoginOrSigninForm'
import ManyStopsTable from './ManyStopsTable'
import Menu from './Menu'
import SearchStop from './SearchStop'
import SingleStopTable from './SingleStopTable'
import StopMap from './StopMap'
import { queryStops } from './stopsFunctions'
import {
    createLoginFunction,
    createLogoutFunction,
    createCreateAccountFunction,
    checkUser,
} from './userFunctions'

const Main = ({ clientDatabase }) => {
    const dispatch = useDispatch()
    const clientDigitransit = useApolloClient()

    const { favouriteStops, loadingMessage, errorMessage } = queryStops()

    const form = useSelector(({ form }) => form)
    const filteredStops = useSelector(({ stops }) => stops.filteredStops)
    const selectedStop = useSelector(({ stops }) => stops.selectedStop)

    const token = localStorage.getItem('jumptonext-user-token')
        ? localStorage.getItem('jumptonext-user-token')
        : null

    useEffect(() => {
        const { checkUserResultError } = checkUser(clientDatabase, dispatch)
        if (checkUserResultError) {
            return checkUserResultError
        }
    }, [token])

    if (loadingMessage) {
        return loadingMessage
    }
    if (errorMessage) {
        return errorMessage
    }

    const choiceForm = () => {
        switch (form) {
            case 'Login': {
                return (
                    <LoginOrSigninForm
                        actionOnSubmit={createLoginFunction(clientDatabase)}
                        formText={'Login'}
                    />
                )
            }
            case 'Create account': {
                return (
                    <LoginOrSigninForm
                        actionOnSubmit={createCreateAccountFunction(
                            clientDatabase,
                        )}
                        formText={'Create account'}
                    />
                )
            }
            case 'main': {
                if (selectedStop) {
                    return (
                        <div>
                            <StopMap />
                            <SingleStopTable clientDatabase={clientDatabase} />
                        </div>
                    )
                }
                return (
                    <div>
                        <StopMap />
                        <SearchStop />
                        <ManyStopsTable stopsToShowInTable={filteredStops} />
                    </div>
                )
            }
            case 'favourites': {
                if (selectedStop) {
                    return (
                        <div>
                            <StopMap />
                            <SingleStopTable clientDatabase={clientDatabase} />
                        </div>
                    )
                }
                return (
                    <div>
                        <StopMap />
                        <ManyStopsTable stopsToShowInTable={favouriteStops} />
                    </div>
                )
            }
        }
    }

    return (
        <div className="container">
            <div className="bg-white pl-3 pr-3 pb-3">
                <Menu
                    logout={createLogoutFunction(
                        clientDatabase,
                        clientDigitransit,
                    )}
                />
                {choiceForm()}
            </div>
        </div>
    )
}

export default Main
