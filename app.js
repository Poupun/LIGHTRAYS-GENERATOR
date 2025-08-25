/**
 * Light Rays Generator App
 * Modern, clean interface for creating and embedding light ray effects
 */

class LightRaysApp {
    constructor() {
        this.lightRaysInstance = null;
        this.config = {
            color: '#2fc125',
            intensity: 0.8,
            rayCount: 30,
            rayWidth: 240,
            rayHeight: 180,
            lightX: 100,
            lightY: -5,
            animationSpeed1: 3.0,
            animationSpeed2: 3.0,
            animated: true,
            blurEnabled: true
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.initDragFunctionality();
        this.createLightRays();
        this.updateAnimationControls();
        this.updateJavaScriptButtonColor(this.config.color);
    }

    bindEvents() {
        // Color input
        const colorInput = document.getElementById('color');
        colorInput.addEventListener('input', (e) => {
            this.updateConfig({ color: e.target.value });
            document.querySelector('.color-value').textContent = e.target.value;
            this.updateJavaScriptButtonColor(e.target.value);
        });

        // Range inputs
        const rangeInputs = [
            'intensity', 'rayCount', 'rayWidth', 'rayHeight', 
            'lightX', 'lightY', 'animationSpeed1', 'animationSpeed2'
        ];
        
        rangeInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', (e) => {
                    const value = parseFloat(e.target.value);
                    this.updateConfig({ [id]: value });
                    this.updateValueDisplay(id, value);
                });
            }
        });

        // Toggle inputs
        const toggleInputs = ['animated', 'blurEnabled'];
        toggleInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('change', (e) => {
                    this.updateConfig({ [id]: e.target.checked });
                    if (id === 'animated') {
                        this.updateAnimationControls();
                    }
                });
            }
        });


        // Action buttons
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetToDefault();
        });

        document.getElementById('toggle-controls').addEventListener('click', () => {
            this.toggleControlsPanel();
        });

        document.getElementById('toggle-embed').addEventListener('click', () => {
            this.toggleEmbedPanel();
        });

        // Generate buttons
        document.getElementById('generate-js-btn').addEventListener('click', () => {
            this.generateJavaScriptEmbed();
        });

        document.getElementById('generate-react-btn').addEventListener('click', () => {
            this.generateReactWidget();
        });

        // Copy button
        document.getElementById('copy-btn').addEventListener('click', () => {
            this.copyToClipboard();
        });
    }

    createLightRays() {
        const container = document.getElementById('preview-container');
        
        // Remove placeholder
        const placeholder = container.querySelector('.preview-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }

        // Destroy existing instance
        if (this.lightRaysInstance) {
            this.lightRaysInstance.destroy();
        }

        // Create new instance
        try {
            this.lightRaysInstance = new LightRaysEngine(container, this.config);
        } catch (error) {
            console.error('Failed to create light rays:', error);
        }
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        if (this.lightRaysInstance) {
            this.lightRaysInstance.updateConfig(this.config);
        }
    }

    updateValueDisplay(id, value) {
        const displayElement = document.getElementById(`${id}-value`);
        if (!displayElement) return;

        let displayValue = value;
        switch (id) {
            case 'rayWidth':
                displayValue = `${value}px`;
                break;
            case 'rayHeight':
                displayValue = `${value}vh`;
                break;
            case 'lightX':
            case 'lightY':
                displayValue = `${value}%`;
                break;
            case 'animationSpeed1':
            case 'animationSpeed2':
                displayValue = `${value.toFixed(1)}x`;
                break;
            case 'intensity':
                displayValue = value.toFixed(1);
                break;
            default:
                displayValue = value.toString();
        }

        displayElement.textContent = displayValue;
    }

    updateAnimationControls() {
        const speed1Control = document.getElementById('speed1-control');
        const speed2Control = document.getElementById('speed2-control');
        const isAnimated = this.config.animated;

        if (speed1Control) {
            speed1Control.style.opacity = isAnimated ? '1' : '0.5';
            speed1Control.style.pointerEvents = isAnimated ? 'auto' : 'none';
        }

        if (speed2Control) {
            speed2Control.style.opacity = isAnimated ? '1' : '0.5';
            speed2Control.style.pointerEvents = isAnimated ? 'auto' : 'none';
        }
    }

    updateJavaScriptButtonColor(color) {
        const button = document.getElementById('generate-js-btn');
        if (!button) return;

        // Convert hex to RGB for darker gradient calculation
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        // Create darker version (reduce by 40%)
        const darkerR = Math.round(r * 0.6);
        const darkerG = Math.round(g * 0.6);
        const darkerB = Math.round(b * 0.6);

        const lightColor = `rgb(${r}, ${g}, ${b})`;
        const darkColor = `rgb(${darkerR}, ${darkerG}, ${darkerB})`;

        // Apply gradient background
        button.style.background = `linear-gradient(135deg, ${lightColor} 0%, ${darkColor} 100%)`;
        button.style.borderColor = lightColor;
        button.style.boxShadow = `0 4px 15px rgba(${r}, ${g}, ${b}, 0.3)`;
    }


    resetToDefault() {
        const defaultConfig = {
            color: '#2fc125',
            intensity: 0.8,
            rayCount: 30,
            rayWidth: 240,
            rayHeight: 180,
            lightX: 100,
            lightY: -5,
            animationSpeed1: 3.0,
            animationSpeed2: 3.0,
            animated: true,
            blurEnabled: true
        };

        this.config = { ...defaultConfig };

        // Update all UI controls
        Object.entries(defaultConfig).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (!element) return;

            if (element.type === 'range' || element.type === 'color') {
                element.value = value;
                if (key === 'color') {
                    document.querySelector('.color-value').textContent = value;
                } else {
                    this.updateValueDisplay(key, value);
                }
            } else if (element.type === 'checkbox') {
                element.checked = value;
            }
        });

        this.createLightRays();
        this.updateAnimationControls();
        this.updateJavaScriptButtonColor(defaultConfig.color);
        this.showNotification('Reset to default settings');
    }

    toggleControlsPanel() {
        const panel = document.getElementById('controls-panel');
        const button = document.getElementById('toggle-controls');
        const icon = button.querySelector('svg');
        
        panel.classList.toggle('collapsed');
        
        if (panel.classList.contains('collapsed')) {
            // Expand/Maximize icon
            icon.innerHTML = '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>';
            button.title = 'Expand Controls';
        } else {
            // Minimize icon
            icon.innerHTML = '<rect x="3" y="4" width="18" height="2"></rect>';
            button.title = 'Minimize Controls';
        }
    }

    toggleEmbedPanel() {
        const panel = document.getElementById('embed-panel');
        const button = document.getElementById('toggle-embed');
        const icon = button.querySelector('svg');
        
        panel.classList.toggle('collapsed');
        
        if (panel.classList.contains('collapsed')) {
            // Expand/Maximize icon
            icon.innerHTML = '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>';
            button.title = 'Expand Embed Panel';
        } else {
            // Minimize icon
            icon.innerHTML = '<rect x="3" y="4" width="18" height="2"></rect>';
            button.title = 'Minimize Embed Panel';
        }
    }

    generateJavaScriptEmbed() {
        const embedCode = this.createJavaScriptEmbedCode();
        this.showEmbedOutput('JavaScript Widget', embedCode);
        this.createEmbedPreview(embedCode, 'javascript');
    }

    generateReactWidget() {
        const embedCode = this.createReactWidgetCode();
        this.showEmbedOutput('React Widget', embedCode);
        this.createEmbedPreview(embedCode, 'react');
    }

    createJavaScriptEmbedCode() {
        const configJson = JSON.stringify(this.config, null, 2);
        
        return `<!-- Light Rays Widget - Full Screen -->
<div id="light-rays-widget" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #000; z-index: 9999; overflow: hidden;"></div>

<script>
// Light Rays Engine - Inline Version
class LightRaysEngine {
    constructor(container, config = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        if (!this.container) throw new Error('Container element not found');
        
        this.config = {
            color: '#00ff7f', intensity: 0.6, rayCount: 12, rayWidth: 80, rayHeight: 120,
            lightX: 100, lightY: 0, animationSpeed1: 1, animationSpeed2: 1,
            animated: true, blurEnabled: true, ...config
        };
        
        this.init();
    }
    
    init() {
        this.createRayContainer();
        this.generateRays();
    }
    
    createRayContainer() {
        if (this.rayContainer) this.rayContainer.remove();
        this.rayContainer = document.createElement('div');
        this.rayContainer.className = 'light-rays-container';
        this.rayContainer.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;pointer-events:none;z-index:1;';
        this.container.style.position = 'relative';
        this.container.appendChild(this.rayContainer);
        this.applyCSSVariables();
    }
    
    applyCSSVariables() {
        const rgb = this.hexToRgb(this.config.color);
        const vars = [
            '--primary-color', this.config.color,
            '--ray-r', rgb.r, '--ray-g', rgb.g, '--ray-b', rgb.b,
            '--intensity', this.config.intensity,
            '--light-x', this.config.lightX + '%', '--light-y', this.config.lightY + '%',
            '--ray-width', this.config.rayWidth + 'px', '--ray-height', this.config.rayHeight + 'vh',
            '--animation-speed1', this.config.animationSpeed1, '--animation-speed2', this.config.animationSpeed2
        ];
        for (let i = 0; i < vars.length; i += 2) this.rayContainer.style.setProperty(vars[i], vars[i + 1]);
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 0, g: 255, b: 127 };
    }
    
    createStyleSheet() {
        if (document.getElementById('light-rays-styles-inline')) return;
        const style = document.createElement('style');
        style.id = 'light-rays-styles-inline';
        style.textContent = \`
            .light-rays-ambient{position:absolute;top:var(--light-y);left:var(--light-x);width:200%;height:200%;background:conic-gradient(from 225deg at center,transparent 0deg,rgba(var(--ray-r),var(--ray-g),var(--ray-b),calc(var(--intensity)*0.3)) 45deg,rgba(var(--ray-r),var(--ray-g),var(--ray-b),calc(var(--intensity)*0.1)) 90deg,transparent 135deg);transform:translate(-50%,-50%);opacity:var(--intensity);\${this.config.animated?'animation:lr-gentle-pulse calc(4s/var(--animation-speed1)) ease-in-out infinite alternate;':''}filter:blur(\${this.config.blurEnabled?'60px':'20px'});}
            .light-rays-ray{position:absolute;top:var(--light-y);left:var(--light-x);width:var(--ray-width);height:var(--ray-height);transform-origin:50% 0%;transform:translate(-50%,-50%) rotate(var(--angle));opacity:var(--opacity);\${this.config.blurEnabled?'background:radial-gradient(ellipse calc(var(--ray-width)/2) var(--ray-height) at center 0%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),1) 0%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.9) 8%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.7) 20%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.5) 35%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.3) 50%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.2) 65%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.1) 80%,transparent 100%);filter:blur(calc(var(--ray-width)/12)) saturate(1.2);':'background:linear-gradient(to bottom,rgba(var(--ray-r),var(--ray-g),var(--ray-b),1) 0%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.9) 15%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.6) 30%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.4) 50%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.2) 70%,transparent 100%);clip-path:polygon(45% 0%,55% 0%,100% 100%,0% 100%);'}}
            .light-rays-ray.layer1{\${this.config.animated?'animation:lr-ray-shimmer calc(3s/var(--animation-speed1)) ease-in-out infinite alternate,lr-ray-sway calc(8s/var(--animation-speed1)) ease-in-out infinite;':''}animation-delay:var(--delay);}
            .light-rays-ray.layer2{\${this.config.animated?'animation:lr-ray-shimmer-2 calc(4s/var(--animation-speed2)) ease-in-out infinite alternate,lr-ray-sway-2 calc(10s/var(--animation-speed2)) ease-in-out infinite;':''}animation-delay:calc(var(--delay) + 1.5s);}
            .light-rays-central{position:absolute;top:calc(var(--light-y) - 100px);left:calc(var(--light-x) - 100px);width:200px;height:200px;background:radial-gradient(circle,rgba(var(--ray-r),var(--ray-g),var(--ray-b),1) 0%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.8) 20%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.4) 40%,transparent 70%);border-radius:50%;opacity:calc(var(--intensity)*0.8);\${this.config.animated?'animation:lr-central-glow-pulse 3s ease-in-out infinite alternate;':''}filter:blur(\${this.config.blurEnabled?'30px':'10px'});}
            @keyframes lr-ray-shimmer{0%{opacity:var(--opacity);transform:translate(-50%,-50%) rotate(var(--angle)) scaleY(1);}100%{opacity:calc(var(--opacity)*1.5);transform:translate(-50%,-50%) rotate(var(--angle)) scaleY(1.1);}}
            @keyframes lr-ray-sway{0%,100%{transform:translate(-50%,-50%) rotate(var(--angle));}50%{transform:translate(-50%,-50%) rotate(calc(var(--angle) + 2deg));}}
            @keyframes lr-ray-shimmer-2{0%{opacity:calc(var(--opacity)*0.8);transform:translate(-50%,-50%) rotate(var(--angle)) scaleY(0.9) translateX(2px);}100%{opacity:calc(var(--opacity)*1.3);transform:translate(-50%,-50%) rotate(var(--angle)) scaleY(1.15) translateX(-2px);}}
            @keyframes lr-ray-sway-2{0%,100%{transform:translate(-50%,-50%) rotate(calc(var(--angle) + 1deg));}25%{transform:translate(-50%,-50%) rotate(calc(var(--angle) - 1deg));}75%{transform:translate(-50%,-50%) rotate(calc(var(--angle) + 3deg));}}
            @keyframes lr-gentle-pulse{0%{opacity:calc(var(--intensity)*0.6);transform:translate(-50%,-50%) scale(0.95);}100%{opacity:calc(var(--intensity)*0.9);transform:translate(-50%,-50%) scale(1.05);}}
            @keyframes lr-central-glow-pulse{0%{opacity:calc(var(--intensity)*0.8);transform:scale(0.9);}100%{opacity:calc(var(--intensity)*1.2);transform:scale(1.1);}}
        \`;
        document.head.appendChild(style);
    }
    
    generateRays() {
        this.rayContainer.innerHTML = '';
        this.createStyleSheet();
        
        const ambient = document.createElement('div');
        ambient.className = 'light-rays-ambient';
        this.rayContainer.appendChild(ambient);
        
        this.generateRayLayer(1, this.config.rayCount, 0, 1, 1.5, 1, 1);
        this.generateRayLayer(2, Math.floor(this.config.rayCount * 0.7), 15, 0.8, 1.2, 0.9, 0.8);
        
        const central = document.createElement('div');
        central.className = 'light-rays-central';
        this.rayContainer.appendChild(central);
    }
    
    generateRayLayer(layer, count, angleOffset, sizeMultiplier, softMultiplier, heightMultiplier, opacityMultiplier) {
        for (let i = 0; i < count; i++) {
            const angle = (360 / count) * i + angleOffset;
            const delay = i * (layer === 1 ? 0.1 : 0.15) + (layer === 2 ? 0.5 : 0);
            const baseOpacity = (0.3 + (Math.random() * 0.4)) * opacityMultiplier;
            this.createRay({ angle, delay, opacity: baseOpacity, layer });
        }
    }
    
    createRay({ angle, delay, opacity, layer }) {
        const ray = document.createElement('div');
        ray.className = \`light-rays-ray layer\${layer}\`;
        ray.style.setProperty('--angle', angle + 'deg');
        ray.style.setProperty('--delay', delay + 's');
        ray.style.setProperty('--opacity', opacity.toString());
        this.rayContainer.appendChild(ray);
    }
}

// Initialize the widget
new LightRaysEngine('#light-rays-widget', ${configJson});
</script>`;
    }

    createReactWidgetCode() {
        const configJson = JSON.stringify(this.config, null, 2);
        
        return `// Light Rays React Component
import React, { useEffect, useRef } from 'react';

const LightRays = ({ config = ${configJson} }) => {
  const containerRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    // Light Rays Engine Class
    class LightRaysEngine {
      constructor(container, config = {}) {
        this.container = container;
        this.config = {
          color: '#2fc125', intensity: 0.8, rayCount: 30, rayWidth: 240, rayHeight: 180,
          lightX: 100, lightY: -5, animationSpeed1: 3.0, animationSpeed2: 3.0,
          animated: true, blurEnabled: true, ...config
        };
        this.init();
      }
      
      init() {
        this.createRayContainer();
        this.generateRays();
      }
      
      createRayContainer() {
        if (this.rayContainer) this.rayContainer.remove();
        this.rayContainer = document.createElement('div');
        this.rayContainer.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;pointer-events:none;z-index:1;';
        this.container.style.position = 'relative';
        this.container.appendChild(this.rayContainer);
        this.applyCSSVariables();
      }
      
      applyCSSVariables() {
        const rgb = this.hexToRgb(this.config.color);
        const vars = [
          ['--primary-color', this.config.color],
          ['--ray-r', rgb.r], ['--ray-g', rgb.g], ['--ray-b', rgb.b],
          ['--intensity', this.config.intensity],
          ['--light-x', this.config.lightX + '%'], ['--light-y', this.config.lightY + '%'],
          ['--ray-width', this.config.rayWidth + 'px'], ['--ray-height', this.config.rayHeight + 'vh'],
          ['--animation-speed1', this.config.animationSpeed1], ['--animation-speed2', this.config.animationSpeed2]
        ];
        vars.forEach(([prop, val]) => this.rayContainer.style.setProperty(prop, val.toString()));
      }
      
      hexToRgb(hex) {
        const result = /^#?([a-f\\\\d]{2})([a-f\\\\d]{2})([a-f\\\\d]{2})$/i.exec(hex);
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 47, g: 193, b: 37 };
      }
      
      createStyleSheet() {
        if (document.getElementById('lr-styles-react')) return;
        const style = document.createElement('style');
        style.id = 'lr-styles-react';
        style.textContent = \`
          .lr-ambient{position:absolute;top:var(--light-y);left:var(--light-x);width:200%;height:200%;background:conic-gradient(from 225deg at center,transparent 0deg,rgba(var(--ray-r),var(--ray-g),var(--ray-b),calc(var(--intensity)*0.3)) 45deg,rgba(var(--ray-r),var(--ray-g),var(--ray-b),calc(var(--intensity)*0.1)) 90deg,transparent 135deg);transform:translate(-50%,-50%);opacity:var(--intensity);\${this.config.animated?'animation:lr-pulse calc(4s/var(--animation-speed1)) ease-in-out infinite alternate;':''}filter:blur(\${this.config.blurEnabled?'60px':'20px'});}
          .lr-ray{position:absolute;top:var(--light-y);left:var(--light-x);width:var(--ray-width);height:var(--ray-height);transform-origin:50% 0%;transform:translate(-50%,-50%) rotate(var(--angle));opacity:var(--opacity);\${this.config.blurEnabled?'background:radial-gradient(ellipse calc(var(--ray-width)/2) var(--ray-height) at center 0%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),1) 0%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.9) 8%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.7) 20%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.5) 35%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.3) 50%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.2) 65%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.1) 80%,transparent 100%);filter:blur(calc(var(--ray-width)/12)) saturate(1.2);':'background:linear-gradient(to bottom,rgba(var(--ray-r),var(--ray-g),var(--ray-b),1) 0%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.9) 15%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.6) 30%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.4) 50%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.2) 70%,transparent 100%);clip-path:polygon(45% 0%,55% 0%,100% 100%,0% 100%);'}}
          .lr-ray.l1{\${this.config.animated?'animation:lr-shimmer calc(3s/var(--animation-speed1)) ease-in-out infinite alternate,lr-sway calc(8s/var(--animation-speed1)) ease-in-out infinite;':''}animation-delay:var(--delay);}
          .lr-ray.l2{\${this.config.animated?'animation:lr-shimmer2 calc(4s/var(--animation-speed2)) ease-in-out infinite alternate,lr-sway2 calc(10s/var(--animation-speed2)) ease-in-out infinite;':''}animation-delay:calc(var(--delay) + 1.5s);}
          .lr-central{position:absolute;top:calc(var(--light-y) - 100px);left:calc(var(--light-x) - 100px);width:200px;height:200px;background:radial-gradient(circle,rgba(var(--ray-r),var(--ray-g),var(--ray-b),1) 0%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.8) 20%,rgba(var(--ray-r),var(--ray-g),var(--ray-b),0.4) 40%,transparent 70%);border-radius:50%;opacity:calc(var(--intensity)*0.8);\${this.config.animated?'animation:lr-glow 3s ease-in-out infinite alternate;':''}filter:blur(\${this.config.blurEnabled?'30px':'10px'});}
          @keyframes lr-shimmer{0%{opacity:var(--opacity);transform:translate(-50%,-50%) rotate(var(--angle)) scaleY(1);}100%{opacity:calc(var(--opacity)*1.5);transform:translate(-50%,-50%) rotate(var(--angle)) scaleY(1.1);}}
          @keyframes lr-sway{0%,100%{transform:translate(-50%,-50%) rotate(var(--angle));}50%{transform:translate(-50%,-50%) rotate(calc(var(--angle) + 2deg));}}
          @keyframes lr-shimmer2{0%{opacity:calc(var(--opacity)*0.8);transform:translate(-50%,-50%) rotate(var(--angle)) scaleY(0.9) translateX(2px);}100%{opacity:calc(var(--opacity)*1.3);transform:translate(-50%,-50%) rotate(var(--angle)) scaleY(1.15) translateX(-2px);}}
          @keyframes lr-sway2{0%,100%{transform:translate(-50%,-50%) rotate(calc(var(--angle) + 1deg));}25%{transform:translate(-50%,-50%) rotate(calc(var(--angle) - 1deg));}75%{transform:translate(-50%,-50%) rotate(calc(var(--angle) + 3deg));}}
          @keyframes lr-pulse{0%{opacity:calc(var(--intensity)*0.6);transform:translate(-50%,-50%) scale(0.95);}100%{opacity:calc(var(--intensity)*0.9);transform:translate(-50%,-50%) scale(1.05);}}
          @keyframes lr-glow{0%{opacity:calc(var(--intensity)*0.8);transform:scale(0.9);}100%{opacity:calc(var(--intensity)*1.2);transform:scale(1.1);}}
        \`;
        document.head.appendChild(style);
      }
      
      generateRays() {
        this.rayContainer.innerHTML = '';
        this.createStyleSheet();
        
        const ambient = document.createElement('div');
        ambient.className = 'lr-ambient';
        this.rayContainer.appendChild(ambient);
        
        this.generateRayLayer(1, this.config.rayCount, 0);
        this.generateRayLayer(2, Math.floor(this.config.rayCount * 0.7), 15);
        
        const central = document.createElement('div');
        central.className = 'lr-central';
        this.rayContainer.appendChild(central);
      }
      
      generateRayLayer(layer, count, angleOffset) {
        for (let i = 0; i < count; i++) {
          const angle = (360 / count) * i + angleOffset;
          const delay = i * (layer === 1 ? 0.1 : 0.15) + (layer === 2 ? 0.5 : 0);
          const baseOpacity = (0.3 + (Math.random() * 0.4)) * (layer === 1 ? 1 : 0.8);
          this.createRay({ angle, delay, opacity: baseOpacity, layer });
        }
      }
      
      createRay({ angle, delay, opacity, layer }) {
        const ray = document.createElement('div');
        ray.className = \`lr-ray l\${layer}\`;
        ray.style.setProperty('--angle', angle + 'deg');
        ray.style.setProperty('--delay', delay + 's');
        ray.style.setProperty('--opacity', opacity.toString());
        this.rayContainer.appendChild(ray);
      }
      
      destroy() {
        if (this.rayContainer) this.rayContainer.remove();
      }
    }

    // Initialize the engine
    if (containerRef.current && !engineRef.current) {
      engineRef.current = new LightRaysEngine(containerRef.current, config);
    }

    // Cleanup on unmount
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, [config]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#000',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    />
  );
};

export default LightRays;

// Usage Example:
// import LightRays from './LightRays';
//
// function App() {
//   return (
//     <div>
//       <LightRays />
//       {/* Your other components */}
//     </div>
//   );
// }`;
    }


    showEmbedOutput(title, code) {
        const embedOutput = document.getElementById('embed-output');
        const outputTitle = document.getElementById('output-title');
        const codeOutput = document.getElementById('code-output');

        outputTitle.textContent = title;
        codeOutput.textContent = code;
        embedOutput.style.display = 'block';

        // Smooth scroll to output
        embedOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    createEmbedPreview(code, type) {
        const previewOutput = document.getElementById('preview-output');
        previewOutput.innerHTML = `
            <h4>Live Preview:</h4>
            <div class="embed-preview-container" id="embed-preview"></div>
        `;

        const previewContainer = document.getElementById('embed-preview');
        
        if (type === 'javascript') {
            // Create a sandboxed preview
            previewContainer.innerHTML = '<div id="preview-widget" style="width: 100%; height: 200px; position: relative; background: #000; border-radius: 8px; overflow: hidden;"></div>';
            
            // Initialize preview widget
            setTimeout(() => {
                try {
                    new LightRaysEngine('#preview-widget', this.config);
                } catch (error) {
                    console.error('Preview error:', error);
                    previewContainer.innerHTML = `<p style="color: var(--text-secondary); font-size: 0.9rem;">Preview: Light rays will appear when embedded</p>`;
                }
            }, 100);
        } else if (type === 'react') {
            // For React widget, show a simple preview indication
            previewContainer.innerHTML = `<p style="color: var(--text-secondary); font-size: 0.9rem; font-style: italic;">Copy and use the React component code above in your project</p>`;
        }
    }

    copyToClipboard() {
        const codeOutput = document.getElementById('code-output');
        const copyBtn = document.getElementById('copy-btn');
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(codeOutput.textContent)
                .then(() => {
                    this.showCopySuccess(copyBtn);
                })
                .catch(err => {
                    console.error('Copy failed:', err);
                    this.fallbackCopy(codeOutput.textContent, copyBtn);
                });
        } else {
            this.fallbackCopy(codeOutput.textContent, copyBtn);
        }
    }

    fallbackCopy(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopySuccess(button);
        } catch (err) {
            console.error('Fallback copy failed:', err);
            this.showNotification('Copy failed. Please select and copy manually.');
        }
        
        document.body.removeChild(textArea);
    }

    showCopySuccess(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
        `;
        button.classList.add('success');
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('success');
        }, 2000);
    }


    showNotification(message) {
        // Simple notification system
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-glass);
            border: 1px solid var(--accent-primary);
            border-radius: var(--radius-md);
            padding: var(--space-md);
            color: var(--text-primary);
            backdrop-filter: blur(10px);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
        
        // Add animation styles if not exists
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    initDragFunctionality() {
        const draggableElements = document.querySelectorAll('.draggable');
        
        draggableElements.forEach(element => {
            const dragHandle = element.querySelector('.drag-handle');
            if (!dragHandle) return;

            let isDragging = false;
            let currentX = 0;
            let currentY = 0;
            let initialX = 0;
            let initialY = 0;

            const dragStart = (e) => {
                // Prevent dragging when clicking on buttons or inputs
                if (e.target.closest('button') || e.target.closest('input') || e.target.closest('label')) {
                    return;
                }

                if (e.type === 'touchstart') {
                    initialX = e.touches[0].clientX - currentX;
                    initialY = e.touches[0].clientY - currentY;
                } else {
                    initialX = e.clientX - currentX;
                    initialY = e.clientY - currentY;
                }

                if (e.target === dragHandle || dragHandle.contains(e.target)) {
                    isDragging = true;
                    element.classList.add('dragging');
                    
                    // Prevent text selection during drag
                    document.body.style.userSelect = 'none';
                    
                    e.preventDefault();
                }
            };

            const dragEnd = () => {
                if (isDragging) {
                    isDragging = false;
                    element.classList.remove('dragging');
                    document.body.style.userSelect = '';
                    
                    // Store position for next time
                    element.style.transform = `translate(${currentX}px, ${currentY}px)`;
                }
            };

            const drag = (e) => {
                if (isDragging) {
                    e.preventDefault();
                    
                    let clientX, clientY;
                    if (e.type === 'touchmove') {
                        clientX = e.touches[0].clientX;
                        clientY = e.touches[0].clientY;
                    } else {
                        clientX = e.clientX;
                        clientY = e.clientY;
                    }

                    currentX = clientX - initialX;
                    currentY = clientY - initialY;

                    // Constrain to viewport
                    const rect = element.getBoundingClientRect();
                    const maxX = window.innerWidth - rect.width;
                    const maxY = window.innerHeight - rect.height;
                    
                    currentX = Math.max(-rect.left, Math.min(currentX, maxX - rect.left));
                    currentY = Math.max(-rect.top, Math.min(currentY, maxY - rect.top));

                    element.style.transform = `translate(${currentX}px, ${currentY}px)`;
                }
            };

            // Mouse events
            dragHandle.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);

            // Touch events for mobile
            dragHandle.addEventListener('touchstart', dragStart, { passive: false });
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('touchend', dragEnd);

            // Prevent default drag behavior on images/elements
            dragHandle.addEventListener('dragstart', (e) => e.preventDefault());
        });
    }
}

// Initialize the app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new LightRaysApp();
    });
} else {
    new LightRaysApp();
}