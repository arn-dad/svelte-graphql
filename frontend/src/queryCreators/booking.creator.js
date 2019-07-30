export const bookingMutation = ({ eventId }) => ({
    query: `
        mutation BookEvent($id: ID!){
            bookEvent(eventId: $id) {
                _id
                createdAt
                updatedAt
            }
        }
    `,
    variables: {
        id: eventId
    }
})

export const bookingCancelMutation = ({ bookingId }) => ({
    query: `
        mutation CancelBooking($id: ID!) {
            cancelBooking(bookingId: $id) {
                _id
                title
            }
        }
    `,
    variables: {
        id: bookingId
    }
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
