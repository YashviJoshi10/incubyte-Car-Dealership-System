import { useState, useEffect, useCallback } from 'react';
import { vehicleApi } from '../api/vehicle.api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import VehicleCard from '../components/VehicleCard';
import SearchBar from '../components/SearchBar';
import VehicleForm from '../components/VehicleForm';

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [toast, setToast] = useState('');

  const [modal, setModal] = useState(null); // 'edit' | 'restock' | null
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [restockQty, setRestockQty] = useState('');
  const [purchasingId, setPurchasingId] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await vehicleApi.getAll();
      setVehicles(data);
    } catch {
      setError('Failed to load vehicles. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVehicles();
  }, [loadVehicles]);

  const handleSearch = useCallback(async (filters) => {
    const hasFilters = Object.values(filters).some((v) => v !== undefined && v !== '');
    if (!hasFilters) {
      await loadVehicles();
      setIsFiltering(false);
      return;
    }
    setIsFiltering(true);
    try {
      const data = await vehicleApi.search(filters);
      setVehicles(data);
    } catch {
      setError('Search failed.');
    }
  }, [loadVehicles]);

  async function handlePurchase(id) {
    setPurchasingId(id);
    try {
      await vehicleApi.purchase(id);
      setVehicles((prev) => prev.map((v) => v.id === id ? { ...v, quantity: v.quantity - 1 } : v));
      showToast('✅ Purchase successful!');
    } catch (err) {
      showToast(`❌ ${err.response?.data?.error ?? 'Purchase failed.'}`);
    } finally {
      setPurchasingId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await vehicleApi.delete(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      showToast('🗑️ Vehicle deleted.');
    } catch {
      showToast('❌ Failed to delete vehicle.');
    }
  }

  async function handleEditSubmit(payload) {
    if (!selectedVehicle) return;
    setModalLoading(true);
    try {
      const updated = await vehicleApi.update(selectedVehicle.id, payload);
      setVehicles((prev) => prev.map((v) => v.id === selectedVehicle.id ? updated : v));
      setModal(null);
      showToast('✅ Vehicle updated.');
    } finally {
      setModalLoading(false);
    }
  }

  async function handleRestockSubmit(e) {
    e.preventDefault();
    if (!selectedVehicle) return;
    const qty = parseInt(restockQty, 10);
    if (!qty || qty <= 0) return;
    setModalLoading(true);
    try {
      const result = await vehicleApi.restock(selectedVehicle.id, qty);
      setVehicles((prev) => prev.map((v) => v.id === selectedVehicle.id ? result.vehicle : v));
      setModal(null);
      setRestockQty('');
      showToast('✅ Vehicle restocked.');
    } catch (err) {
      showToast(`❌ ${err.response?.data?.error ?? 'Restock failed.'}`);
    } finally {
      setModalLoading(false);
    }
  }

  const inStockCount = vehicles.filter((v) => v.quantity > 0).length;
  const outOfStockCount = vehicles.filter((v) => v.quantity === 0).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="page-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="section-title">Vehicle Inventory</h1>
            <p className="text-slate-500 text-sm mt-0.5">Browse and purchase available vehicles</p>
          </div>
          <div className="flex gap-3">
            {[
              { label: 'Total', value: vehicles.length, color: 'text-slate-900' },
              { label: 'In Stock', value: inStockCount, color: 'text-emerald-600' },
              { label: 'Out of Stock', value: outOfStockCount, color: 'text-red-500' },
            ].map((s) => (
              <div key={s.label} className="card px-4 py-2.5 text-center min-w-[80px]">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <SearchBar onSearch={handleSearch} />

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <svg className="w-8 h-8 animate-spin text-primary-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-slate-500">Loading vehicles...</p>
            </div>
          </div>
        ) : error ? (
          <div className="card p-8 text-center">
            <p className="text-red-600">{error}</p>
            <button onClick={loadVehicles} className="btn-primary mt-4">Retry</button>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-slate-500 text-lg font-medium">
              {isFiltering ? 'No vehicles match your search.' : 'No vehicles in inventory yet.'}
            </p>
            {isFiltering && <button onClick={() => handleSearch({})} className="btn-secondary mt-4">Clear filters</button>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isAdmin={isAdmin}
                onPurchase={handlePurchase}
                onEdit={(v) => { setSelectedVehicle(v); setModal('edit'); }}
                onDelete={handleDelete}
                onRestock={(v) => { setSelectedVehicle(v); setRestockQty(''); setModal('restock'); }}
                purchasing={purchasingId === vehicle.id}
              />
            ))}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {modal === 'edit' && selectedVehicle && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card p-6 w-full max-w-lg shadow-xl animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-900">Edit Vehicle</h2>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <VehicleForm vehicle={selectedVehicle} onSubmit={handleEditSubmit} onCancel={() => setModal(null)} loading={modalLoading} />
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {modal === 'restock' && selectedVehicle && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="card p-6 w-full max-w-sm shadow-xl animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-900">Restock Vehicle</h2>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              <span className="font-semibold">{selectedVehicle.make} {selectedVehicle.model}</span> — Current stock: <strong>{selectedVehicle.quantity}</strong>
            </p>
            <form id="restock-form" onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="label" htmlFor="restock-quantity">Quantity to add</label>
                <input id="restock-quantity" type="number" min={1} step={1} value={restockQty} onChange={(e) => setRestockQty(e.target.value)} className="input" placeholder="e.g. 10" required />
              </div>
              <div className="flex gap-3">
                <button id="restock-submit-btn" type="submit" disabled={modalLoading} className="btn-success flex-1">
                  {modalLoading ? 'Restocking...' : 'Restock'}
                </button>
                <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
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
