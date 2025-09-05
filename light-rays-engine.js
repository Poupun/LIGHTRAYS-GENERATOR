/**
 * LightRays Engine - Clean, Modular Light Ray Component
 * Creates beautiful light ray effects with configurable parameters
 */

class LightRaysEngine {
    constructor(container, config = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        if (!this.container) {
            throw new Error('Container element not found');
        }

        // Default configuration
        this.config = {
            color: '#2fc125',
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
            ambientStrength: 1.0,
            ...config
        };

        this.rayContainer = null;
        this.isInitialized = false;
        this.animationFrameId = null;
        
        this.init();
    }

    init() {
        this.createRayContainer();
        this.generateRays();
        this.isInitialized = true;
    }

    createRayContainer() {
        // Remove existing container if present
        if (this.rayContainer) {
            this.rayContainer.remove();
        }

        this.rayContainer = document.createElement('div');
        this.rayContainer.className = 'light-rays-container';
        this.rayContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
            z-index: 1;
        `;

        this.container.style.position = 'relative';
        this.container.appendChild(this.rayContainer);
        this.applyCSSVariables();
    }

    applyCSSVariables() {
        const rgb = this.hexToRgb(this.config.color);
        
        this.rayContainer.style.setProperty('--primary-color', this.config.color);
        this.rayContainer.style.setProperty('--ray-r', rgb.r.toString());
        this.rayContainer.style.setProperty('--ray-g', rgb.g.toString());
        this.rayContainer.style.setProperty('--ray-b', rgb.b.toString());
        this.rayContainer.style.setProperty('--intensity', this.config.intensity.toString());
    // Ambient gradient strengths scale with intensity and user ambientStrength
    const ambS = Math.max(0, parseFloat(this.config.ambientStrength ?? 1.0));
    const ambientAlphaTop = Math.max(0, Math.min(0.6, (0.36 * this.config.intensity) * ambS));
    const ambientAlphaMid = Math.max(0, Math.min(0.4, (0.20 * this.config.intensity) * ambS));
    this.rayContainer.style.setProperty('--ambient-alpha-top', ambientAlphaTop.toString());
    this.rayContainer.style.setProperty('--ambient-alpha-mid', ambientAlphaMid.toString());
        this.rayContainer.style.setProperty('--light-x', this.config.lightX + '%');
        this.rayContainer.style.setProperty('--light-y', this.config.lightY + '%');
        this.rayContainer.style.setProperty('--ray-width', this.config.rayWidth + 'px');
        this.rayContainer.style.setProperty('--ray-height', this.config.rayHeight + 'vh');
        this.rayContainer.style.setProperty('--animation-speed1', this.config.animationSpeed1.toString());
        this.rayContainer.style.setProperty('--animation-speed2', this.config.animationSpeed2.toString());
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 255, b: 127 };
    }

    createStyleSheet() {
        const styleId = 'light-rays-styles';
        let style = document.getElementById(styleId);
        
        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            document.head.appendChild(style);
        }

        style.textContent = `
            .light-rays-container {
                --primary-color: ${this.config.color};
                --ray-r: ${this.hexToRgb(this.config.color).r};
                --ray-g: ${this.hexToRgb(this.config.color).g};
                --ray-b: ${this.hexToRgb(this.config.color).b};
                --intensity: ${this.config.intensity};
                --ambient-alpha-top: ${Math.max(0, Math.min(0.6, (0.36 * this.config.intensity) * Math.max(0, parseFloat(this.config.ambientStrength ?? 1.0))))};
                --ambient-alpha-mid: ${Math.max(0, Math.min(0.4, (0.20 * this.config.intensity) * Math.max(0, parseFloat(this.config.ambientStrength ?? 1.0))))};
                --light-x: ${this.config.lightX}%;
                --light-y: ${this.config.lightY}%;
                --ray-width: ${this.config.rayWidth}px;
                --ray-height: ${this.config.rayHeight}vh;
                --animation-speed1: ${this.config.animationSpeed1};
                --animation-speed2: ${this.config.animationSpeed2};
            }

            /* Subtle ambient gradient wash from top to bottom in ray color */
            .light-rays-ambient {
                position: absolute;
                inset: 0;
                pointer-events: none;
                z-index: 0;
                background: linear-gradient(
                    to bottom,
                    rgba(var(--ray-r), var(--ray-g), var(--ray-b), var(--ambient-alpha-top)) 0%,
                    rgba(var(--ray-r), var(--ray-g), var(--ray-b), var(--ambient-alpha-mid)) 25%,
                    rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0) 80%
                );
            }


