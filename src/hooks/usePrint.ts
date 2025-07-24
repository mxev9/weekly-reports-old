import { useScheduleStore } from './useScheduleStore';
import { useTranslation } from './useTranslation';

export function usePrint() {
  const { schedule, tags } = useScheduleStore();
  const { days, t } = useTranslation();

  const printSchedule = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const formatHour = (hour: number) => {
      if (hour === 0) return '12 AM';
      if (hour === 12) return '12 PM';
      return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
    };

    const getTagsForCell = (dayIndex: number, hourIndex: number) => {
      return schedule[dayIndex][hourIndex].tags
        .map(tagId => tags.find(tag => tag.id === tagId))
        .filter(Boolean)
        .map(tag => tag!.name)
        .join(', ');
    };

    const getSatisfactionIcon = (dayIndex: number, hourIndex: number) => {
      const satisfaction = schedule[dayIndex][hourIndex].satisfaction;
      return satisfaction === 'check' ? '✓' : satisfaction === 'star' ? '★' : '';
    };

    const printHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${t('weeklySchedule')}</title>
        <style>
          @media print {
            @page {
              margin: 0.5in;
              size: landscape;
            }
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: white;
            color: black;
            font-size: 10px;
          }
          
          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }
          
          .schedule-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          
          .schedule-table th,
          .schedule-table td {
            border: 1px solid #333;
            padding: 4px;
            text-align: center;
            vertical-align: top;
            height: 25px;
          }
          
          .schedule-table th {
            background: #f0f0f0;
            font-weight: bold;
            font-size: 9px;
          }
          
          .time-cell {
            background: #f8f8f8;
            font-size: 8px;
            width: 60px;
            font-weight: bold;
          }
          
          .day-header {
            font-size: 10px;
            font-weight: bold;
          }
          
          .cell-content {
            font-size: 8px;
            line-height: 1.2;
            overflow: hidden;
          }
          
          .tags {
            color: #333;
            font-weight: 500;
          }
          
          .satisfaction {
            color: #1DB954;
            font-weight: bold;
            float: right;
          }
          
          .footer {
            text-align: center;
            font-size: 8px;
            color: #666;
            margin-top: 20px;
            border-top: 1px solid #ccc;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${t('weeklySchedule')}</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <table class="schedule-table">
          <thead>
            <tr>
              <th class="time-cell">Time</th>
              ${days.map(day => `<th class="day-header">${day}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${Array.from({ length: 24 }, (_, hour) => `
              <tr>
                <td class="time-cell">${formatHour(hour)}</td>
                ${days.map((_, dayIndex) => `
                  <td>
                    <div class="cell-content">
                      <div class="tags">${getTagsForCell(dayIndex, hour)}</div>
                      <div class="satisfaction">${getSatisfactionIcon(dayIndex, hour)}</div>
                    </div>
                  </td>
                `).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Weekly Schedule - Printed Version</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return { printSchedule };
}