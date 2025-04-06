document.addEventListener('DOMContentLoaded', function() {
  const paletteContainer = document.querySelector('.palette-container');
  const generateBtn = document.getElementById('generate-btn');
  const notification = document.getElementById('notification');
  let lockedColors = JSON.parse(localStorage.getItem('lockedColors')) || Array(5).fill(false);
  
  // Initialize the palette
  generatePalette();
  
  // Generate new palette button click
  generateBtn.addEventListener('click', generatePalette);
  
  // Spacebar shortcut
  document.addEventListener('keydown', function(e) {
      if (e.code === 'Space') {
          e.preventDefault();
          generatePalette();
      }
  });
  
  // Generate a random hex color
  function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  }
  
  // Generate the color palette
  function generatePalette() {
      paletteContainer.innerHTML = '';
      
      for (let i = 0; i < 5; i++) {
          const color = lockedColors[i] ? 
              document.querySelector(`.color-box[data-index="${i}"]`).style.backgroundColor : 
              getRandomColor();
          
          const colorBox = document.createElement('div');
          colorBox.className = 'color-box';
          colorBox.style.backgroundColor = color;
          colorBox.dataset.index = i;
          
          const colorInfo = document.createElement('div');
          colorInfo.className = 'color-info';
          
          const hexCode = document.createElement('div');
          hexCode.className = 'hex-code';
          hexCode.textContent = rgbToHex(color);
          
          const actions = document.createElement('div');
          actions.className = 'actions';
          
          const lockBtn = document.createElement('button');
          lockBtn.className = `action-btn ${lockedColors[i] ? 'locked' : ''}`;
          lockBtn.innerHTML = `<i class="fas fa-${lockedColors[i] ? 'lock' : 'lock-open'}"></i>`;
          lockBtn.title = lockedColors[i] ? 'Unlock color' : 'Lock color';
          
          lockBtn.addEventListener('click', function(e) {
              e.stopPropagation();
              lockedColors[i] = !lockedColors[i];
              localStorage.setItem('lockedColors', JSON.stringify(lockedColors));
              lockBtn.innerHTML = `<i class="fas fa-${lockedColors[i] ? 'lock' : 'lock-open'}"></i>`;
              lockBtn.title = lockedColors[i] ? 'Unlock color' : 'Lock color';
              lockBtn.classList.toggle('locked');
          });
          
          colorInfo.appendChild(hexCode);
          // actions.appendChild(lockBtn);
          colorInfo.appendChild(actions);
          colorBox.appendChild(colorInfo);
          
          colorBox.addEventListener('click', function() {
              copyToClipboard(hexCode.textContent);
              showNotification();
          });
          
          paletteContainer.appendChild(colorBox);
      }
  }
  
  // Convert RGB color to HEX
  function rgbToHex(rgb) {
      if (rgb.startsWith('#')) return rgb.toUpperCase();
      
      // Extract RGB values from rgb(r, g, b) string
      const rgbValues = rgb.match(/\d+/g);
      if (!rgbValues || rgbValues.length < 3) return '#000000';
      
      const r = parseInt(rgbValues[0]).toString(16).padStart(2, '0');
      const g = parseInt(rgbValues[1]).toString(16).padStart(2, '0');
      const b = parseInt(rgbValues[2]).toString(16).padStart(2, '0');
      
      return `#${r}${g}${b}`.toUpperCase();
  }
  
  // Copy text to clipboard
  function copyToClipboard(text) {
      navigator.clipboard.writeText(text).catch(err => {
          console.error('Could not copy text: ', err);
      });
  }
  
  // Show notification
  function showNotification() {
      notification.classList.add('show');
      setTimeout(() => {
          notification.classList.remove('show');
      }, 2000);
  }
});