            .light-rays-ray {
                position: absolute;
                top: var(--light-y);
                left: var(--light-x);
                width: var(--ray-width);
                height: var(--ray-height);
                transform-origin: 50% 0%;
                transform: translate(-50%, -50%) rotate(var(--angle));
                opacity: calc(var(--opacity) * var(--intensity));
                ${this.config.blurEnabled ? `
                    background: radial-gradient(
                        ellipse calc(var(--ray-width) / 2) var(--ray-height) at center 0%,
                        rgba(var(--ray-r), var(--ray-g), var(--ray-b), 1) 0%,
                        rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.9) 8%,
                        rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.7) 20%,
                        rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.5) 35%,
                        rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.3) 50%,
                        rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.2) 65%,
                        rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.1) 80%,
                        transparent 100%
                    );
                    filter: blur(calc(var(--ray-width) / 12 * ${this.config.blurIntensity})) saturate(1.2);
                ` : `
                    background: linear-gradient(
                        to bottom,
                        rgba(var(--ray-r), var(--ray-g), var(--ray-b), 1) 0%,
                        rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.9) 15%,
                        rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.6) 30%,
                        rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.4) 50%,
                        rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.2) 70%,
                        transparent 100%
                    );
                    clip-path: polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%);
                `}
            }

            .light-rays-ray.layer1 {
                ${this.config.animated ? 'animation: lr-ray-combined calc(var(--shimmer-duration) / var(--animation-speed1)) ease-in-out infinite;' : ''}
                animation-delay: var(--delay);
            }

            .light-rays-ray.layer2 {
                ${this.config.animated ? 'animation: lr-ray-combined-2 calc(var(--shimmer-duration) / var(--animation-speed2)) ease-in-out infinite;' : ''}
                animation-delay: calc(var(--delay) + 1.5s);
            }

