describe('Jumptonext', () => {
    beforeEach(function () {
        cy.viewport(1000, 1000)
        cy.removeAllUsers()
        cy.createUser({ username: 'test_user', password: 'test_password' })

        cy.visit('http://localhost:3000')
        cy.contains('Loading', { timeout: 10000 })
        cy.contains('Search stops', { timeout: 10000 })
    })

    it('front page can be opened', () => {
        cy.contains('Login')
        cy.get(
            "input[placeholder=\"Example: 'Vallilan varikko', '3024', 'E4114'...\"]",
        )
        cy.get('body').should('not.contain', 'Favourite stops')
    })

    it('account can be created', () => {
        cy.wait(500)
        cy.contains('Create account').click()
        cy.wait(500)
        cy.get('#username').type('test_user_2')
        cy.get('#password').type('test_password_2')
        cy.wait(500)
        cy.get('#create-account-button').click()
        cy.wait(500)

        cy.filterAllUsersWithUsername({ username: 'test_user_2' }).then(
            (filteredUsers) => {
                expect(filteredUsers).to.have.length(1)
            },
        )
    })

    it('user can log in', () => {
        cy.wait(500)
        cy.get('body').should('not.contain', 'Favourite stops')
        cy.contains('Login').click()
        cy.wait(500)
        cy.get('#username').type('test_user')
        cy.get('#password').type('test_password')
        cy.wait(500)
        cy.get('#login-button').click()
        cy.wait(500)

        cy.contains('Favourite stops')
        cy.contains('test_user')
        cy.contains('logged in')
        cy.get(
            "input[placeholder=\"Example: 'Vallilan varikko', '3024', 'E4114'...\"]",
        )
    })

    describe('when logged in', function () {
        beforeEach(function () {
            cy.wait(500)
            cy.contains('Login').click()
            cy.wait(500)
            cy.get('#username').type('test_user')
            cy.get('#password').type('test_password')
            cy.wait(500)
            cy.get('#login-button').click()
            cy.wait(500)
        })

        it('logged user can search stop', () => {
            cy.get('body').should('not.contain', 'H2061')
            cy.get(
                "input[placeholder=\"Example: 'Vallilan varikko', '3024', 'E4114'...\"]",
            ).type('kaisaniemenp')
            cy.wait(500)
            cy.get('body').should('not.contain', 'Reselect stop')
            cy.wait(500)
            cy.get('button').contains('H2061').click()
            cy.wait(500)
            cy.get('body').should('contain', 'Reselect stop')
        })

        describe("logged in and searched 'kaisaniemenp'", function () {
            beforeEach(function () {
                cy.get(
                    "input[placeholder=\"Example: 'Vallilan varikko', '3024', 'E4114'...\"]",
                ).type('kaisaniemenp')
                cy.wait(500)
                cy.get('button').contains('H2061').click()
                cy.wait(500)
            })

            it('logged in user can add stop to favourites', () => {
                cy.wait(500)
                cy.get('button').contains('Add to favourites').click()
                cy.wait(500)
                cy.get('button').contains('Remove from favourites')
                cy.contains('Favourite stops').click()
                cy.wait(500)
                cy.get('button').contains('H2061').click()
                cy.wait(500)
                cy.contains('H2061 Kaisaniemenpuisto (Bus stop)')
                cy.get('button').contains('Remove from favourites')

                cy.favouriteStopsForFirstUserWithUsername({
                    username: 'test_user',
                }).then((favouriteStops) => {
                    expect(favouriteStops).to.have.length(1)
                    expect(favouriteStops[0]).to.deep.equal('HSL:1020105')
                })
            })

            it('logged in user can remove stop from favourites', () => {
                cy.wait(500)
                cy.get('button').contains('Add to favourites').click()
                cy.wait(1000)
                cy.get('button').should('not.contain', 'Add to favourites')
                cy.get('button').contains('Remove from favourites').click()
                cy.wait(500)
                cy.favouriteStopsForFirstUserWithUsername({
                    username: 'test_user',
                }).then((favouriteStops) => {
                    expect(favouriteStops).to.have.length(0)
                })
                cy.get('button').should('not.contain', 'Remove from favourites')
                cy.get('button').contains('Add to favourites').click()
                cy.wait(500)
                cy.favouriteStopsForFirstUserWithUsername({
                    username: 'test_user',
                }).then((favouriteStops) => {
                    expect(favouriteStops).to.have.length(1)
                    expect(favouriteStops[0]).to.deep.equal('HSL:1020105')
                })
                cy.contains('Favourite stops').click()
                cy.wait(500)
                cy.get('button').contains('H2061').click()
                cy.wait(500)
                cy.get('button').should('not.contain', 'Add to favourites')
                cy.get('button').contains('Remove from favourites').click()
                cy.wait(500)
                cy.get('button').should('not.contain', 'Remove from favourites')
                cy.get('button').contains('Add to favourites')
                cy.favouriteStopsForFirstUserWithUsername({
                    username: 'test_user',
                }).then((favouriteStops) => {
                    expect(favouriteStops).to.have.length(0)
                })
            })
        })
    })
})
