import React, { useState } from 'react';

// Helper to determine Zodiac Sign
function getZodiacSign(day, month) {
  const signs = [
    { name: 'Capricorn', icon: '♑', endDay: 19, endMonth: 1 },
    { name: 'Aquarius', icon: '♒', endDay: 18, endMonth: 2 },
    { name: 'Pisces', icon: '♓', endDay: 20, endMonth: 3 },
    { name: 'Aries', icon: '♈', endDay: 19, endMonth: 4 },
    { name: 'Taurus', icon: '♉', endDay: 20, endMonth: 5 },
    { name: 'Gemini', icon: '♊', endDay: 20, endMonth: 6 },
    { name: 'Cancer', icon: '♋', endDay: 22, endMonth: 7 },
    { name: 'Leo', icon: '♌', endDay: 22, endMonth: 8 },
    { name: 'Virgo', icon: '♍', endDay: 22, endMonth: 9 },
    { name: 'Libra', icon: '♎', endDay: 22, endMonth: 10 },
    { name: 'Scorpio', icon: '♏', endDay: 21, endMonth: 11 },
    { name: 'Sagittarius', icon: '♐', endDay: 21, endMonth: 12 },
    { name: 'Capricorn', icon: '♑', endDay: 31, endMonth: 12 },
  ];

  for (const s of signs) {
    if (month === s.endMonth && day <= s.endDay) return s;
  }
  return { name: 'Capricorn', icon: '♑' };
}

export default function App() {
  const [dob, setDob] = useState('');
  const [ageData, setAgeData] = useState(null);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const calculateAge = () => {
    if (!dob) {
      setError('Please select your birth date.');
      setAgeData(null);
      return;
    }

    if (dob > today) {
      setError('Birth date cannot be in the future.');
      setAgeData(null);
      return;
    }

    setError('');
    const [birthYear, birthMonth, birthDay] = dob.split('-').map(Number);
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    const now = new Date();

    // 1. Calculate Exact Age (Years, Months, Days)
    let years = now.getFullYear() - birthYear;
    let months = now.getMonth() - (birthMonth - 1);
    let days = now.getDate() - birthDay;

    if (days < 0) {
      months--;
      // Days in previous month
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // 2. Total Days Lived
    const diffTime = Math.abs(now.getTime() - birthDate.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);

    // 3. Next Birthday Calculation
    let nextBday = new Date(now.getFullYear(), birthMonth - 1, birthDay);
    if (now > nextBday) {
      nextBday = new Date(now.getFullYear() + 1, birthMonth - 1, birthDay);
    }
    const daysUntilNextBday = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // 4. Zodiac Sign
    const zodiac = getZodiacSign(birthDay, birthMonth);

    setAgeData({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      daysUntilNextBday,
      zodiac,
    });
  };

  const handleReset = () => {
    setDob('');
    setAgeData(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md text-center">
        {/* Header */}
        <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-2xl mb-3">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1">Age Calculator</h1>
        <p className="text-gray-500 text-xs sm:text-sm mb-6">Enter your birth date to calculate exact age & milestones</p>

        {/* Input */}
        <input
          type="date"
          max={today}
          value={dob}
          onChange={(e) => {
            setDob(e.target.value);
            if (error) setError('');
          }}
          className={`w-full p-3.5 border-2 ${error ? 'border-red-400' : 'border-emerald-200'} rounded-xl focus:border-emerald-500 outline-none mb-2 text-gray-700 bg-gray-50`}
        />
        {error && <p className="text-xs text-red-500 text-left mb-3">{error}</p>}

        {/* Buttons */}
        <div className="flex gap-3 mb-6 mt-2">
          <button
            onClick={calculateAge}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold py-3 rounded-xl shadow-md hover:opacity-95 hover:scale-[1.02] transition-all"
          >
            Calculate Age
          </button>
          <button
            onClick={handleReset}
            className="px-5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl transition-all"
          >
            Reset
          </button>
        </div>

        {/* Results */}
        {ageData && (
          <div className="space-y-4 animate-fadeIn">
            {/* Primary Age Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-600">{ageData.years}</span>
                <span className="text-[10px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wider">Years</span>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <span className="block text-2xl sm:text-3xl font-extrabold text-teal-600">{ageData.months}</span>
                <span className="text-[10px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wider">Months</span>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <span className="block text-2xl sm:text-3xl font-extrabold text-cyan-600">{ageData.days}</span>
                <span className="text-[10px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wider">Days</span>
              </div>
            </div>

            {/* Milestones & Zodiac Row */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-[11px] text-gray-500 block">Total Days Lived</span>
                <span className="text-base font-bold text-gray-800">{ageData.totalDays.toLocaleString()} days</span>
                <span className="text-[10px] text-gray-400 block">({ageData.totalWeeks.toLocaleString()} weeks)</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-[11px] text-gray-500 block">Next Birthday</span>
                <span className="text-base font-bold text-emerald-700">{ageData.daysUntilNextBday} days</span>
                <span className="text-[10px] text-gray-400 block">Zodiac: {ageData.zodiac.icon} {ageData.zodiac.name}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
