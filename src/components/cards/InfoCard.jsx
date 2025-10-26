import React from "react";

const InfoCard = ({ icon, title, desc, link }) => (
  <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-start shadow hover:shadow-lg transition">
    <div className="mb-4">{icon}</div>
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-gray-500 mb-4">{desc}</p>
    <a href={link} className="text-blue-600 hover:underline text-sm font-medium">
      Xem chi tiết &rarr;
    </a>
  </div>
);

export default InfoCard;