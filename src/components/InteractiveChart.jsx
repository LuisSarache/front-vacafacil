import { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { TrendingUp, BarChart3, PieChart, Calendar } from 'lucide-react';

export const InteractiveChart = ({ data, title, type = 'line' }) => {
  const [chartType, setChartType] = useState(type);
  const [period, setPeriod] = useState('7d');

  const getMaxValue = () => {
    if (!data || data.length === 0) return 100;
    return Math.max(...data.map(item => item.value || 0));
  };

  const getChartData = () => {
    if (!data) return [];
    
    const periodData = {
      '7d': data.slice(-7),
      '30d': data.slice(-30),
      '90d': data.slice(-90),
      '1y': data.slice(-365)
    };
    
    return periodData[period] || data;
  };

  const renderLineChart = () => {
    const chartData = getChartData();
    const maxValue = getMaxValue();
    
    return (
      <div className="h-64 flex items-end justify-between space-x-1 px-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 group">
            <div className="relative w-full">
              <div
                className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-300 hover:from-blue-600 hover:to-blue-500 cursor-pointer"
                style={{
                  height: `${Math.max((item.value / maxValue) * 200, 8)}px`,
                  minHeight: '8px'
                }}
                title={`${item.label || item.date}: ${item.value}`}
              />
            </div>
            <span className="text-xs text-gray-500 mt-2 transform rotate-45 origin-left">
              {item.label || new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderBarChart = () => {
    const chartData = getChartData();
    const maxValue = getMaxValue();
    
    return (
      <div className="h-64 flex items-end justify-between space-x-2 px-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="bg-gradient-to-t from-green-500 to-green-400 rounded transition-all duration-300 hover:from-green-600 hover:to-green-500 cursor-pointer w-full"
              style={{
                height: `${Math.max((item.value / maxValue) * 200, 8)}px`,
                minHeight: '8px'
              }}
              title={`${item.label || item.date}: ${item.value}`}
            />
            <span className="text-xs text-gray-500 mt-2 text-center">
              {item.label || new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderPieChart = () => {
    const chartData = getChartData();
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {chartData.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
              
              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="15.915"
                  fill="transparent"
                  stroke={colors[index % colors.length]}
                  strokeWidth="8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={-chartData.slice(0, index).reduce((sum, prev) => sum + (prev.value / total) * 100, 0)}
                  className="transition-all duration-300 hover:stroke-width-10"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold">{total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
        <div className="ml-6 space-y-2">
          {chartData.map((item, index) => {
            const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];
            return (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                <span className="text-sm">{item.label}: {item.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center space-x-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="7d">7 dias</option>
            <option value="30d">30 dias</option>
            <option value="90d">90 dias</option>
            <option value="1y">1 ano</option>
          </select>
          <div className="flex border border-gray-300 rounded overflow-hidden">
            <Button
              size="sm"
              variant={chartType === 'line' ? 'primary' : 'secondary'}
              onClick={() => setChartType('line')}
              className="rounded-none border-0"
            >
              <TrendingUp className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={chartType === 'bar' ? 'primary' : 'secondary'}
              onClick={() => setChartType('bar')}
              className="rounded-none border-0 border-l"
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={chartType === 'pie' ? 'primary' : 'secondary'}
              onClick={() => setChartType('pie')}
              className="rounded-none border-0 border-l"
            >
              <PieChart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {data && data.length > 0 ? (
        <>
          {chartType === 'line' && renderLineChart()}
          {chartType === 'bar' && renderBarChart()}
          {chartType === 'pie' && renderPieChart()}
        </>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum dado disponível</p>
          </div>
        </div>
      )}
    </Card>
  );
};