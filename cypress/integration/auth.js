describe("Authentification", () => {

    beforeEach(() => {
        cy.visit("/logout")
    });

    it("Should redirect to login page", () => {
        cy.visit("/");
        cy.url().should('match', /login$/)
    });

    it("Should connect to the account", () => {
        cy.visit("/login");
        cy.get("#emailField").type("admin@etu.umontpellier.fr").should("have.value", "admin@etu.umontpellier.fr");
        cy.get("#passwordField").type("admin").should("have.value", "admin");
        cy.get('button[type="submit"]').first().should("have.text", "Se connecter").click()

        cy.url().should("match", /board$/)
    });

    it("Should tell credentials are invalid", () => {
        cy.visit("/login");
        cy.get("#emailField").type("admin@etu.umontpellier.fr")
        cy.get("#passwordField").type("wrong password");
        cy.get('button[type="submit"]').first().click()

        cy.url().should("match", /login/)
        cy.get(".alert-danger").first().should("contain", "Mauvais")
    });

});