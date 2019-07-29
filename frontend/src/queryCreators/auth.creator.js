export const loginMutation = ({ email, password }) => ({
    query: `
    mutation {
        createUser(userInput: {email: "${email}", password: "${password}"}) {
            _id
            email
        }
    }
`
})

export const signupQuery = ({ email, password }) => ({
    query: `
        query {
            login(email: "${email}", password: "${password}") {
                userId
                token
                tokenExpiration
            }
        }
    `
})