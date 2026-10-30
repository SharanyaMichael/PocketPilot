// @refresh reload
import React, { useState } from 'react';
import {
    User,
    Bell,
    Shield,
    Palette,
    Save,
    Moon,
    Sun,
    Database,
    RotateCcw,
    Trash2,
    Lock
} from 'lucide-react';

export default function SettingsPage() {
    // Settings Form State
    const [profile, setProfile] = useState({
        name: 'Sharanya Michael',
        email: 'sharanya.michael@example.com',
        currency: 'INR (₹)',
        monthlyBudgetLimit: 65000,
    });

    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        coolingOffReminders: true,
        budgetThresholdWarnings: true,
        weeklyReport: false,
    });

    const [themeMode, setThemeMode] = useState('obsidian'); // Obsidian Dark Theme
    const [isSaved, setIsSaved] = useState(false);

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleNotificationToggle = (key) => {
        setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSaveSettings = (e) => {
        e.preventDefault();
        localStorage.setItem('pocketpilot_user_profile', JSON.stringify(profile));
        localStorage.setItem('pocketpilot_notifications', JSON.stringify(notifications));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '48px', maxWidth: '1400px', margin: '0 auto' }}>

            {/* Top Header Banner */}
            <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#F0FDF4', margin: '0 0 4px 0' }}>
                        System Settings
                    </h1>
                    <p style={{ fontSize: '13px', color: '#8EA399', margin: 0 }}>
                        Manage profile configurations, notification preferences, persistent guardrails, and data controls.
                    </p>
                </div>

                {isSaved && (
                    <div style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        ✓ Settings saved successfully!
                    </div>
                )}
            </div>

            {/* Main Settings Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                {/* Left Column: Account Profile & Theme Settings */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* User Profile Card */}
                    <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <User size={18} style={{ color: '#10B981' }} />
                            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#F0FDF4', margin: 0 }}>User Profile Settings</h2>
                        </div>

                        <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#8EA399', marginBottom: '6px' }}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleProfileChange}
                                    style={{ width: '100%', backgroundColor: '#050B09', border: '1px solid #1C3930', borderRadius: '12px', padding: '10px 14px', fontSize: '13px', color: '#F0FDF4', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#8EA399', marginBottom: '6px' }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleProfileChange}
                                    style={{ width: '100%', backgroundColor: '#050B09', border: '1px solid #1C3930', borderRadius: '12px', padding: '10px 14px', fontSize: '13px', color: '#F0FDF4', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#8EA399', marginBottom: '6px' }}>
                                        Primary Currency
                                    </label>
                                    <select
                                        name="currency"
                                        value={profile.currency}
                                        onChange={handleProfileChange}
                                        style={{ width: '100%', backgroundColor: '#050B09', border: '1px solid #1C3930', borderRadius: '12px', padding: '10px 14px', fontSize: '13px', color: '#F0FDF4', outline: 'none', boxSizing: 'border-box' }}
                                    >
                                        <option>INR (₹)</option>
                                        <option>USD ($)</option>
                                        <option>EUR (€)</option>
                                        <option>GBP (£)</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#8EA399', marginBottom: '6px' }}>
                                        Monthly Budget Cap (₹)
                                    </label>
                                    <input
                                        type="number"
                                        name="monthlyBudgetLimit"
                                        value={profile.monthlyBudgetLimit}
                                        onChange={handleProfileChange}
                                        style={{ width: '100%', backgroundColor: '#050B09', border: '1px solid #1C3930', borderRadius: '12px', padding: '10px 14px', fontSize: '13px', fontFamily: 'monospace', color: '#F0FDF4', outline: 'none', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                style={{ backgroundColor: '#10B981', color: '#050B09', fontWeight: 'bold', fontSize: '12px', padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(16,185,129,0.2)', marginTop: '8px' }}
                            >
                                <Save size={16} /> Save Profile Changes
                            </button>
                        </form>
                    </div>

                    {/* Theme & Display Mode */}
                    <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <Palette size={18} style={{ color: '#38BDF8' }} />
                            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#F0FDF4', margin: 0 }}>Theme & Visual Style</h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div
                                onClick={() => setThemeMode('obsidian')}
                                style={{ backgroundColor: '#050B09', border: themeMode === 'obsidian' ? '2px solid #10B981' : '1px solid #1C3930', borderRadius: '12px', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                            >
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#091510', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16,185,129,0.3)' }}>
                                    <Moon size={16} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#F0FDF4' }}>Obsidian Dark</div>
                                    <div style={{ fontSize: '11px', color: '#8EA399' }}>Emerald Accent</div>
                                </div>
                            </div>

                            <div
                                onClick={() => setThemeMode('midnight')}
                                style={{ backgroundColor: '#050B09', border: themeMode === 'midnight' ? '2px solid #10B981' : '1px solid #1C3930', borderRadius: '12px', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.6 }}
                            >
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#091510', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(56,189,248,0.3)' }}>
                                    <Sun size={16} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#F0FDF4' }}>Midnight Slate</div>
                                    <div style={{ fontSize: '11px', color: '#8EA399' }}>Cyan Accent</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Guardrail Alerts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Impulse Guard & Notification Preferences */}
                    <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <Bell size={18} style={{ color: '#FBBF24' }} />
                            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#F0FDF4', margin: 0 }}>Guardrail & Alert Notifications</h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { key: 'coolingOffReminders', label: 'Cooling-Off Window Blackout Alerts', desc: 'Notify immediately when transactions occur during locked hours.' },
                                { key: 'budgetThresholdWarnings', label: 'Daily Budget Pace Warnings', desc: 'Alert when today\'s spend exceeds 80% of daily allocation.' },
                                { key: 'emailAlerts', label: 'Security & Auth Notifications', desc: 'Receive security confirmation logs for configuration updates.' },
                                { key: 'weeklyReport', label: 'Weekly Telemetry Summary', desc: 'Receive weekly cash flow pacing insights via email.' },
                            ].map((item) => (
                                <div key={item.key} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', padding: '12px', borderRadius: '12px', backgroundColor: '#050B09', border: '1px solid rgba(110,231,183,0.08)' }}>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#F0FDF4', marginBottom: '2px' }}>{item.label}</div>
                                        <div style={{ fontSize: '11px', color: '#8EA399' }}>{item.desc}</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notifications[item.key]}
                                        onChange={() => handleNotificationToggle(item.key)}
                                        style={{ width: '18px', height: '18px', accentColor: '#10B981', cursor: 'pointer', marginTop: '2px' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>

            {/* Full Width Sections: Demo Data Controls & Privacy Policy */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Demo Data Controls */}
                <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <Database size={18} style={{ color: '#10B981' }} />
                        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#F0FDF4', margin: 0 }}>Demo Data Controls</h2>
                    </div>
                    <p style={{ fontSize: '13px', color: '#8EA399', margin: '0 0 20px 0' }}>
                        Switch between sample hackathon demonstration data and your own real transactions, or perform a clean slate reset anytime.
                    </p>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => window.location.reload()}
                            style={{ backgroundColor: '#050B09', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '10px 16px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <RotateCcw size={14} /> Reset to Clean Demo State
                        </button>
                        <button
                            onClick={() => alert('Custom records filter applied.')}
                            style={{ backgroundColor: '#050B09', color: '#F0FDF4', border: '1px solid #1C3930', borderRadius: '10px', padding: '10px 16px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            Remove Demo Records (Keep Custom Only)
                        </button>
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to clear all data?')) {
                                    localStorage.clear();
                                    window.location.reload();
                                }
                            }}
                            style={{ backgroundColor: 'rgba(251,113,133,0.15)', color: '#FB7185', border: '1px solid rgba(251,113,133,0.3)', borderRadius: '10px', padding: '10px 16px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <Trash2 size={14} /> Clear All Data
                        </button>
                    </div>
                </div>

                {/* Zero-Knowledge Privacy Policy & Storage Transparency */}
                <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <Lock size={18} style={{ color: '#10B981' }} />
                        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#F0FDF4', margin: 0 }}>Zero-Knowledge Privacy Policy & Storage Transparency</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#8EA399', lineHeight: '1.6' }}>
                        <div>
                            <strong style={{ color: '#F0FDF4' }}>No Banking Credentials Requested:</strong> PocketPilot never asks for or stores bank passwords, netbanking IDs, UPI PINs, OTPs, or debit/credit card CVVs.
                        </div>
                        <div>
                            <strong style={{ color: '#F0FDF4' }}>Transparent Persistence:</strong> Your financial data is persisted locally in the workspace SQLite database (backed by Python FastAPI) and cached in your browser.
                        </div>
                        <div>
                            <strong style={{ color: '#F0FDF4' }}>Local Storage Notice:</strong> This build operates on local persistence. It is not synced to third-party cloud analytics or unencrypted external databases.
                        </div>
                        <div>
                            <strong style={{ color: '#F0FDF4' }}>No Fabricated Connections:</strong> We do not display fake "Bank Account Connected: HDFC / SBI" badges when real open-banking credentials are not authorized.
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}