import { Building2, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface BusinessArea {
  id: string;
  name: string;
  jobCount: number;
  slaMet: number;
  slaMissed: number;
}

interface BusinessAreaSidebarProps {
  businessAreas: BusinessArea[];
  selectedArea: string | null;
  onSelectArea: (areaId: string | null) => void;
}

export function BusinessAreaSidebar({ businessAreas, selectedArea, onSelectArea }: BusinessAreaSidebarProps) {
  return (
    <div className="w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-slate-900 dark:text-slate-100">Business Areas</h2>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        <Button
          variant={selectedArea === null ? 'default' : 'outline'}
          className="w-full justify-between mb-2 h-8 text-xs"
          onClick={() => onSelectArea(null)}
        >
          <span>All Business Areas</span>
          {selectedArea === null && <ChevronRight className="w-3.5 h-3.5" />}
        </Button>
        
        <div className="space-y-2 mt-4">
          {businessAreas.map((area) => {
            const isSelected = selectedArea === area.id;
            const successRate = area.jobCount > 0 
              ? ((area.slaMet / (area.slaMet + area.slaMissed)) * 100).toFixed(0)
              : '0';
            
            return (
              <button
                key={area.id}
                onClick={() => onSelectArea(area.id)}
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
                    {area.name}
                  </span>
                  {isSelected && <ChevronRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                </div>
                
                <div className="flex items-center gap-2 text-xs mb-1.5">
                  <div className="flex items-center gap-0.5">
                    <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full"></div>
                    <span className="text-slate-600 dark:text-slate-400">{area.jobCount}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full"></div>
                    <span className="text-slate-600 dark:text-slate-400">{area.slaMet}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <div className="w-1.5 h-1.5 bg-red-500 dark:bg-red-400 rounded-full"></div>
                    <span className="text-slate-600 dark:text-slate-400">{area.slaMissed}</span>
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
