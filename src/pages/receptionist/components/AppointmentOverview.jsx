import React from "react";
import { useState, useEffect } from "react";
import { getCountAppointmentToday } from "../../../api/appointment.api";

export default function AppointmentOverview() {
    const [total, setTotal] = useState(0);
    // const [pending, setPending] = useState(0);
    const [checkedIn, setCheckedIn] = useState(0);
    const [doing, setDoing] = useState(0);
    const [completed, setCompleted] = useState(0);
    const [cancel, setCancel] = useState(0);

    const fetchDataCountAppointment = async () => {
        try {
            const res = await getCountAppointmentToday();
            // console.log("CountAppointment: " + JSON.stringify(res));
            setTotal(res.total);
            // setPending(res.pending);
            setCheckedIn(res.check_in);
            setDoing(res.doing);
            setCompleted(res.completed);
            setCancel(res.cancelled)

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchDataCountAppointment();
    }, [])

    return (
        <div className="bg-white rounded-xl shadow-sm p-3">
            <h3 className="text-xl font-bold text-gray-800 mb-5">Lịch hẹn tổng quan</h3>
            <div className="grid grid-cols-5 gap-8 text-center">
                <div>
                    <p className="text-3xl font-bold text-teal-700">{total}</p>
                    <p className="text-sm text-gray-500 mt-2">Tổng</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-purple-500">{checkedIn}</p>
                    <p className="text-sm text-gray-500 mt-2">Đã đến </p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-yellow-600">{doing}</p>
                    <p className="text-sm text-gray-500 mt-2">Đang khám</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-green-600">{completed}</p>
                    <p className="text-sm text-gray-500 mt-2">Đã khám xong</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-red-600">{cancel}</p>
                    <p className="text-sm text-gray-500 mt-2">Đã hủy</p>
                </div>
            </div>
        </div>
    );
}