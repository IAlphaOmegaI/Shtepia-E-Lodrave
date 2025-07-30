import React from 'react';

interface OrderStatusWidgetProps {
  order: {
    pending?: number;
    processing?: number;
    complete?: number;
    cancel?: number;
  };
}

const OrderStatusWidget: React.FC<OrderStatusWidgetProps> = ({ order }) => {
  const statusItems = [
    { key: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { key: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
    { key: 'complete', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { key: 'cancel', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  ];

  const total = Object.values(order).reduce((sum, value) => sum + (value || 0), 0);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {statusItems.map((status) => {
        const value = order[status.key as keyof typeof order] || 0;
        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
        
        return (
          <div key={status.key} className="text-center">
            <div className={`rounded-lg p-4 ${status.color}`}>
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-sm font-medium">{status.label}</div>
              <div className="mt-2 text-xs">
                {percentage}% of total
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusWidget;