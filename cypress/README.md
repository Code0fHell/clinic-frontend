# Cypress System Tests

Bộ system test cho các chức năng chính của hệ thống clinic, sử dụng Cypress với mô hình Black Box Testing và Given-When-Then (GWT).

## Cấu trúc Test Files

Mỗi chức năng được test trong một file riêng:

- `appointment.cy.js` - Test chức năng Đặt lịch hẹn (Appointment)
- `visit-medical-ticket.cy.js` - Test chức năng Thăm khám (Visit) và Phiếu khám bệnh (MedicalTicket)
- `bill.cy.js` - Test chức năng Tạo hóa đơn (Bill)
- `indication.cy.js` - Test chức năng Chỉ định cận lâm sàng (IndicationTicket)
- `imaging.cy.js` - Test chức năng Chẩn đoán hình ảnh (Imaging)
- `lab-test.cy.js` - Test chức năng Xét nghiệm (LabTest)
- `prescription.cy.js` - Test chức năng Kê đơn thuốc (Prescription)

## Mô hình Test

### Black Box Testing
- Tập trung vào đầu vào từ người dùng và đầu ra mong đợi
- Không cần biết chi tiết nội bộ của hệ thống
- Test dựa trên API endpoints và UI interactions

### Given-When-Then (GWT)
- **Given**: Chuẩn bị trạng thái hệ thống (dữ liệu mock trong DB)
- **When**: Thực hiện hành động (gọi API hoặc tương tác UI)
- **Then**: Kiểm tra kết quả (so sánh response hoặc trạng thái UI)

## Cài đặt

```bash
npm install
```

## Chạy Tests

### Mở Cypress Test Runner (GUI)
```bash
npm run cypress:open
```

### Chạy tests trong headless mode
```bash
npm run cypress:run
```

### Chạy một file test cụ thể
```bash
npx cypress run --spec "cypress/e2e/appointment.cy.js"
```

## Cấu hình

File cấu hình: `cypress.config.js`

- Base URL: `http://localhost:5173` (frontend)
- API URL: `http://localhost:3000/api/v1` (backend)
- Viewport: 1280x720
- Video recording: Enabled
- Screenshot on failure: Enabled

## Environment Variables

Các biến môi trường được định nghĩa trong `cypress.config.js`:

- `API_URL`: URL của backend API
- `TEST_PATIENT_EMAIL`: Email test cho patient
- `TEST_PATIENT_PASSWORD`: Password test cho patient
- `TEST_DOCTOR_EMAIL`: Email test cho doctor
- `TEST_DOCTOR_PASSWORD`: Password test cho doctor
- `TEST_RECEPTIONIST_EMAIL`: Email test cho receptionist
- `TEST_RECEPTIONIST_PASSWORD`: Password test cho receptionist
- `TEST_PHARMACIST_EMAIL`: Email test cho pharmacist
- `TEST_PHARMACIST_PASSWORD`: Password test cho pharmacist

## Custom Commands

Các custom commands được định nghĩa trong `cypress/support/commands.js`:

- `cy.login(email, password)` - Đăng nhập với email và password
- `cy.loginAsPatient()` - Đăng nhập với role Patient
- `cy.loginAsDoctor()` - Đăng nhập với role Doctor
- `cy.loginAsReceptionist()` - Đăng nhập với role Receptionist
- `cy.loginAsPharmacist()` - Đăng nhập với role Pharmacist
- `cy.logout()` - Đăng xuất
- `cy.apiRequest(method, endpoint, body, alias)` - Gọi API request
- `cy.waitForApi(alias)` - Đợi API call hoàn thành
- `cy.checkApiStatus(alias, expectedStatus)` - Kiểm tra status code
- `cy.checkApiBody(alias, assertions)` - Kiểm tra response body

## Test Coverage

Mỗi file test bao gồm:

1. **Positive Test Cases**: Test các trường hợp thành công
2. **Negative Test Cases**: Test các trường hợp lỗi (validation, missing fields, invalid data, etc.)

### Số lượng test cases

- **appointment.cy.js**: ~15 test cases (3 positive, 12 negative)
- **visit-medical-ticket.cy.js**: ~12 test cases (4 positive, 8 negative)
- **bill.cy.js**: ~17 test cases (3 positive, 14 negative)
- **indication.cy.js**: ~15 test cases (3 positive, 12 negative)
- **imaging.cy.js**: ~15 test cases (5 positive, 10 negative)
- **lab-test.cy.js**: ~20 test cases (5 positive, 15 negative)
- **prescription.cy.js**: ~25 test cases (5 positive, 20 negative)

**Tổng cộng**: ~119 test cases với nhiều test cases được thiết kế để fail (negative test cases).

## Lưu ý

1. **Backend phải đang chạy**: Đảm bảo backend server đang chạy tại `http://localhost:3000`
2. **Frontend phải đang chạy**: Đảm bảo frontend server đang chạy tại `http://localhost:5173`
3. **Test data**: Một số test cases yêu cầu dữ liệu test có sẵn trong database
4. **Authentication**: Các test cases sử dụng authentication tokens được lưu trong localStorage

## Troubleshooting

### Test fails với lỗi "Network Error"
- Kiểm tra backend server có đang chạy không
- Kiểm tra API URL trong `cypress.config.js`

### Test fails với lỗi "404 Not Found"
- Kiểm tra endpoint API có đúng không
- Kiểm tra dữ liệu test có tồn tại trong database không

### Test fails với lỗi "403 Forbidden"
- Kiểm tra user có đúng role không
- Kiểm tra authentication token có hợp lệ không



