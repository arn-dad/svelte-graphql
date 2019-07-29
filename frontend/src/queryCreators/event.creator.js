export const getEvnetsQuery = () => ({
    query: `
    query {
        events {
            _id
            title
            description
            date
            price
            creator {
                _id
                email
            }
        }
    }
`
})

export const createEventMutation = ({ 
    date,
    title,
    price,
    description 
}) => ({
    query: `
    mutation {
        createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
            _id
            title
            description
            date
            price
            creator {
                email
            }
        }
    }
`
})