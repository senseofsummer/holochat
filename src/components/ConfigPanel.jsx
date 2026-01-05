import React from 'react';
import { useBot } from '../context/BotContext';
import { Settings, User, Briefcase, MessageSquare, RefreshCw, Key } from 'lucide-react';

const ConfigPanel = () => {
    const { botConfig, setBotConfig, clearChat } = useBot();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBotConfig(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="glass-panel" style={{ height: '100%', padding: '1.5rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                <h2 className="neon-text" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    <Settings color="var(--primary-neon)" />
                    Bot Configuration
                </h2>
                <p className="text-sm text-muted">Design your digital human's personality.</p>
            </div>

            <div style={{ flex: 1 }}>

                {/* OpenAI API Key Input */}
                <div className="form-group" style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <label className="label-styled" style={{ color: '#ffd700' }}>
                        <Key size={14} /> OpenAI API Key
                    </label>
                    <input
                        type="password"
                        name="openaiApiKey"
                        value={botConfig.openaiApiKey}
                        onChange={handleChange}
                        placeholder="sk-..."
                    />
                    <p className="text-xs text-muted" style={{ marginTop: '4px' }}>
                        Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-neon)', textDecoration: 'underline' }}>OpenAI Platform</a>
                    </p>
                </div>

                {/* Name Input */}
                <div className="form-group">
                    <label className="label-styled">
                        <User size={14} /> Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={botConfig.name}
                        onChange={handleChange}
                        placeholder="e.g. Jarvis"
                    />
                </div>

                {/* Job Input */}
                <div className="form-group">
                    <label className="label-styled" style={{ color: '#bc13fe' }}>
                        <Briefcase size={14} /> Occupation
                    </label>
                    <input
                        type="text"
                        name="job"
                        value={botConfig.job}
                        onChange={handleChange}
                        placeholder="e.g. Digital Companion"
                    />
                </div>

                {/* Style Select */}
                <div className="form-group">
                    <label className="label-styled" style={{ color: '#00ff00' }}>
                        <MessageSquare size={14} /> Personality Style
                    </label>
                    <select
                        name="style"
                        value={botConfig.style}
                        onChange={handleChange}
                    >
                        <option value="Hologram">Hologram Spirit</option>
                        <option value="Friendly">Friendly & Helpful</option>
                        <option value="Professional">Professional & Concise</option>
                        <option value="Sarcastic">Sarcastic & Witty</option>
                        <option value="Pirate">Pirate Captain</option>
                    </select>
                </div>

                {/* Bio Input */}
                <div className="form-group">
                    <label className="label-styled" style={{ color: '#ff0099' }}>
                        Bio / Knowledge Base
                    </label>
                    <textarea
                        name="bio"
                        value={botConfig.bio}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Describe who I am..."
                        style={{ resize: 'none' }}
                    />
                </div>

                {/* Visual Customization */}
                <div className="form-group" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                    <label className="label-styled" style={{ color: '#00f2ff' }}>
                        Visuals
                    </label>

                    <div className="flex flex-col gap-4">
                        {/* Shape Select */}
                        <div>
                            <span className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>Avatar Shape</span>
                            <select
                                name="avatarShape"
                                value={botConfig.avatarShape}
                                onChange={handleChange}
                            >
                                <option value="model">Uploaded Model</option>
                                <option value="sphere">Neon Sphere</option>
                                <option value="cube">Data Cube</option>
                                <option value="torus">Holo Ring</option>
                            </select>
                        </div>

                        {/* Color Picker */}
                        <div>
                            <span className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>Holo Color</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    name="avatarColor"
                                    value={botConfig.avatarColor}
                                    onChange={handleChange}
                                    style={{ padding: '0', height: '40px', cursor: 'pointer', background: 'none', borderColor: 'var(--glass-border)' }}
                                />
                                <span className="text-xs text-muted">{botConfig.avatarColor}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3D Model Upload */}
                <div className="form-group">
                    <label className="label-styled" style={{ color: '#ffffff' }}>
                        Avatar Model (.glb)
                    </label>
                    <input
                        type="file"
                        accept=".glb,.gltf"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const url = URL.createObjectURL(file);
                                setBotConfig(prev => ({ ...prev, avatarUrl: url }));
                            }
                        }}
                        style={{ fontSize: '0.8rem' }}
                    />
                    <p className="text-xs text-muted" style={{ marginTop: '4px' }}>
                        Upload a 3D model to test the Digital Human look.
                    </p>
                    {botConfig.avatarUrl !== '/avatar.glb' && (
                        <button
                            onClick={() => setBotConfig(prev => ({ ...prev, avatarUrl: '/avatar.glb' }))}
                            className="text-xs mt-2"
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                color: 'var(--primary-neon)',
                                textDecoration: 'underline'
                            }}
                        >
                            Reset to Default Avatar
                        </button>
                    )}
                </div>

            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                <button
                    onClick={clearChat}
                    className="btn-primary"
                >
                    <RefreshCw size={18} />
                    Reset & Apply
                </button>
            </div>
        </div>
    );
};

export default ConfigPanel;
