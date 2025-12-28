/**
 * System Test: Lab Test Result
 * Black Box Testing với mô hình Given-When-Then (GWT)
 */

describe('System Test: Lab Test Result', () => {
  beforeEach(() => {
    cy.logout()
    cy.clearLocalStorage()
  })

  describe('Positive Test Cases', () => {
    it('TC-LAB-001: Tạo kết quả xét nghiệm thành công', () => {
      // Given: Lab doctor đã đăng nhập và có indication TEST
      cy.loginAsDoctor()
      
      // Giả sử có indication TEST (cần setup trước)
      const indicationId = 'indication-test-01'
      const patientId = 'patient-01'

      // When: Tạo kết quả xét nghiệm
      cy.apiRequest('POST', '/lab-test-result', {
        indication_id: indicationId,
        patient_id: patientId,
        service_results: [
          { service_indication_id: 'svc-ind-01', test_result: 5.5 },
          { service_indication_id: 'svc-ind-02', test_result: 1.2 },
        ],
        conclusion: 'Các chỉ số trong giới hạn bình thường',
      }).as('createLabResult')

      // Then: Kết quả được tạo thành công
      cy.waitForApi('createLabResult')
      cy.checkApiStatus('createLabResult', 201)
      cy.checkApiBody('createLabResult', (body) => {
        expect(body).to.have.property('result_id')
        expect(body).to.have.property('indication_id', indicationId)
        expect(body).to.have.property('service_results')
        expect(body.service_results.length).to.eq(2)
      })
    })

    it('TC-LAB-002: Tạo kết quả với nhiều service_results', () => {
      // Given: Lab doctor đã đăng nhập
      cy.loginAsDoctor()
      
      const indicationId = 'indication-test-01'
      const patientId = 'patient-01'

      // When: Tạo kết quả với nhiều service_results
      cy.apiRequest('POST', '/lab-test-result', {
        indication_id: indicationId,
        patient_id: patientId,
        service_results: [
          { service_indication_id: 'svc-1', test_result: 5.5 },
          { service_indication_id: 'svc-2', test_result: 1.2 },
          { service_indication_id: 'svc-3', test_result: 8.3 },
          { service_indication_id: 'svc-4', test_result: 2.1 },
          { service_indication_id: 'svc-5', test_result: 6.7 },
        ],
      }).as('createLabResult')

      // Then: Kết quả được tạo với đầy đủ service_results
      cy.waitForApi('createLabResult')
      cy.checkApiStatus('createLabResult', 201)
      cy.checkApiBody('createLabResult', (body) => {
        expect(body.service_results.length).to.eq(5)
      })
    })

    it('TC-LAB-003: Lấy kết quả theo patient_id', () => {
      // Given: Lab doctor đã đăng nhập
      cy.loginAsDoctor()
      
      const patientId = 'patient-01'

      // When: Lấy kết quả theo patient_id
      cy.apiRequest('GET', `/lab-test-result/patient/${patientId}`).as('getResultsByPatient')

      // Then: Trả về danh sách kết quả
      cy.waitForApi('getResultsByPatient')
      cy.checkApiStatus('getResultsByPatient', 200)
      cy.checkApiBody('getResultsByPatient', (body) => {
        expect(body).to.be.an('array')
      })
    })

    it('TC-LAB-004: Lấy kết quả theo indication_id', () => {
      // Given: Lab doctor đã đăng nhập
      cy.loginAsDoctor()
      
      const indicationId = 'indication-test-01'

      // When: Lấy kết quả theo indication_id
      cy.apiRequest('GET', `/lab-test-result/indication/${indicationId}`).as('getResultsByIndication')

      // Then: Trả về kết quả
      cy.waitForApi('getResultsByIndication')
      cy.checkApiStatus('getResultsByIndication', 200)
    })

    it('TC-LAB-005: Lấy kết quả đã hoàn thành trong ngày', () => {
      // Given: Lab doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Lấy kết quả đã hoàn thành hôm nay
      cy.apiRequest('GET', '/lab-test-result/today/completed').as('getTodayCompletedResults')

      // Then: Trả về danh sách kết quả
      cy.waitForApi('getTodayCompletedResults')
      cy.checkApiStatus('getTodayCompletedResults', 200)
      cy.checkApiBody('getTodayCompletedResults', (body) => {
        expect(body).to.be.an('array')
      })
    })
  })

  describe('Negative Test Cases', () => {
    it('TC-LAB-006: Từ chối khi thiếu indication_id', () => {
      // Given: Lab doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo kết quả thiếu indication_id
      cy.apiRequest('POST', '/lab-test-result', {
        patient_id: 'patient-01',
        service_results: [
          { service_indication_id: 'svc-ind-01', test_result: 5.5 },
        ],
      }).as('createLabResult')

      // Then: Lỗi 400
      cy.waitForApi('createLabResult')
      cy.checkApiStatus('createLabResult', 400)
    })

    it('TC-LAB-007: Từ chối khi thiếu patient_id', () => {
      // Given: Lab doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo kết quả thiếu patient_id
      cy.apiRequest('POST', '/lab-test-result', {
        indication_id: 'indication-test-01',
        service_results: [
          { service_indication_id: 'svc-ind-01', test_result: 5.5 },
        ],
      }).as('createLabResult')

      // Then: Lỗi 400
      cy.waitForApi('createLabResult')
      cy.checkApiStatus('createLabResult', 400)
    })

    it('TC-LAB-008: Từ chối khi thiếu service_results', () => {
      // Given: Lab doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo kết quả thiếu service_results
      cy.apiRequest('POST', '/lab-test-result', {
        indication_id: 'indication-test-01',
        patient_id: 'patient-01',
      }).as('createLabResult')

      // Then: Lỗi 400
      cy.waitForApi('createLabResult')
      cy.checkApiStatus('createLabResult', 400)
    })

    it('TC-LAB-009: Từ chối khi service_results là mảng rỗng', () => {
      // Given: Lab doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo kết quả với service_results rỗng
      cy.apiRequest('POST', '/lab-test-result', {
        indication_id: 'indication-test-01',
        patient_id: 'patient-01',
        service_results: [],
      }).as('createLabResult')

      // Then: Lỗi 400
      cy.waitForApi('createLabResult')
      cy.checkApiStatus('createLabResult', 400)
    })

    it('TC-LAB-010: Từ chối khi indication_id không tồn tại', () => {
      // Given: Lab doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo kết quả với indication_id không tồn tại
      cy.apiRequest('POST', '/lab-test-result', {
        indication_id: 'indication-not-exist-999',
        patient_id: 'patient-01',
        service_results: [
          { service_indication_id: 'svc-ind-01', test_result: 5.5 },
        ],
      }).as('createLabResult')

      // Then: Lỗi 404
      cy.waitForApi('createLabResult')
      cy.checkApiStatus('createLabResult', 404)
    })

    it('TC-LAB-011: Từ chối khi indication không phải loại TEST', () => {
      // Given: Lab doctor đã đăng nhập
      cy.loginAsDoctor()
      
      // Giả sử có indication loại IMAGING
      const indicationId = 'indication-imaging-01'

      // When: Tạo kết quả lab cho indication IMAGING
      cy.apiRequest('POST', '/lab-test-result', {
        indication_id: indicationId,
        patient_id: 'patient-01',
        service_results: [
          { service_indication_id: 'svc-ind-01', test_result: 5.5 },
        ],
      }).as('createLabResult')

      // Then: Lỗi 400
      cy.waitForApi('createLabResult')
      cy.checkApiStatus('createLabResult', 400)
    })

    it('TC-LAB-012: Từ chối khi patient_id không tồn tại', () => {
      // Given: Lab doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo kết quả với patient_id không tồn tại
      cy.apiRequest('POST', '/lab-test-result', {
        indication_id: 'indication-test-01',
        patient_id: 'patient-not-exist-999',
        service_results: [
          { service_indication_id: 'svc-ind-01', test_result: 5.5 },
        ],
      }).as('createLabResult')

      // Then: Lỗi 404
      cy.waitForApi('createLabResult')
      cy.checkApiStatus('createLabResult', 404)
    })

    it('TC-LAB-013: Từ chối khi thiếu service_indication_id trong item', () => {
      // Given: Lab doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo kết quả thiếu service_indication_id
      cy.apiRequest('POST', '/lab-test-result', {
        indication_id: 'indication-test-01',
        patient_id: 'patient-01',
        service_results: [
          { test_result: 5.5 },
        ],
      }).as('createLabResult')

      // Then: Lỗi 400
      cy.waitForApi('createLabResult')
      cy.checkApiStatus('createLabResult', 400)
    })

    it('TC-LAB-014: Từ chối khi thiếu test_result trong item', () => {
      // Given: Lab doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo kết quả thiếu test_result
      cy.apiRequest('POST', '/lab-test-result', {
        indication_id: 'indication-test-01',
        patient_id: 'patient-01',
        service_results: [
          { service_indication_id: 'svc-ind-01' },
        ],
      }).as('createLabResult')

      // Then: Lỗi 400
      cy.waitForApi('createLabResult')
      cy.checkApiStatus('createLabResult', 400)
    })

    it('TC-LAB-015: Từ chối khi test_result không phải số', () => {
      // Given: Lab doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo kết quả với test_result không phải số
      cy.apiRequest('POST', '/lab-test-result', {
        indication_id: 'indication-test-01',
        patient_id: 'patient-01',
        service_results: [
          { service_indication_id: 'svc-ind-01', test_result: 'not-a-number' },
        ],
      }).as('createLabResult')

      // Then: Lỗi 400
      cy.waitForApi('createLabResult')
      cy.checkApiStatus('createLabResult', 400)
    })

    it('TC-LAB-016: Từ chối khi service_indication_id không tồn tại', () => {
      // Given: Lab doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo kết quả với service_indication_id không tồn tại
      cy.apiRequest('POST', '/lab-test-result', {
        indication_id: 'indication-test-01',
        patient_id: 'patient-01',
        service_results: [
          { service_indication_id: 'svc-not-exist-999', test_result: 5.5 },
        ],
      }).as('createLabResult')

      // Then: Lỗi 404 hoặc 400
      cy.waitForApi('createLabResult')
      cy.get('@createLabResult').then((response) => {
        expect([400, 404]).to.include(response.status)
      })
    })

    it('TC-LAB-017: Từ chối khi có service_indication_id trùng lặp', () => {
      // Given: Lab doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo kết quả với service_indication_id trùng lặp
      cy.apiRequest('POST', '/lab-test-result', {
        indication_id: 'indication-test-01',
        patient_id: 'patient-01',
        service_results: [
          { service_indication_id: 'svc-ind-01', test_result: 5.5 },
          { service_indication_id: 'svc-ind-01', test_result: 6.0 },
        ],
      }).as('createLabResult')

      // Then: Lỗi 400
      cy.waitForApi('createLabResult')
      cy.checkApiStatus('createLabResult', 400)
    })

    it('TC-LAB-018: Từ chối khi user không phải doctor', () => {
      // Given: User không phải doctor
      cy.loginAsPatient()

      // When: Patient thử tạo kết quả lab
      cy.apiRequest('POST', '/lab-test-result', {
        indication_id: 'indication-test-01',
        patient_id: 'patient-01',
        service_results: [
          { service_indication_id: 'svc-ind-01', test_result: 5.5 },
        ],
      }).as('createLabResult')

      // Then: Lỗi 403
      cy.waitForApi('createLabResult')
      cy.checkApiStatus('createLabResult', 403)
    })

    it('TC-LAB-019: Từ chối khi indication_id là empty string', () => {
      // Given: Lab doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo kết quả với indication_id rỗng
      cy.apiRequest('POST', '/lab-test-result', {
        indication_id: '',
        patient_id: 'patient-01',
        service_results: [
          { service_indication_id: 'svc-ind-01', test_result: 5.5 },
        ],
      }).as('createLabResult')

      // Then: Lỗi 400
      cy.waitForApi('createLabResult')
      cy.checkApiStatus('createLabResult', 400)
    })

    it('TC-LAB-020: Từ chối khi patient_id là empty string', () => {
      // Given: Lab doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo kết quả với patient_id rỗng
      cy.apiRequest('POST', '/lab-test-result', {
        indication_id: 'indication-test-01',
        patient_id: '',
        service_results: [
          { service_indication_id: 'svc-ind-01', test_result: 5.5 },
        ],
      }).as('createLabResult')

      // Then: Lỗi 400
      cy.waitForApi('createLabResult')
      cy.checkApiStatus('createLabResult', 400)
    })
  })
})



