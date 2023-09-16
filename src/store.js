import { configureStore } from '@reduxjs/toolkit'

import notificationReducer from './reducers/notificationReducer.js'
import stopReducer from './reducers/stopReducer.js'
import userReducer from './reducers/userReducer.js'
import formReducer from './reducers/formReducer.js'
import timestampReducer from './reducers/timestampReducer.js'

const store = configureStore({
    reducer: {
        notification: notificationReducer,
        stops: stopReducer,
        user: userReducer,
        form: formReducer,
        currentTimestamp: timestampReducer,
    },
})

export default store
