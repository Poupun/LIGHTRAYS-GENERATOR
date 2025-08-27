# ✨ Light Rays Generator

A powerful, modern web application for creating stunning light ray effects with an intuitive visual editor. Generate customizable, embeddable light rays perfect for SaaS websites, e-commerce platforms, and creative web projects.

[Light Rays Generator](https://poupun.github.io/LIGHTRAYS-GENERATOR/)

## 🚀 Features

### ⚡ Real-time Visual Editor
- **Live Preview**: See your light ray effects instantly as you customize
- **Intuitive Interface**: Drag-and-drop floating control panels
- **Professional UI**: Modern, responsive design that works on all devices

### 🎨 Complete Customization
- **Ray Appearance**: Color, intensity, count, and blur effects
- **Size & Positioning**: Ray dimensions, light source positioning
- **Animation Controls**: Speed settings, enable/disable animations
- **Background Options**: Transparent or colored backgrounds for seamless integration

### 📦 Easy Embedding
- **iframe Embeds**: Clean, secure iframe code generation
- **React Components**: Ready-to-use React components
- **URL Parameters**: All settings encoded in embed URLs
- **Transparent Mode**: Perfect overlay integration for existing designs

### 🔧 Developer Friendly
- **Sandboxed**: Secure iframe embedding prevents conflicts
- **Lightweight**: Optimized CSS animations and minimal footprint
- **Cross-origin**: Works on any domain
- **No Dependencies**: Pure vanilla JavaScript

## 🎯 Perfect For

- **SaaS Platforms**: Hero sections and feature highlights
- **E-commerce**: Product showcases and promotional banners
- **Portfolios**: Creative backgrounds and visual effects
- **Landing Pages**: Eye-catching hero sections
- **Marketing**: Attention-grabbing promotional content

## 🛠 Quick Start

### 1. Clone & Open
```bash
git clone https://github.com/your-username/LIGHTRAYS-GENERATOR.git
cd LIGHTRAYS-GENERATOR
# Open index.html in your browser or serve with a local server
```

### 2. Customize Your Light Rays
- Adjust color, intensity, and ray count
- Position the light source
- Configure animations
- Set background preferences

### 3. Generate Embed Code
- Click "Iframe Embed" for universal iframe code
- Click "React Iframe" for React component code
- Copy and paste into your project

## 📋 Usage Examples

### Basic Iframe Embed
```html
<iframe 
    src="https://your-domain.com/embed.html?color=2fc125&intensity=0.8&rayCount=30&backgroundEnabled=false" 
    style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; border: none; z-index: 9999;"
    frameborder="0"
    allowfullscreen>
</iframe>
```

### React Component
```jsx
import LightRays from './LightRays';

function Hero() {
  return (
    <div className="hero-section">
      <LightRays width="100%" height="600px" />
      <div className="hero-content">
        <h1>Amazing Product</h1>
      </div>
    </div>
  );
}
```

### Responsive Container
```html
<div style="position: relative; width: 100%; height: 400px;">
  <iframe 
    src="embed.html?backgroundEnabled=false&color=ff6b35&animated=true"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;">
  </iframe>
</div>
```

## ⚙ Configuration Options

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | String | `2fc125` | Hex color (without #) |
| `intensity` | Float | `0.8` | Ray intensity (0.1-1.0) |
| `rayCount` | Integer | `30` | Number of rays (4-30) |
| `rayWidth` | Integer | `240` | Ray width in pixels |
| `rayHeight` | Integer | `180` | Ray height in vh units |
| `lightX` | Integer | `100` | Light X position (0-100%) |
| `lightY` | Integer | `-5` | Light Y position (-100-100%) |
| `animated` | Boolean | `true` | Enable animations |
| `blurEnabled` | Boolean | `true` | Enable blur effects |
| `backgroundEnabled` | Boolean | `false` | Show background color |
| `backgroundColor` | String | `000000` | Background hex color |

## 🏗 Project Structure

```
LIGHTRAYS-GENERATOR/
├── index.html              # Main generator interface
├── embed.html              # Embeddable viewer
├── app.js                  # Main application logic
├── light-rays-engine.js    # Light rays rendering engine
├── app-styles.css          # UI styling
└── README.md               # Documentation
```

## 🎨 Customization

### Modifying Colors
The generator includes a dynamic color system that adapts the UI to your chosen light ray color. You can customize the base color scheme in `app-styles.css`:

```css
:root {
  --accent-primary: #2fc125;
  --bg-dark: #0a0a0a;
  --bg-glass: rgba(15, 15, 15, 0.8);
}
```

### Adding New Controls
Extend the control panel by adding new inputs in `index.html` and corresponding logic in `app.js`:

```javascript
// Add to config object
newParameter: defaultValue,

// Add event listener
document.getElementById('newParameter').addEventListener('input', (e) => {
    this.updateConfig({ newParameter: e.target.value });
});
```

### Engine Modifications
Customize the light ray rendering in `light-rays-engine.js`. The engine supports:
- Multiple ray layers
- Customizable animations
- Variable ray patterns
- Performance optimizations

## 🌟 Advanced Features

### Dynamic Background Integration
The transparent background mode allows perfect integration with existing website designs:

```html
<!-- Overlay on existing content -->
<div class="page-hero" style="background: linear-gradient(45deg, #ff6b35, #f7931e);">
  <iframe src="embed.html?backgroundEnabled=false&color=ffffff" 
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
  </iframe>
  <div class="hero-content">Your content here</div>
</div>
```

### Multiple Instances
Deploy multiple light ray instances with different configurations:

```html
<!-- Header rays -->
<iframe src="embed.html?color=2fc125&rayCount=15&lightY=-10"></iframe>

<!-- Footer rays -->
<iframe src="embed.html?color=ff6b35&rayCount=20&lightY=110"></iframe>
```

## 📱 Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+ 
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### Static Hosting
Deploy to any static hosting service:
- Netlify
- Vercel  
- GitHub Pages
- AWS S3
- Any web server

### CDN Integration
For production use, consider serving from a CDN for optimal performance across global users.

## 🤝 Contributing

Contributions are welcome! Areas for enhancement:
- Additional animation patterns
- New ray shapes and effects
- Performance optimizations
- UI/UX improvements
- Mobile-specific features

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋‍♂️ Support

Created by **Julien Salgues** for **Asgard - Atawa Interactive**

For questions, issues, or feature requests, please open an issue on GitHub.
