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
            rayWidth: 240,
            rayHeight: 180,
            lightX: 100,
            lightY: -5,
            animationSpeed1: 3.0,
            animationSpeed2: 3.0,
            animated: true,
            blurEnabled: true,
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
                --light-x: ${this.config.lightX}%;
                --light-y: ${this.config.lightY}%;
                --ray-width: ${this.config.rayWidth}px;
                --ray-height: ${this.config.rayHeight}vh;
                --animation-speed1: ${this.config.animationSpeed1};
                --animation-speed2: ${this.config.animationSpeed2};
            }

            .light-rays-ambient {
                position: absolute;
                top: var(--light-y);
                left: var(--light-x);
                width: 200%;
                height: 200%;
                background: conic-gradient(
                    from 225deg at center,
                    transparent 0deg,
                    rgba(var(--ray-r), var(--ray-g), var(--ray-b), calc(var(--intensity) * 0.3)) 45deg,
                    rgba(var(--ray-r), var(--ray-g), var(--ray-b), calc(var(--intensity) * 0.1)) 90deg,
                    transparent 135deg
                );
                transform: translate(-50%, -50%);
                opacity: var(--intensity);
                ${this.config.animated ? 'animation: lr-gentle-pulse calc(4s / var(--animation-speed1)) ease-in-out infinite alternate;' : ''}
                ${this.config.blurEnabled ? 'filter: blur(60px);' : 'filter: blur(20px);'}
            }

            .light-rays-ray {
                position: absolute;
                top: var(--light-y);
                left: var(--light-x);
                width: var(--ray-width);
                height: var(--ray-height);
                transform-origin: 50% 0%;
                transform: translate(-50%, -50%) rotate(var(--angle));
                opacity: var(--opacity);
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
                    filter: blur(calc(var(--ray-width) / 12)) saturate(1.2);
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
                ${this.config.animated ? 'animation: lr-ray-shimmer calc(3s / var(--animation-speed1)) ease-in-out infinite alternate, lr-ray-sway calc(8s / var(--animation-speed1)) ease-in-out infinite;' : ''}
                animation-delay: var(--delay);
            }

            .light-rays-ray.layer2 {
                ${this.config.animated ? 'animation: lr-ray-shimmer-2 calc(4s / var(--animation-speed2)) ease-in-out infinite alternate, lr-ray-sway-2 calc(10s / var(--animation-speed2)) ease-in-out infinite;' : ''}
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
                opacity: var(--opacity);
                background: radial-gradient(
                    ellipse calc(var(--ray-width) * 0.6) calc(var(--ray-height) * 0.7) at center 0%,
                    rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.6) 0%,
                    rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.4) 25%,
                    rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.3) 45%,
                    rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.2) 65%,
                    rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.1) 80%,
                    transparent 100%
                );
                filter: blur(calc(var(--ray-width) / 8));
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
                ${this.config.animated ? 'animation: lr-central-glow-pulse 3s ease-in-out infinite alternate;' : ''}
                ${this.config.blurEnabled ? 'filter: blur(30px);' : 'filter: blur(10px);'}
            }

            @keyframes lr-ray-shimmer {
                0% { opacity: var(--opacity); transform: translate(-50%, -50%) rotate(var(--angle)) scaleY(1); }
                100% { opacity: calc(var(--opacity) * 1.5); transform: translate(-50%, -50%) rotate(var(--angle)) scaleY(1.1); }
            }

            @keyframes lr-ray-sway {
                0%, 100% { transform: translate(-50%, -50%) rotate(var(--angle)); }
                50% { transform: translate(-50%, -50%) rotate(calc(var(--angle) + 2deg)); }
            }

            @keyframes lr-ray-shimmer-2 {
                0% { opacity: calc(var(--opacity) * 0.8); transform: translate(-50%, -50%) rotate(var(--angle)) scaleY(0.9) translateX(2px); }
                100% { opacity: calc(var(--opacity) * 1.3); transform: translate(-50%, -50%) rotate(var(--angle)) scaleY(1.15) translateX(-2px); }
            }

            @keyframes lr-ray-sway-2 {
                0%, 100% { transform: translate(-50%, -50%) rotate(calc(var(--angle) + 1deg)); }
                25% { transform: translate(-50%, -50%) rotate(calc(var(--angle) - 1deg)); }
                75% { transform: translate(-50%, -50%) rotate(calc(var(--angle) + 3deg)); }
            }

            @keyframes lr-gentle-pulse {
                0% { opacity: calc(var(--intensity) * 0.6); transform: translate(-50%, -50%) scale(0.95); }
                100% { opacity: calc(var(--intensity) * 0.9); transform: translate(-50%, -50%) scale(1.05); }
            }

            @keyframes lr-central-glow-pulse {
                0% { opacity: calc(var(--intensity) * 0.8); transform: scale(0.9); }
                100% { opacity: calc(var(--intensity) * 1.2); transform: scale(1.1); }
            }
        `;
    }

    generateRays() {
        this.rayContainer.innerHTML = '';
        this.createStyleSheet();

        // Create ambient light
        const ambientLight = document.createElement('div');
        ambientLight.className = 'light-rays-ambient';
        this.rayContainer.appendChild(ambientLight);

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
            const angle = (360 / count) * i + angleOffset;
            const delay = i * (layer === 1 ? 0.1 : 0.15) + (layer === 2 ? 0.5 : 0);
            const baseOpacity = (0.3 + (Math.random() * 0.4)) * opacityMultiplier;

            // Main ray
            this.createRay({
                angle, delay, opacity: baseOpacity,
                width: this.config.rayWidth * sizeMultiplier,
                height: this.config.rayHeight * heightMultiplier,
                layer, type: 'main'
            });

            // Soft ray for blurred effect
            if (this.config.blurEnabled) {
                this.createRay({
                    angle, delay, opacity: baseOpacity * 0.4,
                    width: this.config.rayWidth * sizeMultiplier * softMultiplier,
                    height: this.config.rayHeight * heightMultiplier,
                    layer, type: 'soft'
                });
            }
        }
    }

    createRay({ angle, delay, opacity, width, height, layer, type }) {
        const ray = document.createElement('div');
        ray.className = `light-rays-ray${type === 'soft' ? '-soft' : ''} layer${layer}`;
        ray.style.setProperty('--angle', angle + 'deg');
        ray.style.setProperty('--delay', delay + 's');
        ray.style.setProperty('--opacity', opacity.toString());
        
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