import React, { useState } from 'react';
import './LogoAnimation.css';

export default function LogoAnimation() {
    const [key, setKey] = useState(0);

    const handleReplay = () => {
        setKey(prev => prev + 1); // Triggers re-render to replay animation cleanly
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
                    <div className="icon-placeholder" style={{
                        width: 'clamp(112px, 20vw, 230px)',
                        height: 'clamp(112px, 20vw, 230px)',
                        borderRadius: '24px',
                        background: 'linear-gradient(135deg, #10B981, #059669)',
                        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
                    }} />
                    <h1 className="wordmark-text" style={{
                        color: '#F0FDF4',
                        fontSize: 'clamp(32px, 6vw, 72px)',
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                        margin: 0
                    }}>PocketPilot</h1>
                </div>

                <div className="controls">
                    <button onClick={handleReplay}>Replay Animation</button>
                </div>
            </main>
        </div>
    );
}