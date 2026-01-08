import React from "react";
import { parseUTCDate, formatUTCDateOnly, formatUTCTime } from "../../../../utils/dateUtils";

const UpcomingAppointments = ({ upcoming }) => (
  <div className="w-[340px] shrink-0">
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-[#00796B] p-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-full p-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Lịch Sắp Tới</h3>
            <p className="text-teal-100 text-xs">Các cuộc hẹn gần nhất</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
        {upcoming.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <div className="text-gray-400 font-medium">Không có lịch sắp tới</div>
          </div>
        ) : (
          upcoming.map((a, index) => {
            const startUTC = parseUTCDate(a.scheduled_date);
            const endUTC = startUTC.add(a.duration || 30, "minute");
            const colors = [
              { gradient: "bg-[#00796B]", bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
              { gradient: "bg-[#00897B]", bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
              { gradient: "bg-[#009688]", bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
              { gradient: "bg-[#00796B]", bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
              { gradient: "bg-[#00897B]", bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
            ];
            const colorScheme = colors[index % colors.length];
            
            return (
              <div 
                key={a.id} 
                className={`${colorScheme.bg} rounded-lg p-4 border ${colorScheme.border} shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:opacity-90`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`${colorScheme.gradient} text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-sm`}>
                    {index + 1}
                  </div>
                  <span className={`font-bold text-sm ${colorScheme.text}`}>
                    {formatUTCDateOnly(startUTC)}
                  </span>
                </div>
                
                <div className={`flex items-center gap-2 mb-2 ${colorScheme.gradient} text-white px-3 py-1.5 rounded-lg shadow-sm`}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-bold">
                    {formatUTCTime(startUTC)} - {formatUTCTime(endUTC)}
                  </span>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2">
                    <svg className={`w-4 h-4 ${colorScheme.text} flex-shrink-0 mt-0.5`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    <div className={`font-semibold text-sm ${colorScheme.text} truncate`}>
                      {a.reason || "Lịch hẹn khám"}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="bg-white rounded-full p-1 shadow-sm">
                      <svg className={`w-3 h-3 ${colorScheme.text}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className={`text-xs ${colorScheme.text} font-medium truncate`}>
                      {a.patient?.patient_full_name}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  </div>
);

export default UpcomingAppointments;
