describe('User Registration', () => {
  // Limit username to 16 characters max
  const username = `usr${Date.now()}`.slice(0, 8)
  const password = 'TestPass123!'

  it('Navigates to register and registers successfully', () => {
    cy.visit('/login')

    cy.get('[data-cy="go-to-register"]').click()
    cy.url().should('include', '/register')

    cy.get('[data-cy="register-username"]').type(username)
    cy.get('[data-cy="register-password"]').type(password)
    cy.get('[data-cy="register-repeat-password"]').type(password)

    cy.get('[data-cy="register-submit"]').click()

    cy.url().should('include', '/login')
  })
})
