describe('User Registration', () => {
  const username = `user${Date.now()}`
  const password = 'TestPass123!'

  it('should register a new user successfully', () => {
    cy.visit('/register')

    cy.get('[data-cy="register-username"]').type(username)
    cy.get('[data-cy="register-password"]').type(password)
    cy.get('[data-cy="register-repeat-password"]').type(password)

    cy.get('[data-cy="register-submit"]').click()

    // Expect to be redirected to login
    cy.url().should('include', '/login')
  })

  it('should show error if passwords do not match', () => {
    cy.visit('/register')

    cy.get('[data-cy="register-username"]').type(`user${Date.now()}`)
    cy.get('[data-cy="register-password"]').type(password)
    cy.get('[data-cy="register-repeat-password"]').type('WrongPass123!')

    cy.get('[data-cy="register-submit"]').click()

    cy.contains('Passwords do not match.')
  })
})
