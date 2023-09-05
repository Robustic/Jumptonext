import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        setUser(state, action) {
            return action.payload
        },
        setFavouriteStopsForUser(state, action) {
            return { ...state, favouriteStops: action.payload.favouriteStops }
        },
    },
})

export const { setUser, setFavouriteStopsForUser } = userSlice.actions

export default userSlice.reducer
