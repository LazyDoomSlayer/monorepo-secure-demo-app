describe('User Login', () => {
  const username = 'existing_user' // replace with a known user
  const password = 'TestPass123!' // correct password

  it('should log in a valid user', () => {
    cy.visit('/login')

    cy.get('[data-cy="login-username"]').type(username)
    cy.get('[data-cy="login-password"]').type(password)

    cy.get('[data-cy="login-submit"]').click()

    // Expect to be redirected to home
    cy.url().should('include', '/')
  })

  it('should show error on wrong credentials', () => {
    cy.visit('/login')

    cy.get('[data-cy="login-username"]').type(username)
    cy.get('[data-cy="login-password"]').type('WrongPassword123!')

    cy.get('[data-cy="login-submit"]').click()

    cy.get('.v-alert').should('contain.text', 'Please check your login credentials.')
  })
})
