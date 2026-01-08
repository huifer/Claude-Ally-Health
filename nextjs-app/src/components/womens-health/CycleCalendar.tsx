import { Calendar } from 'lucide-react';
import { CycleTracker } from '@/types/health-data';

interface CycleCalendarProps {
  data: CycleTracker;
  selectedMonth?: string;
  onMonthSelect?: (month: string) => void;
}

export function CycleCalendar({ data, selectedMonth, onMonthSelect }: CycleCalendarProps) {
  const { cycles } = data;

  // Group cycles by month
  const monthGroups = cycles.reduce((acc, cycle) => {
    const month = cycle.period_start.substring(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(cycle);
    return acc;
  }, {} as Record<string, typeof cycles>);

  const sortedMonths = Object.keys(monthGroups).sort();

  // Generate calendar days for selected month
  const generateCalendarDays = (year: number, month: number) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay();

    const calendar = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      calendar.push({ day: null, type: 'empty' });
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      // Find if this day is in a period
      let type = 'normal';
      for (const cycle of cycles) {
        const start = new Date(cycle.period_start);
        const end = new Date(cycle.period_end);
        const current = new Date(year, month - 1, day);

        if (current >= start && current <= end) {
          type = 'period';
          break;
        }
        // Check if it's in the fertile window (approximate)
        const periodStart = new Date(cycle.period_start);
        const ovulationDate = new Date(periodStart);
        ovulationDate.setDate(ovulationDate.getDate() + 14);
        const fertileStart = new Date(ovulationDate);
        fertileStart.setDate(fertileStart.getDate() - 5);
        const fertileEnd = new Date(ovulationDate);
        fertileEnd.setDate(fertileEnd.getDate() + 1);

        if (current >= fertileStart && current <= fertileEnd && type !== 'period') {
          type = 'fertile';
        }
      }

      calendar.push({ day, date: dateStr, type });
    }

    return calendar;
  };

  const getDayColor = (type: string) => {
    switch (type) {
      case 'period': return 'bg-pink-500 text-white';
      case 'fertile': return 'bg-purple-200 text-purple-700';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };

  const currentMonth = selectedMonth || sortedMonths[sortedMonths.length - 1];
  const [year, month] = currentMonth ? currentMonth.split('-').map(Number) : [new Date().getFullYear(), new Date().getMonth() + 1];

  const calendarDays = generateCalendarDays(year, month);

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="bg-macos-bg-card p-6 rounded-2xl border border-macos-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-macos-text-primary">经期日历</h3>
        <Calendar className="w-5 h-5 text-macos-accent-coral" />
      </div>

      {/* Month Selector */}
      {sortedMonths.length > 1 && (
        <select
          value={selectedMonth || ''}
          onChange={(e) => onMonthSelect?.(e.target.value)}
          className="mb-4 px-3 py-2 bg-macos-bg-secondary border border-macos-border rounded-lg text-sm"
        >
          {sortedMonths.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      )}

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Week day headers */}
        {weekDays.map(day => (
          <div key={day} className="p-2 text-xs font-semibold text-macos-text-muted">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((dayObj, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg text-sm font-medium transition-colors ${
              dayObj.day === null
                ? 'bg-transparent'
                : getDayColor(dayObj.type)
            }`}
          >
            {dayObj.day || ''}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-pink-500 rounded"></div>
          <span className="text-macos-text-muted">经期</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-purple-200 rounded"></div>
          <span className="text-macos-text-muted">排卵期</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-gray-100 rounded"></div>
          <span className="text-macos-text-muted">普通日</span>
        </div>
      </div>
    </div>
  );
}
