// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Login as a specific user role
 * @param {string} email - User email
 * @param {string} password - User password
 */
Cypress.Commands.add('login', (email, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_URL')}/auth/login`,
    body: {
      email,
      password,
    },
  }).then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('access_token')
    window.localStorage.setItem('access_token', response.body.access_token)
    window.localStorage.setItem('user', JSON.stringify(response.body.user))
  })
})

/**
 * Login as patient
 */
Cypress.Commands.add('loginAsPatient', () => {
  cy.login(
    Cypress.env('TEST_PATIENT_EMAIL'),
    Cypress.env('TEST_PATIENT_PASSWORD')
  )
})

/**
 * Login as doctor
 */
Cypress.Commands.add('loginAsDoctor', () => {
  cy.login(
    Cypress.env('TEST_DOCTOR_EMAIL'),
    Cypress.env('TEST_DOCTOR_PASSWORD')
  )
})

/**
 * Login as receptionist
 */
Cypress.Commands.add('loginAsReceptionist', () => {
  cy.login(
    Cypress.env('TEST_RECEPTIONIST_EMAIL'),
    Cypress.env('TEST_RECEPTIONIST_PASSWORD')
  )
})

/**
 * Login as pharmacist
 */
Cypress.Commands.add('loginAsPharmacist', () => {
  cy.login(
    Cypress.env('TEST_PHARMACIST_EMAIL'),
    Cypress.env('TEST_PHARMACIST_PASSWORD')
  )
})

/**
 * Logout
 */
Cypress.Commands.add('logout', () => {
  window.localStorage.removeItem('access_token')
  window.localStorage.removeItem('user')
})

/**
 * Visit page with authentication
 */
Cypress.Commands.add('visitWithAuth', (url) => {
  cy.visit(url)
  // Wait for auth check
  cy.wait(1000)
})

/**
 * Get API response and store in alias
 */
Cypress.Commands.add('apiRequest', (method, endpoint, body = null, alias = 'apiResponse') => {
  const token = window.localStorage.getItem('access_token')
  const options = {
    method,
    url: `${Cypress.env('API_URL')}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    failOnStatusCode: false,
  }
  
  if (body) {
    options.body = body
  }
  
  cy.request(options).as(alias)
})

/**
 * Wait for API call to complete
 */
Cypress.Commands.add('waitForApi', (alias, timeout = 10000) => {
  cy.wait(`@${alias}`, { timeout })
})

/**
 * Check API response status
 */
Cypress.Commands.add('checkApiStatus', (alias, expectedStatus) => {
  cy.get(`@${alias}`).then((response) => {
    expect(response.status).to.eq(expectedStatus)
  })
})

/**
 * Check API response body
 */
Cypress.Commands.add('checkApiBody', (alias, assertions) => {
  cy.get(`@${alias}`).then((response) => {
    if (typeof assertions === 'function') {
      assertions(response.body)
    } else {
      Object.keys(assertions).forEach((key) => {
        expect(response.body).to.have.property(key, assertions[key])
      })
    }
  })
})

/**
 * Fill form field
 */
Cypress.Commands.add('fillField', (selector, value) => {
  cy.get(selector).clear().type(value)
})

/**
 * Select dropdown option
 */
Cypress.Commands.add('selectOption', (selector, value) => {
  cy.get(selector).select(value)
})

/**
 * Click button and wait for API
 */
Cypress.Commands.add('clickAndWait', (selector, apiAlias) => {
  cy.intercept('**').as(apiAlias)
  cy.get(selector).click()
  if (apiAlias) {
    cy.wait(`@${apiAlias}`)
  }
})



