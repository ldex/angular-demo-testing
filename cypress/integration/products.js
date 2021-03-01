/// <reference types="Cypress" />

import Chance from "chance";
const chance = new Chance();

describe("Products", () => {
  const email = chance.email();

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
      .should('have.text', 'BOOK');
  });
});
