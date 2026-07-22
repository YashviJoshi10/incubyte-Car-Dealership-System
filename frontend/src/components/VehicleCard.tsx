import { Vehicle } from '../types';

interface VehicleCardProps {
  vehicle: Vehicle;
  isAdmin: boolean;
  onPurchase: (id: string) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onRestock: (vehicle: Vehicle) => void;
  purchasing?: boolean;
}

export default function VehicleCard({
  vehicle,
  isAdmin,
  onPurchase,
  onEdit,
  onDelete,
  onRestock,
  purchasing = false,
}: VehicleCardProps) {
  const isOutOfStock = vehicle.quantity === 0;
  const isLowStock = vehicle.quantity > 0 && vehicle.quantity <= 3;

  return (
    <div className="card-hover p-5 animate-fade-in flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {vehicle.make} {vehicle.model}
          </h3>
          <span className="badge-indigo mt-1">{vehicle.category}</span>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-primary-600">
            ${vehicle.price.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Stock indicator */}
      <div className="flex items-center gap-2 mb-4 mt-auto">
        <div className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'}`} />
        <span
          className={`text-sm font-medium ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-amber-600' : 'text-emerald-600'}`}
        >
          {isOutOfStock ? 'Out of Stock' : `${vehicle.quantity} in stock${isLowStock ? ' (Low)' : ''}`}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 pt-4">
        <div className="flex flex-wrap gap-2">
          {/* Purchase button — for all users */}
          <button
            id={`purchase-btn-${vehicle.id}`}
            onClick={() => onPurchase(vehicle.id)}
            disabled={isOutOfStock || purchasing}
            className={`btn-primary btn-sm flex-1 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isOutOfStock ? 'Out of stock' : 'Purchase this vehicle'}
          >
            {purchasing ? (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )}
            {isOutOfStock ? 'Unavailable' : 'Purchase'}
          </button>

          {/* Admin actions */}
          {isAdmin && (
            <>
              <button
                id={`restock-btn-${vehicle.id}`}
                onClick={() => onRestock(vehicle)}
                className="btn-success btn-sm"
                title="Restock vehicle"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
              <button
                id={`edit-btn-${vehicle.id}`}
                onClick={() => onEdit(vehicle)}
                className="btn-secondary btn-sm"
                title="Edit vehicle"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                id={`delete-btn-${vehicle.id}`}
                onClick={() => onDelete(vehicle.id)}
                className="btn-danger btn-sm"
                title="Delete vehicle"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
