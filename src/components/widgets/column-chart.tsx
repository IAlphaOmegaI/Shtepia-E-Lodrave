import React from 'react';

interface ColumnChartProps {
  title: string;
  colors: string[];
  series: number[];
  categories: string[];
}

const ColumnChart: React.FC<ColumnChartProps> = ({
  title,
  colors,
  series,
  categories,
}) => {
  const maxValue = Math.max(...series);
  const chartHeight = 300;

  return (
    <div className="rounded-lg bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      
      <div className="relative" style={{ height: `${chartHeight}px` }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 w-12">
          {[100, 75, 50, 25, 0].map((percent) => (
            <div key={percent} className="text-right pr-2">
              ${((maxValue * percent) / 100).toFixed(0)}
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="ml-14 h-full flex items-end justify-between gap-2">
          {series.map((value, index) => {
            const height = (value / maxValue) * (chartHeight - 40);
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="relative group w-full">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    ${value.toLocaleString()}
                  </div>
                  {/* Bar */}
                  <div
                    className="w-full rounded transition-all duration-300 hover:opacity-80"
                    style={{
                      height: `${height}px`,
                      backgroundColor: colors[0] || '#6073D4',
                    }}
                  />
                </div>
                {/* X-axis label */}
                <div className="mt-2 text-xs text-gray-600 text-center">
                  {categories[index]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart border */}
      <div className="ml-14 mt-4 border-t border-l border-gray-200" />
    </div>
  );
};

export default ColumnChart;