import React, { useState } from 'react';
export default function App() {
  const [dob, setDob] = useState(''), [age, setAge] = useState(null);
  const today = new Date().toISOString().split('T')[0];
  const calculate = () => {
    if (!dob || dob > today) return;
    const [y, m, d] = dob.split('-').map(Number), now = new Date();
    let years = now.getFullYear() - y, months = now.getMonth() + 1 - m, days = now.getDate() - d;
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    setAge({ years, months, days });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-1">Age Calculator</h1>
        <p className="text-gray-500 text-sm mb-6">Enter your birth date to calculate exact age</p>
        <input type="date" max={today} value={dob} onChange={e => setDob(e.target.value)} className="w-full p-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 outline-none mb-4 text-gray-700" />
        <div className="flex gap-3 mb-6">
          <button onClick={calculate} className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold py-3 rounded-xl shadow-md hover:opacity-95 hover:scale-[1.02] transition-all">Calculate</button>
          <button onClick={() => { setDob(''); setAge(null); }} className="px-5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl transition-all">Reset</button>
        </div>
        {age && <div className="grid grid-cols-3 gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
          {[['Years', age.years], ['Months', age.months], ['Days', age.days]].map(([l, v]) => (
            <div key={l} className="bg-white p-3 rounded-xl shadow-sm"><span className="block text-2xl sm:text-3xl font-extrabold text-emerald-600">{v}</span><span className="text-xs text-gray-500 font-semibold uppercase">{l}</span></div>
          ))}
        </div>}
      </div>
    </div>
  );
}
