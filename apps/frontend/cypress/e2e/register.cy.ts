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

  it('Shows error when passwords do not match', () => {
    cy.visit('/register')

    cy.get('[data-cy="register-username"]').type(`usr${Date.now()}`.slice(0, 8))
    cy.get('[data-cy="register-password"]').type(password)
    cy.get('[data-cy="register-repeat-password"]').type('WrongPass123!')

    cy.get('[data-cy="register-submit"]').click()

    cy.contains('Passwords do not match.').should('be.visible')
  })

  it('Shows error if fields are empty', () => {
    cy.visit('/register')

    cy.get('[data-cy="register-submit"]').click()

    cy.contains('Username should not be empty.').should('be.visible')
    cy.contains('Password should not be empty.').should('be.visible')
  })
})
