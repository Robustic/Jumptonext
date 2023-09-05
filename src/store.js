import { configureStore } from '@reduxjs/toolkit'

import stopReducer from './reducers/stopReducer.js'
import userReducer from './reducers/userReducer.js'
import formReducer from './reducers/formReducer.js'
import timestampReducer from './reducers/timestampReducer.js'

const store = configureStore({
    reducer: {
        stops: stopReducer,
        user: userReducer,
        form: formReducer,
        currentTimestamp: timestampReducer,
    },
})

export default store
