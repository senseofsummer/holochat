import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Html, useProgress, Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { useBot } from '../context/BotContext';

function Loader() {
    const { progress } = useProgress();
    return <Html center className="neon-text">{progress.toFixed(0)}% loaded</Html>;
}

function Model({ url, color }) {
    const { scene } = useGLTF(url);
    const ref = useRef();
    const timeRef = useRef(0);

    // Custom holographic shader material
    useEffect(() => {
        if (scene) {
            scene.traverse((child) => {
                if (child.isMesh) {
                    // Create custom shader material with holographic effects
                    const hologramMaterial = new THREE.ShaderMaterial({
                        uniforms: {
                            time: { value: 0 },
                            color: { value: new THREE.Color(color) }
                        },
                        vertexShader: `
                            varying vec3 vNormal;
                            varying vec3 vPosition;
                            varying vec2 vUv;
                            uniform float time;
                            
                            // Simple noise function
                            float noise(vec3 p) {
                                return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
                            }
                            
                            void main() {
                                vNormal = normalize(normalMatrix * normal);
                                vPosition = position;
                                vUv = uv;
                                
                                // Add subtle vertex distortion for glitch effect
                                vec3 pos = position;
                                float distortion = noise(position * 2.0 + time * 0.5) * 0.02;
                                pos += normal * distortion;
                                
                                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                            }
                        `,
                        fragmentShader: `
                            uniform float time;
                            uniform vec3 color;
                            varying vec3 vNormal;
                            varying vec3 vPosition;
                            varying vec2 vUv;
                            
                            void main() {
                                // Fresnel effect for edge glow
                                vec3 viewDirection = normalize(cameraPosition - vPosition);
                                float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 2.5);
                                
                                // Animated scan lines
                                float scanLine = sin(vPosition.y * 20.0 - time * 3.0) * 0.5 + 0.5;
                                scanLine = smoothstep(0.3, 0.7, scanLine);
                                
                                // Noise for glitch effect
                                float noise = fract(sin(dot(vPosition.xy + time * 0.1, vec2(12.9898, 78.233))) * 43758.5453);
                                
                                // Combine effects
                                vec3 finalColor = color;
                                finalColor += fresnel * color * 2.0; // Edge glow
                                finalColor += scanLine * color * 0.3; // Scan lines
                                finalColor += noise * 0.1; // Subtle noise
                                
                                // High transparency with fresnel-based opacity
                                float opacity = 0.25 + fresnel * 0.5 + scanLine * 0.15;
                                
                                gl_FragColor = vec4(finalColor, opacity);
                            }
                        `,
                        transparent: true,
                        side: THREE.DoubleSide,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false
                    });

                    child.material = hologramMaterial;
                }
            });
        }
    }, [scene, color]);

    // Update shader time uniform
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
            ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 - 0.8;

            // Update time uniform for all materials
            ref.current.traverse((child) => {
                if (child.isMesh && child.material.uniforms) {
                    child.material.uniforms.time.value = state.clock.elapsedTime;
                }
            });
        }
    });

    return <primitive ref={ref} object={scene} scale={1.5} />;
}

function ProceduralAvatar({ shape, color }) {
    const meshRef = useRef();

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.5;
            meshRef.current.rotation.y += delta * 0.5;
            // Float animation without offset
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
        }
    });

    const materialProps = {
        color: color,
        emissive: color,
        emissiveIntensity: 2,
        wireframe: true,
        toneMapped: false
    };

    return (
        <mesh ref={meshRef}>
            {shape === 'cube' && <boxGeometry args={[1.5, 1.5, 1.5]} />}
            {shape === 'sphere' && <sphereGeometry args={[1, 32, 32]} />}
            {shape === 'torus' && <torusGeometry args={[1, 0.3, 16, 100]} />}
            <meshStandardMaterial {...materialProps} />
        </mesh>
    );
}

const AvatarViewer = ({ modelUrl, color = '#00f2ff', shape = 'model' }) => {
    const { botConfig } = useBot();

    return (
        <div className="w-full h-full glass-panel relative overflow-hidden" style={{ minHeight: '300px', position: 'relative' }}>
            <Canvas camera={{ position: [0, 1, 7], fov: 50 }} gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color={color} />

                <Suspense fallback={<Loader />}>
                    {shape === 'model' && modelUrl ? (
                        <Model url={modelUrl} color={color} />
                    ) : (
                        <ProceduralAvatar shape={shape === 'model' ? 'sphere' : shape} color={color} />
                    )}

                    {/* Bloom effect environment or dynamic lighting */}
                    <Environment preset="city" />
                </Suspense>

                <OrbitControls enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.8} target={[0, 0, 0]} />
            </Canvas>

            <div
                className="absolute top-4 left-4 z-50 neon-text text-sm font-bold bg-black/50 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md"
                style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 50 }}
            >
                3D VISUALIZER
            </div>

            {/* Bot Info Overlay - Bottom */}
            <div
                className="absolute bottom-4 left-4 right-4 z-50 bg-black/70 backdrop-blur-md border border-white/20 rounded-lg p-3"
                style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', zIndex: 50 }}
            >
                <h2 style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem', fontSize: '1.25rem' }}>
                    {botConfig.name}
                    <span className="job-tag" style={{ marginLeft: '0.75rem' }}>
                        {botConfig.job}
                    </span>
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="status-indicator"></span>
                    <span className="text-xs text-muted">Online & Ready</span>
                </div>
            </div>
        </div>
    );
};

export default AvatarViewer;
