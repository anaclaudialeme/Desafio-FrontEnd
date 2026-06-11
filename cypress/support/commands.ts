// Cypress custom commands
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.log(`Mock login ${username}`);
});
