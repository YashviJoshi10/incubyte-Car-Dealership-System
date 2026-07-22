import { formatINR } from '../utils/formatCurrency';

export default function VehicleCard({
  vehicle,
  isAdmin,
  onPurchase,
  onViewDetails,
  onEdit,
  onDelete,
  onRestock,
  purchasing = false,
}) {
  const isOutOfStock = vehicle.quantity === 0;
  const isLowStock = vehicle.quantity > 0 && vehicle.quantity <= 3;

  const defaultImage =
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="card-hover overflow-hidden flex flex-col group animate-fade-in bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300">
      {/* Vehicle Image Container */}
      <div className="relative h-52 w-full bg-slate-900 overflow-hidden cursor-pointer" onClick={() => onViewDetails(vehicle)}>
        <img
          src={vehicle.imageUrl || defaultImage}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Category Tag overlay */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          {vehicle.category}
        </div>

        {/* Year overlay */}
        <div className="absolute top-3 right-3 flex gap-1.5">
          <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
            {vehicle.year || 2024}
          </span>
        </div>

        {/* Stock Badge bottom overlay */}
        <div className="absolute bottom-3 left-3">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm ${
              isOutOfStock
                ? 'bg-red-500/90 text-white'
                : isLowStock
                ? 'bg-amber-500/90 text-white'
                : 'bg-emerald-600/90 text-white'
            }`}
          >
            {isOutOfStock ? 'Sold Out' : `${vehicle.quantity} Units Left`}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Make & Model */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3
              onClick={() => onViewDetails(vehicle)}
              className="text-lg font-black text-slate-900 leading-tight group-hover:text-primary-600 transition-colors cursor-pointer"
            >
              {vehicle.make} {vehicle.model}
            </h3>
          </div>
        </div>

        {/* Spec details pills */}
        <div className="flex items-center gap-2 my-2 text-[11px] text-slate-600 font-medium">
          <span className="bg-slate-100 px-2.5 py-1 rounded-lg">⛽ {vehicle.fuelType || 'Petrol'}</span>
          <span className="bg-slate-100 px-2.5 py-1 rounded-lg">⚙️ {vehicle.transmission || 'Automatic'}</span>
          {vehicle.mileage && <span className="bg-slate-100 px-2.5 py-1 rounded-lg">🍃 {vehicle.mileage}</span>}
        </div>

        {/* Price Tag */}
        <div className="my-3 flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-black text-slate-900">
              {formatINR(vehicle.price, true)}
            </span>
            <span className="text-[11px] text-slate-400 ml-1.5 font-medium">Ex-Showroom</span>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-slate-100 pt-4 mt-auto">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              {/* View Details button */}
              <button
                onClick={() => onViewDetails(vehicle)}
                className="btn-secondary btn-sm flex-1 py-2 text-xs font-semibold rounded-xl"
              >
                🔍 View Specs
              </button>

              {/* Purchase button */}
              <button
                id={`purchase-btn-${vehicle.id}`}
                onClick={() => onPurchase(vehicle)}
                disabled={isOutOfStock || purchasing}
                className={`btn-primary btn-sm flex-1 py-2 text-xs font-bold rounded-xl ${
                  isOutOfStock ? 'opacity-50 cursor-not-allowed bg-slate-300 text-slate-500 shadow-none' : ''
                }`}
              >
                {purchasing ? 'Processing...' : isOutOfStock ? 'Sold Out' : 'Book Vehicle'}
              </button>
            </div>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="flex gap-2 pt-1 border-t border-slate-100">
                <button
                  id={`restock-btn-${vehicle.id}`}
                  onClick={() => onRestock(vehicle)}
                  className="btn-success btn-sm flex-1 py-1.5 text-xs rounded-xl"
                  title="Restock"
                >
                  ➕ Restock
                </button>
                <button
                  id={`edit-btn-${vehicle.id}`}
                  onClick={() => onEdit(vehicle)}
                  className="btn-secondary btn-sm flex-1 py-1.5 text-xs rounded-xl"
                  title="Edit"
                >
                  ✏️ Edit
                </button>
                <button
                  id={`delete-btn-${vehicle.id}`}
                  onClick={() => onDelete(vehicle.id)}
                  className="btn-danger btn-sm px-3 py-1.5 text-xs rounded-xl"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
