import { useState, useEffect } from 'react';

const CATEGORIES = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback', 'Van', 'Electric', 'Hybrid'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid (Petrol + Electric)', 'CNG'];
const TRANSMISSIONS = ['Automatic', 'Manual', 'Single-Speed Fixed', 'e-CVT Automatic', '8-Speed Automatic'];

export default function VehicleForm({ vehicle = null, onSubmit, onCancel, loading = false }) {
  const isEdit = !!vehicle;

  const [form, setForm] = useState({
    make: vehicle?.make ?? '',
    model: vehicle?.model ?? '',
    category: vehicle?.category ?? '',
    price: vehicle?.price?.toString() ?? '',
    quantity: vehicle?.quantity?.toString() ?? '',
    imageUrl: vehicle?.imageUrl ?? '',
    year: vehicle?.year?.toString() ?? '2024',
    fuelType: vehicle?.fuelType ?? 'Petrol',
    transmission: vehicle?.transmission ?? 'Automatic',
    mileage: vehicle?.mileage ?? '',
    seating: vehicle?.seating?.toString() ?? '5',
    description: vehicle?.description ?? '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (vehicle) {
      setForm({
        make: vehicle.make,
        model: vehicle.model,
        category: vehicle.category,
        price: vehicle.price.toString(),
        quantity: vehicle.quantity.toString(),
        imageUrl: vehicle.imageUrl ?? '',
        year: vehicle.year?.toString() ?? '2024',
        fuelType: vehicle.fuelType ?? 'Petrol',
        transmission: vehicle.transmission ?? 'Automatic',
        mileage: vehicle.mileage ?? '',
        seating: vehicle.seating?.toString() ?? '5',
        description: vehicle.description ?? '',
      });
    }
  }, [vehicle]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.make || !form.model || !form.category || !form.price || !form.quantity) {
      setError('All basic fields are required.');
      return;
    }

    const price = parseFloat(form.price);
    const quantity = parseInt(form.quantity, 10);
    const year = parseInt(form.year, 10);
    const seating = parseInt(form.seating, 10);

    if (isNaN(price) || price <= 0) { setError('Price must be a positive number.'); return; }
    if (isNaN(quantity) || quantity < 0) { setError('Quantity must be a non-negative integer.'); return; }

    try {
      await onSubmit({
        make: form.make,
        model: form.model,
        category: form.category,
        price,
        quantity,
        imageUrl: form.imageUrl.trim() || undefined,
        year: isNaN(year) ? 2024 : year,
        fuelType: form.fuelType,
        transmission: form.transmission,
        mileage: form.mileage.trim() || undefined,
        seating: isNaN(seating) ? 5 : seating,
        description: form.description.trim() || undefined,
      });
    } catch (err) {
      setError(err.response?.data?.error ?? 'An error occurred.');
    }
  }

  return (
    <form id="vehicle-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="label" htmlFor="v-make">Make / Brand</label>
          <input id="v-make" type="text" placeholder="e.g. Toyota" value={form.make} onChange={(e) => setForm((p) => ({ ...p, make: e.target.value }))} className="input" required />
        </div>
        <div>
          <label className="label" htmlFor="v-model">Model Name</label>
          <input id="v-model" type="text" placeholder="e.g. Camry Hybrid" value={form.model} onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))} className="input" required />
        </div>
        <div>
          <label className="label" htmlFor="v-category">Category Body Style</label>
          <select id="v-category" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="input" required>
            <option value="">Select category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="v-price">Ex-Showroom Price (₹ INR)</label>
          <input id="v-price" type="number" placeholder="e.g. 4600000" min={0} step={1000} value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className="input" required />
        </div>
        <div>
          <label className="label" htmlFor="v-quantity">Stock Quantity</label>
          <input id="v-quantity" type="number" placeholder="e.g. 5" min={0} step={1} value={form.quantity} onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))} className="input" required />
        </div>
        <div>
          <label className="label" htmlFor="v-year">Model Year</label>
          <input id="v-year" type="number" placeholder="2024" min={1900} max={2030} value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="v-fuel">Fuel Type</label>
          <select id="v-fuel" value={form.fuelType} onChange={(e) => setForm((p) => ({ ...p, fuelType: e.target.value }))} className="input">
            {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="v-trans">Transmission</label>
          <select id="v-trans" value={form.transmission} onChange={(e) => setForm((p) => ({ ...p, transmission: e.target.value }))} className="input">
            {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="v-mileage">Mileage / Range</label>
          <input id="v-mileage" type="text" placeholder="e.g. 23.2 km/l or 500 km" value={form.mileage} onChange={(e) => setForm((p) => ({ ...p, mileage: e.target.value }))} className="input" />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="label" htmlFor="v-image">Image URL (High-Res Unsplash URL)</label>
          <input id="v-image" type="url" placeholder="https://images.unsplash.com/..." value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} className="input" />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="label" htmlFor="v-desc">Vehicle Description &amp; Highlights</label>
          <textarea id="v-desc" rows={3} placeholder="Brief summary of vehicle features, engine, performance..." value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="input" />
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button id="vehicle-form-submit-btn" type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Saving...' : isEdit ? 'Update Vehicle' : 'Add Vehicle to Inventory'}
        </button>
        <button id="vehicle-form-cancel-btn" type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
}
