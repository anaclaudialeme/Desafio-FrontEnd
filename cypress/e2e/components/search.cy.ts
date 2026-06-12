describe('Search Page', () => {
  beforeEach(() => {
    cy.visit('/search');
  });

  it('should render search page', () => {
    cy.contains(/github/i);
  });

  it('should search users', () => {
    cy.intercept(
      'GET',
      '/api/search/users*',
      {
        fixture: 'search-results.json',
      }
    ).as('searchUsers');

    cy.get('input').type('octocat');
    cy.get('button[type="submit"]').click();

    cy.wait('@searchUsers');

    cy.url().should('include', '/results');
  });

  it('should show validation when search is empty', () => {
    cy.get('button[type="submit"]').click();

    cy.contains(/pesquisa/i);
  });
});