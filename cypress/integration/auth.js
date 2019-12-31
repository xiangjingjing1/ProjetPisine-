describe("Authentification", () => {

    /**
     * Ensures we're disconnected before testing login page
     */
    beforeEach(() => {
        cy.visit("/logout");
    });

    /**
     * Trying to access home page without being connected should redirect to login page
     */
    it("Should redirect to login page", () => {
        cy.visit("/");
        cy.url().should('match', /login$/);
    });

    /**
     * Filling login form with valid credentials should redirect to home page (sessions)
     */
    it("Should connect to the account", () => {
        cy.visit("/login");
        cy.get("#emailField").type("admin@etu.umontpellier.fr").should("have.value", "admin@etu.umontpellier.fr");
        cy.get("#passwordField").type("admin").should("have.value", "admin");
        cy.get('button[type="submit"]').first().should("have.text", "Se connecter").click();

        cy.url().should("match", /sessions$/);
    });

    /**
     * Filling login form with valid email but wrong password should redirect to login page
     * and display an error message
     */
    it("Should tell credentials are invalid (wrong password)", () => {
        cy.visit("/login");
        cy.get("#emailField").type("admin@etu.umontpellier.fr");
        cy.get("#passwordField").type("wrong password");
        cy.get('button[type="submit"]').first().click();

        cy.url().should("match", /login\?error/);
        cy.get(".alert-danger").first().should("contain", "Mauvais");
    });

    /**
     * Filling login form with a wrong email and any password should redirect to login page
     * and display an error message
     */
    it("Should tell credentials are invalid (wrong email)", () => {
        cy.visit("/login");
        cy.get("#emailField").type("wrong@email.fr");
        cy.get("#passwordField").type("any password");
        cy.get('button[type="submit"]').first().click();

        cy.url().should("match", /login\?error/);
        cy.get(".alert-danger").first().should("contain", "Mauvais");
    });

});