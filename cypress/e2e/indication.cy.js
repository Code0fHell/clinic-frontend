/**
 * System Test: Indication Ticket
 * Black Box Testing với mô hình Given-When-Then (GWT)
 */

describe('System Test: Indication Ticket', () => {
  beforeEach(() => {
    cy.logout()
    cy.clearLocalStorage()
  })

  describe('Positive Test Cases', () => {
    it('TC-IND-001: Tạo phiếu chỉ định IMAGING thành công', () => {
      // Given: Doctor đã đăng nhập và có medical ticket
      cy.loginAsDoctor()
      
      // Giả sử có medical ticket (cần setup trước)
      const medicalTicketId = 'ticket-01'
      const patientId = 'patient-01'

      // When: Tạo phiếu chỉ định IMAGING
      cy.apiRequest('POST', '/indication-ticket', {
        medical_ticket_id: medicalTicketId,
        patient_id: patientId,
        medical_service_ids: ['service-xray-01'],
        diagnosis: 'Nghi viêm phổi',
        indication_type: 'IMAGING',
      }).as('createIndication')

      // Then: Phiếu chỉ định được tạo thành công
      cy.waitForApi('createIndication')
      cy.checkApiStatus('createIndication', 201)
      cy.checkApiBody('createIndication', (body) => {
        expect(body).to.have.property('indication_ticket_id')
        expect(body.indication_type).to.eq('IMAGING')
        expect(body).to.have.property('total_fee')
        expect(body.total_fee).to.be.greaterThan(0)
      })
    })

    it('TC-IND-002: Tạo phiếu chỉ định TEST thành công', () => {
      // Given: Doctor đã đăng nhập và có medical ticket
      cy.loginAsDoctor()
      
      const medicalTicketId = 'ticket-01'
      const patientId = 'patient-01'

      // When: Tạo phiếu chỉ định TEST
      cy.apiRequest('POST', '/indication-ticket', {
        medical_ticket_id: medicalTicketId,
        patient_id: patientId,
        medical_service_ids: ['service-lab-01', 'service-lab-02'],
        diagnosis: 'Kiểm tra máu',
        indication_type: 'TEST',
      }).as('createIndication')

      // Then: Phiếu chỉ định được tạo thành công
      cy.waitForApi('createIndication')
      cy.checkApiStatus('createIndication', 201)
      cy.checkApiBody('createIndication', (body) => {
        expect(body).to.have.property('indication_ticket_id')
        expect(body.indication_type).to.eq('TEST')
        expect(body).to.have.property('total_fee')
      })
    })

    it('TC-IND-003: Tạo phiếu chỉ định với nhiều dịch vụ', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()
      
      const medicalTicketId = 'ticket-01'
      const patientId = 'patient-01'

      // When: Tạo phiếu chỉ định với nhiều dịch vụ
      cy.apiRequest('POST', '/indication-ticket', {
        medical_ticket_id: medicalTicketId,
        patient_id: patientId,
        medical_service_ids: ['service-01', 'service-02', 'service-03'],
        diagnosis: 'Khám tổng quát',
      }).as('createIndication')

      // Then: Phiếu chỉ định được tạo với total_fee tính đúng
      cy.waitForApi('createIndication')
      cy.checkApiStatus('createIndication', 201)
      cy.checkApiBody('createIndication', (body) => {
        expect(body).to.have.property('service_items')
        expect(body.service_items.length).to.eq(3)
      })
    })
  })

  describe('Negative Test Cases', () => {
    it('TC-IND-004: Từ chối khi thiếu medical_ticket_id', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo phiếu chỉ định thiếu medical_ticket_id
      cy.apiRequest('POST', '/indication-ticket', {
        patient_id: 'patient-01',
        medical_service_ids: ['service-01'],
      }).as('createIndication')

      // Then: Lỗi 400
      cy.waitForApi('createIndication')
      cy.checkApiStatus('createIndication', 400)
    })

    it('TC-IND-005: Từ chối khi thiếu patient_id', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo phiếu chỉ định thiếu patient_id
      cy.apiRequest('POST', '/indication-ticket', {
        medical_ticket_id: 'ticket-01',
        medical_service_ids: ['service-01'],
      }).as('createIndication')

      // Then: Lỗi 400
      cy.waitForApi('createIndication')
      cy.checkApiStatus('createIndication', 400)
    })

    it('TC-IND-006: Từ chối khi thiếu medical_service_ids', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo phiếu chỉ định thiếu medical_service_ids
      cy.apiRequest('POST', '/indication-ticket', {
        medical_ticket_id: 'ticket-01',
        patient_id: 'patient-01',
      }).as('createIndication')

      // Then: Lỗi 400
      cy.waitForApi('createIndication')
      cy.checkApiStatus('createIndication', 400)
    })

    it('TC-IND-007: Từ chối khi medical_service_ids là mảng rỗng', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo phiếu chỉ định với mảng rỗng
      cy.apiRequest('POST', '/indication-ticket', {
        medical_ticket_id: 'ticket-01',
        patient_id: 'patient-01',
        medical_service_ids: [],
      }).as('createIndication')

      // Then: Lỗi 400
      cy.waitForApi('createIndication')
      cy.checkApiStatus('createIndication', 400)
    })

    it('TC-IND-008: Từ chối khi medical_ticket_id không tồn tại', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo phiếu chỉ định với medical_ticket_id không tồn tại
      cy.apiRequest('POST', '/indication-ticket', {
        medical_ticket_id: 'ticket-not-exist-999',
        patient_id: 'patient-01',
        medical_service_ids: ['service-01'],
      }).as('createIndication')

      // Then: Lỗi 404
      cy.waitForApi('createIndication')
      cy.checkApiStatus('createIndication', 404)
    })

    it('TC-IND-009: Từ chối khi patient_id không tồn tại', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo phiếu chỉ định với patient_id không tồn tại
      cy.apiRequest('POST', '/indication-ticket', {
        medical_ticket_id: 'ticket-01',
        patient_id: 'patient-not-exist-999',
        medical_service_ids: ['service-01'],
      }).as('createIndication')

      // Then: Lỗi 404
      cy.waitForApi('createIndication')
      cy.checkApiStatus('createIndication', 404)
    })

    it('TC-IND-010: Từ chối khi medical_service_ids có ID không tồn tại', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo phiếu chỉ định với service_id không tồn tại
      cy.apiRequest('POST', '/indication-ticket', {
        medical_ticket_id: 'ticket-01',
        patient_id: 'patient-01',
        medical_service_ids: ['service-not-exist-999'],
      }).as('createIndication')

      // Then: Lỗi 404 hoặc 400
      cy.waitForApi('createIndication')
      cy.get('@createIndication').then((response) => {
        expect([400, 404]).to.include(response.status)
      })
    })

    it('TC-IND-011: Từ chối khi có service_id trùng lặp', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo phiếu chỉ định với service_id trùng lặp
      cy.apiRequest('POST', '/indication-ticket', {
        medical_ticket_id: 'ticket-01',
        patient_id: 'patient-01',
        medical_service_ids: ['service-01', 'service-01'],
      }).as('createIndication')

      // Then: Lỗi 400
      cy.waitForApi('createIndication')
      cy.checkApiStatus('createIndication', 400)
    })

    it('TC-IND-012: Từ chối khi indication_type không hợp lệ', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo phiếu chỉ định với indication_type không hợp lệ
      cy.apiRequest('POST', '/indication-ticket', {
        medical_ticket_id: 'ticket-01',
        patient_id: 'patient-01',
        medical_service_ids: ['service-01'],
        indication_type: 'INVALID_TYPE',
      }).as('createIndication')

      // Then: Lỗi 400
      cy.waitForApi('createIndication')
      cy.checkApiStatus('createIndication', 400)
    })

    it('TC-IND-013: Từ chối khi user không phải doctor', () => {
      // Given: User không phải doctor
      cy.loginAsPatient()

      // When: Patient thử tạo phiếu chỉ định
      cy.apiRequest('POST', '/indication-ticket', {
        medical_ticket_id: 'ticket-01',
        patient_id: 'patient-01',
        medical_service_ids: ['service-01'],
      }).as('createIndication')

      // Then: Lỗi 403
      cy.waitForApi('createIndication')
      cy.checkApiStatus('createIndication', 403)
    })

    it('TC-IND-014: Từ chối khi medical_ticket_id là empty string', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo phiếu chỉ định với medical_ticket_id rỗng
      cy.apiRequest('POST', '/indication-ticket', {
        medical_ticket_id: '',
        patient_id: 'patient-01',
        medical_service_ids: ['service-01'],
      }).as('createIndication')

      // Then: Lỗi 400
      cy.waitForApi('createIndication')
      cy.checkApiStatus('createIndication', 400)
    })

    it('TC-IND-015: Từ chối khi patient_id là empty string', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Tạo phiếu chỉ định với patient_id rỗng
      cy.apiRequest('POST', '/indication-ticket', {
        medical_ticket_id: 'ticket-01',
        patient_id: '',
        medical_service_ids: ['service-01'],
      }).as('createIndication')

      // Then: Lỗi 400
      cy.waitForApi('createIndication')
      cy.checkApiStatus('createIndication', 400)
    })
  })
})



