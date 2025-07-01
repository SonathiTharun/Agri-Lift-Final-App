import React from "react";
import { useNavigate } from "react-router-dom";

const serviceBlocks = [
    {
        label: "Find Your Next Cow",
        icon: "🐄",
        link: "/dairy-lift/livestock-market",
        color: "from-amber-200 via-yellow-300 to-amber-400",
    },
    {
        label: "Sell Your Milk",
        icon: "🥛",
        link: "/dairy-lift/sell-produce",
        color: "from-blue-200 via-cyan-200 to-blue-300",
    },
    {
        label: "Buy Farming Machines",
        icon: "🚜",
        link: "/dairy-lift/equipment-mart",
        color: "from-green-200 via-emerald-200 to-teal-200",
    },
    {
        label: "Expert Farming Advice",
        icon: "📚",
        link: "/dairy-lift/knowledge-hub",
        color: "from-purple-200 via-indigo-200 to-purple-300",
    },
];

const testimonials = [
    {
        name: "Ramesh, Telangana",
        quote: "Dairy-Lift helped me get better prices for my milk and buy healthy cows easily!",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        name: "Lakshmi, Andhra Pradesh",
        quote: "The advice and market info is a game changer for my dairy business.",
        img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        name: "Suresh, Karnataka",
        quote: "I found the best feed deals and sold my old tractor in a day!",
        img: "https://randomuser.me/api/portraits/men/65.jpg",
    },
];

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 pb-16">
            {/* Hero Section */}
            <section className="max-w-5xl mx-auto text-center py-12 px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                    Maximize Your Dairy Profits. Everything You Need, All in One Place.
                </h1>
                <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                    Buy, sell, and manage your dairy farm with confidence. Trusted by farmers across South India.
                </p>
            </section>

            {/* Core Service Blocks */}
            <section className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12 px-4">
                {serviceBlocks.map((block) => (
                    <button
                        key={block.label}
                        onClick={() => navigate(block.link)}
                        className={`flex flex-col items-center justify-center rounded-3xl shadow-xl bg-gradient-to-br ${block.color} p-8 hover:scale-105 hover:shadow-2xl transition-all duration-300 group`}
                    >
                        <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">{block.icon}</span>
                        <span className="text-lg font-bold text-gray-800 group-hover:text-blue-700 text-center">
                            {block.label}
                        </span>
                    </button>
                ))}
            </section>

            {/* Live Market Ticker */}
            <section className="max-w-4xl mx-auto bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-100">
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-xl font-bold text-blue-800 mb-2">Live Market Ticker</h2>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center md:justify-start">
                        <div>
                            <span className="font-semibold text-emerald-700">Milk Price (avg):</span> ₹44/L (Telangana)
                        </div>
                        <div>
                            <span className="font-semibold text-amber-700">Cattle (HF Cow):</span> ₹75,000
                        </div>
                        <div>
                            <span className="font-semibold text-cyan-700">Feed Cost (avg):</span> ₹18/kg
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 animate-pulse">
                    <span className="text-2xl">📈</span>
                    <span className="text-blue-700 font-bold">Updated Live</span>
                </div>
            </section>

            {/* How It Works */}
            <section className="max-w-4xl mx-auto mb-16 px-4">
                <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">How It Works</h2>
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    <div className="flex flex-col items-center">
                        <div className="bg-emerald-100 text-emerald-700 rounded-full w-20 h-20 flex items-center justify-center text-3xl mb-2 shadow-lg">1</div>
                        <span className="font-semibold text-gray-700">Register Your Farm</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-blue-100 text-blue-700 rounded-full w-20 h-20 flex items-center justify-center text-3xl mb-2 shadow-lg">2</div>
                        <span className="font-semibold text-gray-700">List or Find What You Need</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-purple-100 text-purple-700 rounded-full w-20 h-20 flex items-center justify-center text-3xl mb-2 shadow-lg">3</div>
                        <span className="font-semibold text-gray-700">Transact Securely</span>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="max-w-5xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">What Farmers Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t) => (
                        <div key={t.name} className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 flex flex-col items-center border border-blue-100">
                            <img src={t.img} alt={t.name} className="w-20 h-20 rounded-full mb-4 shadow-md object-cover" />
                            <blockquote className="italic text-gray-700 mb-2 text-center">“{t.quote}”</blockquote>
                            <span className="font-semibold text-blue-700">{t.name}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard; 