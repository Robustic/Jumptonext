import { configureStore } from '@reduxjs/toolkit'

import stopReducer from './reducers/stopReducer.js'
import userReducer from './reducers/userReducer.js'
import formReducer from './reducers/formReducer.js'

const store = configureStore({
    reducer: {
        stops: stopReducer,
        user: userReducer,
        form: formReducer,
    },
})

export default store
