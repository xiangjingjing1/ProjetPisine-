describe("Registration", () => {

    beforeEach(() => {
        cy.visit("/register")
    });

    it("Should tell the email is already used", () => {
        cy.get("#firstnameField").type("My firstname").should("have.value", "My firstname")
        cy.get("#lastnameField").type("My lastname").should("have.value", "My lastname")
        cy.get("#specialtyNameField").should("have.value", "IG")
        cy.get("#specialtyYearField").should("have.value", "3")
        cy.get("#groupField").should("have.value", "1")
        cy.get("#emailField").type("admin@etu.umontpellier.fr").should("have.value", "admin@etu.umontpellier.fr")

        cy.get("#submitButton").should("be.disabled")

        // No help message, fields are empty
        cy.get("#passwordHelp").should("be.empty")
        cy.get("#passwordConfirmHelp").should("be.empty")

        // Typing too short password
        cy.get("#passwordField").type("password").should("have.value", "password")
        
        // Help messages should be shown
        cy.get("#passwordHelp").should("contain", "trop court")
        cy.get("#passwordConfirmHelp").should("contain", "pas identiques")
        cy.get("#submitButton").should("be.disabled")
        
        // Typing more chracters, so password is long enought
        cy.get("#passwordField").type("123").should("have.value", "password123")
        cy.get("#passwordHelp").should("be.empty")
        cy.get("#passwordConfirmHelp").should("contain", "pas identiques")
        cy.get("#submitButton").should("be.disabled")

        cy.get("#passwordConfirmField").type("pass").should("have.value", "pass")
        cy.get("#passwordConfirmHelp").should("contain", "pas identiques")
        cy.get("#submitButton").should("be.disabled")

        cy.get("#passwordConfirmField").type("word123").should("have.value", "password123")
        cy.get("#passwordConfirmHelp").should("contain", "correspondants")
        cy.get("#submitButton").should("be.enabled")

        cy.get("#submitButton").click()

        cy.url().should("match", /register$/)

        cy.get(".alert-danger").first().should("contain", "email existe")
    });

    it("Should create account", () => {
        cy.get("#firstnameField").type("firstname")
        cy.get("#lastnameField").type("lastname")
        cy.get("#emailField").type("me@etu.umontpellier.fr")
        cy.get("#passwordField").type("password123")
        cy.get("#passwordConfirmField").type("password123")
        cy.get("#submitButton").click()

        cy.url().should("match", /login/)

        cy.get(".alert-success").first().should("contain", "inscrit")
    });

});