import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        setNotificationToReducer(state, action) {
            return action.payload
        },
        clearNotificationToReducer(state, action) {
            return null
        },
    },
})

export const setNotification = (message, time, variant) => {
    return (dispatch) => {
        dispatch(setNotificationToReducer({ message, variant }))
        setTimeout(() => {
            dispatch(clearNotificationToReducer())
        }, time * 1000)
    }
}

export const { setNotificationToReducer, clearNotificationToReducer } =
    notificationSlice.actions
export default notificationSlice.reducer
