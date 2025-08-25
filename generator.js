// Configuration object
let config = {
    color: '#00ff7f',
    intensity: 0.6,
    rayCount: 12,
    animated: true,
    lightX: 100,
    lightY: 0,
    rayWidth: 80,
    rayHeight: 120,
    blurEnabled: true,
    animationSpeed1: 1,
    animationSpeed2: 1
};

let lightRaysInstance = null;

// Presets
const presets = {
    soft: { color: '#00ff7f', intensity: 0.4, rayCount: 8, rayWidth: 100, rayHeight: 150, blurEnabled: true, animated: true, lightX: 100, lightY: -50, animationSpeed1: 1, animationSpeed2: 0.7 },
    neon: { color: '#ff69b4', intensity: 0.9, rayCount: 20, rayWidth: 60, rayHeight: 160, blurEnabled: false, animated: true, lightX: 25, lightY: 25, animationSpeed1: 2.5, animationSpeed2: 3 },
    ethereal: { color: '#aa44ff', intensity: 0.6, rayCount: 12, rayWidth: 120, rayHeight: 200, blurEnabled: true, animated: true, lightX: 75, lightY: -75, animationSpeed1: 0.5, animationSpeed2: 1.8 },
    cinema: { color: '#ff6b35', intensity: 0.7, rayCount: 6, rayWidth: 180, rayHeight: 250, blurEnabled: true, animated: false, lightX: 100, lightY: -25, animationSpeed1: 1, animationSpeed2: 1 },
    ticket: { color: '#aa44ff', intensity: 0.6, rayCount: 12, rayWidth: 290, rayHeight: 140, blurEnabled: true, animated: true, lightX: 65, lightY: -75, animationSpeed1: 3.0, animationSpeed2: 3.0 },
    forest: { color: '#32cd32', intensity: 0.5, rayCount: 10, rayWidth: 90, rayHeight: 140, blurEnabled: true, animated: true, lightX: 80, lightY: -100, animationSpeed1: 0.8, animationSpeed2: 0.4 }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeControls();
    createLightRays();
});

function initializeControls() {
    // Add event listeners to all controls
    Object.keys(config).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'range' || element.type === 'color') {
                element.addEventListener('input', updateConfig);
            } else if (element.classList.contains('toggle-button')) {
                element.addEventListener('click', toggleConfig);
            }
        }
    });

    // Update value displays
    updateValueDisplays();
}

function updateConfig(event) {
    const key = event.target.id;
    let value = event.target.value;

    // Convert to appropriate type
    if (event.target.type === 'range') {
        value = parseFloat(value);
    }

    config[key] = value;
    updateValueDisplays();
    createLightRays();
}

function toggleConfig(event) {
    const key = event.target.id;
    config[key] = !config[key];
    
    event.target.textContent = config[key] ? 'ON' : 'OFF';
    event.target.classList.toggle('active', config[key]);
    
    createLightRays();
}

function updateValueDisplays() {
    const displays = {
        'intensity-value': config.intensity,
        'rayCount-value': config.rayCount,
        'rayWidth-value': config.rayWidth + 'px',
        'rayHeight-value': config.rayHeight + 'vh',
        'lightX-value': config.lightX + '%',
        'lightY-value': config.lightY + '%',
        'animationSpeed1-value': config.animationSpeed1.toFixed(1) + 'x',
        'animationSpeed2-value': config.animationSpeed2.toFixed(1) + 'x'
    };

    Object.entries(displays).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

function applyPreset(presetName) {
    const preset = presets[presetName];
    if (!preset) return;

    // Update config
    config = { ...config, ...preset };

    // Update UI controls
    Object.entries(preset).forEach(([key, value]) => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'range' || element.type === 'color') {
                element.value = value;
            } else if (element.classList.contains('toggle-button')) {
                element.textContent = value ? 'ON' : 'OFF';
                element.classList.toggle('active', value);
            }
        }
    });

    updateValueDisplays();
    createLightRays();
}

