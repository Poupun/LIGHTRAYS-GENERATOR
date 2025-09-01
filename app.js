/**
 * Light Rays Generator App
 * Modern, clean interface for creating and embedding light ray effects
 */

class LightRaysApp {
    constructor() {
        this.lightRaysInstance = null;
        this.activePreset = null;
        this.prePresetConfig = null;
        this.config = {
            color: '#00ddff',
            intensity: 0.8,
            rayCount: 30,
            raySpread: 360,
            rayWidth: 240,
            rayHeight: 180,
            lightX: 100,
            lightY: -5,
            animationSpeed1: 3.0,
            animationSpeed2: 3.0,
            animated: true,
            blurEnabled: true,
            blurIntensity: 1.0,
            backgroundEnabled: false,
            backgroundColor: '#000000'
        };

        this.presets = {
            'ticket-hub': {
                color: '#a9ffa3',
                intensity: 0.4,
                rayCount: 60,
                raySpread: 360,
                rayWidth: 240,
                rayHeight: 160,
                lightX: 80,
                lightY: -10,
                animationSpeed1: 3.0,
                animationSpeed2: 3.0,
                animated: true,
                blurEnabled: true,
                blurIntensity: 0.7,
                backgroundEnabled: false,
                backgroundColor: '#000000'
            },
            'jelly-creative': {
                color: '#ffffff',
                intensity: 0.7,
                rayCount: 59,
                raySpread: 360,
                rayWidth: 200,
                rayHeight: 180,
                lightX: 50,
                lightY: -35,
                animationSpeed1: 1.9,
                animationSpeed2: 2.8,
                animated: true,
                blurEnabled: true,
                blurIntensity: 2.1,
                backgroundEnabled: false,
                backgroundColor: '#0f172a'
            }
        };
        
        this.init();
    }

    init() {
        this.loadConfigFromURL();
        this.bindEvents();
        this.initDragFunctionality();
        this.createLightRays();
        this.updateAnimationControls();
        this.updateBackgroundControls();
        this.updateBlurControls();
        this.updateJavaScriptButtonColor(this.config.color);
        this.updateAppColorScheme(this.config.color);
        this.updatePreviewBackground();
        this.initMobileView();
        this.updateAllValueDisplays();
    }

    loadConfigFromURL() {
        const params = new URLSearchParams(window.location.search);
        const urlConfig = {};

        // Parse URL parameters
        for (const [key, value] of params.entries()) {
            if (this.config.hasOwnProperty(key)) {
                if (key === 'color' || key === 'backgroundColor') {
                    // Add # back to color values
                    urlConfig[key] = value.startsWith('#') ? value : `#${value}`;
                } else if (key === 'animated' || key === 'blurEnabled' || key === 'backgroundEnabled') {
                    // Convert string booleans
                    urlConfig[key] = value === 'true';
                } else if (typeof this.config[key] === 'number') {
                    // Convert strings to numbers
                    urlConfig[key] = parseFloat(value);
                } else {
                    urlConfig[key] = value;
                }
            }
        }

        // Apply URL configuration
        if (Object.keys(urlConfig).length > 0) {
            this.config = { ...this.config, ...urlConfig };
            this.updateUIFromConfig();
        }
    }

