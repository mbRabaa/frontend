describe('Page d\'accueil', () => {
  it('Devrait afficher le contenu principal', () => {
    cy.visit('/', { timeout: 60000 });
    
    // Vérification plus flexible du titre
    cy.contains(/(r|R)éservez vos billets/, { timeout: 60000 })
      .should('exist');
    
    // Vérification des éléments clés
    cy.contains(/trouvez votre trajet/i).should('be.visible');
    cy.contains('button', /sélectionnez/i).should('exist');
    cy.contains('button', /rechercher/i).should('be.visible');
  });
});