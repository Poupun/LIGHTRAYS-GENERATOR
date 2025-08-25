# Light Rays Generator

A modern, beautiful web application for creating and embedding stunning light ray effects. Completely refactored from the ground up with clean architecture, intuitive interface, and robust embed generation.

## ✨ Features

- **Real-time Preview**: See your light ray effects instantly as you adjust settings
- **Intuitive Controls**: Modern, responsive interface with organized control groups
- **Multiple Embed Options**: Generate both JavaScript widgets and iframe embeds
- **Preset Configurations**: Quick presets for common light ray styles
- **Customizable Parameters**: Full control over colors, animation, positioning, and effects
- **Mobile Responsive**: Works beautifully on all screen sizes
- **Copy-to-Clipboard**: Easy one-click copying of generated embed codes

## 🚀 Getting Started

### Option 1: Open Directly in Browser
1. Open `index.html` in any modern web browser
2. Start customizing your light rays using the controls
3. Generate embed codes when ready

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 📁 File Structure

```
├── index.html              # Main application interface
├── app.js                 # Application logic and controls
├── app-styles.css         # Modern UI styling
├── light-rays-engine.js   # Core light ray rendering engine
├── embed-standalone.html  # Standalone embed page for iframes
└── README.md             # This file
```

## 🎨 How to Use

### 1. Customize Your Light Rays
- **Appearance**: Adjust color, intensity, and ray count
- **Size & Position**: Control ray width, height, and light source position
- **Animation**: Toggle animations and adjust layer speeds
- **Effects**: Enable/disable blur effects for different styles

### 2. Try Quick Presets
- **Soft Dreamy**: Gentle, ethereal light rays
- **Neon Club**: Vibrant, high-energy effects
- **Ethereal Glow**: Mystical purple lighting
- **Cinematic**: Dramatic orange rays for films
- **Forest Light**: Natural green forest lighting

### 3. Generate Embed Code
Choose between two embed methods:

#### JavaScript Widget (Recommended)
- Self-contained, no external dependencies
- Better performance and customization
- Smaller payload size
- Direct integration with your website

#### iframe Embed
- Sandboxed and secure
- Easy drop-in integration
- Works with any CMS or platform
- No JavaScript conflicts

### 4. Copy and Paste
Use the built-in copy functionality to get your embed code instantly.

## 🛠 Technical Architecture

### Core Engine
The `LightRaysEngine` class provides:
- Modular, reusable light ray generation
- CSS-based animations for smooth performance
- Dynamic configuration updates
- Memory-efficient cleanup

### Modern Interface
- CSS Grid and Flexbox layouts
- CSS custom properties for theming
- Smooth transitions and micro-interactions
- Accessibility-friendly controls

### Embed Generation
- **JavaScript Method**: Generates optimized, inline JavaScript with minified engine
- **iframe Method**: Creates standalone HTML with query parameter configuration
- Both methods preserve exact visual fidelity to the preview

## 🎯 Configuration Options

```javascript
{
    color: '#00ff7f',           // Hex color of the light rays
    intensity: 0.6,             // Overall brightness (0.1 - 1.0)
    rayCount: 12,               // Number of rays (4 - 30)
    rayWidth: 80,               // Width of each ray in pixels (20 - 300)
    rayHeight: 120,             // Height of rays in viewport units (50 - 300)
    lightX: 100,                // Horizontal position percentage (0 - 100)
    lightY: 0,                  // Vertical position percentage (-100 - 100)
    animationSpeed1: 1,         // Layer 1 animation speed (0.1 - 3.0)
    animationSpeed2: 1,         // Layer 2 animation speed (0.1 - 3.0)
    animated: true,             // Enable/disable animations
    blurEnabled: true           // Enable/disable blur effects
}
```

## 🌟 Key Improvements Over Original

### Code Quality
- **Modular Architecture**: Clean separation of concerns
- **Modern JavaScript**: ES6+ classes and modules
- **No Dependencies**: Pure vanilla JavaScript
- **Memory Management**: Proper cleanup and resource management

### User Experience
- **Intuitive Interface**: Organized controls with clear labels
- **Real-time Feedback**: Instant preview updates
- **Visual Hierarchy**: Better information architecture
- **Responsive Design**: Works on all devices

### Embed Generation
- **Multiple Options**: JavaScript and iframe methods
- **Self-contained**: No external dependencies required
- **Optimized Output**: Minified and efficient generated code
- **Error Handling**: Robust error reporting and recovery

### Performance
- **CSS Animations**: Hardware-accelerated rendering
- **Efficient Updates**: Only re-render when needed
- **Lightweight**: Small footprint and fast loading

## 🔧 Customization

The application is built with customization in mind:

- **Styling**: Modify CSS custom properties in `app-styles.css`
- **Presets**: Add new presets in `LightRaysEngine.presets`
- **Controls**: Extend control ranges and options in `app.js`
- **Engine**: Customize ray generation in `light-rays-engine.js`

## 📱 Browser Support

- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

This is a self-contained project designed to be easily customizable. Feel free to:

- Add new preset configurations
- Enhance the UI with additional controls
- Optimize the rendering engine
- Add new export formats

## 📄 License

This project is provided as-is for educational and commercial use. Feel free to modify and distribute as needed.

---

**Enjoy creating beautiful light ray effects! ✨**