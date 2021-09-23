describe('Home page test', () => {

  it('Navbar content', () => {
    cy.visit('/');
    cy.get('[data-cy="LogoImage"]').should('be.visible');
    cy.get('[data-cy="AppTitle"]').should('be.visible');
    cy.get('header a[href="/upload"] button.ant-btn.app-primary-btn span').should('have.text', 'Add new cat');
  });

  it('Image display', () => {
    cy.visit('/');
    cy.get('.catme-cat-holder').should('have.length', 100);
    cy.get('.catme-cat-holder').children().eq(1).should('contain.html', '<span class="ant-ribbon-text">Votes: 2</span>');
    cy.get('.catme-cat-holder').children().eq(2).should('contain.html', '<span class="ant-ribbon-text">Votes: 1</span>');
    cy.get('.catme-cat-holder').children().eq(3).should('contain.html', '<span class="ant-ribbon-text">Votes: 1</span>');


    cy.get('.catme-cat-holder').children().eq(1).should('contain.html', '<span role="img" aria-label="heart" class="anticon anticon-heart" style="color: rgb(252, 126, 41);">');
    cy.get('.catme-cat-holder').children().eq(2).should('contain.html', '<span role="img" aria-label="heart" class="anticon anticon-heart">');
  });

  it('Pagination', () => {
    cy.visit('/');
    cy.get('[data-cy="PaginationContainer"]').should('be.visible');
    cy.get('[data-cy="PaginationContainer"] .ant-radio-group').children().eq(0).should('have.class', 'ant-radio-button-wrapper-disabled');
    cy.get('[data-cy="PaginationContainer"] .ant-radio-group').children().eq(1).should('not.have.class', 'ant-radio-button-wrapper-disabled');

    cy.get('[data-cy="PaginationContainer"] .ant-radio-group').children().eq(1).click();
    cy.get('.catme-cat-holder').should('have.length', 50);
    cy.get('[data-cy="PaginationContainer"]').should('not.exist');
  });

  it('Navigate to upload', () => {
    cy.visit('/');
    cy.get('header a[href="/upload"] button.ant-btn.app-primary-btn').click();
    cy.url().should('include', '/upload');
  });
});