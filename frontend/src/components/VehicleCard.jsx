export default function VehicleCard({
  vehicle,
  isAdmin,
  onPurchase,
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
    <div className="card-hover overflow-hidden flex flex-col group animate-fade-in bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Vehicle Image Container */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        <img
          src={vehicle.imageUrl || defaultImage}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />
        {/* Category Tag overlay */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          {vehicle.category}
        </div>

        {/* Stock Badge overlay */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm ${
              isOutOfStock
                ? 'bg-red-500/90 text-white'
                : isLowStock
                ? 'bg-amber-500/90 text-white'
                : 'bg-emerald-600/90 text-white'
            }`}
          >
            {isOutOfStock ? 'Sold Out' : `${vehicle.quantity} left`}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Make & Model */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 leading-tight group-hover:text-primary-600 transition-colors">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Ref ID: #{vehicle.id.slice(0, 8)}</p>
          </div>
        </div>

        {/* Price & Stock info */}
        <div className="my-3 flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-black text-slate-900">
              ${vehicle.price.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 ml-1">MSRP</span>
          </div>
          <span
            className={`text-xs font-semibold ${
              isOutOfStock ? 'text-red-600' : isLowStock ? 'text-amber-600' : 'text-emerald-600'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : isLowStock ? '⚠️ Low Stock' : 'In Stock'}
          </span>
        </div>

        {/* Actions */}
        <div className="border-t border-slate-100 pt-4 mt-auto">
          <div className="flex flex-wrap gap-2">
            <button
              id={`purchase-btn-${vehicle.id}`}
              onClick={() => onPurchase(vehicle)}
              disabled={isOutOfStock || purchasing}
              className={`btn-primary btn-sm flex-1 py-2.5 text-xs font-bold rounded-xl ${
                isOutOfStock ? 'opacity-50 cursor-not-allowed bg-slate-300 text-slate-500 shadow-none' : ''
              }`}
            >
              {purchasing ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )}
              {isOutOfStock ? 'Sold Out' : 'Purchase Vehicle'}
            </button>

            {isAdmin && (
              <>
                <button
                  id={`restock-btn-${vehicle.id}`}
                  onClick={() => onRestock(vehicle)}
                  className="btn-success btn-sm px-2.5 rounded-xl"
                  title="Restock"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
                <button
                  id={`edit-btn-${vehicle.id}`}
                  onClick={() => onEdit(vehicle)}
                  className="btn-secondary btn-sm px-2.5 rounded-xl"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  id={`delete-btn-${vehicle.id}`}
                  onClick={() => onDelete(vehicle.id)}
                  className="btn-danger btn-sm px-2.5 rounded-xl"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
