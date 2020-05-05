/// <reference types="Cypress" />

import Chance from "chance";
const chance = new Chance();

describe("Products", () => {
  const email = chance.email();

  beforeEach(() => {
    cy.visit("http://localhost:4200/products");
  });

  it("Should block Admin", () => {
    cy.contains("Admin").click();
    cy.url().should("include", "login");
  });
  it("Has title", () => {
    cy.root().should("contain", "Products");
    cy.get("h2").should("contain", "Products");
  });
});
