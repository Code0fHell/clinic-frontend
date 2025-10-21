import React from 'react';

const DatePicker = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="date"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
      placeholder={placeholder}
    />
  );
};

export default DatePicker;