            .light-rays-ray-soft {
                position: absolute;
                top: var(--light-y);
                left: var(--light-x);
                width: calc(var(--ray-width) * 0.6);
                height: calc(var(--ray-height) * 0.7);
                transform-origin: 50% 0%;
                transform: translate(-50%, -50%) rotate(var(--angle));
                opacity: calc(var(--opacity) * var(--intensity));
                background: radial-gradient(
                    ellipse calc(var(--ray-width) * 0.6) calc(var(--ray-height) * 0.7) at center 0%,
                    rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.6) 0%,
                    rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.4) 25%,
                    rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.3) 45%,
                    rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.2) 65%,
                    rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.1) 80%,
                    transparent 100%
                );
                filter: blur(calc(var(--ray-width) / 8 * ${this.config.blurIntensity}));
            }

            .light-rays-central {
                position: absolute;
                top: calc(var(--light-y) - 100px);
                left: calc(var(--light-x) - 100px);
                width: 200px;
                height: 200px;
                background: radial-gradient(
                    circle,
                    rgba(var(--ray-r), var(--ray-g), var(--ray-b), 1) 0%,
                    rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.8) 20%,
                    rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.4) 40%,
                    transparent 70%
                );
                border-radius: 50%;
                opacity: calc(var(--intensity) * 0.8);
                ${this.config.animated ? 'animation: lr-central-glow-pulse 6s ease-in-out infinite alternate;' : ''}
                ${this.config.blurEnabled ? `filter: blur(${30 * this.config.blurIntensity}px);` : 'filter: blur(10px);'}
            }

            @keyframes lr-ray-combined {
                0% { 
                    opacity: calc(var(--opacity) * var(--intensity) * 0.8); 
                    transform: translate(-50%, -50%) rotate(var(--angle)) scaleY(0.98); 
                }
                25% {
                    opacity: calc(var(--opacity) * var(--intensity) * 1.0);
                    transform: translate(-50%, -50%) rotate(calc(var(--angle) + var(--sway-angle) * 0.5)) scaleY(1.02);
                }
                50% { 
                    opacity: calc(var(--opacity) * var(--intensity) * 1.1); 
                    transform: translate(-50%, -50%) rotate(calc(var(--angle) + var(--sway-angle))) scaleY(1.05); 
                }
                75% {
                    opacity: calc(var(--opacity) * var(--intensity) * 1.0);
                    transform: translate(-50%, -50%) rotate(calc(var(--angle) + var(--sway-angle) * 0.5)) scaleY(1.02);
                }
                100% { 
                    opacity: calc(var(--opacity) * var(--intensity) * 0.9); 
                    transform: translate(-50%, -50%) rotate(var(--angle)) scaleY(0.99); 
                }
            }

            @keyframes lr-ray-combined-2 {
                0% { 
                    opacity: calc(var(--opacity) * var(--intensity) * 0.7); 
                    transform: translate(-50%, -50%) rotate(calc(var(--angle) - var(--sway-angle) * 0.3)) scaleY(0.96); 
                }
                25% {
                    opacity: calc(var(--opacity) * var(--intensity) * 0.9);
                    transform: translate(-50%, -50%) rotate(calc(var(--angle) + var(--sway-angle) * 0.2)) scaleY(1.02);
                }
                50% { 
                    opacity: calc(var(--opacity) * var(--intensity) * 1.0); 
                    transform: translate(-50%, -50%) rotate(calc(var(--angle) + var(--sway-angle) * 0.7)) scaleY(1.08); 
                }
                75% {
                    opacity: calc(var(--opacity) * var(--intensity) * 0.9);
                    transform: translate(-50%, -50%) rotate(calc(var(--angle) + var(--sway-angle) * 0.2)) scaleY(1.02);
                }
                100% { 
                    opacity: calc(var(--opacity) * var(--intensity) * 0.8); 
                    transform: translate(-50%, -50%) rotate(calc(var(--angle) - var(--sway-angle) * 0.3)) scaleY(1.01); 
                }
            }


            @keyframes lr-central-glow-pulse {
                0% { opacity: calc(var(--intensity) * 0.8); transform: scale(0.9); }
                50% { opacity: calc(var(--intensity) * 1.2); transform: scale(1.1); }
                100% { opacity: calc(var(--intensity) * 0.9); transform: scale(0.95); }
            }
        `;
    }

    generateRays() {
        this.rayContainer.innerHTML = '';
        this.createStyleSheet();

    // Add ambient gradient (no blur, avoids previous artifact issues)
    const ambient = document.createElement('div');
    ambient.className = 'light-rays-ambient';
    this.rayContainer.appendChild(ambient);

        // Generate Layer 1 rays
        this.generateRayLayer(1, this.config.rayCount, 0, 1, 1.5, 1, 1);
        
        // Generate Layer 2 rays
        this.generateRayLayer(2, Math.floor(this.config.rayCount * 0.7), 15, 0.8, 1.2, 0.9, 0.8);

        // Create central glow
        const centralGlow = document.createElement('div');
        centralGlow.className = 'light-rays-central';
        this.rayContainer.appendChild(centralGlow);
    }

    generateRayLayer(layer, count, angleOffset, sizeMultiplier, softMultiplier, heightMultiplier, opacityMultiplier) {
        for (let i = 0; i < count; i++) {
            // Add randomization to angle distribution using raySpread
            const baseAngle = (this.config.raySpread / count) * i + angleOffset;
            const angle = baseAngle + (Math.random() - 0.5) * 4; // Random ±2 degree variation
            
            // Smoother delay patterns
            const baseDelay = i * (layer === 1 ? 0.1 : 0.15) + (layer === 2 ? 0.5 : 0);
            const delay = baseDelay + Math.random() * 0.2; // Less random delay
            
            // More varied opacity with higher minimum
            const baseOpacity = (0.4 + (Math.random() * 0.5)) * opacityMultiplier;
            
            // Subtler size variations
            const sizeVariation = 0.85 + Math.random() * 0.3; // 85-115% size variation
            const heightVariation = 0.9 + Math.random() * 0.2; // 90-110% height variation

            // Main ray
            this.createRay({
                angle, delay, opacity: baseOpacity,
                width: this.config.rayWidth * sizeMultiplier * sizeVariation,
                height: this.config.rayHeight * heightMultiplier * heightVariation,
                layer, type: 'main',
                randomSeed: Math.random() // For unique animation variations
            });

            // Soft ray for blurred effect
            if (this.config.blurEnabled) {
                this.createRay({
                    angle: angle + (Math.random() - 0.5) * 3, // Slightly different angle for soft rays
                    delay: delay + Math.random() * 0.2, 
                    opacity: baseOpacity * (0.3 + Math.random() * 0.3),
                    width: this.config.rayWidth * sizeMultiplier * softMultiplier * sizeVariation,
                    height: this.config.rayHeight * heightMultiplier * heightVariation,
                    layer, type: 'soft',
                    randomSeed: Math.random()
                });
            }
        }
    }

    createRay({ angle, delay, opacity, width, height, layer, type, randomSeed }) {
        const ray = document.createElement('div');
        ray.className = `light-rays-ray${type === 'soft' ? '-soft' : ''} layer${layer}`;
        ray.style.setProperty('--angle', angle + 'deg');
        ray.style.setProperty('--delay', delay + 's');
        ray.style.setProperty('--opacity', opacity.toString());
        
        // Slower, smoother animation properties
        const shimmerDuration = (6 + Math.random() * 4); // 6-10s variation
        const swayDuration = (12 + Math.random() * 8); // 12-20s variation
        const swayAngle = (1 + Math.random() * 2); // 1-3 degree sway variation
        
        ray.style.setProperty('--shimmer-duration', shimmerDuration + 's');
        ray.style.setProperty('--sway-duration', swayDuration + 's');
        ray.style.setProperty('--sway-angle', swayAngle + 'deg');
        ray.style.setProperty('--random-seed', randomSeed.toString());
        
        // Less frequent animation direction changes
        if (Math.random() < 0.15) {
            ray.style.animationDirection = 'reverse';
        }
        
        this.rayContainer.appendChild(ray);
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.applyCSSVariables();
        this.generateRays();
    }

    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        if (this.rayContainer) {
            this.rayContainer.remove();
        }
        
        // Remove styles if no other instances exist
        const containers = document.querySelectorAll('.light-rays-container');
        if (containers.length === 0) {
            const style = document.getElementById('light-rays-styles');
            if (style) style.remove();
        }
        
        this.isInitialized = false;
    }

}

// Export for both module and global usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LightRaysEngine;
}
if (typeof window !== 'undefined') {
    window.LightRaysEngine = LightRaysEngine;
}