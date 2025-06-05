describe('Page de réservation', () => {
  it('Devrait afficher le formulaire', () => {
    cy.visit('/reservations?journeyId=1', { timeout: 60000 });
    
    // Vérification plus flexible avec timeout augmenté
    cy.contains(/(r|R)éservez maintenant/, { timeout: 20000 })
      .should('exist');
    
    cy.contains(/point de départ/i).should('be.visible');
    cy.contains(/destination/i).should('be.visible');
    cy.contains('button', /réserver et payer/i)
      .should('be.visible');
  });
});