function createLightRays() {
    const container = document.getElementById('preview');
    
    // Remove existing light rays
    const existing = container.querySelector('.light-rays-container');
    if (existing) {
        existing.remove();
    }

    // Create new light rays container
    const lightRaysContainer = document.createElement('div');
    lightRaysContainer.className = 'light-rays-container';
    
    // Set CSS variables
    lightRaysContainer.style.setProperty('--primary-color', config.color);
    lightRaysContainer.style.setProperty('--intensity', config.intensity);
    lightRaysContainer.style.setProperty('--light-x', config.lightX + '%');
    lightRaysContainer.style.setProperty('--light-y', config.lightY + '%');
    lightRaysContainer.style.setProperty('--ray-width', config.rayWidth + 'px');
    lightRaysContainer.style.setProperty('--ray-height', config.rayHeight + 'vh');

    // Create ambient light
    const ambientLight = document.createElement('div');
    ambientLight.className = `ambient-light ${config.blurEnabled ? 'blurred' : 'sharp'}`;
    lightRaysContainer.appendChild(ambientLight);

    // Create rays wrapper
    const raysWrapper = document.createElement('div');
    raysWrapper.className = 'rays-wrapper';

    // Generate rays
    generateRayLayer(raysWrapper, config.rayCount, 1, 0, 1, 1.5, 1, 1);
    generateRayLayer(raysWrapper, Math.floor(config.rayCount * 0.7), 2, 15, 0.8, 1.2, 0.9, 0.8);

    lightRaysContainer.appendChild(raysWrapper);

    // Create central glow
    const centralGlow = document.createElement('div');
    centralGlow.className = `central-glow ${config.blurEnabled ? 'blurred' : 'sharp'}`;
    lightRaysContainer.appendChild(centralGlow);

    container.appendChild(lightRaysContainer);
}

function generateRayLayer(wrapper, count, layer, angleOffset, sizeMultiplier, softMultiplier, heightMultiplier, opacityMultiplier) {
    for (let i = 0; i < count; i++) {
        const angle = (360 / count) * i + angleOffset;
        const delay = i * (layer === 1 ? 0.1 : 0.15) + (layer === 2 ? 0.5 : 0);
        const baseOpacity = (0.3 + (Math.random() * 0.4)) * opacityMultiplier;

        // Main ray
        wrapper.appendChild(createRay({
            angle, delay, opacity: baseOpacity,
            width: config.rayWidth * sizeMultiplier,
            height: config.rayHeight * heightMultiplier,
            layer, type: 'main'
        }));

        // Soft and ultra layers only for blurred rays
        if (config.blurEnabled) {
            wrapper.appendChild(createRay({
                angle, delay, opacity: baseOpacity * 0.4,
                width: config.rayWidth * sizeMultiplier * softMultiplier,
                height: config.rayHeight * heightMultiplier,
                layer, type: 'soft'
            }));

            if (layer === 1) {
                wrapper.appendChild(createRay({
                    angle, delay, opacity: baseOpacity * 0.2,
                    width: config.rayWidth * sizeMultiplier * 2,
                    height: config.rayHeight * heightMultiplier,
                    layer, type: 'ultra'
                }));
            }
        }
    }
}

function createRay({ angle, delay, opacity, width, height, layer, type }) {
    const ray = document.createElement('div');
    const classes = ['light-ray'];
    
    if (type === 'soft') classes.push('light-ray-soft');
    if (type === 'ultra') classes.push('light-ray-ultra');
    if (type === 'main') classes.push(config.blurEnabled ? 'blurred' : 'sharp');
    if (config.animated) {
        classes.push('animated');
        if (layer === 2) classes.push('layer2');
    }

    ray.className = classes.join(' ');
    ray.style.setProperty('--ray-angle', angle + 'deg');
    ray.style.setProperty('--animation-delay', delay + 's');
    ray.style.setProperty('--ray-opacity', opacity);
    ray.style.setProperty('--ray-width', width + 'px');
    ray.style.setProperty('--ray-height', height + 'vh');
    ray.style.setProperty('--animation-speed1', config.animationSpeed1);
    ray.style.setProperty('--animation-speed2', config.animationSpeed2);

    return ray;
}

// Global variable to store the last generated embed code
let lastGeneratedEmbedCode = '';

function copyEmbedCodeToClipboard() {
    if (lastGeneratedEmbedCode) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(lastGeneratedEmbedCode).then(() => {
                showCopySuccess();
            }).catch(err => {
                console.error('❌ Failed to copy to clipboard:', err);
                fallbackCopy(lastGeneratedEmbedCode);
            });
        } else {
            fallbackCopy(lastGeneratedEmbedCode);
        }
    }
}

