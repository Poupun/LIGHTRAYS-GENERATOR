import React, { useState, useEffect, useRef } from 'react';

const LightRaysGenerator = () => {
    const [config, setConfig] = useState({
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
    });

    const [iframeVisible, setIframeVisible] = useState(false);
    const [iframeCode, setIframeCode] = useState('');
    const previewRef = useRef(null);

    const presets = {
        soft: { color: '#00ff7f', intensity: 0.4, rayCount: 8, rayWidth: 100, rayHeight: 150, blurEnabled: true, animated: true, lightX: 100, lightY: -50, animationSpeed1: 1, animationSpeed2: 0.7 },
        neon: { color: '#ff69b4', intensity: 0.9, rayCount: 20, rayWidth: 60, rayHeight: 160, blurEnabled: false, animated: true, lightX: 25, lightY: 25, animationSpeed1: 2.5, animationSpeed2: 3 },
        ethereal: { color: '#aa44ff', intensity: 0.6, rayCount: 12, rayWidth: 120, rayHeight: 200, blurEnabled: true, animated: true, lightX: 75, lightY: -75, animationSpeed1: 0.5, animationSpeed2: 1.8 },
        cinema: { color: '#ff6b35', intensity: 0.7, rayCount: 6, rayWidth: 180, rayHeight: 250, blurEnabled: true, animated: false, lightX: 100, lightY: -25, animationSpeed1: 1, animationSpeed2: 1 },
        ticket: { color: '#aa44ff', intensity: 0.6, rayCount: 12, rayWidth: 290, rayHeight: 140, blurEnabled: true, animated: true, lightX: 65, lightY: -75, animationSpeed1: 3.0, animationSpeed2: 3.0 },
        forest: { color: '#32cd32', intensity: 0.5, rayCount: 10, rayWidth: 90, rayHeight: 140, blurEnabled: true, animated: true, lightX: 80, lightY: -100, animationSpeed1: 0.8, animationSpeed2: 0.4 }
    };

    useEffect(() => {
        createLightRays();
    }, [config]);

    const updateConfig = (key, value) => {
        setConfig(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const toggleConfig = (key) => {
        setConfig(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const applyPreset = (presetName) => {
        const preset = presets[presetName];
        if (preset) {
            setConfig(prev => ({ ...prev, ...preset }));
        }
    };

    const createRay = ({ angle, delay, opacity, width, height, layer, type }) => {
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
    };

    const generateRayLayer = (wrapper, count, layer, angleOffset, sizeMultiplier, softMultiplier, heightMultiplier, opacityMultiplier) => {
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
    };

    const createLightRays = () => {
        if (!previewRef.current) return;

        const container = previewRef.current;
        
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
    };

    const generateIframe = () => {
        const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/embed.html');
        const encodedConfig = btoa(JSON.stringify(config));
        const iframeUrl = `${baseUrl}?config=${encodedConfig}`;
        
        const code = `<iframe src="${iframeUrl}" width="100%" height="400" frameborder="0" style="border-radius: 10px;"></iframe>`;
        
        setIframeCode(code);
        setIframeVisible(true);
    };

    const copyIframe = async () => {
        try {
            await navigator.clipboard.writeText(iframeCode);
            // You can add a toast notification here
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = iframeCode;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1>✨ Light Rays Generator</h1>
                <p>Create stunning light ray effects and generate embeddable iframe links for your projects</p>
            </div>

            <div className="main-content">
                <div className="preview-area" ref={previewRef}>
                    <div className="preview-content">
                        <h3>Your Light Rays</h3>
                        <p>Customize the settings and see your beautiful light rays in real-time</p>
                    </div>
                </div>

                <div className="controls-panel">
                    <h2 className="controls-title">🎮 Customize Your Light Rays</h2>

                    <div className="control-group">
                        <label>Color</label>
                        <input 
                            type="color" 
                            value={config.color}
                            onChange={(e) => updateConfig('color', e.target.value)}
                        />
                    </div>

                    <div className="control-group">
                        <label>Intensity <span className="value-display">{config.intensity}</span></label>
                        <input 
                            type="range" 
                            min="0.1" 
                            max="1" 
                            step="0.1" 
                            value={config.intensity}
                            onChange={(e) => updateConfig('intensity', parseFloat(e.target.value))}
                        />
                    </div>

                    <div className="control-group">
                        <label>Ray Count <span className="value-display">{config.rayCount}</span></label>
                        <input 
                            type="range" 
                            min="4" 
                            max="30" 
                            step="1" 
                            value={config.rayCount}
                            onChange={(e) => updateConfig('rayCount', parseInt(e.target.value))}
                        />
                    </div>

                    <div className="control-group">
                        <label>Ray Width <span className="value-display">{config.rayWidth}px</span></label>
                        <input 
                            type="range" 
                            min="20" 
                            max="300" 
                            step="10" 
                            value={config.rayWidth}
                            onChange={(e) => updateConfig('rayWidth', parseInt(e.target.value))}
                        />
                    </div>

                    <div className="control-group">
                        <label>Ray Height <span className="value-display">{config.rayHeight}vh</span></label>
                        <input 
                            type="range" 
                            min="50" 
                            max="300" 
                            step="10" 
                            value={config.rayHeight}
                            onChange={(e) => updateConfig('rayHeight', parseInt(e.target.value))}
                        />
                    </div>

                    <div className="control-group">
                        <label>Light X Position <span className="value-display">{config.lightX}%</span></label>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            step="5" 
                            value={config.lightX}
                            onChange={(e) => updateConfig('lightX', parseInt(e.target.value))}
                        />
                    </div>

                    <div className="control-group">
                        <label>Light Y Position <span className="value-display">{config.lightY}%</span></label>
                        <input 
                            type="range" 
                            min="-100" 
                            max="100" 
                            step="5" 
                            value={config.lightY}
                            onChange={(e) => updateConfig('lightY', parseInt(e.target.value))}
                        />
                    </div>

                    <div className="control-group">
                        <label>Layer 1 Speed <span className="value-display">{config.animationSpeed1.toFixed(1)}x</span></label>
                        <input 
                            type="range" 
                            min="0.1" 
                            max="3" 
                            step="0.1" 
                            value={config.animationSpeed1}
                            onChange={(e) => updateConfig('animationSpeed1', parseFloat(e.target.value))}
                        />
                    </div>

                    <div className="control-group">
                        <label>Layer 2 Speed <span className="value-display">{config.animationSpeed2.toFixed(1)}x</span></label>
                        <input 
                            type="range" 
                            min="0.1" 
                            max="3" 
                            step="0.1" 
                            value={config.animationSpeed2}
                            onChange={(e) => updateConfig('animationSpeed2', parseFloat(e.target.value))}
                        />
                    </div>

                    <div className="control-group">
                        <label>Animation</label>
                        <button 
                            className={`toggle-button ${config.animated ? 'active' : ''}`}
                            onClick={() => toggleConfig('animated')}
                        >
                            {config.animated ? 'ON' : 'OFF'}
                        </button>
                    </div>

                    <div className="control-group">
                        <label>Blur Effect</label>
                        <button 
                            className={`toggle-button ${config.blurEnabled ? 'active' : ''}`}
                            onClick={() => toggleConfig('blurEnabled')}
                        >
                            {config.blurEnabled ? 'ON' : 'OFF'}
                        </button>
                    </div>

                    <div className="control-group">
                        <label>Quick Presets</label>
                        <div className="preset-buttons">
                            <button className="preset-button" onClick={() => applyPreset('soft')}>Soft Dreamy</button>
                            <button className="preset-button" onClick={() => applyPreset('neon')}>Neon Club</button>
                            <button className="preset-button" onClick={() => applyPreset('ethereal')}>Ethereal Glow</button>
                            <button className="preset-button" onClick={() => applyPreset('cinema')}>Cinematic</button>
                            <button className="preset-button" onClick={() => applyPreset('ticket')}>Ticket Hub</button>
                            <button className="preset-button" onClick={() => applyPreset('forest')}>Forest Light</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="generate-section">
                <h3 style={{marginBottom: '1rem'}}>🔗 Generate Embeddable iframe</h3>
                <p style={{marginBottom: '1.5rem', opacity: 0.8}}>Copy the generated iframe code and paste it into any website</p>
                <button className="generate-button" onClick={generateIframe}>
                    🚀 Generate iframe Code
                </button>
                {iframeVisible && (
                    <div className="iframe-output">
                        <div style={{marginBottom: '1rem', fontWeight: 'bold'}}>Copy this code:</div>
                        <div>{iframeCode}</div>
                        <button className="copy-button" onClick={copyIframe}>📋 Copy to Clipboard</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LightRaysGenerator;
