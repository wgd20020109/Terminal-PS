/* color-converter.js */
ToolManager.register({
  id: 'color-converter',
  name: '颜色转换器',
  icon: '🎨',
  desc: 'HEX、RGB、HSL颜色互转',
  category: 'other',
  render(container) {
    container.innerHTML = `
      <div class="tool-panel">
        <div class="color-preview-box" id="color-preview" style="background:#00f0ff"></div>
        <div class="color-values">
          <span class="color-val-label">HEX</span>
          <input class="color-val-input" id="color-hex" value="#00f0ff" oninput="ColorTool.fromHex()">
          <span class="color-val-label">RGB</span>
          <input class="color-val-input" id="color-rgb" value="rgb(0, 240, 255)" oninput="ColorTool.fromRGB()">
          <span class="color-val-label">HSL</span>
          <input class="color-val-input" id="color-hsl" value="hsl(184, 100%, 50%)" oninput="ColorTool.fromHSL()">
        </div>
        <input type="color" id="color-picker-input" value="#00f0ff" style="width:100%;height:40px;border:none;cursor:pointer;border-radius:8px;" oninput="ColorTool.fromPicker(this.value)">
      </div>`;
  }
});

const ColorTool = {
  fromHex() {
    const hex = document.getElementById('color-hex').value.trim();
    const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!m) return;
    const r = parseInt(m[1],16), g = parseInt(m[2],16), b = parseInt(m[3],16);
    document.getElementById('color-preview').style.background = hex;
    document.getElementById('color-picker-input').value = hex.startsWith('#') ? hex : '#' + hex;
    document.getElementById('color-rgb').value = `rgb(${r}, ${g}, ${b})`;
    document.getElementById('color-hsl').value = this.rgbToHsl(r, g, b);
  },
  fromRGB() {
    const s = document.getElementById('color-rgb').value;
    const m = s.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (!m) return;
    const r = +m[1], g = +m[2], b = +m[3];
    const hex = '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
    document.getElementById('color-hex').value = hex;
    document.getElementById('color-preview').style.background = hex;
    document.getElementById('color-picker-input').value = hex;
    document.getElementById('color-hsl').value = this.rgbToHsl(r, g, b);
  },
  fromHSL() {
    // simplified
    document.getElementById('color-preview').style.background = document.getElementById('color-hsl').value;
  },
  fromPicker(val) {
    document.getElementById('color-hex').value = val;
    this.fromHex();
  },
  rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b);
    let h, s, l = (max+min)/2;
    if (max === min) { h = s = 0; } else {
      const d = max - min;
      s = l > 0.5 ? d/(2-max-min) : d/(max+min);
      switch(max) {
        case r: h = ((g-b)/d + (g<b?6:0))/6; break;
        case g: h = ((b-r)/d + 2)/6; break;
        case b: h = ((r-g)/d + 4)/6; break;
      }
    }
    return `hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`;
  }
};