function generateIframe() {
            const encodedConfig = btoa(JSON.stringify(config));
            const iframeUrl = `${baseUrl}?config=${encodedConfig}`;
            
            // Check if we're running locally (for console logging only)
            const isLocalFile = window.location.protocol === 'file:';
            
            if (isLocalFile) {
                console.info('ℹ️ Running locally - iframe may not load due to browser security restrictions');
                console.info('� To test iframe: host files online or use a local server');
            }
            
            const iframeCode = `<iframe src="${iframeUrl}" width="100%" height="400" frameborder="0" style="border-radius: 10px;" onload="console.log('✅ Iframe loaded successfully')" onerror="console.error('❌ Iframe failed to load')"></iframe>`;
            
            document.getElementById('iframe-code').innerHTML = `<div style="font-family: monospace; background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 5px; word-break: break-all;">${iframeCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`;
            document.getElementById('iframe-output').style.display = 'block';
            
            // Show a test preview if not running locally
            if (!isLocalFile) {
                showIframePreview(iframeUrl);
            }
        }

        function copyIframe() {
            const iframeCodeElement = document.getElementById('iframe-code');
            // Get the text content and decode HTML entities
            let iframeCode = iframeCodeElement.textContent || iframeCodeElement.innerText;
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(iframeCode).then(() => {
                    showCopySuccess();
                }).catch(err => {
                    console.error('❌ Failed to copy to clipboard:', err);
                    fallbackCopy(iframeCode);
                });
            } else {
                fallbackCopy(iframeCode);
            }
        }

        function fallbackCopy(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showCopySuccess();
            } catch (err) {
                console.error('❌ Fallback copy failed:', err);
                alert('Copy failed. Please manually copy the iframe code.');
            }
            document.body.removeChild(textArea);
        }

        function showIframePreview(iframeUrl) {
            const previewContainer = document.getElementById('iframe-output');
            const existingPreview = previewContainer.querySelector('.iframe-preview');
            if (existingPreview) {
                existingPreview.remove();
            }

            const previewDiv = document.createElement('div');
            previewDiv.className = 'iframe-preview';
            previewDiv.innerHTML = `
                <div style="margin: 1rem 0; font-weight: bold;">🔍 Live Preview:</div>
                <iframe 
                    src="${iframeUrl}" 
                    width="100%" 
                    height="300" 
                    frameborder="0" 
                    style="border-radius: 10px; border: 1px solid rgba(255,255,255,0.2);"
                    onload="console.log('✅ Preview iframe loaded successfully'); this.style.border='1px solid rgba(0,255,127,0.5)'"
                    onerror="console.error('❌ Preview iframe failed to load'); this.style.border='1px solid rgba(255,0,0,0.5)'"
                ></iframe>
            `;
            previewContainer.appendChild(previewDiv);
        }

        function showCopySuccess() {
    const button = document.querySelector('.copy-button');
    const originalText = button.textContent;
    button.textContent = '✅ Copied!';
    button.style.background = 'rgba(0, 255, 0, 0.3)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'rgba(0, 100, 255, 0.3)';
    }, 2000);
}

        function generateEmbedCode() {
            // Generate self-contained HTML with inline styles matching the current configuration
            const hexToRgb = (hex) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : { r: 0, g: 255, b: 127 };
            };

            const rgb = hexToRgb(config.color);
            const rayCount = config.rayCount;
            const intensity = config.intensity;
            const blurAmount = config.blurEnabled ? Math.floor(config.rayWidth / 12) + 'px' : '1px';
            const animationSpeed1 = config.animationSpeed1;
            const animationSpeed2 = config.animationSpeed2;

            // Generate rays HTML that matches the preview exactly
            let raysHTML = '';
            let ambientHTML = '';
            let centralGlowHTML = '';

            // Create ambient light (matches the preview)
            ambientHTML = `<div class="ambient-glow"></div>`;

            // Generate Layer 1 rays (main layer)
            for (let i = 0; i < rayCount; i++) {
                const angle = (360 / rayCount) * i;
                const delay = i * 0.1;
                const baseOpacity = (0.3 + (i / rayCount * 0.4)) * intensity;
                
                raysHTML += `<div class="light-ray layer1" style="--angle: ${angle}deg; --delay: ${delay}s; --opacity: ${baseOpacity};"></div>`;
                
                // Add soft ray if blur is enabled
                if (config.blurEnabled) {
                    raysHTML += `<div class="light-ray-soft layer1" style="--angle: ${angle}deg; --delay: ${delay}s; --opacity: ${baseOpacity * 0.4};"></div>`;
                }
            }

            // Generate Layer 2 rays (secondary layer)
            const layer2Count = Math.floor(rayCount * 0.7);
            for (let i = 0; i < layer2Count; i++) {
                const angle = (360 / layer2Count) * i + 15;
                const delay = i * 0.15 + 0.5;
                const baseOpacity = (0.3 + (i / layer2Count * 0.4)) * intensity * 0.8;
                
                raysHTML += `<div class="light-ray layer2" style="--angle: ${angle}deg; --delay: ${delay}s; --opacity: ${baseOpacity};"></div>`;
                
                if (config.blurEnabled) {
                    raysHTML += `<div class="light-ray-soft layer2" style="--angle: ${angle}deg; --delay: ${delay}s; --opacity: ${baseOpacity * 0.4};"></div>`;
                }
            }

            // Central glow
            centralGlowHTML = `<div class="central-glow"></div>`;

            const embedCode = `<!-- Light Rays Effect - Exact Configuration Match -->
<div class="light-rays-generated" style="position: relative; width: 100%; height: 400px; background: #000; overflow: hidden; border-radius: 10px;">
<style>
.light-rays-generated {
    --primary-color: ${config.color};
    --ray-r: ${rgb.r}; --ray-g: ${rgb.g}; --ray-b: ${rgb.b};
    --intensity: ${intensity};
    --light-x: ${config.lightX}%; --light-y: ${config.lightY}%;
    --ray-width: ${config.rayWidth}px; --ray-height: ${config.rayHeight}vh;
    --animation-speed1: ${animationSpeed1}; --animation-speed2: ${animationSpeed2};
}

.light-rays-generated .ambient-glow {
    position: absolute; top: var(--light-y); left: var(--light-x); width: 200%; height: 200%;
    background: conic-gradient(from 225deg at center, transparent 0deg, rgba(var(--ray-r), var(--ray-g), var(--ray-b), calc(var(--intensity) * 0.3)) 45deg, rgba(var(--ray-r), var(--ray-g), var(--ray-b), calc(var(--intensity) * 0.1)) 90deg, transparent 135deg);
    transform: translate(-50%, -50%); opacity: var(--intensity);
    ${config.animated ? `animation: gentle-pulse-gen calc(4s / var(--animation-speed1)) ease-in-out infinite alternate;` : ''}
    ${config.blurEnabled ? 'filter: blur(60px);' : 'filter: blur(20px);'}
}

.light-rays-generated .light-ray {
    position: absolute; top: var(--light-y); left: var(--light-x); width: var(--ray-width); height: var(--ray-height);
    transform-origin: 50% 0%; transform: translate(-50%, -50%) rotate(var(--angle)); opacity: var(--opacity);
    ${config.blurEnabled ? 
        `background: radial-gradient(ellipse calc(var(--ray-width) / 2) var(--ray-height) at center 0%, rgba(var(--ray-r), var(--ray-g), var(--ray-b), 1) 0%, rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.9) 8%, rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.7) 20%, rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.5) 35%, rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.3) 50%, rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.2) 65%, rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.1) 80%, transparent 100%); filter: blur(calc(var(--ray-width) / 12)) saturate(1.2);` :
        `background: linear-gradient(to bottom, rgba(var(--ray-r), var(--ray-g), var(--ray-b), 1) 0%, rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.9) 15%, rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.6) 30%, rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.4) 50%, rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.2) 70%, transparent 100%); clip-path: polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%);`
    }
}

.light-rays-generated .light-ray.layer1 {
    ${config.animated ? `animation: ray-shimmer-gen calc(3s / var(--animation-speed1)) ease-in-out infinite alternate, ray-sway-gen calc(8s / var(--animation-speed1)) ease-in-out infinite; animation-delay: var(--delay);` : ''}
}

.light-rays-generated .light-ray.layer2 {
    ${config.animated ? `animation: ray-shimmer-2-gen calc(4s / var(--animation-speed2)) ease-in-out infinite alternate, ray-sway-2-gen calc(10s / var(--animation-speed2)) ease-in-out infinite; animation-delay: calc(var(--delay) + 1.5s);` : ''}
}

.light-rays-generated .light-ray-soft {
    position: absolute; top: var(--light-y); left: var(--light-x); width: calc(var(--ray-width) * 0.6); height: calc(var(--ray-height) * 0.7);
    transform-origin: 50% 0%; transform: translate(-50%, -50%) rotate(var(--angle)); opacity: var(--opacity);
    background: radial-gradient(ellipse calc(var(--ray-width) * 0.6) calc(var(--ray-height) * 0.7) at center 0%, rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.6) 0%, rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.4) 25%, rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.3) 45%, rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.2) 65%, rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.1) 80%, transparent 100%);
    filter: blur(calc(var(--ray-width) / 8));
}

.light-rays-generated .central-glow {
    position: absolute; top: calc(var(--light-y) - 100px); left: calc(var(--light-x) - 100px); width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(var(--ray-r), var(--ray-g), var(--ray-b), 1) 0%, rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.8) 20%, rgba(var(--ray-r), var(--ray-g), var(--ray-b), 0.4) 40%, transparent 70%);
    border-radius: 50%; opacity: calc(var(--intensity) * 0.8);
    ${config.animated ? 'animation: central-glow-pulse-gen 3s ease-in-out infinite alternate;' : ''}
    ${config.blurEnabled ? 'filter: blur(30px);' : 'filter: blur(10px);'}
}

@keyframes ray-shimmer-gen { 0% { opacity: var(--opacity); transform: translate(-50%, -50%) rotate(var(--angle)) scaleY(1); } 100% { opacity: calc(var(--opacity) * 1.5); transform: translate(-50%, -50%) rotate(var(--angle)) scaleY(1.1); } }
@keyframes ray-sway-gen { 0%, 100% { transform: translate(-50%, -50%) rotate(var(--angle)); } 50% { transform: translate(-50%, -50%) rotate(calc(var(--angle) + 2deg)); } }
@keyframes ray-shimmer-2-gen { 0% { opacity: calc(var(--opacity) * 0.8); transform: translate(-50%, -50%) rotate(var(--angle)) scaleY(0.9) translateX(2px); } 100% { opacity: calc(var(--opacity) * 1.3); transform: translate(-50%, -50%) rotate(var(--angle)) scaleY(1.15) translateX(-2px); } }
@keyframes ray-sway-2-gen { 0%, 100% { transform: translate(-50%, -50%) rotate(calc(var(--angle) + 1deg)); } 25% { transform: translate(-50%, -50%) rotate(calc(var(--angle) - 1deg)); } 75% { transform: translate(-50%, -50%) rotate(calc(var(--angle) + 3deg)); } }
@keyframes gentle-pulse-gen { 0% { opacity: calc(var(--intensity) * 0.6); transform: translate(-50%, -50%) scale(0.95); } 100% { opacity: calc(var(--intensity) * 0.9); transform: translate(-50%, -50%) scale(1.05); } }
@keyframes central-glow-pulse-gen { 0% { opacity: calc(var(--intensity) * 0.8); transform: scale(0.9); } 100% { opacity: calc(var(--intensity) * 1.2); transform: scale(1.1); } }
</style>
${ambientHTML}${raysHTML}${centralGlowHTML}
</div>`;

            // Store the generated code globally
            lastGeneratedEmbedCode = embedCode;

            document.getElementById('iframe-code').innerHTML = `
                <div style="font-family: monospace; background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 5px; word-break: break-all; white-space: pre-wrap; font-size: 0.8rem; max-height: 300px; overflow-y: auto;">${embedCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                <button class="copy-button" onclick="copyEmbedCodeToClipboard()" style="margin-top: 1rem;">📋 Copy Embed Code to Clipboard</button>
            `;
            document.getElementById('iframe-output').style.display = 'block';

            // Show a live preview that matches exactly
            const previewContainer = document.getElementById('iframe-output');
            
            // Clear any existing previews to prevent conflicts
            const existingPreviews = previewContainer.querySelectorAll('.embed-preview, .iframe-preview');
            existingPreviews.forEach(preview => preview.remove());

            const previewDiv = document.createElement('div');
            previewDiv.className = 'embed-preview';
            previewDiv.style.cssText = 'isolation: isolate; contain: layout style paint;'; // Isolate to prevent conflicts
            previewDiv.innerHTML = `<div style="margin: 1rem 0; font-weight: bold;">🔍 Live Preview (Exact Match):</div>${embedCode}`;
            previewContainer.appendChild(previewDiv);

            // Copy to clipboard functionality
            if (navigator.clipboard) {
                navigator.clipboard.writeText(embedCode).then(() => {
                    showCopySuccess();
                }).catch(err => {
                    console.error('❌ Failed to copy to clipboard:', err);
                    fallbackCopy(embedCode);
                });
            } else {
                fallbackCopy(embedCode);
            }
        }
