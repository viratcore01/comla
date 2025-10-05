describe('Comla Homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the homepage successfully', () => {
    cy.contains('Welcome to My Website').should('be.visible');
    cy.contains('Get Started').should('be.visible');
  });

  it('should navigate to login when Get Started is clicked (not logged in)', () => {
    cy.contains('Get Started').click();
    cy.url().should('include', '/login');
  });

  it('should display the navbar with correct branding', () => {
    cy.contains('Comla').should('be.visible');
    cy.contains('Building Cool Stuff').should('be.visible');
    cy.contains('About Us').should('be.visible');
  });

  it('should show login and signup buttons when not authenticated', () => {
    cy.contains('Login').should('be.visible');
    cy.contains('Signup').should('be.visible');
  });
});