/// <reference types="cypress" />

context('Connectors', () => {
  beforeEach(() => {
    cy.visit('https://example.cypress.io/commands/connectors')
  })

  describe('.then()', () => {
    it('invokes a callback function with the current subject', () => {
      // https://on.cypress.io/then
      cy.get('.connectors-list > li')
        .then(($lis) => {
          expect($lis, '3 items').to.have.length(3)
          expect($lis.eq(0), 'first item').to.contain('Walk the dog')
          expect($lis.eq(1), 'second item').to.contain('Feed the cat')
          expect($lis.eq(2), 'third item').to.contain('Write JavaScript')
        })
    })
  })
})
