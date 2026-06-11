describe('App E2E', () => {
  it('loads the search page', () => {
    cy.visit('/search');
    cy.get('input[placeholder="Enter GitHub username..."]').should('exist');
  });
});
