import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Componente de gráfico mock para exibir estabilidade e valor do token glPET
 * @param {boolean} compact - Se true, exibe versão compacta para cards de materiais
 * @param {string} materialName - Nome do material para identificação única do gráfico
 */
const TokenChart = ({ compact = false, materialName = 'glPET' }) => {
  const dataPoints = [
    { day: 'Seg', value: 2.45, change: -0.12 },
    { day: 'Ter', value: 2.58, change: 0.13 },
    { day: 'Qua', value: 2.52, change: -0.06 },
    { day: 'Qui', value: 2.68, change: 0.16 },
    { day: 'Sex', value: 2.75, change: 0.07 },
    { day: 'Sáb', value: 2.61, change: -0.14 },
    { day: 'Dom', value: 2.73, change: 0.12 },
  ];

  const currentValue = dataPoints[dataPoints.length - 1].value;
  const previousValue = dataPoints[dataPoints.length - 2].value;
  const change = currentValue - previousValue;
  const changePercent = ((change / previousValue) * 100).toFixed(2);
  const isPositive = change >= 0;

  const maxValue = Math.max(...dataPoints.map(d => d.value));
  const minValue = Math.min(...dataPoints.map(d => d.value));
  const range = maxValue - minValue || 1;

  const totalChange = dataPoints[dataPoints.length - 1].value - dataPoints[0].value;
  const totalChangePercent = ((totalChange / dataPoints[0].value) * 100).toFixed(2);

  if (compact) {
    return (
      <div className="mt-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-gray-500">Valor (R$/kg)</p>
            <p className="text-sm font-bold text-[#538536]">R$ {currentValue.toFixed(2)}</p>
          </div>
          <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{isPositive ? '+' : ''}{changePercent}%</span>
          </div>
        </div>

        <div className="h-16 relative mb-1">
          <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`chartGradient-${materialName}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#538536" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#538536" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            <polyline
              points={dataPoints.map((point, i) => {
                const x = (i / (dataPoints.length - 1)) * 200;
                const y = 60 - ((point.value - minValue) / range) * 50;
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#538536"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            <polygon
              points={`0,60 ${dataPoints.map((point, i) => {
                const x = (i / (dataPoints.length - 1)) * 200;
                const y = 60 - ((point.value - minValue) / range) * 50;
                return `${x},${y}`;
              }).join(' ')} 200,60`}
              fill={`url(#chartGradient-${materialName})`}
            />
          </svg>
        </div>

        <div className="flex justify-between text-[9px] text-gray-400">
          {dataPoints.map((point, i) => (
            <span key={i}>{point.day.slice(0, 1)}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-gray-500">Valor glPET (R$/kg)</p>
          <p className="text-lg font-bold text-[#538536]">R$ {currentValue.toFixed(2)}</p>
        </div>
        {isPositive ? (
          <TrendingUp className="w-5 h-5 text-green-500" />
        ) : (
          <TrendingDown className="w-5 h-5 text-red-500" />
        )}
      </div>

      <div className="flex items-center gap-4 mb-3 text-xs">
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent}%)</span>
        </div>
        <div className="text-gray-400">|</div>
        <div className={`flex items-center gap-1 ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {totalChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>Semana: {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(2)} ({totalChange >= 0 ? '+' : ''}{totalChangePercent}%)</span>
        </div>
      </div>

      <div className="h-32 relative mb-2">
        <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#538536" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#538536" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          <polyline
            points={dataPoints.map((point, i) => {
              const x = (i / (dataPoints.length - 1)) * 200;
              const y = 100 - ((point.value - minValue) / range) * 80;
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#538536"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          <polygon
            points={`0,100 ${dataPoints.map((point, i) => {
              const x = (i / (dataPoints.length - 1)) * 200;
              const y = 100 - ((point.value - minValue) / range) * 80;
              return `${x},${y}`;
            }).join(' ')} 200,100`}
            fill="url(#chartGradient)"
          />

          {dataPoints.map((point, i) => {
            const x = (i / (dataPoints.length - 1)) * 200;
            const y = 100 - ((point.value - minValue) / range) * 80;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="#538536"
                className="hover:r-4 transition-all"
              />
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {dataPoints.map((point, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="text-[10px]">{point.day}</span>
            <span className={`text-[9px] font-medium ${point.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {point.change >= 0 ? '↑' : '↓'} {Math.abs(point.change).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenChart;
