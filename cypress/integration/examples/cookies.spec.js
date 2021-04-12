/// <reference types="Cypress" />

context('Cookies', () => {
  beforeEach(() => {
    Cypress.Cookies.debug(true)

    cy.visit('https://example.cypress.io/commands/cookies')

    // clear cookies again after visiting to remove
    // any 3rd party cookies picked up such as cloudflare
    cy.clearCookies()
  })


  it('cy.getCookies() - get browser cookies', () => {
    // https://on.cypress.io/getcookies
    cy.getCookies().should('be.empty')

    cy.get('#getCookies .set-a-cookie').click()

  })

  it('cy.setCookie() - set a browser cookie', () => {
    // https://on.cypress.io/setcookie
    cy.getCookies().should('be.empty')

    cy.setCookie('foo', 'bar')

    // cy.getCookie() yields a cookie object
    cy.getCookie('foo').should('have.property', 'value', 'bar')
  })

  it('cy.clearCookie() - clear a browser cookie', () => {
    // https://on.cypress.io/clearcookie
    cy.getCookie('token').should('be.null')

    cy.get('#clearCookie .set-a-cookie').click()

    // cy.clearCookies() yields null
    cy.clearCookie('token').should('be.null')

    cy.getCookie('token').should('be.null')
  })

})
