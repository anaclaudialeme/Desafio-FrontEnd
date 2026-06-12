describe('Results Page', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/api/search/users*',
      {
        fixture: 'search-results.json',
      }
    ).as('searchUsers');

    cy.visit('/results?q=octocat');

    cy.wait('@searchUsers');
  });

  it('should render users list', () => {
    cy.contains('Resultado da pesquisa');
    cy.contains('usuários encontrados');
  });

  it('should sort by stars', () => {
    cy.get('select')
      .first()
      .select('stars');

    cy.contains('Top Repo Stars');
  });

  it('should change sort order', () => {
    cy.contains('↓ Desc').click();
    cy.contains('↑ Asc');
  });

  it('should navigate to user details', () => {
    cy.get('a[href*="/user/"]')
      .first()
      .click();

    cy.url().should('include', '/user/');
  });
});