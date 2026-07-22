import { formatINR, formatINRFull } from '../utils/formatCurrency';

export default function VehicleDetailsModal({ vehicle, onClose, onPurchase, isAdmin, onEdit }) {
  if (!vehicle) return null;

  const isOutOfStock = vehicle.quantity === 0;
  const defaultImage =
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
      <div className="card w-full max-w-3xl shadow-2xl animate-slide-up bg-white rounded-3xl overflow-hidden my-8 border border-slate-100">
        {/* Top Image Hero */}
        <div className="relative h-64 sm:h-80 w-full bg-slate-900 overflow-hidden">
          <img
            src={vehicle.imageUrl || defaultImage}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-900/70 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-md transition-all shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Badges Overlay */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {vehicle.category}
                </span>
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  {vehicle.year || 2024} Model
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {vehicle.make} {vehicle.model}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-300 block font-medium">Ex-Showroom Price</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                {formatINR(vehicle.price, true)}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Quick Spec Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-center">
              <span className="text-lg block mb-0.5">⛽</span>
              <span className="text-xs text-slate-500 block font-medium">Fuel Type</span>
              <span className="text-sm font-extrabold text-slate-900">{vehicle.fuelType || 'Petrol'}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-center">
              <span className="text-lg block mb-0.5">⚙️</span>
              <span className="text-xs text-slate-500 block font-medium">Transmission</span>
              <span className="text-sm font-extrabold text-slate-900">{vehicle.transmission || 'Automatic'}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-center">
              <span className="text-lg block mb-0.5">🍃</span>
              <span className="text-xs text-slate-500 block font-medium">Efficiency / Range</span>
              <span className="text-sm font-extrabold text-slate-900">{vehicle.mileage || '16.5 km/l'}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-center">
              <span className="text-lg block mb-0.5">💺</span>
              <span className="text-xs text-slate-500 block font-medium">Seating</span>
              <span className="text-sm font-extrabold text-slate-900">{vehicle.seating || 5} Seater</span>
            </div>
          </div>

          {/* Overview Description */}
          {vehicle.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Vehicle Overview</h3>
              <p className="text-slate-700 text-sm leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                {vehicle.description}
              </p>
            </div>
          )}

          {/* Detailed Pricing & Stock */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">Full Price Breakdown</span>
              <span className="text-2xl font-black text-white">{formatINRFull(vehicle.price)}</span>
              <span className="text-xs text-emerald-400 block mt-0.5">
                {isOutOfStock ? '❌ Currently Out of Stock' : `✅ ${vehicle.quantity} Units Available in Stock`}
              </span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {isAdmin && (
                <button
                  onClick={() => { onClose(); onEdit(vehicle); }}
                  className="btn-secondary py-3 px-4 text-xs font-semibold flex-1 sm:flex-none"
                >
                  Edit Vehicle
                </button>
              )}
              <button
                onClick={() => { onClose(); onPurchase(vehicle); }}
                disabled={isOutOfStock}
                className={`btn-primary py-3 px-6 text-sm font-bold flex-1 sm:flex-none ${
                  isOutOfStock ? 'opacity-50 cursor-not-allowed bg-slate-700 text-slate-400' : ''
                }`}
              >
                {isOutOfStock ? 'Sold Out' : 'Purchase Vehicle'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
