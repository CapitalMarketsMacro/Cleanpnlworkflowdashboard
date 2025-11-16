import { Clock, TrendingUp, AlertCircle, CheckCircle2, Circle, PlayCircle, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { BusinessDateIndicator } from './BusinessDateIndicator';
import { QuickDateNav } from './QuickDateNav';
import { useTheme } from '../utils/ThemeContext';

interface DashboardProps {
  stats: {
    total: number;
    met: number;
    missed: number;
    notStarted: number;
    inProgress: number;
  };
  lastUpdate: Date;
  businessDate: Date;
  onBusinessDateChange: (date: Date) => void;
  selectedBusinessArea: string | null;
  businessAreaName: string | null;
  selectedApplication?: string | null;
}

export function Dashboard({ stats, lastUpdate, businessDate, onBusinessDateChange, selectedBusinessArea, businessAreaName, selectedApplication }: DashboardProps) {
  const { theme, toggleTheme } = useTheme();
  const successRate = stats.total > 0 ? ((stats.met / (stats.met + stats.missed)) * 100).toFixed(1) : '0';
  
  const isToday = businessDate.toDateString() === new Date().toDateString();
  
  const handlePreviousDay = () => {
    const newDate = new Date(businessDate);
    newDate.setDate(newDate.getDate() - 1);
    onBusinessDateChange(newDate);
  };
  
  const handleNextDay = () => {
    const newDate = new Date(businessDate);
    newDate.setDate(newDate.getDate() + 1);
    onBusinessDateChange(newDate);
  };
  
  const handleToday = () => {
    onBusinessDateChange(new Date());
  };

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 transition-colors">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-slate-900 dark:text-slate-100">Clean PNL Workflow Observability</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {selectedApplication && selectedBusinessArea
                ? `Viewing ${selectedApplication} activities for ${businessAreaName}` 
                : selectedBusinessArea 
                ? `Viewing ${businessAreaName} workflow by activity type` 
                : 'Real-time monitoring of PNL workflow across all business areas'
              }
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="h-9 w-9 p-0"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreviousDay}
                className="h-7 w-7 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 gap-2"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    <span>{businessDate.toLocaleDateString('en-US', { 
                      weekday: 'short',
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={businessDate}
                    onSelect={(date) => date && onBusinessDateChange(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextDay}
                className="h-7 w-7 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {!isToday && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleToday}
                  className="h-9"
                >
                  Today
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {isToday ? `Last updated: ${lastUpdate.toLocaleTimeString()}` : 'Historical Data'}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4 space-y-3">
          <BusinessDateIndicator businessDate={businessDate} stats={stats} />
          <QuickDateNav currentDate={businessDate} onDateChange={onBusinessDateChange} />
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Total Jobs</p>
                <p className="text-slate-900 dark:text-slate-100 mt-1">{stats.total}</p>
              </div>
              <Circle className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 dark:text-green-400 text-sm">SLA Met</p>
                <p className="text-green-900 dark:text-green-300 mt-1">{stats.met}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-700 dark:text-red-400 text-sm">SLA Missed</p>
                <p className="text-red-900 dark:text-red-300 mt-1">{stats.missed}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-700 dark:text-yellow-400 text-sm">In Progress</p>
                <p className="text-yellow-900 dark:text-yellow-300 mt-1">{stats.inProgress}</p>
              </div>
              <PlayCircle className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 dark:text-blue-400 text-sm">Success Rate</p>
                <p className="text-blue-900 dark:text-blue-300 mt-1">{successRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
