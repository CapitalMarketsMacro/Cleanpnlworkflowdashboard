import { Calendar, History, CheckCircle2, AlertCircle } from 'lucide-react';

interface BusinessDateIndicatorProps {
  businessDate: Date;
  stats: {
    total: number;
    met: number;
    missed: number;
  };
}

export function BusinessDateIndicator({ businessDate, stats }: BusinessDateIndicatorProps) {
  const isToday = businessDate.toDateString() === new Date().toDateString();
  const isPast = businessDate < new Date() && !isToday;
  const isFuture = businessDate > new Date();
  
  const successRate = stats.total > 0 ? ((stats.met / (stats.met + stats.missed)) * 100).toFixed(1) : '0';
  
  return (
    <div className={`
      rounded-lg p-4 border-2
      ${isToday ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400' : ''}
      ${isPast ? 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600' : ''}
      ${isFuture ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-600' : ''}
    `}>
      <div className="flex items-center gap-3">
        {isToday && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"></div>
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-blue-900 dark:text-blue-300 text-sm">Live - {businessDate.toLocaleDateString()}</p>
              <p className="text-blue-700 dark:text-blue-400 text-xs">Real-time monitoring active</p>
            </div>
          </>
        )}
        
        {isPast && (
          <>
            <History className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <div className="flex-1">
              <p className="text-slate-900 dark:text-slate-100 text-sm">Historical - {businessDate.toLocaleDateString()}</p>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                  <span className="text-xs text-slate-700 dark:text-slate-300">{stats.met} Met</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
                  <span className="text-xs text-slate-700 dark:text-slate-300">{stats.missed} Missed</span>
                </div>
                <span className="text-xs text-slate-700 dark:text-slate-300">({successRate}% success)</span>
              </div>
            </div>
          </>
        )}
        
        {isFuture && (
          <>
            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-purple-900 dark:text-purple-300 text-sm">Future Date - {businessDate.toLocaleDateString()}</p>
              <p className="text-purple-700 dark:text-purple-400 text-xs">No data available</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
