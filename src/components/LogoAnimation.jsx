import React, { useState } from 'react';
import './LogoAnimation.css';

export default function LogoAnimation() {
    const [key, setKey] = useState(0);

    const handleReplay = () => {
        setKey(prev => prev + 1);
    };

    return (
        <div className="landing-container">
            <main className="scene playing" key={key} aria-label="PocketPilot animated logo">
                <div className="ring"></div>
                <span className="star s1"></span>
                <span className="star s2"></span>
                <span className="star s3"></span>
                <span className="star s4"></span>
                <span className="star s5"></span>
                <span className="star s6"></span>

                <div className="logo-lockup">
                    {/* Wallet + Checklist + Target Icon */}
                    <svg className="icon-placeholder" style={{ width: 'clamp(110px, 18vw, 190px)', height: 'auto' }} viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="20" y="25" width="55" height="70" rx="6" fill="#F0FDF4" />
                        <rect x="38" y="18" width="19" height="10" rx="3" fill="#6EE7B7" />
                        <path d="M28 42L33 47L43 37" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M28 60L33 65L43 55" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M28 78L33 83L43 73" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        
                        <circle cx="95" cy="55" r="30" fill="#07100C" stroke="#10B981" strokeWidth="6" />
                        <circle cx="95" cy="55" r="16" stroke="#6EE7B7" strokeWidth="4" />
                        <circle cx="95" cy="55" r="5" fill="#10B981" />
                        <path d="M95 25V35" stroke="#6EE7B7" strokeWidth="4" strokeLinecap="round" />
                        <path d="M110 37L117 30" stroke="#6EE7B7" strokeWidth="4" strokeLinecap="round" />

                        <rect x="18" y="76" width="105" height="52" rx="12" fill="#10B981" />
                        <path d="M92 94C92 91.7909 93.7909 90 96 90H108C110.209 90 112 91.7909 112 94V110C112 112.209 110.209 114 108 114H96C93.7909 114 92 112.209 92 110V94Z" fill="#050B09" />
                        <circle cx="102" cy="102" r="4" fill="#6EE7B7" />
                    </svg>

                    {/* Wordmark: Pocket (White with Compass O) + Pilot (Emerald Green) */}
                    <svg className="wordmark-text" style={{ width: 'clamp(280px, 58vw, 620px)', height: 'auto' }} viewBox="0 0 460 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <text x="0" y="62" fill="#F0FDF4" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="64" letterSpacing="-1.5px">P</text>
                        {/* Custom 'o' with embedded compass arrow */}
                        <g transform="translate(38, 12)">
                            <circle cx="24" cy="31" r="23" fill="none" stroke="#F0FDF4" strokeWidth="11" />
                            <path d="M17 37L31 21L24 40L20 33L17 37Z" fill="#10B981" />
                        </g>
                        <text x="86" y="62" fill="#F0FDF4" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="64" letterSpacing="-1.5px">cket</text>
                        <text x="210" y="62" fill="#10B981" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="64" letterSpacing="-1.5px">Pilot</text>
                    </svg>
                </div>

                <div className="controls">
                    <button onClick={handleReplay}>Replay Animation</button>
                </div>
            </main>
        </div>
    );
}