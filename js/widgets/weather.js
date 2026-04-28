/* ============================================
   weather.js — 天气组件
   ============================================ */
const WeatherWidget = {
  init() {
    this.load();
  },

  async load() {
    const body = document.getElementById('weather-body');
    if (!body) return;

    try {
      // 使用wttr.in免费API
      const resp = await fetch('https://wttr.in/?format=j1');
      const data = await resp.json();
      const current = data.current_condition?.[0];
      if (!current) throw new Error('No data');

      const temp = current.temp_C;
      const desc = current.lang_zh?.[0]?.value || current.weatherDesc?.[0]?.value || '';
      const humidity = current.humidity;
      const wind = current.windspeedKmph;
      const feelsLike = current.FeelsLikeC;

      const weatherIcons = {
        'Sunny': '☀️', 'Clear': '🌙', 'Partly cloudy': '⛅',
        'Cloudy': '☁️', 'Overcast': '☁️', 'Mist': '🌫️',
        'Patchy rain possible': '🌦️', 'Light rain': '🌧️',
        'Moderate rain': '🌧️', 'Heavy rain': '🌧️',
        'Thunderstorm': '⛈️', 'Snow': '🌨️', 'Fog': '🌫️',
        'Light snow': '🌨️', 'Blizzard': '❄️'
      };
      const icon = weatherIcons[desc] || weatherIcons[current.weatherDesc?.[0]?.value] || '🌤️';

      body.innerHTML = `
        <div class="weather-icon">${icon}</div>
        <div class="weather-info">
          <div class="weather-temp">${temp}°C</div>
          <div class="weather-desc">${desc}</div>
          <div class="weather-details">
            <span class="weather-detail">💧 ${humidity}%</span>
            <span class="weather-detail">🌡️ 体感${feelsLike}°C</span>
            <span class="weather-detail">💨 ${wind}km/h</span>
          </div>
        </div>
      `;
    } catch {
      body.innerHTML = `<div class="weather-loading">天气获取失败，点击刷新 ⟳</div>`;
    }
  },

  refresh() {
    const body = document.getElementById('weather-body');
    if (body) body.innerHTML = '<div class="weather-loading">刷新中...</div>';
    this.load();
  }
};
