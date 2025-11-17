import { Package, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface ApplicationInfo {
  id: string;
  name: string;
  activityCount: number;
  activityTypes: string[];
  slaMet: number;
  slaMissed: number;
}

interface ApplicationSidebarProps {
  businessAreaName: string;
  applications: ApplicationInfo[];
  selectedApp: string | null;
  onSelectApp: (appId: string | null) => void;
  onBack: () => void;
}

export function ApplicationSidebar({ 
  businessAreaName, 
  applications, 
  selectedApp, 
  onSelectApp,
  onBack 
}: ApplicationSidebarProps) {
  return (
    <div className="w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-2 -ml-2 h-7"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          <span className="text-xs">Back</span>
        </Button>
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-slate-900 dark:text-slate-100">{businessAreaName}</h2>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        <Button
          variant={selectedApp === null ? 'default' : 'outline'}
          className="w-full justify-between mb-2 h-8 text-xs"
          onClick={() => onSelectApp(null)}
        >
          <span>All Applications</span>
          {selectedApp === null && <ChevronRight className="w-3.5 h-3.5" />}
        </Button>
        
        <div className="space-y-2 mt-4">
          {applications.map((app) => {
            const isSelected = selectedApp === app.id;
            const successRate = (app.slaMet + app.slaMissed) > 0
              ? ((app.slaMet / (app.slaMet + app.slaMissed)) * 100).toFixed(0)
              : '0';
            
            return (
              <button
                key={app.id}
                onClick={() => onSelectApp(app.id)}
                className={`
                  w-full p-3 rounded-lg border-2 text-left transition-all
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' 
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-600'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-sm ${isSelected ? 'text-blue-900 dark:text-blue-300' : 'text-slate-900 dark:text-slate-100'}`}>
                    {app.name}
                  </span>
                  {isSelected && <ChevronRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                </div>
                
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {app.activityTypes.map((type) => (
                    <span
                      key={type}
                      className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded"
                    >
                      {type}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 text-xs mb-1.5">
                  <div className="flex items-center gap-0.5">
                    <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full"></div>
                    <span className="text-slate-600 dark:text-slate-400">{app.activityCount}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full"></div>
                    <span className="text-slate-600 dark:text-slate-400">{app.slaMet}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <div className="w-1.5 h-1.5 bg-red-500 dark:bg-red-400 rounded-full"></div>
                    <span className="text-slate-600 dark:text-slate-400">{app.slaMissed}</span>
                  </div>
                  <span className="text-slate-900 dark:text-slate-100 ml-auto">{successRate}%</span>
                </div>
                
                <div>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full ${
                        parseInt(successRate) >= 80 ? 'bg-green-500' :
                        parseInt(successRate) >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${successRate}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
