/// <reference types="cypress" />
describe('find* dom-testing-library commands', () => {
  beforeEach(() => {
    cy.visit('file://' + process.cwd() + '/data/resources/index.html')
  })

  // Test each of the types of queries: LabelText, PlaceholderText, Text, DisplayValue, AltText, Title, Role, TestId

  it('findByLabelText', () => {
    cy.findByLabelText('Label 1').click().type('Hello Input Labelled By Id')
  })

  it('findAllByLabelText', () => {
    cy.findAllByLabelText(/^Label \d$/).should('have.length', 2)
  })

  it('findByPlaceholderText', () => {
    cy.findByPlaceholderText('Input 1').click().type('Hello Placeholder')
  })

  it('findAllByPlaceholderText', () => {
    cy.findAllByPlaceholderText(/^Input \d$/).should('have.length', 2)
  })

  it('findAllByText', () => {
    cy.findAllByText(/^Button Text \d$/)
      .should('have.length', 2)
  })

  it('findByAltText', () => {
    cy.findByAltText('Image Alt Text 1').click()
  })

  it('findAllByAltText', () => {
    cy.findAllByAltText(/^Image Alt Text \d$/).should('have.length', 2)
  })

  it('findByTitle', () => {
    cy.findByTitle('Title 1').click()
  })

  it('findAllByTitle', () => {
    cy.findAllByTitle(/^Title \d$/).should('have.length', 2)
  })

  it('findByRole', () => {
    cy.findByRole('dialog').click()
  })

  it('findByTestId', () => {
    cy.findByTestId('image-with-random-alt-tag-1').click()
  })

  /* Test the behaviour around these queries */

  it('findByText should handle non-existence', () => {
    cy.findByText('Does Not Exist').should('not.exist')
  })

  it('findByText should handle eventual existence', () => {
    cy.findByText('Eventually Exists').should('exist')
  })

  it('findByText should handle eventual non-existence', () => {
    cy.findByText('Eventually Not exists').should('not.exist')
  })

  it("findByText with should('not.exist')", () => {
    cy.findByText('Non-existing Button Text', {timeout: 100}).should(
      'not.exist',
    )
  })

  it('findByText with a previous subject', () => {
    cy.get('#nested').findByText('Button Text 1').should('not.exist')
    cy.get('#nested').findByText('Button Text 2').should('exist')
  })

  it('findByText within', () => {
    cy.get('#nested').within(() => {
      cy.findByText('Button Text 1').should('not.exist')
      cy.findByText('Button Text 2').should('exist')
    })
  })

  it('findByText in container', () => {
    cy.get('#nested').then(subject => {
      cy.findByText('Button Text 1', {container: subject}).should('not.exist')
      cy.findByText('Button Text 2', {container: subject}).should('exist')
    })
  })

  it('findByText works when another page loads', () => {
    cy.findByText('Next Page').click()
    cy.findByText('New Page Loaded').should('exist')
  })
})
