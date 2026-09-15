import { useState, useEffect } from 'react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function useWeather() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const LAT = 43.6753
        const LON = -72.7781

        // Fetching from Open-Meteo (highly reliable and fast, ~150-250ms)
        const omRes = await fetch(
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${LAT}&longitude=${LON}` +
          `&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,snow_depth` +
          `&daily=temperature_2m_max,temperature_2m_min,weather_code,snowfall_sum` +
          `&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch` +
          `&timezone=America%2FNew_York&forecast_days=5`
        )

        if (!omRes.ok) throw new Error('Open-Meteo fetch failed')
        const om = await omRes.json()

        const avgTemp = Math.round(om.current.temperature_2m)
        const currentSnowDepth = Math.round(om.current.snow_depth * 39.37)
        const newSnowToday = Number(om.daily.snowfall_sum[0]).toFixed(1)

        const forecast = om.daily.time.map((date, i) => ({
          dayName: i === 0 ? 'Today' : DAYS[new Date(date + 'T12:00:00').getDay()],
          high: Math.round(om.daily.temperature_2m_max[i]),
          low:  Math.round(om.daily.temperature_2m_min[i]),
          code: om.daily.weather_code[i],
          snow: om.daily.snowfall_sum[i] > 0 ? Number(om.daily.snowfall_sum[i]).toFixed(1) : null,
        }))

        // Instantly update state with high-performance Open-Meteo data
        setWeather({
          temp: avgTemp,
          snowDepth: currentSnowDepth,
          newSnow: newSnowToday,
          code: om.current.weather_code,
          wind: Math.round(om.current.wind_speed_10m),
          humidity: om.current.relative_humidity_2m,
          forecast,
          sources: ['Open-Meteo'],
          updatedAt: new Date().toLocaleTimeString('en-US', {
            hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
          }),
        })
        setLoading(false)



      } catch (err) {
        console.error('Weather fetch error:', err)
        // Set standard winter placeholders on failure
        setWeather({
          temp: 32,
          snowDepth: 0,
          newSnow: 0,
          code: 0,
          forecast: [],
          sources: ['Fallback'],
          updatedAt: new Date().toLocaleTimeString(),
        })
        setLoading(false)
      }
    }

    load()
  }, [])

  return { weather, loading }
}
