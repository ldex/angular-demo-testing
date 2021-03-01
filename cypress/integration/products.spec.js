/// <reference types="Cypress" />


describe("Products", () => {
  beforeEach(() => {
    cy.visit("/products");
  });

  it("should display correct title", () => {
    cy.get("h2")
      .should("contain", "Products");
  });

  it('should display correct products number', () => {
    cy.get('#productsNumber')
      .should('have.text', '10')
  });

  it('should display the correct number of products', () => {
    cy.get('.productItem')
      .should('have.length', 5);
  });

  it('should display correctly the first product after sorting by name', () => {
    cy.get('#sortByName').click();
    cy.get('.name')
      .first()
      .should('have.text', 'AAAAAAAAAAAAA');
  });

  it("unauthenticated users should not be able to visit the new product form", () => {
    cy.get("#addLink").click();
    cy.url().should("include", "login");
  });

  it("authenticated users should be able to visit the new product form", () => {
    cy.loginAs("foo@foo.com", "fooPassword");
    cy.get("#addLink").click();
    cy.url().should("include", "insert");
  });
});
