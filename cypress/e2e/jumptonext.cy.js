describe('Jumptomext', () => {
  beforeEach(function() {
    cy.visit('http://localhost:3000')
    cy.contains('Loading', { timeout: 10000 })
    cy.contains('Search stops', { timeout: 10000 })
  })

  it('front page can be opened', () => {
    cy.contains('Login')

  })

  it('new account can be created', () => {
    cy.wait(500)
    cy.contains('Create account').click()
    cy.wait(1000)
    cy.get('#username').type('test_user')
    cy.get('#password').type('test_password')
    cy.get('#login-create-account-button').click()
  })
})
