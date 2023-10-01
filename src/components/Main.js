import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useApolloClient } from '@apollo/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../index.css'

import AccountSettingsForm from './AccountSettingsForm'
import LoginOrSigninForm from './LoginOrSigninForm'
import Loading from './Loading'
import ManyStopsTable from './ManyStopsTable'
import Menu from './Menu'
import Notification from './Notification'
import SearchStop from './SearchStop'
import SingleStopTable from './SingleStopTable'
import StopMap from './StopMap'
import { queryStops } from './stopsFunctions'
import {
    loginFunction,
    logoutFunction,
    createAccountFunction,
    removeAccountFunction,
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
        return <Loading waitingText={loadingMessage} />
    }
    if (errorMessage) {
        return <p>{errorMessage}</p>
    }

    const choiceForm = () => {
        switch (form) {
            case 'Login': {
                return (
                    <LoginOrSigninForm
                        actionOnSubmit={loginFunction(clientDatabase)}
                        formText={'Login'}
                    />
                )
            }
            case 'Create account': {
                return (
                    <LoginOrSigninForm
                        actionOnSubmit={createAccountFunction(clientDatabase)}
                        formText={'Create account'}
                    />
                )
            }
            case 'account-settings': {
                return (
                    <AccountSettingsForm
                        removeAccount={removeAccountFunction(
                            clientDatabase,
                            clientDigitransit,
                        )}
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
                    logout={logoutFunction(clientDatabase, clientDigitransit)}
                />
                <Notification />
                {choiceForm()}
            </div>
        </div>
    )
}

export default Main
