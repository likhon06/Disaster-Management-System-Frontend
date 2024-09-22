import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import useReducer from '../redux/features/userSlice'
export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        user: useReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware)
})

