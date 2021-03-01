/// <reference types="Cypress" />

import Chance from "chance";

describe("Login", () => {
  const chance = new Chance();

  beforeEach(() => {
    cy.visit("/login");
  });

  afterEach(function() {
    // Not needed as cypress clear localstorage between tests.
    // cy.clearLocalStorage();
  });

  it("should authenticate a user with username and password", () => {
    cy.get("#username").type(chance.email());
    cy.get("#password").type(chance.string());
    cy.get("button")
        .click()
        .url().should("include", "admin")
        .then(() => {
            cy.expect(localStorage.getItem('auth_token')).to.not.be.null;
            }
        );
    });

  it("logout should clear auth token in local storage", () => {
    cy.fixture('user').then((user) => { // see fixtures/user.json
        cy.loginAs(user.email, user.password); // see support/commands.js
        cy.visit("/home");
        cy.get("#logoutLink")
            .click()
            .url().should("include", "home")
            .then(() => {
                cy.expect(localStorage.getItem('auth_token')).to.be.null;
                }
            );
        })
  });

});
