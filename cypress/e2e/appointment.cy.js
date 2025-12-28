/**
 * System Test: Appointment Booking
 * Black Box Testing với mô hình Given-When-Then (GWT)
 *
 * Given: Chuẩn bị trạng thái hệ thống (dữ liệu mock)
 * When: Thực hiện hành động (gọi API hoặc tương tác UI)
 * Then: Kiểm tra kết quả (so sánh response hoặc trạng thái UI)
 */

describe("System Test: Appointment Booking", () => {
    beforeEach(() => {
        // Given: Reset state before each test
        cy.logout();
        cy.clearLocalStorage();
    });

    describe("Positive Test Cases - Successful Appointment Booking", () => {
        it("TC-APT-001: Đặt lịch thành công với thông tin hợp lệ", () => {
            // Given: User đã đăng nhập và có danh sách bác sĩ
            cy.loginAsPatient();
            cy.apiRequest("GET", "/staff/clinical-doctors").as("getDoctors");
            cy.waitForApi("getDoctors");
            cy.checkApiStatus("getDoctors", 200);

            cy.get("@getDoctors").then((response) => {
                const doctorId = response.body[0]?.id;
                expect(doctorId).to.exist;

                // Given: Có work schedule cho bác sĩ
                cy.apiRequest("GET", `/staff/${doctorId}/work-schedules`).as(
                    "getSchedules"
                );
                cy.waitForApi("getSchedules");
                cy.checkApiStatus("getSchedules", 200);

                cy.get("@getSchedules").then((scheduleResponse) => {
                    const scheduleId = scheduleResponse.body[0]?.id;
                    expect(scheduleId).to.exist;

                    // Given: Có slot trống
                    cy.apiRequest(
                        "GET",
                        `/appointment/work-schedule/${scheduleId}/slots`
                    ).as("getSlots");
                    cy.waitForApi("getSlots");
                    cy.checkApiStatus("getSlots", 200);

                    cy.get("@getSlots").then((slotResponse) => {
                        const slotId = slotResponse.body[0]?.id;
                        expect(slotId).to.exist;

                        // When: Đặt lịch với thông tin hợp lệ
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const scheduledDate = tomorrow.toISOString();

                        cy.apiRequest("POST", "/appointment/book", {
                            doctor_id: doctorId,
                            schedule_detail_id: slotId,
                            scheduled_date: scheduledDate,
                            reason: "Khám tổng quát",
                        }).as("bookAppointment");

                        // Then: Kiểm tra kết quả thành công
                        cy.waitForApi("bookAppointment");
                        cy.checkApiStatus("bookAppointment", 201);
                        cy.checkApiBody("bookAppointment", (body) => {
                            expect(body).to.have.property("appointmentId");
                            expect(body).to.have.property(
                                "message",
                                "Appointment booked"
                            );
                        });
                    });
                });
            });
        });

        it("TC-APT-002: Đặt lịch với ngày đúng 30 ngày tới", () => {
            // Given: User đã đăng nhập
            cy.loginAsPatient();
            cy.apiRequest("GET", "/staff/clinical-doctors").as("getDoctors");
            cy.waitForApi("getDoctors");

            cy.get("@getDoctors").then((response) => {
                const doctorId = response.body[0]?.id;
                cy.apiRequest("GET", `/staff/${doctorId}/work-schedules`).as(
                    "getSchedules"
                );
                cy.waitForApi("getSchedules");

                cy.get("@getSchedules").then((scheduleResponse) => {
                    const scheduleId = scheduleResponse.body[0]?.id;
                    cy.apiRequest(
                        "GET",
                        `/appointment/work-schedule/${scheduleId}/slots`
                    ).as("getSlots");
                    cy.waitForApi("getSlots");

                    cy.get("@getSlots").then((slotResponse) => {
                        const slotId = slotResponse.body[0]?.id;

                        // When: Đặt lịch với ngày đúng 30 ngày tới
                        const date30Days = new Date();
                        date30Days.setDate(date30Days.getDate() + 30);
                        const scheduledDate = date30Days.toISOString();

                        cy.apiRequest("POST", "/appointment/book", {
                            doctor_id: doctorId,
                            schedule_detail_id: slotId,
                            scheduled_date: scheduledDate,
                        }).as("bookAppointment");

                        // Then: Thành công
                        cy.waitForApi("bookAppointment");
                        cy.checkApiStatus("bookAppointment", 201);
                        cy.checkApiBody("bookAppointment", (body) => {
                            expect(body).to.have.property("appointmentId");
                        });
                    });
                });
            });
        });

        it("TC-APT-003: Đặt lịch guest không cần đăng nhập", () => {
            // Given: Không đăng nhập (guest)
            cy.apiRequest("GET", "/staff/clinical-doctors").as("getDoctors");
            cy.waitForApi("getDoctors");

            cy.get("@getDoctors").then((response) => {
                const doctorId = response.body[0]?.id;
                cy.apiRequest("GET", `/staff/${doctorId}/work-schedules`).as(
                    "getSchedules"
                );
                cy.waitForApi("getSchedules");

                cy.get("@getSchedules").then((scheduleResponse) => {
                    const scheduleId = scheduleResponse.body[0]?.id;
                    cy.apiRequest(
                        "GET",
                        `/appointment/work-schedule/${scheduleId}/slots`
                    ).as("getSlots");
                    cy.waitForApi("getSlots");

                    cy.get("@getSlots").then((slotResponse) => {
                        const slotId = slotResponse.body[0]?.id;

                        // When: Đặt lịch guest với thông tin đầy đủ
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);

                        cy.apiRequest("POST", "/appointment/guest-book", {
                            full_name: "Nguyễn Văn A",
                            dob: "1990-01-01",
                            gender: "NAM",
                            phone: "0123456789",
                            email: "guest@test.com",
                            reason: "Khám tổng quát",
                            doctor_id: doctorId,
                            schedule_detail_id: slotId,
                            scheduled_date: tomorrow.toISOString(),
                        }).as("guestBookAppointment");

                        // Then: Thành công
                        cy.waitForApi("guestBookAppointment");
                        cy.checkApiStatus("guestBookAppointment", 201);
                        cy.checkApiBody("guestBookAppointment", (body) => {
                            expect(body).to.have.property("appointmentId");
                        });
                    });
                });
            });
        });
    });

    describe("Negative Test Cases - Validation Failures", () => {
        it("TC-APT-004: Từ chối đặt lịch với ngày trong quá khứ", () => {
            // Given: User đã đăng nhập
            cy.loginAsPatient();
            cy.apiRequest("GET", "/staff/clinical-doctors").as("getDoctors");
            cy.waitForApi("getDoctors");

            cy.get("@getDoctors").then((response) => {
                const doctorId = response.body[0]?.id;
                cy.apiRequest("GET", `/staff/${doctorId}/work-schedules`).as(
                    "getSchedules"
                );
                cy.waitForApi("getSchedules");

                cy.get("@getSchedules").then((scheduleResponse) => {
                    const scheduleId = scheduleResponse.body[0]?.id;
                    cy.apiRequest(
                        "GET",
                        `/appointment/work-schedule/${scheduleId}/slots`
                    ).as("getSlots");
                    cy.waitForApi("getSlots");

                    cy.get("@getSlots").then((slotResponse) => {
                        const slotId = slotResponse.body[0]?.id;

                        // When: Đặt lịch với ngày quá khứ
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);

                        cy.apiRequest("POST", "/appointment/book", {
                            doctor_id: doctorId,
                            schedule_detail_id: slotId,
                            scheduled_date: yesterday.toISOString(),
                        }).as("bookAppointment");

                        // Then: Lỗi 400
                        cy.waitForApi("bookAppointment");
                        cy.checkApiStatus("bookAppointment", 400);
                    });
                });
            });
        });

        it("TC-APT-005: Từ chối đặt lịch quá 30 ngày", () => {
            // Given: User đã đăng nhập
            cy.loginAsPatient();
            cy.apiRequest("GET", "/staff/clinical-doctors").as("getDoctors");
            cy.waitForApi("getDoctors");

            cy.get("@getDoctors").then((response) => {
                const doctorId = response.body[0]?.id;
                cy.apiRequest("GET", `/staff/${doctorId}/work-schedules`).as(
                    "getSchedules"
                );
                cy.waitForApi("getSchedules");

                cy.get("@getSchedules").then((scheduleResponse) => {
                    const scheduleId = scheduleResponse.body[0]?.id;
                    cy.apiRequest(
                        "GET",
                        `/appointment/work-schedule/${scheduleId}/slots`
                    ).as("getSlots");
                    cy.waitForApi("getSlots");

                    cy.get("@getSlots").then((slotResponse) => {
                        const slotId = slotResponse.body[0]?.id;

                        // When: Đặt lịch với ngày > 30 ngày
                        const date31Days = new Date();
                        date31Days.setDate(date31Days.getDate() + 31);

                        cy.apiRequest("POST", "/appointment/book", {
                            doctor_id: doctorId,
                            schedule_detail_id: slotId,
                            scheduled_date: date31Days.toISOString(),
                        }).as("bookAppointment");

                        // Then: Lỗi 400
                        cy.waitForApi("bookAppointment");
                        cy.checkApiStatus("bookAppointment", 400);
                    });
                });
            });
        });

        it("TC-APT-006: Từ chối khi thiếu doctor_id", () => {
            // Given: User đã đăng nhập
            cy.loginAsPatient();

            // When: Đặt lịch thiếu doctor_id
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            cy.apiRequest("POST", "/appointment/book", {
                schedule_detail_id: "slot-123",
                scheduled_date: tomorrow.toISOString(),
            }).as("bookAppointment");

            // Then: Lỗi 400
            cy.waitForApi("bookAppointment");
            cy.checkApiStatus("bookAppointment", 400);
        });

        it("TC-APT-007: Từ chối khi thiếu schedule_detail_id", () => {
            // Given: User đã đăng nhập
            cy.loginAsPatient();

            // When: Đặt lịch thiếu schedule_detail_id
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            cy.apiRequest("POST", "/appointment/book", {
                doctor_id: "doctor-123",
                scheduled_date: tomorrow.toISOString(),
            }).as("bookAppointment");

            // Then: Lỗi 400
            cy.waitForApi("bookAppointment");
            cy.checkApiStatus("bookAppointment", 400);
        });

        it("TC-APT-008: Từ chối khi thiếu scheduled_date", () => {
            // Given: User đã đăng nhập
            cy.loginAsPatient();

            // When: Đặt lịch thiếu scheduled_date
            cy.apiRequest("POST", "/appointment/book", {
                doctor_id: "doctor-123",
                schedule_detail_id: "slot-123",
            }).as("bookAppointment");

            // Then: Lỗi 400
            cy.waitForApi("bookAppointment");
            cy.checkApiStatus("bookAppointment", 400);
        });

        it("TC-APT-009: Từ chối khi doctor_id không tồn tại", () => {
            // Given: User đã đăng nhập
            cy.loginAsPatient();

            // When: Đặt lịch với doctor_id không tồn tại
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            cy.apiRequest("POST", "/appointment/book", {
                doctor_id: "doctor-not-exist-999",
                schedule_detail_id: "slot-123",
                scheduled_date: tomorrow.toISOString(),
            }).as("bookAppointment");

            // Then: Lỗi 404 hoặc 400
            cy.waitForApi("bookAppointment");
            cy.get("@bookAppointment").then((response) => {
                expect([400, 404]).to.include(response.status);
            });
        });

        it("TC-APT-010: Từ chối khi schedule_detail_id không tồn tại", () => {
            // Given: User đã đăng nhập
            cy.loginAsPatient();
            cy.apiRequest("GET", "/staff/clinical-doctors").as("getDoctors");
            cy.waitForApi("getDoctors");

            cy.get("@getDoctors").then((response) => {
                const doctorId = response.body[0]?.id;

                // When: Đặt lịch với schedule_detail_id không tồn tại
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);

                cy.apiRequest("POST", "/appointment/book", {
                    doctor_id: doctorId,
                    schedule_detail_id: "slot-not-exist-999",
                    scheduled_date: tomorrow.toISOString(),
                }).as("bookAppointment");

                // Then: Lỗi 404 hoặc 400
                cy.waitForApi("bookAppointment");
                cy.get("@bookAppointment").then((response) => {
                    expect([400, 404]).to.include(response.status);
                });
            });
        });

        it("TC-APT-011: Từ chối khi scheduled_date không hợp lệ (string)", () => {
            // Given: User đã đăng nhập
            cy.loginAsPatient();

            // When: Đặt lịch với scheduled_date không hợp lệ
            cy.apiRequest("POST", "/appointment/book", {
                doctor_id: "doctor-123",
                schedule_detail_id: "slot-123",
                scheduled_date: "invalid-date-string",
            }).as("bookAppointment");

            // Then: Lỗi 400
            cy.waitForApi("bookAppointment");
            cy.checkApiStatus("bookAppointment", 400);
        });

        it("TC-APT-012: Từ chối khi scheduled_date là null", () => {
            // Given: User đã đăng nhập
            cy.loginAsPatient();

            // When: Đặt lịch với scheduled_date là null
            cy.apiRequest("POST", "/appointment/book", {
                doctor_id: "doctor-123",
                schedule_detail_id: "slot-123",
                scheduled_date: null,
            }).as("bookAppointment");

            // Then: Lỗi 400
            cy.waitForApi("bookAppointment");
            cy.checkApiStatus("bookAppointment", 400);
        });

        it("TC-APT-013: Từ chối khi đặt trùng slot đã được đặt", () => {
            // Given: User đã đăng nhập và đã đặt một slot
            cy.loginAsPatient();
            cy.apiRequest("GET", "/staff/clinical-doctors").as("getDoctors");
            cy.waitForApi("getDoctors");

            cy.get("@getDoctors").then((response) => {
                const doctorId = response.body[0]?.id;
                cy.apiRequest("GET", `/staff/${doctorId}/work-schedules`).as(
                    "getSchedules"
                );
                cy.waitForApi("getSchedules");

                cy.get("@getSchedules").then((scheduleResponse) => {
                    const scheduleId = scheduleResponse.body[0]?.id;
                    cy.apiRequest(
                        "GET",
                        `/appointment/work-schedule/${scheduleId}/slots`
                    ).as("getSlots");
                    cy.waitForApi("getSlots");

                    cy.get("@getSlots").then((slotResponse) => {
                        const slotId = slotResponse.body[0]?.id;
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);

                        // Đặt lần đầu thành công
                        cy.apiRequest("POST", "/appointment/book", {
                            doctor_id: doctorId,
                            schedule_detail_id: slotId,
                            scheduled_date: tomorrow.toISOString(),
                        }).as("bookAppointment1");
                        cy.waitForApi("bookAppointment1");
                        cy.checkApiStatus("bookAppointment1", 201);

                        // When: Đặt lại cùng slot
                        cy.apiRequest("POST", "/appointment/book", {
                            doctor_id: doctorId,
                            schedule_detail_id: slotId,
                            scheduled_date: tomorrow.toISOString(),
                        }).as("bookAppointment2");

                        // Then: Lỗi 400
                        cy.waitForApi("bookAppointment2");
                        cy.checkApiStatus("bookAppointment2", 400);
                    });
                });
            });
        });

        it("TC-APT-014: Từ chối khi không đăng nhập và thiếu thông tin guest", () => {
            // Given: Không đăng nhập

            // When: Đặt lịch guest thiếu thông tin
            cy.apiRequest("POST", "/appointment/guest-book", {
                doctor_id: "doctor-123",
                schedule_detail_id: "slot-123",
                scheduled_date: new Date().toISOString(),
                // Thiếu full_name, dob, gender, phone, email
            }).as("guestBookAppointment");

            // Then: Lỗi 400
            cy.waitForApi("guestBookAppointment");
            cy.checkApiStatus("guestBookAppointment", 400);
        });

        it("TC-APT-015: Từ chối khi email guest không hợp lệ", () => {
            // Given: Không đăng nhập

            // When: Đặt lịch guest với email không hợp lệ
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            cy.apiRequest("POST", "/appointment/guest-book", {
                full_name: "Nguyễn Văn A",
                dob: "1990-01-01",
                gender: "NAM",
                phone: "0123456789",
                email: "invalid-email",
                doctor_id: "doctor-123",
                schedule_detail_id: "slot-123",
                scheduled_date: tomorrow.toISOString(),
            }).as("guestBookAppointment");

            // Then: Lỗi 400
            cy.waitForApi("guestBookAppointment");
            cy.checkApiStatus("guestBookAppointment", 400);
        });
    });
});


