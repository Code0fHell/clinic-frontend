/**
 * System Test: Prescription
 * Black Box Testing với mô hình Given-When-Then (GWT)
 */

describe('System Test: Prescription', () => {
  beforeEach(() => {
    cy.logout()
    cy.clearLocalStorage()
  })

  describe('Positive Test Cases', () => {
    it('TC-PRE-001: Bác sĩ kê đơn thuốc thành công', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()
      
      const patientId = 'patient-01'
      const doctorId = 'doctor-01'

      // When: Kê đơn thuốc
      cy.apiRequest('POST', '/prescription', {
        patient_id: patientId,
        doctor_id: doctorId,
        medicine_items: [
          { medicine_id: 'med-01', quantity: 2, dosage: '2 viên/ngày' },
          { medicine_id: 'med-02', quantity: 1 },
        ],
        conclusion: 'Theo dõi sau 7 ngày',
      }).as('createPrescription')

      // Then: Đơn thuốc được tạo thành công
      cy.waitForApi('createPrescription')
      cy.checkApiStatus('createPrescription', 201)
      cy.checkApiBody('createPrescription', (body) => {
        expect(body).to.have.property('id')
        expect(body).to.have.property('total_fee')
        expect(body.total_fee).to.be.greaterThan(0)
        expect(body.status).to.eq('PENDING')
      })
    })

    it('TC-PRE-002: Kê đơn với return_date', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()
      
      const patientId = 'patient-01'
      const doctorId = 'doctor-01'
      const returnDate = new Date()
      returnDate.setDate(returnDate.getDate() + 7)

      // When: Kê đơn với return_date
      cy.apiRequest('POST', '/prescription', {
        patient_id: patientId,
        doctor_id: doctorId,
        medicine_items: [
          { medicine_id: 'med-01', quantity: 1 },
        ],
        return_date: returnDate.toISOString(),
      }).as('createPrescription')

      // Then: Đơn thuốc được tạo với return_date
      cy.waitForApi('createPrescription')
      cy.checkApiStatus('createPrescription', 201)
    })

    it('TC-PRE-003: Dược sĩ duyệt đơn thuốc', () => {
      // Given: Pharmacist đã đăng nhập và có đơn PENDING
      cy.loginAsPharmacist()
      
      // Giả sử có đơn PENDING (cần setup trước)
      const prescriptionId = 'prescription-01'

      // When: Duyệt đơn thuốc
      cy.apiRequest('PUT', `/prescription/${prescriptionId}/approve`, {
        note: 'Đã kiểm tra, thuốc đủ',
      }).as('approvePrescription')

      // Then: Đơn được duyệt thành công
      cy.waitForApi('approvePrescription')
      cy.checkApiStatus('approvePrescription', 200)
      cy.checkApiBody('approvePrescription', (body) => {
        expect(body.status).to.eq('APPROVED')
      })
    })

    it('TC-PRE-004: Lấy danh sách đơn pending', () => {
      // Given: Pharmacist đã đăng nhập
      cy.loginAsPharmacist()

      // When: Lấy danh sách đơn pending
      cy.apiRequest('GET', '/prescription/pending/list').as('getPendingPrescriptions')

      // Then: Trả về danh sách đơn pending
      cy.waitForApi('getPendingPrescriptions')
      cy.checkApiStatus('getPendingPrescriptions', 200)
      cy.checkApiBody('getPendingPrescriptions', (body) => {
        expect(body).to.be.an('array')
      })
    })

    it('TC-PRE-005: Lấy recent activity của dược sĩ', () => {
      // Given: Pharmacist đã đăng nhập
      cy.loginAsPharmacist()

      // When: Lấy recent activity
      cy.apiRequest('GET', '/prescription/pharmacist/recent-activity').as('getRecentActivity')

      // Then: Trả về danh sách đơn đã duyệt
      cy.waitForApi('getRecentActivity')
      cy.checkApiStatus('getRecentActivity', 200)
      cy.checkApiBody('getRecentActivity', (body) => {
        expect(body).to.be.an('array')
      })
    })
  })

  describe('Negative Test Cases', () => {
    it('TC-PRE-006: Từ chối khi thiếu patient_id', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Kê đơn thiếu patient_id
      cy.apiRequest('POST', '/prescription', {
        doctor_id: 'doctor-01',
        medicine_items: [
          { medicine_id: 'med-01', quantity: 1 },
        ],
      }).as('createPrescription')

      // Then: Lỗi 400
      cy.waitForApi('createPrescription')
      cy.checkApiStatus('createPrescription', 400)
    })

    it('TC-PRE-007: Từ chối khi thiếu doctor_id', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Kê đơn thiếu doctor_id
      cy.apiRequest('POST', '/prescription', {
        patient_id: 'patient-01',
        medicine_items: [
          { medicine_id: 'med-01', quantity: 1 },
        ],
      }).as('createPrescription')

      // Then: Lỗi 400
      cy.waitForApi('createPrescription')
      cy.checkApiStatus('createPrescription', 400)
    })

    it('TC-PRE-008: Từ chối khi thiếu medicine_items', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Kê đơn thiếu medicine_items
      cy.apiRequest('POST', '/prescription', {
        patient_id: 'patient-01',
        doctor_id: 'doctor-01',
      }).as('createPrescription')

      // Then: Lỗi 400
      cy.waitForApi('createPrescription')
      cy.checkApiStatus('createPrescription', 400)
    })

    it('TC-PRE-009: Từ chối khi medicine_items là mảng rỗng', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Kê đơn với medicine_items rỗng
      cy.apiRequest('POST', '/prescription', {
        patient_id: 'patient-01',
        doctor_id: 'doctor-01',
        medicine_items: [],
      }).as('createPrescription')

      // Then: Lỗi 400
      cy.waitForApi('createPrescription')
      cy.checkApiStatus('createPrescription', 400)
    })

    it('TC-PRE-010: Từ chối khi patient_id không tồn tại', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Kê đơn với patient_id không tồn tại
      cy.apiRequest('POST', '/prescription', {
        patient_id: 'patient-not-exist-999',
        doctor_id: 'doctor-01',
        medicine_items: [
          { medicine_id: 'med-01', quantity: 1 },
        ],
      }).as('createPrescription')

      // Then: Lỗi 404
      cy.waitForApi('createPrescription')
      cy.checkApiStatus('createPrescription', 404)
    })

    it('TC-PRE-011: Từ chối khi doctor_id không tồn tại', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Kê đơn với doctor_id không tồn tại
      cy.apiRequest('POST', '/prescription', {
        patient_id: 'patient-01',
        doctor_id: 'doctor-not-exist-999',
        medicine_items: [
          { medicine_id: 'med-01', quantity: 1 },
        ],
      }).as('createPrescription')

      // Then: Lỗi 404
      cy.waitForApi('createPrescription')
      cy.checkApiStatus('createPrescription', 404)
    })

    it('TC-PRE-012: Từ chối khi medicine_id không tồn tại', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Kê đơn với medicine_id không tồn tại
      cy.apiRequest('POST', '/prescription', {
        patient_id: 'patient-01',
        doctor_id: 'doctor-01',
        medicine_items: [
          { medicine_id: 'med-not-exist-999', quantity: 1 },
        ],
      }).as('createPrescription')

      // Then: Lỗi 404 hoặc 400
      cy.waitForApi('createPrescription')
      cy.get('@createPrescription').then((response) => {
        expect([400, 404]).to.include(response.status)
      })
    })

    it('TC-PRE-013: Từ chối khi quantity = 0', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Kê đơn với quantity = 0
      cy.apiRequest('POST', '/prescription', {
        patient_id: 'patient-01',
        doctor_id: 'doctor-01',
        medicine_items: [
          { medicine_id: 'med-01', quantity: 0 },
        ],
      }).as('createPrescription')

      // Then: Lỗi 400
      cy.waitForApi('createPrescription')
      cy.checkApiStatus('createPrescription', 400)
    })

    it('TC-PRE-014: Từ chối khi quantity < 0', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Kê đơn với quantity âm
      cy.apiRequest('POST', '/prescription', {
        patient_id: 'patient-01',
        doctor_id: 'doctor-01',
        medicine_items: [
          { medicine_id: 'med-01', quantity: -1 },
        ],
      }).as('createPrescription')

      // Then: Lỗi 400
      cy.waitForApi('createPrescription')
      cy.checkApiStatus('createPrescription', 400)
    })

    it('TC-PRE-015: Từ chối khi thiếu medicine_id trong item', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Kê đơn thiếu medicine_id
      cy.apiRequest('POST', '/prescription', {
        patient_id: 'patient-01',
        doctor_id: 'doctor-01',
        medicine_items: [
          { quantity: 1 },
        ],
      }).as('createPrescription')

      // Then: Lỗi 400
      cy.waitForApi('createPrescription')
      cy.checkApiStatus('createPrescription', 400)
    })

    it('TC-PRE-016: Từ chối khi thiếu quantity trong item', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Kê đơn thiếu quantity
      cy.apiRequest('POST', '/prescription', {
        patient_id: 'patient-01',
        doctor_id: 'doctor-01',
        medicine_items: [
          { medicine_id: 'med-01' },
        ],
      }).as('createPrescription')

      // Then: Lỗi 400
      cy.waitForApi('createPrescription')
      cy.checkApiStatus('createPrescription', 400)
    })

    it('TC-PRE-017: Từ chối khi return_date trong quá khứ', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()
      
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      // When: Kê đơn với return_date trong quá khứ
      cy.apiRequest('POST', '/prescription', {
        patient_id: 'patient-01',
        doctor_id: 'doctor-01',
        medicine_items: [
          { medicine_id: 'med-01', quantity: 1 },
        ],
        return_date: yesterday.toISOString(),
      }).as('createPrescription')

      // Then: Lỗi 400
      cy.waitForApi('createPrescription')
      cy.checkApiStatus('createPrescription', 400)
    })

    it('TC-PRE-018: Từ chối khi approve prescription_id không tồn tại', () => {
      // Given: Pharmacist đã đăng nhập
      cy.loginAsPharmacist()

      // When: Duyệt đơn không tồn tại
      cy.apiRequest('PUT', '/prescription/prescription-not-exist-999/approve', {
        note: 'Test',
      }).as('approvePrescription')

      // Then: Lỗi 404
      cy.waitForApi('approvePrescription')
      cy.checkApiStatus('approvePrescription', 404)
    })

    it('TC-PRE-019: Từ chối khi approve đơn đã được approve', () => {
      // Given: Pharmacist đã đăng nhập và có đơn đã APPROVED
      cy.loginAsPharmacist()
      
      const prescriptionId = 'prescription-approved-01'

      // Đã approve lần đầu
      cy.apiRequest('PUT', `/prescription/${prescriptionId}/approve`, {
        note: 'First approval',
      }).as('approvePrescription1')
      cy.waitForApi('approvePrescription1')
      cy.checkApiStatus('approvePrescription1', 200)

      // When: Approve lần 2
      cy.apiRequest('PUT', `/prescription/${prescriptionId}/approve`, {
        note: 'Second approval',
      }).as('approvePrescription2')

      // Then: Lỗi 400
      cy.waitForApi('approvePrescription2')
      cy.checkApiStatus('approvePrescription2', 400)
    })

    it('TC-PRE-020: Từ chối khi user không phải doctor để tạo đơn', () => {
      // Given: User không phải doctor
      cy.loginAsPatient()

      // When: Patient thử kê đơn
      cy.apiRequest('POST', '/prescription', {
        patient_id: 'patient-01',
        doctor_id: 'doctor-01',
        medicine_items: [
          { medicine_id: 'med-01', quantity: 1 },
        ],
      }).as('createPrescription')

      // Then: Lỗi 403
      cy.waitForApi('createPrescription')
      cy.checkApiStatus('createPrescription', 403)
    })

    it('TC-PRE-021: Từ chối khi user không phải pharmacist để duyệt đơn', () => {
      // Given: User không phải pharmacist
      cy.loginAsDoctor()

      // When: Doctor thử duyệt đơn
      cy.apiRequest('PUT', '/prescription/prescription-01/approve', {
        note: 'Test',
      }).as('approvePrescription')

      // Then: Lỗi 403
      cy.waitForApi('approvePrescription')
      cy.checkApiStatus('approvePrescription', 403)
    })

    it('TC-PRE-022: Từ chối khi patient_id là empty string', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Kê đơn với patient_id rỗng
      cy.apiRequest('POST', '/prescription', {
        patient_id: '',
        doctor_id: 'doctor-01',
        medicine_items: [
          { medicine_id: 'med-01', quantity: 1 },
        ],
      }).as('createPrescription')

      // Then: Lỗi 400
      cy.waitForApi('createPrescription')
      cy.checkApiStatus('createPrescription', 400)
    })

    it('TC-PRE-023: Từ chối khi doctor_id là empty string', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Kê đơn với doctor_id rỗng
      cy.apiRequest('POST', '/prescription', {
        patient_id: 'patient-01',
        doctor_id: '',
        medicine_items: [
          { medicine_id: 'med-01', quantity: 1 },
        ],
      }).as('createPrescription')

      // Then: Lỗi 400
      cy.waitForApi('createPrescription')
      cy.checkApiStatus('createPrescription', 400)
    })

    it('TC-PRE-024: Từ chối khi quantity quá lớn (>1000)', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Kê đơn với quantity quá lớn
      cy.apiRequest('POST', '/prescription', {
        patient_id: 'patient-01',
        doctor_id: 'doctor-01',
        medicine_items: [
          { medicine_id: 'med-01', quantity: 1001 },
        ],
      }).as('createPrescription')

      // Then: Lỗi 400
      cy.waitForApi('createPrescription')
      cy.checkApiStatus('createPrescription', 400)
    })

    it('TC-PRE-025: Từ chối khi return_date không hợp lệ', () => {
      // Given: Doctor đã đăng nhập
      cy.loginAsDoctor()

      // When: Kê đơn với return_date không hợp lệ
      cy.apiRequest('POST', '/prescription', {
        patient_id: 'patient-01',
        doctor_id: 'doctor-01',
        medicine_items: [
          { medicine_id: 'med-01', quantity: 1 },
        ],
        return_date: 'invalid-date',
      }).as('createPrescription')

      // Then: Lỗi 400
      cy.waitForApi('createPrescription')
      cy.checkApiStatus('createPrescription', 400)
    })
  })
})



