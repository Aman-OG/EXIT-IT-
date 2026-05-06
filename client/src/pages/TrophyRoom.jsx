import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, ContactShadows, Environment, Stars, Float, Text, PerspectiveCamera } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Award, Trophy } from 'lucide-react';
import TrophyPedestal from '../components/TrophyPedestal';

const badgeMap = [
    { id: 'initiator', name: 'The Initiator', desc: 'Started your first practice quiz', colorCode: '#a855f7' },
    { id: 'flawless', name: 'Flawless Victory', desc: 'Achieved a perfect 100% score', colorCode: '#22d3ee' },
    { id: 'consistent', name: 'Consistent Learner', desc: 'Reached a 3-day active streak', colorCode: '#f43f5e' },
    { id: 'marathon', name: 'Marathon Reader', desc: 'Read 5 different study PDFs', colorCode: '#10b981' },
    { id: 'weekend', name: 'Weekend Warrior', desc: 'Studied on a Saturday or Sunday', colorCode: '#f59e0b' },
    { id: 'nightowl', name: 'Night Owl', desc: 'Studied late (Midnight to 4AM)', colorCode: '#475569' },
    { id: 'centurion', name: 'The Centurion', desc: 'Solved 100 total questions', colorCode: '#e11d48' },
    { id: 'examready', name: 'Exam Ready', desc: 'Completed > 85% of platform materials', colorCode: '#fbbf24' }
];

const TrophyRoom = () => {
    const navigate = useNavigate();
    const [unlockedBadges, setUnlockedBadges] = useState({});
    const [loading, setLoading] = useState(true);

    // Silence internal library deprecation warnings (THREE.Clock is used by R3F internally)
    useEffect(() => {
        const originalWarn = console.warn;
        console.warn = (...args) => {
            if (typeof args[0] === 'string' && (args[0].includes('THREE.Clock') || args[0].includes('THREE.Timer'))) return;
            originalWarn(...args);
        };
        return () => { console.warn = originalWarn; };
    }, []);

    useEffect(() => {
        const fetchTrophies = async () => {
            try {
                const res = await api.get('/analytics/profile');
                setUnlockedBadges(res.data.badges || {});
            } catch (err) {
                console.error("Failed to fetch trophies", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrophies();
    }, []);

    return (
        <div className="h-screen w-screen bg-black relative overflow-hidden">
            {/* UI Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8">
                <div className="flex items-center justify-between">
                    <button 
                        onClick={() => { console.log('Back button clicked'); navigate('/profile'); }}
                        style={{ pointerEvents: 'auto' }}
                        className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors bg-white/10 backdrop-blur-lg px-6 py-3 rounded-2xl border border-white/20 group relative z-50 cursor-pointer"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold">Back to Profile</span>
                    </button>
                    
                    <div className="text-right">
                        <h1 className="text-4xl font-black text-white tracking-tighter flex items-center justify-end space-x-3">
                            <Award className="text-amber-500" size={32} />
                            <span>Trophy Hall</span>
                        </h1>
                        <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mt-1">Interactive 3D Achievement Gallery</p>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                     <div 
                        style={{ pointerEvents: 'auto' }}
                        className="bg-white/5 backdrop-blur-md border border-white/10 px-8 py-4 rounded-[2rem] text-center"
                     >
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Navigation Tip</p>
                        <p className="text-white/80 text-xs font-bold">DRAG TO ROTATE • SCROLL TO ZOOM • CLICK TROPHIES</p>
                     </div>
                </div>
            </div>

            {loading ? (
                <div className="h-full w-full flex items-center justify-center bg-black">
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto" />
                        <p className="text-amber-500 font-bold tracking-widest uppercase text-xs">Architecting the Hall...</p>
                    </div>
                </div>
            ) : (
                <Canvas shadows={{ type: 1 }} dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={50} />
                    
                    <Suspense fallback={null}>
                        {/* Environment */}
                        <color attach="background" args={['#050505']} />
                        <fog attach="fog" args={['#050505', 10, 25]} />
                        
                        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                        <Sky sunPosition={[100, 20, 100]} />
                        <Environment preset="city" />

                        {/* Lighting */}
                        <ambientLight intensity={0.2} />
                        <spotLight 
                            position={[10, 15, 10]} 
                            angle={0.3} 
                            penumbra={1} 
                            intensity={2} 
                            castShadow 
                            shadow-mapSize={[1024, 1024]}
                        />
                        <pointLight position={[-10, 5, -10]} intensity={1} color="#3b82f6" />

                        {/* Floor */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
                            <planeGeometry args={[100, 100]} />
                            <meshStandardMaterial 
                                color="#0a0a0a" 
                                roughness={0.1}
                                metalness={0.8}
                            />
                        </mesh>
                        
                        {/* Pedestals in a circle */}
                        {badgeMap.map((b, i) => {
                            const angle = (i / badgeMap.length) * Math.PI * 2;
                            const radius = 8;
                            const x = Math.cos(angle) * radius;
                            const z = Math.sin(angle) * radius;
                            const isUnlocked = unlockedBadges[b.id]?.isUnlocked;
                            
                            return (
                                <TrophyPedestal 
                                    key={b.id}
                                    position={[x, -1.5, z]}
                                    badge={b}
                                    isUnlocked={isUnlocked}
                                />
                            );
                        })}

                        {/* Centerpiece Text */}
                        <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
                            <Text
                                position={[0, 2, 0]}
                                fontSize={0.8}
                                color="#ffffff"
                                anchorX="center"
                                anchorY="middle"
                                opacity={0.2}
                            >
                                EXIT-IT
                            </Text>
                        </Float>

                        {/* Controls */}
                        <OrbitControls 
                            enablePan={false}
                            maxPolarAngle={Math.PI / 2.1}
                            minDistance={5}
                            maxDistance={20}
                            autoRotate
                            autoRotateSpeed={0.5}
                        />

                        <ContactShadows position={[0, -2.9, 0]} opacity={0.5} scale={30} blur={2.5} far={4} />
                    </Suspense>
                </Canvas>
            )}
        </div>
    );
};

export default TrophyRoom;
