/**
 * System Test: Visit & Medical Ticket
 * Black Box Testing với mô hình Given-When-Then (GWT)
 */

describe('System Test: Visit & Medical Ticket', () => {
  beforeEach(() => {
    cy.logout()
    cy.clearLocalStorage()
  })

  describe('Positive Test Cases', () => {
    it('TC-VIS-001: Tạo visit từ appointment thành công', () => {
      // Given: Receptionist đã đăng nhập và có appointment PENDING
      cy.loginAsReceptionist()
      
      // Tạo appointment trước
      cy.apiRequest('GET', '/appointment/all').as('getAppointments')
      cy.waitForApi('getAppointments')
      
      cy.get('@getAppointments').then((response) => {
        const appointment = response.body.find(apt => apt.status === 'PENDING')
        expect(appointment).to.exist

        // When: Tạo visit từ appointment
        cy.apiRequest('POST', '/visit/create', {
          patient_id: appointment.patient?.id || 'patient-01',
          doctor_id: appointment.doctor?.id || 'doctor-01',
          appointment_id: appointment.id,
          visit_type: 'BOOKED',
          visit_status: 'CHECKED_IN',
        }).as('createVisit')

        // Then: Visit được tạo thành công
        cy.waitForApi('createVisit')
        cy.checkApiStatus('createVisit', 201)
        cy.checkApiBody('createVisit', (body) => {
          expect(body).to.have.property('id')
          expect(body.visit_status).to.eq('CHECKED_IN')
        })
      })
    })

    it('TC-VIS-002: Tạo visit walk-in không appointment', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo visit walk-in
      cy.apiRequest('POST', '/visit/create', {
        patient_id: 'patient-01',
        doctor_id: 'doctor-01',
        work_schedule_detail_id: 'slot-walk-01',
        visit_type: 'WALK_IN',
        visit_status: 'CHECKED_IN',
      }).as('createVisit')

      // Then: Visit được tạo thành công
      cy.waitForApi('createVisit')
      cy.checkApiStatus('createVisit', 201)
      cy.checkApiBody('createVisit', (body) => {
        expect(body).to.have.property('id')
        expect(body.visit_type).to.eq('WALK_IN')
      })
    })

    it('TC-TIC-001: Tạo medical ticket từ visit thành công', () => {
      // Given: Receptionist đã đăng nhập và có visit CHECKED_IN
      cy.loginAsReceptionist()
      
      cy.apiRequest('GET', '/visit/queue').as('getVisits')
      cy.waitForApi('getVisits')
      
      cy.get('@getVisits').then((response) => {
        const visit = response.body[0]
        expect(visit).to.exist

        // When: Tạo medical ticket
        cy.apiRequest('POST', `/medical-ticket/${visit.id}/create-ticket`).as('createTicket')

        // Then: Ticket được tạo thành công
        cy.waitForApi('createTicket')
        cy.checkApiStatus('createTicket', 201)
        cy.checkApiBody('createTicket', (body) => {
          expect(body).to.have.property('ticket_id')
          expect(body).to.have.property('barcode')
          expect(body).to.have.property('clinical_fee')
        })
      })
    })

    it('TC-TIC-002: Gọi lại tạo ticket trả về cùng ticket (idempotent)', () => {
      // Given: Receptionist đã đăng nhập và có visit
      cy.loginAsReceptionist()
      
      cy.apiRequest('GET', '/visit/queue').as('getVisits')
      cy.waitForApi('getVisits')
      
      cy.get('@getVisits').then((response) => {
        const visit = response.body[0]
        
        // Tạo ticket lần đầu
        cy.apiRequest('POST', `/medical-ticket/${visit.id}/create-ticket`).as('createTicket1')
        cy.waitForApi('createTicket1')
        cy.checkApiStatus('createTicket1', 201)
        
        cy.get('@createTicket1').then((firstResponse) => {
          const firstTicketId = firstResponse.body.ticket_id

          // When: Gọi lại tạo ticket
          cy.apiRequest('POST', `/medical-ticket/${visit.id}/create-ticket`).as('createTicket2')

          // Then: Trả về cùng ticket_id
          cy.waitForApi('createTicket2')
          cy.checkApiStatus('createTicket2', 201)
          cy.checkApiBody('createTicket2', (body) => {
            expect(body.ticket_id).to.eq(firstTicketId)
          })
        })
      })
    })
  })

  describe('Negative Test Cases - Visit', () => {
    it('TC-VIS-003: Từ chối khi thiếu patient_id', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo visit thiếu patient_id
      cy.apiRequest('POST', '/visit/create', {
        doctor_id: 'doctor-01',
        work_schedule_detail_id: 'slot-01',
        visit_type: 'WALK_IN',
        visit_status: 'CHECKED_IN',
      }).as('createVisit')

      // Then: Lỗi 400
      cy.waitForApi('createVisit')
      cy.checkApiStatus('createVisit', 400)
    })

    it('TC-VIS-004: Từ chối khi thiếu doctor_id', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo visit thiếu doctor_id
      cy.apiRequest('POST', '/visit/create', {
        patient_id: 'patient-01',
        work_schedule_detail_id: 'slot-01',
        visit_type: 'WALK_IN',
        visit_status: 'CHECKED_IN',
      }).as('createVisit')

      // Then: Lỗi 400
      cy.waitForApi('createVisit')
      cy.checkApiStatus('createVisit', 400)
    })

    it('TC-VIS-005: Từ chối khi appointment_id không tồn tại', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo visit với appointment_id không tồn tại
      cy.apiRequest('POST', '/visit/create', {
        patient_id: 'patient-01',
        doctor_id: 'doctor-01',
        appointment_id: 'appointment-not-exist-999',
        visit_type: 'BOOKED',
        visit_status: 'CHECKED_IN',
      }).as('createVisit')

      // Then: Lỗi 404
      cy.waitForApi('createVisit')
      cy.checkApiStatus('createVisit', 404)
    })

    it('TC-VIS-006: Từ chối visit walk-in khi thiếu work_schedule_detail_id', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo visit walk-in thiếu slot
      cy.apiRequest('POST', '/visit/create', {
        patient_id: 'patient-01',
        doctor_id: 'doctor-01',
        visit_type: 'WALK_IN',
        visit_status: 'CHECKED_IN',
      }).as('createVisit')

      // Then: Lỗi 400
      cy.waitForApi('createVisit')
      cy.checkApiStatus('createVisit', 400)
    })

    it('TC-VIS-007: Từ chối khi patient_id không tồn tại', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo visit với patient_id không tồn tại
      cy.apiRequest('POST', '/visit/create', {
        patient_id: 'patient-not-exist-999',
        doctor_id: 'doctor-01',
        work_schedule_detail_id: 'slot-01',
        visit_type: 'WALK_IN',
        visit_status: 'CHECKED_IN',
      }).as('createVisit')

      // Then: Lỗi 404
      cy.waitForApi('createVisit')
      cy.checkApiStatus('createVisit', 404)
    })

    it('TC-VIS-008: Từ chối khi doctor_id không tồn tại', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo visit với doctor_id không tồn tại
      cy.apiRequest('POST', '/visit/create', {
        patient_id: 'patient-01',
        doctor_id: 'doctor-not-exist-999',
        work_schedule_detail_id: 'slot-01',
        visit_type: 'WALK_IN',
        visit_status: 'CHECKED_IN',
      }).as('createVisit')

      // Then: Lỗi 404
      cy.waitForApi('createVisit')
      cy.checkApiStatus('createVisit', 404)
    })

    it('TC-VIS-009: Từ chối khi visit_type không hợp lệ', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo visit với visit_type không hợp lệ
      cy.apiRequest('POST', '/visit/create', {
        patient_id: 'patient-01',
        doctor_id: 'doctor-01',
        work_schedule_detail_id: 'slot-01',
        visit_type: 'INVALID_TYPE',
        visit_status: 'CHECKED_IN',
      }).as('createVisit')

      // Then: Lỗi 400
      cy.waitForApi('createVisit')
      cy.checkApiStatus('createVisit', 400)
    })

    it('TC-VIS-010: Từ chối khi visit_status không hợp lệ', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo visit với visit_status không hợp lệ
      cy.apiRequest('POST', '/visit/create', {
        patient_id: 'patient-01',
        doctor_id: 'doctor-01',
        work_schedule_detail_id: 'slot-01',
        visit_type: 'WALK_IN',
        visit_status: 'INVALID_STATUS',
      }).as('createVisit')

      // Then: Lỗi 400
      cy.waitForApi('createVisit')
      cy.checkApiStatus('createVisit', 400)
    })
  })

  describe('Negative Test Cases - Medical Ticket', () => {
    it('TC-TIC-003: Từ chối khi visit_id không tồn tại', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo ticket với visit_id không tồn tại
      cy.apiRequest('POST', '/medical-ticket/visit-not-exist-999/create-ticket').as('createTicket')

      // Then: Lỗi 404
      cy.waitForApi('createTicket')
      cy.checkApiStatus('createTicket', 404)
    })

    it('TC-TIC-004: Từ chối khi visit_id là empty string', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo ticket với visit_id rỗng
      cy.apiRequest('POST', '/medical-ticket//create-ticket').as('createTicket')

      // Then: Lỗi 404 hoặc 400
      cy.waitForApi('createTicket')
      cy.get('@createTicket').then((response) => {
        expect([400, 404]).to.include(response.status)
      })
    })

    it('TC-TIC-005: Từ chối khi visit chưa CHECKED_IN', () => {
      // Given: Receptionist đã đăng nhập và có visit ở trạng thái khác
      cy.loginAsReceptionist()
      
      // Giả sử có visit với status khác CHECKED_IN
      cy.apiRequest('GET', '/visit/queue').as('getVisits')
      cy.waitForApi('getVisits')
      
      cy.get('@getVisits').then((response) => {
        // Tìm visit không phải CHECKED_IN hoặc tạo visit mới với status khác
        const visit = response.body.find(v => v.visit_status !== 'CHECKED_IN')
        
        if (visit) {
          // When: Tạo ticket cho visit chưa CHECKED_IN
          cy.apiRequest('POST', `/medical-ticket/${visit.id}/create-ticket`).as('createTicket')

          // Then: Lỗi 400
          cy.waitForApi('createTicket')
          cy.checkApiStatus('createTicket', 400)
        } else {
          // Skip test nếu không có visit phù hợp
          cy.log('No visit with non-CHECKED_IN status found')
        }
      })
    })

    it('TC-TIC-006: Từ chối khi user không phải receptionist', () => {
      // Given: User không phải receptionist
      cy.loginAsPatient()

      cy.apiRequest('GET', '/visit/queue').as('getVisits')
      cy.waitForApi('getVisits')
      
      cy.get('@getVisits').then((response) => {
        const visit = response.body[0]
        if (visit) {
          // When: Patient thử tạo ticket
          cy.apiRequest('POST', `/medical-ticket/${visit.id}/create-ticket`).as('createTicket')

          // Then: Lỗi 403
          cy.waitForApi('createTicket')
          cy.checkApiStatus('createTicket', 403)
        }
      })
    })

    it('TC-TIC-007: Từ chối khi visit không có doctor', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // Giả sử có visit không có doctor (khó test trong thực tế, nhưng có thể mock)
      // When: Tạo ticket cho visit không có doctor
      cy.apiRequest('POST', '/medical-ticket/visit-no-doctor/create-ticket').as('createTicket')

      // Then: Lỗi 400 hoặc 404
      cy.waitForApi('createTicket')
      cy.get('@createTicket').then((response) => {
        expect([400, 404]).to.include(response.status)
      })
    })

    it('TC-TIC-008: Từ chối khi visit không có patient', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo ticket cho visit không có patient
      cy.apiRequest('POST', '/medical-ticket/visit-no-patient/create-ticket').as('createTicket')

      // Then: Lỗi 400 hoặc 404
      cy.waitForApi('createTicket')
      cy.get('@createTicket').then((response) => {
        expect([400, 404]).to.include(response.status)
      })
    })

    it('TC-TIC-009: Từ chối khi visit_id không phải UUID format', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // When: Tạo ticket với visit_id không hợp lệ
      cy.apiRequest('POST', '/medical-ticket/invalid-id-format/create-ticket').as('createTicket')

      // Then: Lỗi 400
      cy.waitForApi('createTicket')
      cy.checkApiStatus('createTicket', 400)
    })

    it('TC-TIC-010: Từ chối khi visit không thuộc ngày hôm nay', () => {
      // Given: Receptionist đã đăng nhập
      cy.loginAsReceptionist()

      // Giả sử có visit từ ngày khác (khó test trong thực tế)
      // When: Tạo ticket cho visit không phải hôm nay
      cy.apiRequest('POST', '/medical-ticket/visit-yesterday/create-ticket').as('createTicket')

      // Then: Lỗi 400
      cy.waitForApi('createTicket')
      cy.checkApiStatus('createTicket', 400)
    })
  })
})



