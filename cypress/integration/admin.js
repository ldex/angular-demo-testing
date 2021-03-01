/// <reference types="Cypress" />

describe("Admin", () => {

  beforeEach(() => {
    cy.visit("/admin");
  });

  it("Authenticated users should not access Admin", () => {
    cy.contains("Admin").click();
    cy.url().should("include", "login");
  });
});
