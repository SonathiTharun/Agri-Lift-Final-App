import React, { useEffect, useState } from "react";

const categories = [
    "Milking Machines",
    "Chaff Cutters",
    "Feed Grinders",
    "Bulk Milk Chillers",
    "TMR Wagons",
    "Pasteurizers",
    "Other",
];
const conditions = ["New", "Used"];

const mockBrands = ["DeLaval", "GEA", "Keventer", "Vijay", "Local Brand"];

const defaultForm = {
    name: "",
    category: "",
    brand: "",
    condition: "New",
    capacity: "",
    location: "",
    price: 0,
    description: "",
    images: [],
    seller: "",
    contactInfo: "",
    conditionReport: "",
};

const EquipmentMart = () => {
    const [equipment, setEquipment] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({
        category: "",
        condition: "",
        brand: "",
        location: "",
    });
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState<any>(defaultForm);
    const [formImages, setFormImages] = useState<File[]>([]);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState("");
    const [selected, setSelected] = useState<any | null>(null);
    const [showProfile, setShowProfile] = useState(false);
    const [search, setSearch] = useState("");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
    const [capacity, setCapacity] = useState("");

    // Fetch equipment listings
    const fetchEquipment = () => {
        setLoading(true);
        fetch("/api/equipment")
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch equipment");
                return res.json();
            })
            .then(data => {
                setEquipment(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchEquipment();
    }, []);

    // Filtered equipment
    const filteredEquipment = equipment.filter(eq => {
        const matchesSearch =
            eq.name.toLowerCase().includes(search.toLowerCase()) ||
            eq.brand.toLowerCase().includes(search.toLowerCase()) ||
            eq.location.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !filters.category || eq.category === filters.category;
        const matchesCondition = !filters.condition || eq.condition === filters.condition;
        const matchesBrand = !filters.brand || eq.brand === filters.brand;
        const matchesLocation = !filters.location || eq.location.toLowerCase().includes(filters.location.toLowerCase());
        const matchesPrice = eq.price >= priceRange[0] && eq.price <= priceRange[1];
        const matchesCapacity = !capacity || (eq.capacity && eq.capacity.toLowerCase().includes(capacity.toLowerCase()));
        return (
            matchesSearch &&
            matchesCategory &&
            matchesCondition &&
            matchesBrand &&
            matchesLocation &&
            matchesPrice &&
            matchesCapacity
        );
    });

    // Profile modal
    const openProfile = (eq: any) => {
        setSelected(eq);
        setShowProfile(true);
    };
    const closeProfile = () => {
        setShowProfile(false);
        setSelected(null);
    };

    // Financing partners (mock)
    const partners = [
        { name: "AgriBank", logo: "/dairy-lift-logo.png", url: "#" },
        { name: "NBFC Pro", logo: "/dairy-lift-logo.png", url: "#" },
        { name: "Farm Finance", logo: "/dairy-lift-logo.png", url: "#" },
    ];

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 pb-16">
            {/* Hero */}
            <section className="relative w-full h-64 flex items-center justify-center mb-10">
                <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80" alt="Equipment Hero" className="absolute inset-0 w-full h-full object-cover brightness-75" />
                <div className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg animate-fadeInUp">Equipment Mart</h1>
                    <p className="mt-4 text-lg md:text-2xl text-white/90 font-medium animate-fadeInUp delay-100">A marketplace for new and used dairy farming machinery.</p>
                </div>
            </section>

            {/* Filters */}
            <section className="max-w-6xl mx-auto bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-12 border border-blue-100 flex flex-wrap gap-6 items-center animate-fadeIn">
                <input type="text" className="rounded-xl border border-blue-200 px-4 py-3 text-lg shadow" placeholder="Search by name, brand, location..." value={search} onChange={e => setSearch(e.target.value)} />
                <select className="rounded-xl border border-blue-200 px-4 py-3 text-lg shadow" value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}>
                    <option value="">Category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="rounded-xl border border-blue-200 px-4 py-3 text-lg shadow" value={filters.condition} onChange={e => setFilters(f => ({ ...f, condition: e.target.value }))}>
                    <option value="">Condition</option>
                    {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="rounded-xl border border-blue-200 px-4 py-3 text-lg shadow" value={filters.brand} onChange={e => setFilters(f => ({ ...f, brand: e.target.value }))}>
                    <option value="">Brand</option>
                    {mockBrands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <input type="text" className="rounded-xl border border-blue-200 px-4 py-3 text-lg shadow" placeholder="Location" value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))} />
                <input type="number" className="rounded-xl border border-blue-200 px-4 py-3 text-lg shadow w-32" placeholder="Min Price" value={priceRange[0]} onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])} />
                <input type="number" className="rounded-xl border border-blue-200 px-4 py-3 text-lg shadow w-32" placeholder="Max Price" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])} />
                <input type="text" className="rounded-xl border border-blue-200 px-4 py-3 text-lg shadow w-32" placeholder="Capacity (e.g. 500L)" value={capacity} onChange={e => setCapacity(e.target.value)} />
                <button className="rounded-xl bg-gradient-to-r from-blue-400 to-emerald-400 text-white font-bold px-6 py-3 shadow hover:scale-105 transition-all duration-200" onClick={() => { setFilters({ category: "", condition: "", brand: "", location: "" }); setSearch(""); setPriceRange([0, 1000000]); setCapacity(""); }}>Clear</button>
            </section>

            {/* Equipment Listings */}
            <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-16 px-4 animate-fadeInUp">
                {loading && <div className="col-span-full text-center text-blue-600 font-bold animate-pulse">Loading equipment...</div>}
                {error && <div className="col-span-full text-center text-red-600 font-bold animate-fadeIn">{error}</div>}
                {!loading && !error && filteredEquipment.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 animate-fadeIn">No equipment found matching your filters.</div>
                )}
                {!loading && !error && filteredEquipment.map(eq => (
                    <div key={eq._id} className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-6 flex flex-col items-center border border-blue-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group relative overflow-hidden animate-fadeInUp">
                        <div className="relative w-44 h-44 mb-4">
                            {eq.images && eq.images.length > 0 ? (
                                <img src={eq.images[0]} alt={eq.name} className="w-44 h-44 object-cover rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300" />
                            ) : (
                                <img src="https://via.placeholder.com/160x160?text=No+Image" alt={eq.name} className="w-44 h-44 object-cover rounded-2xl shadow-md" />
                            )}
                        </div>
                        <h3 className="text-2xl font-bold text-blue-800 mb-1 group-hover:text-emerald-600 transition-colors duration-200">{eq.name}</h3>
                        <div className="text-gray-700 mb-1">Category: <span className="font-semibold">{eq.category}</span></div>
                        <div className="text-gray-700 mb-1">Brand: <span className="font-semibold">{eq.brand}</span></div>
                        <div className="text-gray-700 mb-1">Condition: <span className="font-semibold">{eq.condition}</span></div>
                        <div className="text-gray-700 mb-1">Capacity: <span className="font-semibold">{eq.capacity}</span></div>
                        <div className="text-gray-700 mb-1">Location: <span className="font-semibold">{eq.location}</span></div>
                        <div className="text-gray-700 mb-1">Price: <span className="font-semibold">₹{eq.price}</span></div>
                        <div className="text-gray-700 mb-1">Seller: <span className="font-semibold">{eq.seller}</span></div>
                        <button onClick={() => openProfile(eq)} className="mt-4 bg-gradient-to-r from-blue-500 via-emerald-500 to-cyan-500 text-white font-bold py-2 px-6 rounded-full shadow hover:scale-105 transition-all duration-200">View Details</button>
                    </div>
                ))}
            </section>

            {/* Equipment Profile Modal */}
            {showProfile && selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fadeIn">
                        <button onClick={closeProfile} className="absolute top-4 right-4 text-2xl text-blue-700 hover:text-blue-900">&times;</button>
                        <div className="flex flex-col items-center">
                            {selected.images && selected.images.length > 0 ? (
                                <div className="flex gap-2 mb-4 overflow-x-auto">
                                    {selected.images.map((img: string, idx: number) => (
                                        <img key={idx} src={img} alt={selected.name + ' ' + (idx + 1)} className="w-40 h-40 object-cover rounded-xl shadow-md" />
                                    ))}
                                </div>
                            ) : (
                                <img src="https://via.placeholder.com/160x160?text=No+Image" alt={selected.name} className="w-40 h-40 object-cover rounded-xl mb-4 shadow-md" />
                            )}
                            <h2 className="text-2xl font-bold text-blue-800 mb-2">{selected.name}</h2>
                            <div className="text-gray-700 mb-1">Category: <span className="font-semibold">{selected.category}</span></div>
                            <div className="text-gray-700 mb-1">Brand: <span className="font-semibold">{selected.brand}</span></div>
                            <div className="text-gray-700 mb-1">Condition: <span className="font-semibold">{selected.condition}</span></div>
                            <div className="text-gray-700 mb-1">Capacity: <span className="font-semibold">{selected.capacity}</span></div>
                            <div className="text-gray-700 mb-1">Location: <span className="font-semibold">{selected.location}</span></div>
                            <div className="text-gray-700 mb-1">Price: <span className="font-semibold">₹{selected.price}</span></div>
                            <div className="text-gray-700 mb-1">Seller: <span className="font-semibold">{selected.seller}</span></div>
                            <div className="text-gray-700 mb-1">Contact: <span className="font-semibold">{selected.contactInfo}</span></div>
                            {selected.condition === "Used" && selected.conditionReport && (
                                <div className="text-gray-700 mb-1">Condition Report: <span className="font-semibold">{selected.conditionReport}</span></div>
                            )}
                            <div className="text-gray-700 mb-1">Description: <span className="font-semibold">{selected.description}</span></div>
                            <div className="mt-6 w-full flex justify-center">
                                {selected.contactInfo ? (
                                    <a href={`mailto:${selected.contactInfo}`} className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-all duration-200 text-lg">
                                        Contact Seller
                                    </a>
                                ) : (
                                    <span className="text-gray-500">No contact info available</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Financing Partners */}
            <section className="max-w-5xl mx-auto mt-16 bg-white/80 backdrop-blur rounded-2xl shadow-lg p-8 border border-blue-100 animate-fadeIn">
                <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Financing Partners</h2>
                <div className="flex flex-wrap justify-center gap-8">
                    {partners.map(p => (
                        <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center bg-white rounded-xl shadow p-4 hover:scale-105 transition-all duration-200">
                            <img src={p.logo} alt={p.name} className="h-16 w-24 object-contain mb-2" />
                            <span className="font-semibold text-blue-700">{p.name}</span>
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default EquipmentMart; 