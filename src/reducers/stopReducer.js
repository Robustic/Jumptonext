import { createSlice } from '@reduxjs/toolkit'

const stopSlice = createSlice({
    name: 'stops',
    initialState: {
        allStops: [],
        stopSearchString: null,
        filteredStops: [],
        stopsInsideMapBounds: [],
        viewCenterCoordinates: { x: 60.171298, y: 24.941671 },
        selectedStop: null,
    },
    reducers: {
        setStops(state, action) {
            return { ...state, allStops: action.payload }
        },
        stopSearchStringChanged(state, action) {
            if (action.payload && action.payload !== '') {
                const written = action.payload
                const str = written.toLowerCase()
                const filteredStops = state.allStops
                    .filter(
                        (stop) =>
                            stop.name.toLowerCase().includes(str) ||
                            (stop.code &&
                                stop.code.toLowerCase().includes(str)),
                    )
                    .sort((a, b) => {
                        if (a.name.toLowerCase() < b.name.toLowerCase())
                            return -1
                        if (a.name.toLowerCase() > b.name.toLowerCase())
                            return 1
                        return 0
                    })
                    .filter((i, index) => index < 10)
                return {
                    ...state,
                    stopSearchString: written,
                    filteredStops: filteredStops,
                }
            } else {
                return {
                    ...state,
                    stopSearchString: null,
                    filteredStops: [],
                }
            }
        },
        mapBoundsChanged(state, action) {
            const bounds = action.payload
            const swLat = bounds._southWest.lat
            const swLng = bounds._southWest.lng
            const neLat = bounds._northEast.lat
            const neLng = bounds._northEast.lng
            const stopsInsideMapBounds = state.allStops
                .filter(
                    (stop) =>
                        swLat < stop.lat &&
                        stop.lat < neLat &&
                        swLng < stop.lon &&
                        stop.lon < neLng,
                )
                .filter((i, index) => index < 100)
            return { ...state, stopsInsideMapBounds: stopsInsideMapBounds }
        },
        setViewCenterCoordinates(state, action) {
            return {
                ...state,
                selectedStop: action.payload.selectedStop,
                viewCenterCoordinates: action.payload.bounds,
            }
        },
        setSelectedStop(state, action) {
            return {
                ...state,
                selectedStop: action.payload,
            }
        },
        clearAllButInitialStops(state, action) {
            return {
                ...state,
                stopSearchString: null,
                filteredStops: [],
                viewCenterCoordinates: { x: 60.171298, y: 24.941671 },
                selectedStop: null,
            }
        },
    },
})

export const {
    setStops,
    stopSearchStringChanged,
    mapBoundsChanged,
    setViewCenterCoordinates,
    setSelectedStop,
    clearAllButInitialStops,
} = stopSlice.actions

export default stopSlice.reducer