    updateUIFromConfig() {
        // Update all UI controls to match current config
        Object.entries(this.config).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (!element) return;

            if (element.type === 'range' || element.type === 'color') {
                element.value = value;
                if (key === 'color') {
                    document.querySelector('.color-value').textContent = value;
                } else if (key === 'backgroundColor') {
                    document.getElementById('background-color-value').textContent = value;
                }
            } else if (element.type === 'checkbox') {
                element.checked = value;
            }
        });
    }

    updateAllValueDisplays() {
        // Update all value displays
        const rangeInputs = [
            'intensity', 'rayCount', 'raySpread', 'rayWidth', 'rayHeight', 
            'lightX', 'lightY', 'animationSpeed1', 'animationSpeed2', 'blurIntensity'
        ];
        
        rangeInputs.forEach(key => {
            this.updateValueDisplay(key, this.config[key]);
        });
    }

    bindEvents() {
        // Color input
        const colorInput = document.getElementById('color');
        colorInput.addEventListener('input', (e) => {
            this.updateConfig({ color: e.target.value });
            document.querySelector('.color-value').textContent = e.target.value;
            this.updateJavaScriptButtonColor(e.target.value);
            this.updateAppColorScheme(e.target.value);
        });

        // Background color input
        const backgroundColorInput = document.getElementById('backgroundColor');
        backgroundColorInput.addEventListener('input', (e) => {
            this.updateConfig({ backgroundColor: e.target.value });
            document.getElementById('background-color-value').textContent = e.target.value;
            this.updatePreviewBackground();
        });

        // Range inputs
        const rangeInputs = [
            'intensity', 'rayCount', 'raySpread', 'rayWidth', 'rayHeight', 
            'lightX', 'lightY', 'animationSpeed1', 'animationSpeed2', 'blurIntensity'
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
        const toggleInputs = ['animated', 'blurEnabled', 'backgroundEnabled'];
        toggleInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('change', (e) => {
                    this.updateConfig({ [id]: e.target.checked });
                    if (id === 'animated') {
                        this.updateAnimationControls();
                    } else if (id === 'backgroundEnabled') {
                        this.updateBackgroundControls();
                        this.updatePreviewBackground();
                    } else if (id === 'blurEnabled') {
                        this.updateBlurControls();
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

        // Config link button
        document.getElementById('copy-config-link-btn').addEventListener('click', () => {
            this.copyConfigurationLink();
        });

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(button => {
            if (!button.disabled) {
                button.addEventListener('click', () => {
                    const presetName = button.getAttribute('data-preset');
                    this.applyPreset(presetName);
                });
            }
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
        
        // Clear active preset when user manually changes settings
        if (this.activePreset) {
            this.activePreset = null;
            this.prePresetConfig = null;
            document.querySelectorAll('.preset-btn').forEach(btn => {
                btn.classList.remove('active');
            });
        }
        
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
            case 'raySpread':
                displayValue = `${value}°`;
                break;
            case 'lightX':
            case 'lightY':
                displayValue = `${value}%`;
                break;
            case 'animationSpeed1':
            case 'animationSpeed2':
            case 'blurIntensity':
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

    updateBackgroundControls() {
        const backgroundColorControl = document.getElementById('background-color-control');
        const isBackgroundEnabled = this.config.backgroundEnabled;

        if (backgroundColorControl) {
            backgroundColorControl.style.opacity = isBackgroundEnabled ? '1' : '0.5';
            backgroundColorControl.style.pointerEvents = isBackgroundEnabled ? 'auto' : 'none';
        }
    }

    updateBlurControls() {
        const blurIntensityControl = document.getElementById('blur-intensity-control');
        const isBlurEnabled = this.config.blurEnabled;

        if (blurIntensityControl) {
            blurIntensityControl.style.opacity = isBlurEnabled ? '1' : '0.5';
            blurIntensityControl.style.pointerEvents = isBlurEnabled ? 'auto' : 'none';
        }
    }

    updatePreviewBackground() {
        const previewContainer = document.getElementById('preview-container');
        if (previewContainer) {
            if (this.config.backgroundEnabled) {
                previewContainer.style.backgroundColor = this.config.backgroundColor;
            } else {
                previewContainer.style.backgroundColor = 'transparent';
            }
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
            color: '#00ddff',
            intensity: 0.8,
            rayCount: 30,
            raySpread: 360,
            rayWidth: 240,
            rayHeight: 180,
            lightX: 100,
            lightY: -5,
            animationSpeed1: 3.0,
            animationSpeed2: 3.0,
            animated: true,
            blurEnabled: true,
            blurIntensity: 1.0,
            backgroundEnabled: false,
            backgroundColor: '#000000'
        };

        this.config = { ...defaultConfig };

        // Clear active preset
        this.activePreset = null;
        this.prePresetConfig = null;
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Update all UI controls
        Object.entries(defaultConfig).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (!element) return;

            if (element.type === 'range' || element.type === 'color') {
                element.value = value;
                if (key === 'color') {
                    document.querySelector('.color-value').textContent = value;
                } else if (key === 'backgroundColor') {
                    document.getElementById('background-color-value').textContent = value;
                } else {
                    this.updateValueDisplay(key, value);
                }
            } else if (element.type === 'checkbox') {
                element.checked = value;
            }
        });

        this.createLightRays();
        this.updateAnimationControls();
        this.updateBackgroundControls();
        this.updateBlurControls();
        this.updateJavaScriptButtonColor(defaultConfig.color);
        this.updatePreviewBackground();
        this.showNotification('Reset to default settings');
    }

    applyPreset(presetName) {
        const preset = this.presets[presetName];
        if (!preset) return;

        const activeBtn = document.querySelector(`[data-preset="${presetName}"]`);
        
        // Check if this preset is already active (toggle off)
        if (this.activePreset === presetName) {
            // Revert to pre-preset configuration
            if (this.prePresetConfig) {
                this.config = { ...this.prePresetConfig };
                this.updateUIFromConfig();
                this.createLightRays();
                this.updateAnimationControls();
                this.updateBackgroundControls();
                this.updateBlurControls();
                this.updateJavaScriptButtonColor(this.config.color);
                this.updateAppColorScheme(this.config.color);
                this.updatePreviewBackground();
                this.updateAllValueDisplays();
            }
            
            // Clear active states
            this.activePreset = null;
            this.prePresetConfig = null;
            document.querySelectorAll('.preset-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            this.showNotification(`Reverted "${presetName.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}" preset`);
            return;
        }

        // Store current config before applying preset (only if no preset is currently active)
        if (!this.activePreset) {
            this.prePresetConfig = { ...this.config };
        }

        // Update active preset button
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Set active preset
        this.activePreset = presetName;

        // Apply preset configuration
        this.config = { ...this.config, ...preset };

        // Update all UI controls
        Object.entries(preset).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (!element) return;

            if (element.type === 'range' || element.type === 'color') {
                element.value = value;
                if (key === 'color') {
                    document.querySelector('.color-value').textContent = value;
                    this.updateJavaScriptButtonColor(value);
                    this.updateAppColorScheme(value);
                } else if (key === 'backgroundColor') {
                    document.getElementById('background-color-value').textContent = value;
                } else {
                    this.updateValueDisplay(key, value);
                }
            } else if (element.type === 'checkbox') {
                element.checked = value;
                if (key === 'animated') {
                    this.updateAnimationControls();
                } else if (key === 'backgroundEnabled') {
                    this.updateBackgroundControls();
                    this.updatePreviewBackground();
                } else if (key === 'blurEnabled') {
                    this.updateBlurControls();
                }
            }
        });

        this.createLightRays();
        this.showNotification(`Applied "${presetName.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}" preset`);
    }

    copyConfigurationLink() {
        const currentUrl = window.location.origin + window.location.pathname;
        const params = new URLSearchParams();
        
        // Add all config parameters to URL
        Object.entries(this.config).forEach(([key, value]) => {
            if ((key === 'color' || key === 'backgroundColor') && value.startsWith('#')) {
                params.append(key, value.substring(1)); // Remove # for URL
            } else {
                params.append(key, value.toString());
            }
        });
        
        const configUrl = `${currentUrl}?${params.toString()}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(configUrl).then(() => {
                this.showCopySuccessForConfigLink();
            }).catch(err => {
                console.error('Copy failed:', err);
                this.fallbackCopyConfigLink(configUrl);
            });
        } else {
            this.fallbackCopyConfigLink(configUrl);
        }
    }

    showCopySuccessForConfigLink() {
        const button = document.getElementById('copy-config-link-btn');
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Link Copied!
        `;
        button.classList.add('success');
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('success');
        }, 2000);
    }

    fallbackCopyConfigLink(text) {
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
            this.showCopySuccessForConfigLink();
        } catch (err) {
            console.error('Fallback copy failed:', err);
            this.showNotification('Copy failed. Please select and copy manually.');
        }
        
        document.body.removeChild(textArea);
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

    initMobileView() {
        // Detect if device is actually a mobile device
        const isMobile = this.isMobileDevice();
        
        if (isMobile) {
            // Minimize both panels on mobile
            const controlsPanel = document.getElementById('controls-panel');
            const embedPanel = document.getElementById('embed-panel');
            
            // Add collapsed class to both panels
            controlsPanel.classList.add('collapsed');
            embedPanel.classList.add('collapsed');
            
            // Update the toggle buttons to show expand icons
            const controlsButton = document.getElementById('toggle-controls');
            const embedButton = document.getElementById('toggle-embed');
            
            const controlsIcon = controlsButton.querySelector('svg');
            const embedIcon = embedButton.querySelector('svg');
            
            // Set expand icons
            controlsIcon.innerHTML = '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>';
            embedIcon.innerHTML = '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>';
            
            // Update button titles
            controlsButton.title = 'Expand Controls';
            embedButton.title = 'Expand Embed Panel';
        }
    }

    isMobileDevice() {
        // Check user agent for mobile devices
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // Check for mobile user agents
        const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
        
        // Also check for touch capability and small screen
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth <= 768;
        
        return mobileRegex.test(userAgent) || (hasTouch && isSmallScreen);
    }

    generateJavaScriptEmbed() {
        const embedCode = this.createJavaScriptEmbedCode();
        this.showEmbedOutput('Iframe Embed Code', embedCode);
        this.animateEmbedOutput();
    }

    generateReactWidget() {
        const embedCode = this.createReactWidgetCode();
        this.showEmbedOutput('React Iframe Component', embedCode);
        this.animateEmbedOutput();
    }

    animateEmbedOutput() {
        // Animate the embed output appearing
        const embedOutput = document.getElementById('embed-output');
        if (embedOutput && embedOutput.style.display !== 'none') {
            embedOutput.classList.add('slide-in');
            setTimeout(() => {
                embedOutput.classList.remove('slide-in');
            }, 800);
        }
    }

    updateAppColorScheme(hexColor) {
        // Convert hex to RGB
        const rgb = this.hexToRgb(hexColor);
        if (!rgb) return;

        // Create nuanced color variations
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        // Primary: Use original color
        const primary = hexColor;
        
        // Secondary: Shift hue by 30 degrees and adjust saturation
        const secondaryHsl = {
            h: (hsl.h + 30) % 360,
            s: Math.min(100, hsl.s * 1.2),
            l: Math.max(30, Math.min(70, hsl.l))
        };
        const secondary = this.hslToHex(secondaryHsl.h, secondaryHsl.s, secondaryHsl.l);
        
        // Muted: Desaturate and darken
        const mutedHsl = {
            h: hsl.h,
            s: Math.max(20, hsl.s * 0.4),
            l: Math.max(25, Math.min(45, hsl.l * 0.7))
        };
        const muted = this.hslToHex(mutedHsl.h, mutedHsl.s, mutedHsl.l);
        
        // Gradient colors: Primary to Secondary
        const gradientStart = primary;
        const gradientEnd = secondary;

        // Update CSS custom properties
        const root = document.documentElement;
        root.style.setProperty('--dynamic-primary', primary);
        root.style.setProperty('--dynamic-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
        root.style.setProperty('--dynamic-secondary', secondary);
        root.style.setProperty('--dynamic-muted', muted);
        root.style.setProperty('--dynamic-gradient-start', gradientStart);
        root.style.setProperty('--dynamic-gradient-end', gradientEnd);
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;

        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        let r, g, b;
        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        const toHex = (c) => {
            const hex = Math.round(c * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    generateEmbedUrl() {
        // Get the current host and path for the embed URL
        const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '') + 'embed.html';
        const params = new URLSearchParams();
        
        // Add config parameters to URL
        Object.entries(this.config).forEach(([key, value]) => {
            if ((key === 'color' || key === 'backgroundColor') && value.startsWith('#')) {
                params.append(key, value.substring(1)); // Remove # for URL
            } else {
                params.append(key, value.toString());
            }
        });
        
        return `${baseUrl}?${params.toString()}`;
    }

    createJavaScriptEmbedCode() {
        const embedUrl = this.generateEmbedUrl();
        
        return `<!-- Light Rays Embed -->
<iframe 
    src="${embedUrl}" 
    style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; border: none; z-index: 9999;"
    frameborder="0"
    allowfullscreen>
</iframe>`;
    }

    createReactWidgetCode() {
        const embedUrl = this.generateEmbedUrl();
        
        return `// Light Rays React Component - Iframe Version
import React from 'react';

const LightRays = ({ 
  style = {}, 
  width = '100%', 
  height = '400px',
  customEmbedUrl = null 
}) => {
  const embedSrc = customEmbedUrl || '${embedUrl}';
  
  const defaultStyle = {
    position: 'relative',
    width: width,
    height: height,
    overflow: 'hidden',
    ...style
  };

  return (
    <div style={defaultStyle}>
      <iframe 
        src={embedSrc}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none'
        }}
        frameBorder="0"
        title="Light Rays"
      />
    </div>
  );
};

// Full Screen Overlay Component
export const LightRaysFullScreen = ({ customEmbedUrl = null }) => {
  const embedSrc = customEmbedUrl || '${embedUrl}';
  
  return (
    <iframe 
      src={embedSrc}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        border: 'none',
        zIndex: 9999
      }}
      frameBorder="0"
      allowFullScreen
      title="Light Rays Full Screen"
    />
  );
};

export default LightRays;

// Usage Examples:
//
// Basic usage:
// import LightRays from './LightRays';
// <LightRays width="800px" height="600px" />
//
// Full screen overlay:
// import { LightRaysFullScreen } from './LightRays';
// <LightRaysFullScreen />
//
// With custom embed URL (different config):
// <LightRays customEmbedUrl="https://your-domain.com/embed.html?color=ff0000&intensity=0.9" />`;
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

                    // No viewport constraints - allow dragging outside screen
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