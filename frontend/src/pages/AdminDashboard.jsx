import { useState, useEffect, useCallback } from 'react';
import { vehicleApi } from '../api/vehicle.api';
import Navbar from '../components/Navbar';
import VehicleForm from '../components/VehicleForm';
import { formatINR } from '../utils/formatCurrency';

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [restockModal, setRestockModal] = useState(null);
  const [restockQty, setRestockQty] = useState('');
  const [restockLoading, setRestockLoading] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await vehicleApi.getAll();
      setVehicles(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadVehicles(); }, [loadVehicles]);

  async function handleCreate(payload) {
    setFormLoading(true);
    try {
      const created = await vehicleApi.create(payload);
      setVehicles((prev) => [created, ...prev]);
      setShowAddForm(false);
      showToast('✅ Vehicle added successfully!');
    } catch (err) {
      showToast(`❌ ${err.response?.data?.error ?? 'Failed to create vehicle.'}`);
      throw err;
    } finally {
      setFormLoading(false);
    }
  }

  async function handleUpdate(payload) {
    if (!editingVehicle) return;
    setFormLoading(true);
    try {
      const updated = await vehicleApi.update(editingVehicle.id, payload);
      setVehicles((prev) => prev.map((v) => v.id === editingVehicle.id ? updated : v));
      setEditingVehicle(null);
      showToast('✅ Vehicle updated!');
    } catch (err) {
      showToast(`❌ ${err.response?.data?.error ?? 'Failed to update vehicle.'}`);
      throw err;
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this vehicle permanently?')) return;
    try {
      await vehicleApi.delete(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      showToast('🗑️ Vehicle deleted.');
    } catch {
      showToast('❌ Failed to delete vehicle.');
    }
  }

  async function handleRestock(e) {
    e.preventDefault();
    if (!restockModal) return;
    const qty = parseInt(restockQty, 10);
    if (!qty || qty <= 0) return;
    setRestockLoading(true);
    try {
      const result = await vehicleApi.restock(restockModal.id, qty);
      setVehicles((prev) => prev.map((v) => v.id === restockModal.id ? result.vehicle : v));
      setRestockModal(null);
      setRestockQty('');
      showToast('✅ Restocked successfully!');
    } catch {
      showToast('❌ Restock failed.');
    } finally {
      setRestockLoading(false);
    }
  }

  const totalValue = vehicles.reduce((sum, v) => sum + v.price * v.quantity, 0);
  const totalUnits = vehicles.reduce((sum, v) => sum + v.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="page-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="section-title">Admin Management Panel</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage dealership fleet, stock levels, and vehicle specs</p>
          </div>
          <button id="add-vehicle-btn" onClick={() => { setShowAddForm(true); setEditingVehicle(null); }} className="btn-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add New Vehicle
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Models', value: vehicles.length, color: 'text-slate-900' },
            { label: 'Total Units', value: totalUnits, color: 'text-primary-600' },
            { label: 'In Stock', value: vehicles.filter((v) => v.quantity > 0).length, color: 'text-emerald-600' },
            { label: 'Fleet Value', value: formatINR(totalValue, true), color: 'text-amber-600' },
          ].map((stat) => (
            <div key={stat.label} className="card px-5 py-4">
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {showAddForm && (
          <div className="card p-6 mb-6 border-primary-100 shadow-md animate-slide-up">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Add New Vehicle to Inventory</h2>
            <VehicleForm onSubmit={handleCreate} onCancel={() => setShowAddForm(false)} loading={formLoading} />
          </div>
        )}

        {/* Vehicle Table */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Showroom Fleet ({vehicles.length})</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <svg className="w-6 h-6 animate-spin text-primary-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No vehicles yet. Add one above!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    {['Vehicle', 'Specs & Category', 'Ex-Showroom Price', 'Stock Level', 'Actions'].map((h) => (
                      <th key={h} className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80'}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="w-14 h-10 object-cover rounded-xl shadow-sm bg-slate-100"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{vehicle.make} {vehicle.model}</p>
                            <p className="text-[11px] text-slate-400">Year: {vehicle.year || 2024} • ID: #{vehicle.id.slice(0, 6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="badge-indigo w-fit text-[11px]">{vehicle.category}</span>
                          <span className="text-[11px] text-slate-500">{vehicle.fuelType || 'Petrol'} • {vehicle.transmission || 'Automatic'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900 text-base">{formatINR(vehicle.price, true)}</td>
                      <td className="px-6 py-4">
                        <span className={`badge ${vehicle.quantity === 0 ? 'badge-red' : vehicle.quantity <= 3 ? 'badge-amber' : 'badge-green'}`}>
                          {vehicle.quantity === 0 ? 'Out of Stock' : `${vehicle.quantity} units`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button id={`admin-restock-btn-${vehicle.id}`} onClick={() => { setRestockModal(vehicle); setRestockQty(''); }} className="btn-success btn-sm">
                            Restock
                          </button>
                          <button id={`admin-edit-btn-${vehicle.id}`} onClick={() => { setEditingVehicle(vehicle); setShowAddForm(false); }} className="btn-secondary btn-sm">Edit</button>
                          <button id={`admin-delete-btn-${vehicle.id}`} onClick={() => handleDelete(vehicle.id)} className="btn-danger btn-sm">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {editingVehicle && (
          <div className="card p-6 mt-6 border-amber-100 shadow-md animate-slide-up">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Edit: {editingVehicle.make} {editingVehicle.model}</h2>
            <VehicleForm vehicle={editingVehicle} onSubmit={handleUpdate} onCancel={() => setEditingVehicle(null)} loading={formLoading} />
          </div>
        )}
      </main>

      {/* Restock Modal */}
      {restockModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card p-6 w-full max-w-sm shadow-xl animate-slide-up">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Restock Vehicle</h2>
            <p className="text-sm text-slate-500 mb-4">{restockModal.make} {restockModal.model} — Current: <strong>{restockModal.quantity}</strong></p>
            <form id="admin-restock-form" onSubmit={handleRestock} className="space-y-4">
              <div>
                <label className="label" htmlFor="admin-restock-qty">Units to add</label>
                <input id="admin-restock-qty" type="number" min={1} value={restockQty} onChange={(e) => setRestockQty(e.target.value)} className="input" placeholder="e.g. 10" required />
              </div>
              <div className="flex gap-3">
                <button id="admin-restock-submit-btn" type="submit" disabled={restockLoading} className="btn-success flex-1">
                  {restockLoading ? 'Restocking...' : 'Confirm Restock'}
                </button>
                <button type="button" onClick={() => setRestockModal(null)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl animate-slide-up text-sm font-medium z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
