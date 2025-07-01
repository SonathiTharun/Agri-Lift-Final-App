import React, { useState, useEffect } from "react";

const breeds = ["Gir", "Sahiwal", "Holstein Friesian (HF)", "Jersey", "Murrah Buffalo"];
const locations = ["Hyderabad", "Warangal", "Vijayawada", "Guntur", "Bangalore"];
const ages = ["Calf", "Heifer", "In-milk cow"];
const certifications = ["Genetic History", "Vaccination Records"];

const defaultForm = {
  name: "",
  breed: "",
  location: "",
  age: "",
  lactation: 0,
  yield: 0,
  certifications: [],
  seller: "",
  healthRecords: [],
  images: [],
};

const BACKEND_URL = "http://localhost:5006";

const LivestockMarket = () => {
  const [filters, setFilters] = useState<{
    breed: string;
    location: string;
    age: string;
    certification: string | string[];
  }>({
    breed: "",
    location: "",
    age: "",
    certification: "",
  });
  const [animals, setAnimals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState<any | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<any>(defaultForm);
  const [formImages, setFormImages] = useState<File[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<any | null>(null);
  const [editImages, setEditImages] = useState<File[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAnimal, setDeletingAnimal] = useState<any | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [yieldRange, setYieldRange] = useState<[number, number]>([0, 100]);
  const [lactationRange, setLactationRange] = useState<[number, number]>([0, 100]);

  // Fetch animals
  const fetchAnimals = () => {
    setLoading(true);
    fetch("/api/livestock")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch livestock");
        return res.json();
      })
      .then(data => {
        setAnimals(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch =
      animal.name.toLowerCase().includes(search.toLowerCase()) ||
      animal.breed.toLowerCase().includes(search.toLowerCase()) ||
      animal.location.toLowerCase().includes(search.toLowerCase());
    const matchesBreed = !filters.breed || animal.breed === filters.breed;
    const matchesLocation = !filters.location || animal.location.includes(filters.location);
    const matchesAge = !filters.age || animal.age === filters.age;
    const matchesCert =
      !filters.certification ||
      (Array.isArray(filters.certification)
        ? filters.certification.every((c: string) => animal.certifications && animal.certifications.includes(c))
        : animal.certifications && animal.certifications.includes(filters.certification));
    const matchesYield = animal.yield >= yieldRange[0] && animal.yield <= yieldRange[1];
    const matchesLactation = animal.lactation >= lactationRange[0] && animal.lactation <= lactationRange[1];
    return (
      matchesSearch &&
      matchesBreed &&
      matchesLocation &&
      matchesAge &&
      matchesCert &&
      matchesYield &&
      matchesLactation
    );
  });

  // Profile modal
  const openProfile = (animal: any) => {
    setSelectedAnimal(animal);
    setShowProfile(true);
  };
  const closeProfile = () => {
    setShowProfile(false);
    setSelectedAnimal(null);
  };

  // Add listing modal
  const openAdd = () => {
    setForm(defaultForm);
    setFormImages([]);
    setError("");
    setShowAdd(true);
  };
  const closeAdd = () => {
    setShowAdd(false);
    setError("");
  };

  // Handle add form submit
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("breed", form.breed);
      formData.append("location", form.location);
      formData.append("age", form.age);
      formData.append("lactation", String(form.lactation));
      formData.append("yield", String(form.yield));
      formData.append("seller", form.seller);
      formData.append("certifications", JSON.stringify(form.certifications));
      formData.append("healthRecords", JSON.stringify(form.healthRecords));
      if (formImages.length > 0) {
        formImages.forEach(img => formData.append("images", img));
      }
      const res = await fetch("/api/livestock", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to add listing");
      closeAdd();
      fetchAnimals();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Edit functionality
  const openEdit = (animal: any) => {
    console.log("Opening edit for animal:", animal);
    setEditingAnimal(animal);
    setForm({
      name: animal.name,
      breed: animal.breed,
      location: animal.location,
      age: animal.age,
      lactation: animal.lactation,
      yield: animal.yield,
      certifications: animal.certifications || [],
      seller: animal.seller,
      healthRecords: animal.healthRecords || [],
    });
    setEditImages([]);
    setError("");
    setShowEdit(true);
  };
  const closeEdit = () => {
    setShowEdit(false);
    setEditingAnimal(null);
    setError("");
  };

  // Handle edit form submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting edit for animal:", editingAnimal);
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("breed", form.breed);
      formData.append("location", form.location);
      formData.append("age", form.age);
      formData.append("lactation", String(form.lactation));
      formData.append("yield", String(form.yield));
      formData.append("seller", form.seller);
      formData.append("certifications", JSON.stringify(form.certifications));
      formData.append("healthRecords", JSON.stringify(form.healthRecords));
      if (editImages.length > 0) {
        editImages.forEach(img => formData.append("images", img));
      }
      console.log("Sending PUT request to:", `/api/livestock/${editingAnimal._id}`);
      const res = await fetch(`/api/livestock/${editingAnimal._id}`, {
        method: "PUT",
        body: formData,
      });
      console.log("Edit response status:", res.status);
      if (!res.ok) {
        const errorText = await res.text();
        console.log("Edit error response:", errorText);
        throw new Error("Failed to update listing");
      }
      closeEdit();
      fetchAnimals();
    } catch (err: any) {
      console.log("Edit error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete functionality
  const openDeleteConfirm = (animal: any) => {
    console.log("Opening delete confirm for animal:", animal);
    setDeletingAnimal(animal);
    setShowDeleteConfirm(true);
  };
  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setDeletingAnimal(null);
  };
  const handleDelete = async () => {
    console.log("Deleting animal:", deletingAnimal);
    setDeleteLoading(true);
    try {
      console.log("Sending DELETE request to:", `/api/livestock/${deletingAnimal._id}`);
      const res = await fetch(`/api/livestock/${deletingAnimal._id}`, {
        method: "DELETE",
      });
      console.log("Delete response status:", res.status);
      if (!res.ok) {
        const errorText = await res.text();
        console.log("Delete error response:", errorText);
        throw new Error("Failed to delete listing");
      }
      closeDeleteConfirm();
      fetchAnimals();
    } catch (err: any) {
      console.log("Delete error:", err);
      setError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 pb-16">
      {/* Hero */}
      <section className="relative w-full h-64 flex items-center justify-center mb-10">
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" alt="Livestock Hero" className="absolute inset-0 w-full h-full object-cover brightness-75" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg animate-fadeInUp">Livestock Market</h1>
          <p className="mt-4 text-lg md:text-2xl text-white/90 font-medium animate-fadeInUp delay-100">Buy and sell dairy animals with confidence. Trusted by farmers across India.</p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-12 border border-blue-100 flex flex-col md:flex-row md:items-center gap-6 animate-fadeIn">
        <input
          type="text"
          className="rounded-xl border border-blue-200 px-5 py-3 w-full md:w-72 text-lg shadow focus:ring-2 focus:ring-blue-400 transition-all duration-200"
          placeholder="Search by name, breed, location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="rounded-xl border border-blue-200 px-4 py-3 text-lg shadow" value={filters.breed} onChange={e => setFilters(f => ({ ...f, breed: e.target.value }))}>
          <option value="">Breed</option>
          {breeds.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select className="rounded-xl border border-blue-200 px-4 py-3 text-lg shadow" value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}>
          <option value="">Location</option>
          {locations.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select className="rounded-xl border border-blue-200 px-4 py-3 text-lg shadow" value={filters.age} onChange={e => setFilters(f => ({ ...f, age: e.target.value }))}>
          <option value="">Age/Lactation</option>
          {ages.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select
          multiple
          className="rounded-xl border border-blue-200 px-4 py-3 text-lg shadow"
          value={Array.isArray(filters.certification) ? filters.certification : filters.certification ? [filters.certification] : []}
          onChange={e => setFilters(f => ({ ...f, certification: Array.from(e.target.selectedOptions, (option: any) => option.value) }))}
        >
          {certifications.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="rounded-xl bg-gradient-to-r from-blue-400 to-emerald-400 text-white font-bold px-6 py-3 shadow hover:scale-105 transition-all duration-200" onClick={() => { setFilters({ breed: "", location: "", age: "", certification: "" }); setSearch(""); }}>Clear</button>
      </section>

      {/* Animal Listings */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-16 px-4 animate-fadeInUp">
        {loading && <div className="col-span-full text-center text-blue-600 font-bold animate-pulse">Loading livestock...</div>}
        {error && <div className="col-span-full text-center text-red-600 font-bold animate-fadeIn">{error}</div>}
        {!loading && !error && filteredAnimals.length === 0 && (
          <div className="col-span-full text-center text-gray-500 animate-fadeIn">No animals found matching your filters.</div>
        )}
        {!loading && !error && filteredAnimals.map(animal => (
          <div key={animal._id} className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-6 flex flex-col items-center border border-blue-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group relative overflow-hidden animate-fadeInUp">
            <div className="relative w-44 h-44 mb-4">
              {animal.images && animal.images.length > 0 ? (
                <>
                  <img src={animal.images[0]} alt={animal.name} className="w-44 h-44 object-cover rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300" />
                  {animal.images.length > 1 && (
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      {animal.images.slice(1, 4).map((img: string, idx: number) => (
                        <img key={idx} src={img} alt="thumb" className="w-9 h-9 object-cover rounded border-2 border-white shadow" />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <img src="https://via.placeholder.com/160x160?text=No+Image" alt={animal.name} className="w-44 h-44 object-cover rounded-2xl shadow-md" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-blue-800 mb-1 group-hover:text-emerald-600 transition-colors duration-200">{animal.name}</h3>
            <div className="text-gray-700 mb-1">Breed: <span className="font-semibold">{animal.breed}</span></div>
            <div className="text-gray-700 mb-1">Location: <span className="font-semibold">{animal.location}</span></div>
            <div className="text-gray-700 mb-1">Milk Yield: <span className="font-semibold">{animal.yield} L/day</span></div>
            <div className="text-gray-700 mb-1">Age: <span className="font-semibold">{animal.age}</span></div>
            <div className="text-gray-700 mb-1">Certifications: <span className="font-semibold">{(animal.certifications && animal.certifications.join(", ")) || "None"}</span></div>
            <div className="text-gray-700 mb-1">Seller: <span className="font-semibold">{animal.seller}</span></div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => openProfile(animal)} className="bg-gradient-to-r from-blue-500 via-emerald-500 to-cyan-500 text-white font-bold py-2 px-6 rounded-full shadow hover:scale-105 transition-all duration-200">View Profile</button>
              <button onClick={() => openEdit(animal)} className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-2 px-6 rounded-full shadow hover:scale-105 transition-all duration-200">Edit</button>
              <button onClick={() => openDeleteConfirm(animal)} className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-2 px-6 rounded-full shadow hover:scale-105 transition-all duration-200">Delete</button>
            </div>
          </div>
        ))}
      </section>

      {/* Animal Profile Modal */}
      {showProfile && selectedAnimal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fadeIn">
            <button onClick={closeProfile} className="absolute top-4 right-4 text-2xl text-blue-700 hover:text-blue-900">&times;</button>
            <div className="flex flex-col items-center">
              {selectedAnimal.images && selectedAnimal.images.length > 0 ? (
                <div className="flex gap-2 mb-4 overflow-x-auto">
                  {selectedAnimal.images.map((img: string, idx: number) => (
                    <img key={idx} src={img} alt={selectedAnimal.name + ' ' + (idx + 1)} className="w-40 h-40 object-cover rounded-xl shadow-md" />
                  ))}
                </div>
              ) : (
                <img src="https://via.placeholder.com/160x160?text=No+Image" alt={selectedAnimal.name} className="w-40 h-40 object-cover rounded-xl mb-4 shadow-md" />
              )}
              <h2 className="text-2xl font-bold text-blue-800 mb-2">{selectedAnimal.name}</h2>
              <div className="text-gray-700 mb-1">Breed: <span className="font-semibold">{selectedAnimal.breed}</span></div>
              <div className="text-gray-700 mb-1">Location: <span className="font-semibold">{selectedAnimal.location}</span></div>
              <div className="text-gray-700 mb-1">Milk Yield: <span className="font-semibold">{selectedAnimal.yield} L/day</span></div>
              <div className="text-gray-700 mb-1">Age: <span className="font-semibold">{selectedAnimal.age}</span></div>
              <div className="text-gray-700 mb-1">Lactation: <span className="font-semibold">{selectedAnimal.lactation}</span></div>
              <div className="text-gray-700 mb-1">Certifications: <span className="font-semibold">{(selectedAnimal.certifications && selectedAnimal.certifications.join(", ")) || "None"}</span></div>
              <div className="text-gray-700 mb-1">Seller: <span className="font-semibold">{selectedAnimal.seller}</span></div>
              <div className="text-gray-700 mb-1">Health Records: <span className="font-semibold">{(selectedAnimal.healthRecords && selectedAnimal.healthRecords.length > 0) ? selectedAnimal.healthRecords.map((url: string, i: number) => <a key={i} href={url} className="text-blue-600 underline ml-1" target="_blank" rel="noopener noreferrer">Doc {i + 1}</a>) : "None"}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* How to List Your Cattle Guide */}
      <section className="max-w-3xl mx-auto bg-white/80 backdrop-blur rounded-2xl shadow-lg p-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">How to List Your Cattle</h2>
        <ol className="list-decimal list-inside text-lg text-gray-700 space-y-2">
          <li>Register or log in to your Dairy-Lift account.</li>
          <li>Click on "Sell Your Cattle" and fill in all details (photos, breed, yield, health records).</li>
          <li>Submit your listing. Our team will verify and publish it for buyers to see.</li>
        </ol>
        <div className="mt-6 text-center">
          <button onClick={openAdd} className="bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 text-white font-bold py-2 px-8 rounded-full shadow hover:scale-105 transition-all duration-200">
            List Your Cattle
          </button>
        </div>
      </section>

      {/* Add Listing Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={handleAddSubmit} className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fadeIn">
            <button onClick={closeAdd} type="button" className="absolute top-4 right-4 text-2xl text-blue-700 hover:text-blue-900">&times;</button>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">List Your Cattle</h2>
            <div className="grid grid-cols-1 gap-4">
              <input required className="rounded-lg border border-blue-200 px-4 py-2" placeholder="Name" value={form.name} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} />
              <select required className="rounded-lg border border-blue-200 px-4 py-2" value={form.breed} onChange={e => setForm((f: any) => ({ ...f, breed: e.target.value }))}>
                <option value="">Breed</option>
                {breeds.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <input required className="rounded-lg border border-blue-200 px-4 py-2" placeholder="Location" value={form.location} onChange={e => setForm((f: any) => ({ ...f, location: e.target.value }))} />
              <select required className="rounded-lg border border-blue-200 px-4 py-2" value={form.age} onChange={e => setForm((f: any) => ({ ...f, age: e.target.value }))}>
                <option value="">Age/Lactation</option>
                {ages.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <input type="number" min={0} className="rounded-lg border border-blue-200 px-4 py-2" placeholder="Lactation" value={form.lactation} onChange={e => setForm((f: any) => ({ ...f, lactation: Number(e.target.value) }))} />
              <input type="number" min={0} className="rounded-lg border border-blue-200 px-4 py-2" placeholder="Milk Yield (L/day)" value={form.yield} onChange={e => setForm((f: any) => ({ ...f, yield: Number(e.target.value) }))} />
              <select multiple className="rounded-lg border border-blue-200 px-4 py-2" value={form.certifications} onChange={e => setForm((f: any) => ({ ...f, certifications: Array.from(e.target.selectedOptions, (option: any) => option.value) }))}>
                {certifications.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input required className="rounded-lg border border-blue-200 px-4 py-2" placeholder="Seller Name" value={form.seller} onChange={e => setForm((f: any) => ({ ...f, seller: e.target.value }))} />
              <input type="file" accept="image/*" multiple className="rounded-lg border border-blue-200 px-4 py-2" onChange={e => setFormImages(e.target.files ? Array.from(e.target.files) : [])} />
            </div>
            {formImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formImages.map((img, idx) => (
                  <img key={idx} src={URL.createObjectURL(img)} alt="preview" className="w-16 h-16 object-cover rounded" />
                ))}
              </div>
            )}
            {error && <div className="text-red-600 text-center mt-2">{error}</div>}
            <button type="submit" disabled={formLoading} className="w-full mt-6 bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 text-white font-bold py-2 px-8 rounded-full shadow hover:scale-105 transition-all duration-200 disabled:opacity-60">
              {formLoading ? "Listing..." : "Submit Listing"}
            </button>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={handleEditSubmit} className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fadeIn">
            <button onClick={closeEdit} type="button" className="absolute top-4 right-4 text-2xl text-blue-700 hover:text-blue-900">&times;</button>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">Edit Cattle Listing</h2>
            <div className="grid grid-cols-1 gap-4">
              <input required className="rounded-lg border border-blue-200 px-4 py-2" placeholder="Name" value={form.name} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} />
              <select required className="rounded-lg border border-blue-200 px-4 py-2" value={form.breed} onChange={e => setForm((f: any) => ({ ...f, breed: e.target.value }))}>
                <option value="">Breed</option>
                {breeds.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <input required className="rounded-lg border border-blue-200 px-4 py-2" placeholder="Location" value={form.location} onChange={e => setForm((f: any) => ({ ...f, location: e.target.value }))} />
              <select required className="rounded-lg border border-blue-200 px-4 py-2" value={form.age} onChange={e => setForm((f: any) => ({ ...f, age: e.target.value }))}>
                <option value="">Age/Lactation</option>
                {ages.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <input type="number" min={0} className="rounded-lg border border-blue-200 px-4 py-2" placeholder="Lactation" value={form.lactation} onChange={e => setForm((f: any) => ({ ...f, lactation: Number(e.target.value) }))} />
              <input type="number" min={0} className="rounded-lg border border-blue-200 px-4 py-2" placeholder="Milk Yield (L/day)" value={form.yield} onChange={e => setForm((f: any) => ({ ...f, yield: Number(e.target.value) }))} />
              <select multiple className="rounded-lg border border-blue-200 px-4 py-2" value={form.certifications} onChange={e => setForm((f: any) => ({ ...f, certifications: Array.from(e.target.selectedOptions, (option: any) => option.value) }))}>
                {certifications.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input required className="rounded-lg border border-blue-200 px-4 py-2" placeholder="Seller Name" value={form.seller} onChange={e => setForm((f: any) => ({ ...f, seller: e.target.value }))} />
              <input type="file" accept="image/*" multiple className="rounded-lg border border-blue-200 px-4 py-2" onChange={e => setEditImages(e.target.files ? Array.from(e.target.files) : [])} />
            </div>
            {editImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {editImages.map((img, idx) => (
                  <img key={idx} src={URL.createObjectURL(img)} alt="preview" className="w-16 h-16 object-cover rounded" />
                ))}
              </div>
            )}
            {error && <div className="text-red-600 text-center mt-2">{error}</div>}
            <button type="submit" disabled={loading} className="w-full mt-6 bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 text-white font-bold py-2 px-8 rounded-full shadow hover:scale-105 transition-all duration-200 disabled:opacity-60">
              {loading ? "Updating..." : "Update Listing"}
            </button>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
            <h2 className="text-2xl font-bold text-red-800 mb-4 text-center">Delete Listing</h2>
            <p className="text-gray-700 mb-6 text-center">Are you sure you want to delete "{deletingAnimal?.name}"? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button onClick={closeDeleteConfirm} className="flex-1 bg-gray-500 text-white font-bold py-2 px-6 rounded-full shadow hover:scale-105 transition-all duration-200">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleteLoading} className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-2 px-6 rounded-full shadow hover:scale-105 transition-all duration-200 disabled:opacity-60">
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating action button for 'List Your Cattle' */}
      <button onClick={openAdd} className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 text-white font-bold py-4 px-8 rounded-full shadow-2xl hover:scale-110 hover:shadow-emerald-400/40 transition-all duration-300 animate-bounce">
        + List Your Cattle
      </button>
    </div>
  );
};

export default LivestockMarket; 