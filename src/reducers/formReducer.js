import { createSlice } from '@reduxjs/toolkit'

const formSlice = createSlice({
    name: 'form',
    initialState: 'main',
    reducers: {
        setForm(state, action) {
            return action.payload
        },
    },
})

export const { setForm } = formSlice.actions

export default formSlice.reducer
