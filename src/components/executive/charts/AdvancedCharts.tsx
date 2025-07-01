import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartProps {
  title: string;
  data: any;
  options?: any;
  className?: string;
  showTrend?: boolean;
  trendValue?: number;
  trendLabel?: string;
}

// Revenue Trend Chart Component
export const RevenueTrendChart: React.FC<ChartProps> = ({ 
  title, 
  data, 
  options, 
  className = "",
  showTrend = false,
  trendValue = 0,
  trendLabel = ""
}) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#22c55e',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `₹${(context.parsed.y / 100000).toFixed(1)}L`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          },
          callback: function(value: any) {
            return `₹${(value / 100000).toFixed(0)}L`;
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <Card className={`agrilift-card hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader className="agrilift-card-header pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold agrilift-text-primary">{title}</CardTitle>
          {showTrend && (
            <div className="flex items-center gap-2">
              {trendValue >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${trendValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trendValue >= 0 ? '+' : ''}{trendValue}% {trendLabel}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Line data={data} options={mergedOptions} />
        </div>
      </CardContent>
    </Card>
  );
};

// User Engagement Bar Chart
export const UserEngagementChart: React.FC<ChartProps> = ({ 
  title, 
  data, 
  options, 
  className = "" 
}) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#22c55e',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          }
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 4,
        borderSkipped: false
      }
    }
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <Card className={`agrilift-card hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader className="agrilift-card-header pb-3">
        <CardTitle className="text-lg font-semibold agrilift-text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Bar data={data} options={mergedOptions} />
        </div>
      </CardContent>
    </Card>
  );
};

// Market Distribution Doughnut Chart
export const MarketDistributionChart: React.FC<ChartProps> = ({ 
  title, 
  data, 
  options, 
  className = "" 
}) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#22c55e',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${percentage}%`;
          }
        }
      }
    },
    cutout: '60%',
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: '#fff'
      }
    }
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <Card className={`agrilift-card hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader className="agrilift-card-header pb-3">
        <CardTitle className="text-lg font-semibold agrilift-text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Doughnut data={data} options={mergedOptions} />
        </div>
      </CardContent>
    </Card>
  );
};

// Performance Metrics Chart
export const PerformanceMetricsChart: React.FC<ChartProps> = ({ 
  title, 
  data, 
  options, 
  className = "" 
}) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#22c55e',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <Card className={`agrilift-card hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader className="agrilift-card-header pb-3">
        <CardTitle className="text-lg font-semibold agrilift-text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Line data={data} options={mergedOptions} />
        </div>
      </CardContent>
    </Card>
  );
};

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<any>;
  trend?: {
    value: number;
    label: string;
  };
  color?: string;
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "text-green-600",
  className = ""
}) => {
  return (
    <Card className={`agrilift-card hover:shadow-lg transition-all duration-300 hover:scale-105 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium agrilift-text-secondary">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold agrilift-text-primary animate-pulse">{value}</div>
        {subtitle && (
          <p className="text-xs agrilift-text-muted mt-1">{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trend.value >= 0 ? (
              <TrendingUp className="h-3 w-3 text-green-600" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600" />
            )}
            <span className={`text-xs font-medium ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Regional Performance Chart
export const RegionalPerformanceChart: React.FC<ChartProps> = ({
  title,
  data,
  options,
  className = ""
}) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#22c55e',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `₹${(context.parsed.x / 1000).toFixed(0)}K`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          },
          callback: function(value: any) {
            return `₹${(value / 1000).toFixed(0)}K`;
          }
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          }
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 4,
        borderSkipped: false
      }
    }
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <Card className={`agrilift-card hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader className="agrilift-card-header pb-3">
        <CardTitle className="text-lg font-semibold agrilift-text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Bar data={data} options={mergedOptions} />
        </div>
      </CardContent>
    </Card>
  );
};

// Soil Analysis Summary Chart
export const SoilAnalysisChart: React.FC<ChartProps> = ({
  title,
  data,
  options,
  className = ""
}) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#22c55e',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false
      }
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: '#fff'
      }
    }
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <Card className={`agrilift-card hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader className="agrilift-card-header pb-3">
        <CardTitle className="text-lg font-semibold agrilift-text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Pie data={data} options={mergedOptions} />
        </div>
      </CardContent>
    </Card>
  );
};
