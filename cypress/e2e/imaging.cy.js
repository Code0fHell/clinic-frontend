/**
 * System Test: Imaging Result
 * Black Box Testing với mô hình Given-When-Then (GWT)
 */

describe('System Test: Imaging Result', () => {
  beforeEach(() => {
    cy.logout()
    cy.clearLocalStorage()
  })

  describe('Positive Test Cases', () => {
    it('TC-IMG-001: Tạo kết quả X-ray với files thành công', () => {
      // Given: Diagnostic doctor đã đăng nhập và có indication IMAGING
      cy.loginAsDoctor()
      
      // Giả sử có indication IMAGING (cần setup trước)
      const indicationId = 'indication-imaging-01'

      // When: Tạo kết quả X-ray với files
      cy.apiRequest('POST', '/imaging/xray-result', {
        indication_id: indicationId,
        conclusion: 'Không phát hiện bất thường',
        result: 'Phổi trái và phải bình thường',
        description: 'Kết quả X-ray cho thấy không có dấu hiệu bất thường',
      }).as('createXrayResult')

      // Then: Kết quả được tạo thành công
      cy.waitForApi('createXrayResult')
      cy.checkApiStatus('createXrayResult', 201)
      cy.checkApiBody('createXrayResult', (body) => {
        expect(body).to.have.property('result_id')
        expect(body).to.have.property('indication_id', indicationId)
      })
    })

    it('TC-IMG-002: Tạo kết quả X-ray chỉ với conclusion', () => {
      // Given: Diagnostic doctor đã đăng nhập
      cy.loginAsDoctor()
      
      const indicationId = 'indication-imaging-01'

      // When: Tạo kết quả chỉ với conclusion
      cy.apiRequest('POST', '/imaging/xray-result', {
        indication_id: indicationId,
        conclusion: 'Kết quả bình thường',
      }).as('createXrayResult')

      // Then: Kết quả được tạo thành công
      cy.waitForApi('createXrayResult')
      cy.checkApiStatus('createXrayResult', 201)
    })

    it('TC-IMG-003: Lấy danh sách indication cho diagnostic doctor', () => {
      // Given: Diagnostic doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Lấy danh sách indication
      cy.apiRequest('GET', '/imaging/indications').as('getIndications')

      // Then: Trả về danh sách indication
      cy.waitForApi('getIndications')
      cy.checkApiStatus('getIndications', 200)
      cy.checkApiBody('getIndications', (body) => {
        expect(body).to.be.an('array')
      })
    })

    it('TC-IMG-004: Lấy chi tiết indication', () => {
      // Given: Diagnostic doctor đã đăng nhập
      cy.loginAsDoctor()
      
      const indicationId = 'indication-imaging-01'

      // When: Lấy chi tiết indication
      cy.apiRequest('GET', `/imaging/indications/${indicationId}`).as('getIndicationDetail')

      // Then: Trả về chi tiết indication
      cy.waitForApi('getIndicationDetail')
      cy.checkApiStatus('getIndicationDetail', 200)
    })

    it('TC-IMG-005: Lấy kết quả đã hoàn thành', () => {
      // Given: Diagnostic doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Lấy kết quả đã hoàn thành
      cy.apiRequest('GET', '/imaging/completed').as('getCompletedResults')

      // Then: Trả về danh sách kết quả
      cy.waitForApi('getCompletedResults')
      cy.checkApiStatus('getCompletedResults', 200)
      cy.checkApiBody('getCompletedResults', (body) => {
        expect(body).to.be.an('array')
      })
    })
  })

  describe('Negative Test Cases', () => {
    it('TC-IMG-006: Từ chối khi thiếu indication_id', () => {
      // Given: Diagnostic doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo kết quả thiếu indication_id
      cy.apiRequest('POST', '/imaging/xray-result', {
        conclusion: 'Test',
      }).as('createXrayResult')

      // Then: Lỗi 400
      cy.waitForApi('createXrayResult')
      cy.checkApiStatus('createXrayResult', 400)
    })

    it('TC-IMG-007: Từ chối khi indication_id không tồn tại', () => {
      // Given: Diagnostic doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo kết quả với indication_id không tồn tại
      cy.apiRequest('POST', '/imaging/xray-result', {
        indication_id: 'indication-not-exist-999',
        conclusion: 'Test',
      }).as('createXrayResult')

      // Then: Lỗi 404
      cy.waitForApi('createXrayResult')
      cy.checkApiStatus('createXrayResult', 404)
    })

    it('TC-IMG-008: Từ chối khi indication không phải loại IMAGING', () => {
      // Given: Diagnostic doctor đã đăng nhập
      cy.loginAsDoctor()
      
      // Giả sử có indication loại TEST
      const indicationId = 'indication-test-01'

      // When: Tạo kết quả X-ray cho indication TEST
      cy.apiRequest('POST', '/imaging/xray-result', {
        indication_id: indicationId,
        conclusion: 'Test',
      }).as('createXrayResult')

      // Then: Lỗi 400
      cy.waitForApi('createXrayResult')
      cy.checkApiStatus('createXrayResult', 400)
    })

    it('TC-IMG-009: Từ chối khi indication_id là empty string', () => {
      // Given: Diagnostic doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo kết quả với indication_id rỗng
      cy.apiRequest('POST', '/imaging/xray-result', {
        indication_id: '',
        conclusion: 'Test',
      }).as('createXrayResult')

      // Then: Lỗi 400
      cy.waitForApi('createXrayResult')
      cy.checkApiStatus('createXrayResult', 400)
    })

    it('TC-IMG-010: Từ chối khi không có cả files và conclusion', () => {
      // Given: Diagnostic doctor đã đăng nhập
      cy.loginAsDoctor()
      
      const indicationId = 'indication-imaging-01'

      // When: Tạo kết quả không có files và conclusion
      cy.apiRequest('POST', '/imaging/xray-result', {
        indication_id: indicationId,
      }).as('createXrayResult')

      // Then: Lỗi 400
      cy.waitForApi('createXrayResult')
      cy.checkApiStatus('createXrayResult', 400)
    })

    it('TC-IMG-011: Từ chối khi user không phải doctor', () => {
      // Given: User không phải doctor
      cy.loginAsPatient()
      
      const indicationId = 'indication-imaging-01'

      // When: Patient thử tạo kết quả X-ray
      cy.apiRequest('POST', '/imaging/xray-result', {
        indication_id: indicationId,
        conclusion: 'Test',
      }).as('createXrayResult')

      // Then: Lỗi 403
      cy.waitForApi('createXrayResult')
      cy.checkApiStatus('createXrayResult', 403)
    })

    it('TC-IMG-012: Từ chối khi get indication detail với id không tồn tại', () => {
      // Given: Diagnostic doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Lấy chi tiết indication không tồn tại
      cy.apiRequest('GET', '/imaging/indications/indication-not-exist-999').as('getIndicationDetail')

      // Then: Lỗi 404
      cy.waitForApi('getIndicationDetail')
      cy.checkApiStatus('getIndicationDetail', 404)
    })

    it('TC-IMG-013: Từ chối khi indication đã có kết quả', () => {
      // Given: Diagnostic doctor đã đăng nhập và indication đã có kết quả
      cy.loginAsDoctor()
      
      const indicationId = 'indication-imaging-completed-01'

      // Tạo kết quả lần đầu
      cy.apiRequest('POST', '/imaging/xray-result', {
        indication_id: indicationId,
        conclusion: 'First result',
      }).as('createXrayResult1')
      cy.waitForApi('createXrayResult1')
      cy.checkApiStatus('createXrayResult1', 201)

      // When: Tạo kết quả lần 2
      cy.apiRequest('POST', '/imaging/xray-result', {
        indication_id: indicationId,
        conclusion: 'Second result',
      }).as('createXrayResult2')

      // Then: Lỗi 400
      cy.waitForApi('createXrayResult2')
      cy.checkApiStatus('createXrayResult2', 400)
    })

    it('TC-IMG-014: Từ chối khi indication_id không phải UUID format', () => {
      // Given: Diagnostic doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo kết quả với indication_id không hợp lệ
      cy.apiRequest('POST', '/imaging/xray-result', {
        indication_id: 'invalid-id-format',
        conclusion: 'Test',
      }).as('createXrayResult')

      // Then: Lỗi 400
      cy.waitForApi('createXrayResult')
      cy.checkApiStatus('createXrayResult', 400)
    })

    it('TC-IMG-015: Từ chối khi conclusion quá dài (>1000 ký tự)', () => {
      // Given: Diagnostic doctor đã đăng nhập
      cy.loginAsDoctor()
      
      const indicationId = 'indication-imaging-01'
      const longConclusion = 'a'.repeat(1001)

      // When: Tạo kết quả với conclusion quá dài
      cy.apiRequest('POST', '/imaging/xray-result', {
        indication_id: indicationId,
        conclusion: longConclusion,
      }).as('createXrayResult')

      // Then: Lỗi 400
      cy.waitForApi('createXrayResult')
      cy.checkApiStatus('createXrayResult', 400)
    })
  })
})



