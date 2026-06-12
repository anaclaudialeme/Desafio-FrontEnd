describe('User Details', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/api/users/octocat',
      {
        fixture: 'user-details.json',
      }
    ).as('user');

    cy.visit('/user/octocat');

    cy.wait('@user');
  });

  it('should display user information', () => {
    cy.contains('octocat');
  });

  it('should display repositories', () => {
    cy.contains('Repositories');
  });

  it('should change repository sorting', () => {
    cy.get('select')
      .first()
      .select('stars');
  });
});