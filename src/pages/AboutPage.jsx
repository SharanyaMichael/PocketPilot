import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Brain,
    Tags,
    BarChart3,
    ShieldCheck,
    Eye,
    UserCheck,
    Mail,
    Compass,
    ArrowRight,
    Target
} from 'lucide-react';

export default function AboutPage() {
    const navigate = useNavigate();

    const featureCards = [
        {
            title: "AI-POWERED INSIGHTS",
            description: "Understand spending patterns through meaningful financial insights.",
            icon: Brain
        },
        {
            title: "SMART CATEGORIZATION",
            description: "Automatically organize transactions into relevant spending categories, making everyday expenses easier to understand and track.",
            icon: Tags
        },
        {
            title: "FINANCIAL FORECASTING",
            description: "Explore potential future balances and prepare for upcoming expenses.",
            icon: BarChart3
        },
        {
            title: "SMART PLANNING",
            description: "Organize savings goals and make more informed financial decisions.",
            icon: Target
        },
        {
            title: "USER CONTROL",
            description: "Stay in control of your financial information and everyday decisions.",
            icon: ShieldCheck
        }
    ];

    const philosophyCards = [
        {
            title: "CLARITY",
            description: "Financial information should be understandable and useful.",
            icon: Eye
        },
        {
            title: "TRANSPARENCY",
            description: "Insights and forecasts should communicate their assumptions and limitations.",
            icon: ShieldCheck
        },
        {
            title: "CONTROL",
            description: "Users should remain in charge of their financial information and decisions.",
            icon: UserCheck
        }
    ];

    const developers = [
        {
            name: "Sharanya Michael",
            email: "sharanya.michael9@gmail.com"
        },
        {
            name: "Nehal Singh",
            email: "nehalsingh20264@gmail.com"
        },
        {
            name: "Angel Philip",
            email: "angelsaraphilip563@gmail.com"
        },
        {
            name: "Zakia Jamil",
            email: "zakiajamil16@gmail.com"
        }
    ];

    return (
        <div className="space-y-6 pb-12 max-w-[1400px] mx-auto text-[#F0FDF4]">

            {/* Page Top Title Banner */}
            <div className="bg-[#091510] border border-[#10B981]/20 rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
                <div className="space-y-1">
                    <span className="text-xs font-bold tracking-widest text-[#10B981] uppercase">
                        ABOUT POCKETPILOT
                    </span>
                    <h1 className="text-2xl lg:text-3xl font-extrabold text-[#F0FDF4] tracking-tight">
                        System Overview & Information
                    </h1>
                    <p className="text-sm text-[#9CAFA3]">
                        Learn more about the architecture, philosophy, and team behind your financial operating system.
                    </p>
                </div>
            </div>

            {/* SECTION 1: ABOUT POCKETPILOT & FEATURES GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Left Card: Brand Introduction */}
                <div className="lg:col-span-7 bg-[#091510] border border-[#10B981]/20 rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
                    <h2 className="text-xl font-bold text-[#F0FDF4]">
                        About PocketPilot
                    </h2>

                    <blockquote className="border-l-2 border-[#10B981] pl-4 italic text-base text-[#6EE7B7] font-serif">
                        "Your money deserves a smarter direction."
                    </blockquote>

                    <div className="space-y-4 text-[#9CAFA3] text-sm lg:text-base leading-relaxed">
                        <p>
                            Managing money isn't just about knowing what you spend. It's about understanding where it goes, anticipating what comes next and making decisions with confidence.
                        </p>
                        <p>
                            PocketPilot was created with a simple vision: to make everyday financial management smarter, clearer and more accessible.
                        </p>
                        <p>
                            By bringing transaction management, smart categorization, AI-powered insights, financial forecasting and savings planning together, PocketPilot helps users turn everyday financial activity into meaningful information.
                        </p>
                        <p className="text-[#F0FDF4]/90 font-medium pt-2">
                            We believe technology should empower people, not overwhelm them. Because better financial decisions begin with better financial understanding.
                        </p>
                    </div>
                </div>

                {/* Right Column: Five Feature Cards */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    {featureCards.map((card, idx) => {
                        const CardIcon = card.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-[#091510] border border-[#10B981]/20 rounded-2xl p-4 lg:p-5 flex items-start gap-4 transition-all hover:border-[#10B981]/40 shadow-xl"
                            >
                                <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center shrink-0">
                                    <CardIcon className="w-5 h-5 text-[#10B981]" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold tracking-widest text-[#6EE7B7] uppercase mb-1">
                                        {card.title}
                                    </h3>
                                    <p className="text-xs lg:text-sm text-[#9CAFA3] leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>

            {/* SECTION 2: OUR PHILOSOPHY (Contrasting Light Theme Card) */}
            <div className="bg-[#F4F7F4] text-[#17251D] rounded-2xl p-6 lg:p-8 shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                    <div className="lg:col-span-5 space-y-4">
                        <span className="text-xs font-bold tracking-widest text-[#087A50] uppercase">
                            OUR PHILOSOPHY
                        </span>

                        <h2 className="text-2xl lg:text-3xl font-serif text-[#17251D] font-normal leading-tight">
                            Technology should empower, not overwhelm.
                        </h2>

                        <p className="text-sm lg:text-base text-[#17251D]/75 leading-relaxed">
                            We believe financial technology should make important information easier to understand, not more complicated. PocketPilot is designed around clarity, transparency and user control.
                        </p>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {philosophyCards.map((phi, idx) => {
                            const PhiIcon = phi.icon;
                            return (
                                <div
                                    key={idx}
                                    className="bg-[#FFFFFF] border border-[#E2E8E4] rounded-xl p-5 flex flex-col justify-between shadow-sm"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-[#E6F4EA] flex items-center justify-center mb-4">
                                        <PhiIcon className="w-5 h-5 text-[#087A50]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold tracking-wider text-[#087A50] uppercase mb-1">
                                            {phi.title}
                                        </h3>
                                        <p className="text-[11px] text-[#17251D]/75 leading-relaxed">
                                            {phi.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>

            {/* SECTION 3: DEVELOPED BY COFFEE CODERS */}
            <div className="bg-[#091510] border border-[#10B981]/20 rounded-2xl p-6 lg:p-8 space-y-8 shadow-xl">
                <div className="text-center max-w-xl mx-auto space-y-2">
                    <span className="text-xs font-bold tracking-widest text-[#10B981] uppercase">
                        THE TEAM BEHIND POCKETPILOT
                    </span>
                    <h2 className="text-2xl lg:text-3xl font-bold text-[#F0FDF4]">
                        Developed by Coffee Coders
                    </h2>
                    <p className="text-xs lg:text-sm text-[#9CAFA3]">
                        Built with curiosity, collaboration and a shared passion for creating smarter financial experiences.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {developers.map((dev, idx) => (
                        <div
                            key={idx}
                            className="bg-[#050B09] border border-[#10B981]/20 rounded-xl p-5 flex flex-col justify-between transition-all hover:border-[#10B981]/50 shadow-md group"
                        >
                            <div className="space-y-3">
                                <div className="w-9 h-9 rounded-lg bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center">
                                    <UserCheck className="w-4 h-4 text-[#10B981]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-[#F0FDF4] group-hover:text-[#6EE7B7] transition-colors">
                                        {dev.name}
                                    </h3>
                                </div>
                            </div>

                            <div className="pt-4 mt-4 border-t border-[#10B981]/10 flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-[#9CAFA3] shrink-0" />
                                <a
                                    href={`mailto:${dev.email}`}
                                    className="text-[11px] text-[#9CAFA3] hover:text-[#10B981] transition-colors truncate"
                                    title={dev.email}
                                >
                                    {dev.email}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}