import { createSlice } from '@reduxjs/toolkit'

import { timestamp } from '../components/commonFunctions'

const timestampSlice = createSlice({
    name: 'currentTimestamp',
    initialState: timestamp(),
    reducers: {
        setCurrentTimestamp(state, action) {
            return timestamp()
        },
    },
})

export const { setCurrentTimestamp } = timestampSlice.actions

export default timestampSlice.reducer
