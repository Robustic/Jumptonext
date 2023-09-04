// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('removeAllUsers', async () => {
    const remove_all_users = `
            mutation removeAllUsers($removeUsersString: String!) {
                removeAllUsers(removeUsersString: $removeUsersString)
            }
        `

    await fetch('http://localhost:4004', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: remove_all_users,
            variables: { removeUsersString: 'Remove all users' },
        }),
    })
})

Cypress.Commands.add('createUser', async ({ username, password }) => {
    const create_new_user = `
            mutation createUser($username: String!, $password: String!) {
                createUser(username: $username, password: $password) {
                    id
                    username
                }
            }
        `

    await fetch('http://localhost:4004', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: create_new_user,
            variables: { username: username, password: password },
        }),
    })
})

Cypress.Commands.add('filterAllUsersWithUsername', async ({ username }) => {
    const get_all_users = `
            query {
                allUsers {
                    username
                    favouriteStops
                }
            }
        `

    const response = await fetch('http://localhost:4004', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: get_all_users,
        }),
    })

    const responseJson = await response.json()
    const allUsers = responseJson.data.allUsers
    const filteredUsers = allUsers.filter((u) => u.username === username)

    return filteredUsers
})

Cypress.Commands.add(
    'favouriteStopsForFirstUserWithUsername',
    async ({ username }) => {
        const get_all_users = `
            query {
                allUsers {
                    username
                    favouriteStops
                }
            }
        `

        const response = await fetch('http://localhost:4004', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: get_all_users,
            }),
        })

        const responseJson = await response.json()
        const allUsers = responseJson.data.allUsers
        const filteredUsers = allUsers.filter((u) => u.username === username)

        return filteredUsers[0].favouriteStops
    },
)
