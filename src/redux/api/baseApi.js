import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://dmm-backend.vercel.app' }),
    tagTypes: ['Donation', 'Crisis', 'Status', 'Inventory', 'Expense'],
    endpoints: (builder) => ({
        getDonation: builder.query({
            query: () => '/api/only-donations',
            providesTags: ['Donation']
        }),
        getDonationandExpenses: builder.query({
            query: () => '/api/donation&expenses/total',
            providesTags: ['Donation', 'Expense']
        }),
        postDonation: builder.mutation({
            query: (payload) => ({
                url: '/api/donation',
                method: 'POST',
                body: payload
            }),
            invalidatesTags: ['Donation', 'DonationList']
        }),
        postCrisis: builder.mutation({
            query: (payload) => ({
                url: `/api/crisis`,
                method: 'POST',
                body: payload
            }),
            invalidatesTags: ['Crisis']
        }),
        getCrisis: builder.query({
            query: () => `/api/crisis`,
            providesTags: ['Crisis']
        }),
        postRegister: builder.mutation({
            query: (payload) => ({
                url: `/api/auth/register`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Volunteer']
        }),
        postLogin: builder.mutation({
            query: (payload) => ({
                url: `/api/auth/login`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Volunteer']
        }),
        getSingleCrisis: builder.query({
            query: (id) => `/api/crisis/${id}`,
            providesTags: ['Crisis']
        }),
        statusUpdate: builder.mutation({
            query: (payload) => ({
                url: `/api/crisis/:id`,
                method: 'PUT',
                body: payload
            }),
            invalidatesTags: ['Crisis']
        }),
        deleteSingleCrisis: builder.mutation({
            query: (id) => ({
                url: `/api/crisis/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Crisis']
        }),
        getVolunteer: builder.query({
            query: () => `/api/volunteer`,
            providesTags: ['Volunteer']
        }),
        updateVolunteer: builder.mutation({
            query: (payload) => ({
                url: `/api/volunteer`,
                method: 'PUT',
                body: payload
            }),
            invalidatesTags: ['Volunteer']
        }),
        postInventory: builder.mutation({
            query: (payload) => ({
                url: `/api/inventory`,
                method: 'POST',
                body: payload
            }),
            invalidatesTags: ['Inventory', 'Expense']
        }),
        getInventory: builder.query({
            query: () => `/api/inventory`,
            providesTags: ['Inventory']
        }),
        deleteInventory: builder.mutation({
            query: (id) => ({
                url: `/api/inventory/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Inventory', 'Expense']
        }),
        getSingleInventory: builder.query({
            query: (id) => `/api/inventory/${id}`,
            providesTags: ['Inventory']
        }),
        updateSingleInventory: builder.mutation({
            query: ({ id, payload }) => ({
                url: `/api/inventory/${id}`,
                method: 'PUT',
                body: payload
            }),
            invalidatesTags: ['Inventory', 'Expense']
        }),
        getDonationsList: builder.query({
            query: () => `/api/donations-list`,
            providesTags: ['DonationList']
        }),
        getDonationsReport: builder.query({
            query: () => `/api/csv-donation`
        })
    }),
})

export const {
    useGetDonationQuery,
    usePostDonationMutation,
    useGetDonationandExpensesQuery,
    usePostCrisisMutation,
    useGetCrisisQuery,
    usePostRegisterMutation,
    usePostLoginMutation,
    useGetSingleCrisisQuery,
    useStatusUpdateMutation,
    useDeleteSingleCrisisMutation,
    useGetVolunteerQuery,
    useUpdateVolunteerMutation,
    usePostInventoryMutation,
    useGetInventoryQuery,
    useDeleteInventoryMutation,
    useGetSingleInventoryQuery,
    useUpdateSingleInventoryMutation,
    useGetDonationsListQuery,
    useGetDonationsReportQuery
} = baseApi;