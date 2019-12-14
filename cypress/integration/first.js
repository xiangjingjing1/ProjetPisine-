describe("Authentification", () => {

    it("Should redirect to login page", () => {
        cy.visit("/");
        cy.url().should('match', /login$/)
    });

    it("Should have email and password fields", () => {
        cy.visit("/login");
        cy.get("#emailField").type("my-mail@etu.umontpellier.fr").should("have.value", "my-mail@etu.umontpellier.fr");
        cy.get("#passwordField").type("my-password").should("have.value", "my-password");
    });

});