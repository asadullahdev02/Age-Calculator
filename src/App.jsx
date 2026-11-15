import React, { useState, useEffect } from 'react';

// Accurate Zodiac Sign determination
function getZodiacSign(day, month) {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { name: 'Aries', icon: '♈', element: 'Fire' };
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { name: 'Taurus', icon: '♉', element: 'Earth' };
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { name: 'Gemini', icon: '♊', element: 'Air' };
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { name: 'Cancer', icon: '♋', element: 'Water' };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { name: 'Leo', icon: '♌', element: 'Fire' };
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { name: 'Virgo', icon: '♍', element: 'Earth' };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { name: 'Libra', icon: '♎', element: 'Air' };
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { name: 'Scorpio', icon: '♏', element: 'Water' };
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { name: 'Sagittarius', icon: '♐', element: 'Fire' };
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { name: 'Capricorn', icon: '♑', element: 'Earth' };
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { name: 'Aquarius', icon: '♒', element: 'Air' };
  return { name: 'Pisces', icon: '♓', element: 'Water' };
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function App() {
  const [personName, setPersonName] = useState('');
  const [dob, setDob] = useState('');
  const [ageData, setAgeData] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, metrics, planets
  const [copyToast, setCopyToast] = useState('');
  const [profiles, setProfiles] = useState([]);

  const today = new Date().toISOString().split('T')[0];

  // Load saved profiles from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('age_calc_profiles_v1');
      if (saved) {
        setProfiles(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const calculateAge = (targetDob = null, targetName = null) => {
    const birthString = targetDob || dob;
    const nameToUse = targetName !== null ? targetName : personName;

    if (!birthString) {
      setError('Please select a valid birth date.');
      setAgeData(null);
      return;
    }

    if (birthString > today) {
      setError('Birth date cannot be in the future.');
      setAgeData(null);
      return;
    }

    setError('');
    const [birthYear, birthMonth, birthDay] = birthString.split('-').map(Number);
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    const now = new Date();

    // 1. Exact Age (Years, Months, Days)
    let years = now.getFullYear() - birthYear;
    let months = now.getMonth() - (birthMonth - 1);
    let days = now.getDate() - birthDay;

    if (days < 0) {
      months--;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // 2. Day of Week & Total Time Lived
    const birthDayOfWeek = DAYS_OF_WEEK[birthDate.getDay()];
    const diffTime = Math.abs(now.getTime() - birthDate.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // 3. Biological Estimates
    const estimatedHeartbeats = Math.floor(totalMinutes * 75); // ~75 bpm average
    const estimatedBreaths = Math.floor(totalMinutes * 16); // ~16 breaths/min
    const estimatedHoursSlept = Math.floor(totalDays * 8); // ~8 hours/day

    // 4. Next Birthday Countdown
    let nextBday = new Date(now.getFullYear(), birthMonth - 1, birthDay);
    if (now > nextBday) {
      nextBday = new Date(now.getFullYear() + 1, birthMonth - 1, birthDay);
    }
    const daysUntilNextBday = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const nextBdayDayOfWeek = DAYS_OF_WEEK[nextBday.getDay()];

    // 5. Next Milestone Age (next multiple of 5 or 10)
    const nextMilestoneAge = Math.ceil((years + 1) / 5) * 5;
    const milestoneDate = new Date(birthYear + nextMilestoneAge, birthMonth - 1, birthDay);
    const daysUntilMilestone = Math.max(0, Math.ceil((milestoneDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    // 6. Zodiac Sign
    const zodiac = getZodiacSign(birthDay, birthMonth);

    // 7. Planetary Ages (Orbital period in Earth days)
    const planetaryAges = [
      { planet: 'Mercury', icon: '☿', color: 'text-amber-600', years: (totalDays / 87.97).toFixed(1), period: '88 days' },
      { planet: 'Venus', icon: '♀', color: 'text-orange-500', years: (totalDays / 224.7).toFixed(1), period: '225 days' },
      { planet: 'Mars', icon: '♂', color: 'text-red-500', years: (totalDays / 686.98).toFixed(1), period: '1.88 yrs' },
      { planet: 'Jupiter', icon: '♃', color: 'text-amber-700', years: (totalDays / 4332.59).toFixed(2), period: '11.8 yrs' },
      { planet: 'Saturn', icon: '♄', color: 'text-yellow-600', years: (totalDays / 10759.22).toFixed(2), period: '29.4 yrs' },
    ];

    const computedData = {
      name: nameToUse.trim() || 'You',
      dob: birthString,
      years,
      months,
      days,
      birthDayOfWeek,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      estimatedHeartbeats,
      estimatedBreaths,
      estimatedHoursSlept,
      daysUntilNextBday,
      nextBdayDayOfWeek,
      nextMilestoneAge,
      daysUntilMilestone,
      zodiac,
      planetaryAges,
    };

    setAgeData(computedData);

    // Save profile to recent profiles list if name or date is provided
    const newProfile = {
      id: birthString + (nameToUse ? `-${nameToUse}` : ''),
      name: nameToUse.trim() || 'Profile',
      dob: birthString,
      summary: `${years} yrs`,
    };

    setProfiles((prev) => {
      const filtered = prev.filter((p) => p.dob !== newProfile.dob || p.name !== newProfile.name);
      const updated = [newProfile, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('age_calc_profiles_v1', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleReset = () => {
    setDob('');
    setPersonName('');
    setAgeData(null);
    setError('');
    setCopyToast('');
  };

  const handleSelectProfile = (p) => {
    setDob(p.dob);
    setPersonName(p.name === 'Profile' ? '' : p.name);
    calculateAge(p.dob, p.name === 'Profile' ? '' : p.name);
  };

  const handleClearProfiles = () => {
    setProfiles([]);
    try {
      localStorage.removeItem('age_calc_profiles_v1');
    } catch (e) {
      console.error(e);
    }
  };

  const copyLifeStats = async () => {
    if (!ageData) return;
    const text = `🎂 Life & Age Stats for ${ageData.name}:\n` +
      `• Exact Age: ${ageData.years} Years, ${ageData.months} Months, ${ageData.days} Days\n` +
      `• Born on: ${ageData.birthDayOfWeek} (${ageData.zodiac.icon} ${ageData.zodiac.name} - ${ageData.zodiac.element})\n` +
      `• Total Lived: ${ageData.totalDays.toLocaleString()} Days (${ageData.totalWeeks.toLocaleString()} Weeks)\n` +
      `• Estimated Heartbeats: ~${(ageData.estimatedHeartbeats / 1e6).toFixed(1)} Million\n` +
      `• Estimated Sleep: ~${ageData.estimatedHoursSlept.toLocaleString()} Hours\n` +
      `• Martian Age: ${ageData.planetaryAges[2].years} Mars Years\n` +
      `• Next Birthday: in ${ageData.daysUntilNextBday} Days (on a ${ageData.nextBdayDayOfWeek})\n` +
      `Calculated with Age Calculator`;

    try {
      await navigator.clipboard.writeText(text);
      setCopyToast('Life summary copied to clipboard!');
      setTimeout(() => setCopyToast(''), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center p-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-lg text-center">
        {/* Header */}
        <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-2xl mb-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">Age Calculator</h1>
        <p className="text-gray-500 text-xs sm:text-sm mb-5">Calculate exact age, life metrics, and planetary years</p>

        {/* Inputs */}
        <div className="space-y-3 mb-4 text-left">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="e.g. Asadullah"
              className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-xs sm:text-sm text-gray-700 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Birth Date *
            </label>
            <input
              type="date"
              max={today}
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') calculateAge(); }}
              className={`w-full p-2.5 sm:p-3 border-2 ${error ? 'border-red-400' : 'border-emerald-200'} rounded-xl focus:border-emerald-500 outline-none text-xs sm:text-sm text-gray-700 bg-gray-50`}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3 mb-5">
          <button
            onClick={() => calculateAge()}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:opacity-95 hover:scale-[1.01] active:scale-95 transition-all text-xs sm:text-sm"
          >
            Calculate Age
          </button>
          <button
            onClick={handleReset}
            className="px-4 sm:px-5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl transition-all text-xs sm:text-sm"
          >
            Reset
          </button>
        </div>

        {/* Recent Profiles Quick Chips */}
        {profiles.length > 0 && (
          <div className="mb-5 text-left">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Recent Calculations
              </span>
              <button
                onClick={handleClearProfiles}
                className="text-[10px] text-red-500 hover:underline"
              >
                Clear
              </button>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectProfile(p)}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-600 text-xs font-medium whitespace-nowrap transition-colors"
                >
                  {p.name} ({p.summary})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Section */}
        {ageData && (
          <div className="space-y-4">
            {/* View Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold text-gray-500">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  activeTab === 'overview' ? 'bg-white text-emerald-700 shadow-sm' : 'hover:text-gray-800'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('metrics')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  activeTab === 'metrics' ? 'bg-white text-emerald-700 shadow-sm' : 'hover:text-gray-800'
                }`}
              >
                Life Metrics
              </button>
              <button
                onClick={() => setActiveTab('planets')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  activeTab === 'planets' ? 'bg-white text-emerald-700 shadow-sm' : 'hover:text-gray-800'
                }`}
              >
                Planetary Ages
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-3">
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

                {/* Birth Day & Zodiac Details */}
                <div className="grid grid-cols-2 gap-2.5 text-left">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Born on a</span>
                    <span className="text-sm font-bold text-gray-800">{ageData.birthDayOfWeek} 🌟</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{ageData.dob}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Zodiac Sign</span>
                    <span className="text-sm font-bold text-gray-800">{ageData.zodiac.icon} {ageData.zodiac.name}</span>
                    <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">{ageData.zodiac.element} Element</span>
                  </div>
                </div>

                {/* Next Birthday & Milestones */}
                <div className="grid grid-cols-2 gap-2.5 text-left">
                  <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Next Birthday</span>
                    <span className="text-base font-extrabold text-emerald-700">{ageData.daysUntilNextBday} days</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">Falls on a {ageData.nextBdayDayOfWeek}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Turning {ageData.nextMilestoneAge} in</span>
                    <span className="text-base font-bold text-gray-800">{ageData.daysUntilMilestone.toLocaleString()} days</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">Next milestone age</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LIFE METRICS */}
            {activeTab === 'metrics' && (
              <div className="grid grid-cols-2 gap-2.5 text-left">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Total Days Lived</span>
                  <span className="text-base font-extrabold text-emerald-600">{ageData.totalDays.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-400 block">~{ageData.totalWeeks.toLocaleString()} full weeks</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Total Hours</span>
                  <span className="text-base font-extrabold text-teal-600">{ageData.totalHours.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-400 block">~{(ageData.totalMinutes / 1e6).toFixed(1)}M minutes</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Estimated Heartbeats</span>
                  <span className="text-base font-extrabold text-rose-600">~{(ageData.estimatedHeartbeats / 1e6).toFixed(1)}M</span>
                  <span className="text-[10px] text-gray-400 block">Average 75 bpm</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Estimated Breaths</span>
                  <span className="text-base font-extrabold text-cyan-600">~{(ageData.estimatedBreaths / 1e6).toFixed(1)}M</span>
                  <span className="text-[10px] text-gray-400 block">Average 16 breaths/min</span>
                </div>
                <div className="col-span-2 bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Time Spent Sleeping</span>
                  <span className="text-base font-extrabold text-emerald-700">~{ageData.estimatedHoursSlept.toLocaleString()} hours</span>
                  <span className="text-[10px] text-gray-500 block">Approx. {Math.round(ageData.years / 3)} years spent dreaming (based on 8h/night)</span>
                </div>
              </div>
            )}

            {/* TAB 3: PLANETARY AGES */}
            {activeTab === 'planets' && (
              <div className="space-y-2 text-left">
                <p className="text-[11px] text-gray-500 mb-1">
                  How many times each planet in our solar system has orbited the Sun since your birth:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {ageData.planetaryAges.map((planet) => (
                    <div
                      key={planet.planet}
                      className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-100 rounded-xl"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`text-xl font-bold ${planet.color}`}>{planet.icon}</span>
                        <div>
                          <span className="text-xs font-bold text-gray-800 block">{planet.planet}</span>
                          <span className="text-[10px] text-gray-400">Orbit: {planet.period}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-gray-800">{planet.years}</span>
                        <span className="text-[10px] text-gray-400 block">years old</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Share / Copy Summary Action */}
            <div className="pt-2 border-t border-gray-100">
              {copyToast && (
                <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-200 mb-2">
                  {copyToast}
                </div>
              )}
              <button
                onClick={copyLifeStats}
                className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>📋 Copy Life Summary Card</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
