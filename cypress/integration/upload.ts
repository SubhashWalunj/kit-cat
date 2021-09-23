describe('Upload page test', () => {
    it('upload content', () => {
        cy.visit('/upload');
        cy.get('.photo-uploader .ant-upload-select-picture-card').should('be.visible');
        cy.get('.photo-upload-container button').should('contain.html', '<span>Start Upload</span>');
        cy.get('.photo-upload-container button').should('be.disabled');
    });
});