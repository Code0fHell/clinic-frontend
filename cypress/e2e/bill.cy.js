/**
 * System Test: Bill Creation
 * Black Box Testing với mô hình Given-When-Then (GWT)
 */

describe('System Test: Bill Creation', () => {
  beforeEach(() => {
    cy.logout()
    cy.clearLocalStorage()
  })

  describe('Positive Test Cases', () => {
    it('TC-BIL-001: Tạo hóa đơn CLINICAL thành công', () => {
      // Given: Receptionist đã đăng nhập và có medical ticket
      cy.loginAsReceptionist()
      
      // Giả sử có visit và ticket
      cy.apiRequest('GET', '/visit/queue').as('getVisits')
      cy.waitForApi('getVisits')
      
      cy.get('@getVisits').then((response) => {
        const visit = response.body[0]
        if (visit) {
          // Tạo ticket trước
          cy.apiRequest('POST', `/medical-ticket/${visit.id}/create-ticket`).as('createTicket')
          cy.waitForApi('createTicket')
          
          cy.get('@createTicket').then((ticketResponse) => {
            const ticketId = ticketResponse.body.ticket_id

            // When: Tạo hóa đơn CLINICAL
            cy.apiRequest('POST', '/bill', {
              bill_type: 'CLINICAL',
              patient_id: visit.patient?.id || 'patient-01',
              medical_ticket_id: ticketId,
              total: 150000,
            }).as('createBill')

            // Then: Hóa đơn được tạo thành công
            cy.waitForApi('createBill')
            cy.checkApiStatus('createBill', 201)
            cy.checkApiBody('createBill', (body) => {
              expect(body).to.have.property('id')
              expect(body.bill_type).to.eq('CLINICAL')
              expect(body.total).to.eq(150000)
            })
          })
        }
      })
    })

    it('TC-BIL-002: Tạo hóa đơn SERVICE thành công', () => {
      // Given: Receptionist đã đăng nhập và có indication ticket
      cy.loginAsReceptionist()
      
      // Giả sử có indication ticket (cần setup trước)
      const indicationId = 'indication-01'

      // When: Tạo hóa đơn SERVICE
      cy.apiRequest('POST', '/bill', {
        bill_type: 'SERVICE',
        patient_id: 'patient-01',
        indication_ticket_id: indicationId,
        total: 100000,
      }).as('createBill')

      // Then: Hóa đơn được tạo thành công
      cy.waitForApi('createBill')
      cy.checkApiStatus('createBill', 201)
      cy.checkApiBody('createBill', (body) => {
        expect(body).to.have.property('id')
        expect(body.bill_type).to.eq('SERVICE')
      })
    })

    it('TC-BIL-003: Tạo hóa đơn MEDICINE thành công', () => {
      // Given: Receptionist đã đăng nhập và có prescription
      cy.loginAsReceptionist()
      
      // Giả sử có prescription (cần setup trước)
      const prescriptionId = 'prescription-01'

      // When: Tạo hóa đơn MEDICINE
      cy.apiRequest('POST', '/bill', {
        bill_type: 'MEDICINE',
        patient_id: 'patient-01',
        prescription_id: prescriptionId,
        total: 200000,
      }).as('createBill')

      // Then: Hóa đơn được tạo thành công
      cy.waitForApi('createBill')
      cy.checkApiStatus('createBill', 201)
      cy.checkApiBody('createBill', (body) => {
        expect(body).to.have.property('id')
        expect(body.bill_type).to.eq('MEDICINE')
      })
    })
  })

  describe('Negative Test Cases', () => {
    it('TC-BIL-004: Từ chối khi bill_type không hợp lệ', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo hóa đơn với bill_type không hợp lệ
      cy.apiRequest('POST', '/bill', {
        bill_type: 'UNKNOWN_TYPE',
        patient_id: 'patient-01',
        medical_ticket_id: 'ticket-01',
        total: 150000,
      }).as('createBill')

      // Then: Lỗi 400
      cy.waitForApi('createBill')
      cy.checkApiStatus('createBill', 400)
    })

    it('TC-BIL-005: Từ chối khi thiếu patient_id', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo hóa đơn thiếu patient_id
      cy.apiRequest('POST', '/bill', {
        bill_type: 'CLINICAL',
        medical_ticket_id: 'ticket-01',
        total: 150000,
      }).as('createBill')

      // Then: Lỗi 400
      cy.waitForApi('createBill')
      cy.checkApiStatus('createBill', 400)
    })

    it('TC-BIL-006: Từ chối CLINICAL khi thiếu medical_ticket_id', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo hóa đơn CLINICAL thiếu medical_ticket_id
      cy.apiRequest('POST', '/bill', {
        bill_type: 'CLINICAL',
        patient_id: 'patient-01',
        total: 150000,
      }).as('createBill')

      // Then: Lỗi 400
      cy.waitForApi('createBill')
      cy.checkApiStatus('createBill', 400)
    })

    it('TC-BIL-007: Từ chối SERVICE khi thiếu indication_ticket_id', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo hóa đơn SERVICE thiếu indication_ticket_id
      cy.apiRequest('POST', '/bill', {
        bill_type: 'SERVICE',
        patient_id: 'patient-01',
        total: 100000,
      }).as('createBill')

      // Then: Lỗi 400
      cy.waitForApi('createBill')
      cy.checkApiStatus('createBill', 400)
    })

    it('TC-BIL-008: Từ chối MEDICINE khi thiếu prescription_id', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo hóa đơn MEDICINE thiếu prescription_id
      cy.apiRequest('POST', '/bill', {
        bill_type: 'MEDICINE',
        patient_id: 'patient-01',
        total: 200000,
      }).as('createBill')

      // Then: Lỗi 400
      cy.waitForApi('createBill')
      cy.checkApiStatus('createBill', 400)
    })

    it('TC-BIL-009: Từ chối khi patient_id không tồn tại', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo hóa đơn với patient_id không tồn tại
      cy.apiRequest('POST', '/bill', {
        bill_type: 'CLINICAL',
        patient_id: 'patient-not-exist-999',
        medical_ticket_id: 'ticket-01',
        total: 150000,
      }).as('createBill')

      // Then: Lỗi 404
      cy.waitForApi('createBill')
      cy.checkApiStatus('createBill', 404)
    })

    it('TC-BIL-010: Từ chối khi medical_ticket_id không tồn tại', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo hóa đơn CLINICAL với medical_ticket_id không tồn tại
      cy.apiRequest('POST', '/bill', {
        bill_type: 'CLINICAL',
        patient_id: 'patient-01',
        medical_ticket_id: 'ticket-not-exist-999',
        total: 150000,
      }).as('createBill')

      // Then: Lỗi 404
      cy.waitForApi('createBill')
      cy.checkApiStatus('createBill', 404)
    })

    it('TC-BIL-011: Từ chối khi indication_ticket_id không tồn tại', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo hóa đơn SERVICE với indication_ticket_id không tồn tại
      cy.apiRequest('POST', '/bill', {
        bill_type: 'SERVICE',
        patient_id: 'patient-01',
        indication_ticket_id: 'indication-not-exist-999',
        total: 100000,
      }).as('createBill')

      // Then: Lỗi 404
      cy.waitForApi('createBill')
      cy.checkApiStatus('createBill', 404)
    })

    it('TC-BIL-012: Từ chối khi prescription_id không tồn tại', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo hóa đơn MEDICINE với prescription_id không tồn tại
      cy.apiRequest('POST', '/bill', {
        bill_type: 'MEDICINE',
        patient_id: 'patient-01',
        prescription_id: 'prescription-not-exist-999',
        total: 200000,
      }).as('createBill')

      // Then: Lỗi 404
      cy.waitForApi('createBill')
      cy.checkApiStatus('createBill', 404)
    })

    it('TC-BIL-013: Từ chối khi total <= 0', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo hóa đơn với total = 0
      cy.apiRequest('POST', '/bill', {
        bill_type: 'CLINICAL',
        patient_id: 'patient-01',
        medical_ticket_id: 'ticket-01',
        total: 0,
      }).as('createBill')

      // Then: Lỗi 400
      cy.waitForApi('createBill')
      cy.checkApiStatus('createBill', 400)
    })

    it('TC-BIL-014: Từ chối khi total < 0', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo hóa đơn với total âm
      cy.apiRequest('POST', '/bill', {
        bill_type: 'CLINICAL',
        patient_id: 'patient-01',
        medical_ticket_id: 'ticket-01',
        total: -1000,
      }).as('createBill')

      // Then: Lỗi 400
      cy.waitForApi('createBill')
      cy.checkApiStatus('createBill', 400)
    })

    it('TC-BIL-015: Từ chối khi total không phải số', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo hóa đơn với total không phải số
      cy.apiRequest('POST', '/bill', {
        bill_type: 'CLINICAL',
        patient_id: 'patient-01',
        medical_ticket_id: 'ticket-01',
        total: 'not-a-number',
      }).as('createBill')

      // Then: Lỗi 400
      cy.waitForApi('createBill')
      cy.checkApiStatus('createBill', 400)
    })

    it('TC-BIL-016: Từ chối khi bill_type là empty string', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo hóa đơn với bill_type rỗng
      cy.apiRequest('POST', '/bill', {
        bill_type: '',
        patient_id: 'patient-01',
        medical_ticket_id: 'ticket-01',
        total: 150000,
      }).as('createBill')

      // Then: Lỗi 400
      cy.waitForApi('createBill')
      cy.checkApiStatus('createBill', 400)
    })

    it('TC-BIL-017: Từ chối khi user không phải receptionist', () => {
      // Given: User không phải receptionist
      cy.loginAsPatient()

      // When: Patient thử tạo hóa đơn
      cy.apiRequest('POST', '/bill', {
        bill_type: 'CLINICAL',
        patient_id: 'patient-01',
        medical_ticket_id: 'ticket-01',
        total: 150000,
      }).as('createBill')

      // Then: Lỗi 403
      cy.waitForApi('createBill')
      cy.checkApiStatus('createBill', 403)
    })
  })
})



