export const bookingMutation = ({ eventId }) => ({
    query: `
    mutation {
        bookEvent(eventId: "${eventId}") {
            _id
            createdAt
            updatedAt
        }
    }
`
})

export const bookingCancelMutation = ({ bookingId }) => ({
    query: `
    mutation {
        cancelBooking(bookingId: "${bookingId}") {
            _id
            title
        }
    }
`
})

export const bookingQuery = () => ({
    query: `
    query {
        bookings {
            _id
            createdAt
            updatedAt
            event {
                _id
                title
                date
            }
        }
    }
`
})
