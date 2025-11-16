import { Button } from './ui/button';

interface QuickDateNavProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export function QuickDateNav({ currentDate, onDateChange }: QuickDateNavProps) {
  // Generate last 7 business days (excluding weekends for demo)
  const getRecentBusinessDates = () => {
    const dates: Date[] = [];
    let date = new Date();
    
    for (let i = 0; i < 10; i++) {
      const tempDate = new Date(date);
      tempDate.setDate(date.getDate() - i);
      
      // Skip weekends (0 = Sunday, 6 = Saturday)
      const dayOfWeek = tempDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(tempDate);
        if (dates.length >= 7) break;
      }
    }
    
    return dates.reverse();
  };
  
  const recentDates = getRecentBusinessDates();
  
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      <span className="text-sm text-slate-600 whitespace-nowrap mr-2">Quick Select:</span>
      {recentDates.map((date, index) => {
        const isSelected = date.toDateString() === currentDate.toDateString();
        const isToday = date.toDateString() === new Date().toDateString();
        
        return (
          <Button
            key={index}
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => onDateChange(date)}
            className={`
              whitespace-nowrap
              ${isToday && !isSelected ? 'border-blue-500 text-blue-700' : ''}
            `}
          >
            {isToday ? 'Today' : date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </Button>
        );
      })}
    </div>
  );
}
