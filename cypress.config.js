import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    API_URL: 'http://localhost:3000/api/v1',
    TEST_PATIENT_EMAIL: 'patient@test.com',
    TEST_PATIENT_PASSWORD: 'password123',
    TEST_DOCTOR_EMAIL: 'doctor@test.com',
    TEST_DOCTOR_PASSWORD: 'password123',
    TEST_RECEPTIONIST_EMAIL: 'receptionist@test.com',
    TEST_RECEPTIONIST_PASSWORD: 'password123',
    TEST_PHARMACIST_EMAIL: 'pharmacist@test.com',
    TEST_PHARMACIST_PASSWORD: 'password123',
  },
})



