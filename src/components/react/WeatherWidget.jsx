import { useState, useEffect } from 'react';
import { useWeather } from '../../hooks/useWeather';

function getCondition(code) {
  if (code === 0)  return { label: 'Clear Sky',       icon: '☀️' };
  if (code === 1)  return { label: 'Mainly Clear',    icon: '🌤️' };
  if (code === 2)  return { label: 'Partly Cloudy',   icon: '⛅' };
  if (code === 3)  return { label: 'Overcast',        icon: '☁️' };
  if (code <= 48)  return { label: 'Foggy',           icon: '🌫️' };
  if (code <= 55)  return { label: 'Drizzle',         icon: '🌦️' };
  if (code <= 65)  return { label: 'Rain',            icon: '🌧️' };
  if (code <= 77)  return { label: 'Snow',            icon: '❄️' };
  if (code <= 82)  return { label: 'Rain Showers',    icon: '🌦️' };
  if (code <= 86)  return { label: 'Snow Showers',    icon: '🌨️' };
  return             { label: 'Thunderstorm',         icon: '⛈️' };
}

function getSeason(month) {
  if (month >= 2 && month <= 4)  return 'spring';
  if (month >= 5 && month <= 7)  return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

function getCondBucket(code) {
  if (code <= 1)  return 'clear';
  if (code <= 3)  return 'cloudy';
  if (code <= 48) return 'fog';
  if (code <= 65 || (code >= 80 && code <= 82)) return 'rain';
  if (code <= 77 || (code >= 85 && code <= 86)) return 'snow';
  return 'storm';
}

const BG = {
  spring: {
    clear:  '/images/hero/killington-aerial.jpg',
    cloudy: '/images/hero/killington-mountains.png',
    fog:    '/images/hero/killington-aerial.jpg',
    rain:   '/images/hero/killington-water.jpg',
    snow:   '/images/hero/killington-k1.jpg',
    storm:  '/images/hero/killington-mountains.png',
  },
  summer: {
    clear:  '/images/hero/killington-water.jpg',
    cloudy: '/images/hero/killington-mountains.png',
    fog:    '/images/hero/killington-aerial.jpg',
    rain:   '/images/hero/killington-water.jpg',
    snow:   '/images/hero/killington-water.jpg',
    storm:  '/images/hero/killington-mountains.png',
  },
  fall: {
    clear:  '/images/hero/killington-aerial.jpg',
    cloudy: '/images/hero/killington-mountains.png',
    fog:    '/images/hero/killington-aerial.jpg',
    rain:   '/images/hero/killington-aerial.jpg',
    snow:   '/images/hero/killington-k1.jpg',
    storm:  '/images/hero/killington-mountains.png',
  },
  winter: {
    clear:  '/images/hero/killington-k1.jpg',
    cloudy: '/images/hero/killington-k1.jpg',
    fog:    '/images/hero/killington-aerial.jpg',
    rain:   '/images/hero/killington-k1.jpg',
    snow:   '/images/hero/killington-k1.jpg',
    storm:  '/images/hero/killington-k1.jpg',
  },
};

function getBgUrl(code) {
  const month  = new Date().getMonth();
  const season = getSeason(month);
  const bucket = getCondBucket(code);
  return BG[season]?.[bucket] ?? BG.winter.clear;
}

export default function WeatherWidget() {
  const { weather: data, loading } = useWeather();

  if (loading) {
    return (
      <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/5 h-40" style={{ background: 'linear-gradient(135deg, #005f82, #00B4D8)' }} />
          <div className="flex-1 bg-white p-5 flex gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-1 h-24 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <p className="text-center text-gray-400 text-sm py-8">
        Weather data temporarily unavailable — check back shortly.
      </p>
    );
  }

  const cond = getCondition(data.code);
  const bgUrl = getBgUrl(data.code);

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col md:flex-row">
      {/* Left: current conditions with seasonal photo */}
      <div
        className="md:w-2/5 relative overflow-hidden flex flex-col justify-center"
        style={{
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '220px',
        }}
      >
        <div className="absolute inset-0 bg-brand-navy/60" />

        <div className="relative z-10 px-6 py-5">
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-3">
            Killington, VT · 4,241 ft
          </p>
          <div className="flex items-center justify-between md:flex-col md:items-start gap-2">
            <div>
              <div className="flex items-end gap-1 leading-none">
                <span className="text-6xl font-black text-white">{data.temp}</span>
                <span className="text-white/75 text-xl font-bold mb-1">°F</span>
              </div>
              <p className="text-white/95 text-base font-semibold mt-2">{cond.label}</p>
              {data.sources.length > 1 && (
                <p className="text-white/50 text-xs mt-0.5">avg · {data.sources.length} sources</p>
              )}
            </div>
            <span className="text-6xl md:text-5xl select-none" role="img" aria-label={cond.label}>
              {cond.icon}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4">
            <span className="text-white/80 text-xs font-medium">💨 {data.wind} mph</span>
            <span className="text-white/80 text-xs font-medium">💧 {data.humidity}%</span>
            {data.snowDepth > 0 && (
              <span className="text-white/80 text-xs font-medium">❄️ {data.snowDepth}" base</span>
            )}
          </div>
        </div>
      </div>

      {/* Right: 5-day forecast + attribution */}
      <div className="flex-1 bg-white flex flex-col">
        <div className="px-6 py-5 flex-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            5-Day Forecast
          </p>
          <div className="flex justify-between">
            {data.forecast.map((day) => {
              const dc = getCondition(day.code);
              return (
                <div key={day.dayName} className="flex flex-col items-center flex-1">
                  <span className="text-sm font-bold text-gray-500 whitespace-nowrap">{day.dayName}</span>
                  <span className="text-3xl my-1">{dc.icon}</span>
                  {day.snow && (
                    <span className="text-sm font-bold mb-0.5" style={{ color: '#2d94e3' }}>{day.snow}"</span>
                  )}
                  <span className="text-lg font-black text-black">{day.high}°</span>
                  <span className="text-sm text-gray-400">{day.low}°</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between flex-wrap gap-1">
          <p className="text-xs text-gray-400">{data.sources.join(' · ')}</p>
          <p className="text-xs text-gray-400">{data.updatedAt}</p>
        </div>
      </div>
    </div>
  );
}
