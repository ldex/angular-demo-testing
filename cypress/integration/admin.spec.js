/// <reference types="Cypress" />

describe("Admin", () => {

  beforeEach(() => {
    cy.visit("/home");
  });

  it("unauthenticated users should not access Admin", () => {
    cy.contains("Admin").click();
    cy.url().should("include", "login");
  });
  
});
