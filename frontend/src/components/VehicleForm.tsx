import { useState, useEffect } from 'react';
import { Vehicle, CreateVehiclePayload, UpdateVehiclePayload } from '../types';

interface VehicleFormProps {
  vehicle?: Vehicle | null;
  onSubmit: (payload: CreateVehiclePayload | UpdateVehiclePayload) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const CATEGORIES = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback', 'Van', 'Electric', 'Hybrid'];

interface FormData {
  make: string;
  model: string;
  category: string;
  price: string;
  quantity: string;
}

export default function VehicleForm({ vehicle, onSubmit, onCancel, loading = false }: VehicleFormProps) {
  const isEdit = !!vehicle;

  const [form, setForm] = useState<FormData>({
    make: vehicle?.make ?? '',
    model: vehicle?.model ?? '',
    category: vehicle?.category ?? '',
    price: vehicle?.price.toString() ?? '',
    quantity: vehicle?.quantity.toString() ?? '',
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
      });
    }
  }, [vehicle]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.make || !form.model || !form.category || !form.price || !form.quantity) {
      setError('All fields are required.');
      return;
    }

    const price = parseFloat(form.price);
    const quantity = parseInt(form.quantity, 10);

    if (isNaN(price) || price <= 0) { setError('Price must be a positive number.'); return; }
    if (isNaN(quantity) || quantity < 0) { setError('Quantity must be a non-negative integer.'); return; }

    try {
      await onSubmit({ make: form.make, model: form.model, category: form.category, price, quantity });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error ?? 'An error occurred.');
    }
  }

  return (
    <form id="vehicle-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="v-make">Make</label>
          <input
            id="v-make"
            type="text"
            placeholder="e.g. Toyota"
            value={form.make}
            onChange={(e) => setForm((p) => ({ ...p, make: e.target.value }))}
            className="input"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="v-model">Model</label>
          <input
            id="v-model"
            type="text"
            placeholder="e.g. Camry"
            value={form.model}
            onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))}
            className="input"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="v-category">Category</label>
          <select
            id="v-category"
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            className="input"
            required
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="v-price">Price ($)</label>
          <input
            id="v-price"
            type="number"
            placeholder="e.g. 25000"
            min={0}
            step={0.01}
            value={form.price}
            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
            className="input"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="v-quantity">Quantity</label>
          <input
            id="v-quantity"
            type="number"
            placeholder="e.g. 5"
            min={0}
            step={1}
            value={form.quantity}
            onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))}
            className="input"
            required
          />
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          id="vehicle-form-submit-btn"
          type="submit"
          disabled={loading}
          className="btn-primary flex-1"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
        <button
          id="vehicle-form-cancel-btn"
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
