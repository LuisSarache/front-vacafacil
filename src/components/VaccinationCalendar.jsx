import { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { Calendar, Syringe, AlertTriangle } from 'lucide-react';

export const VaccinationCalendar = ({ vacinas, onSchedule }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getVacinasForDate = (date) => {
    return vacinas.filter(v => 
      new Date(v.proximaDose).toDateString() === date.toDateString()
    );
  };

  const isOverdue = (date) => {
    return new Date(date) < new Date();
  };

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const vacinasForDay = getVacinasForDate(date);
      days.push({
        date,
        day,
        vacinas: vacinasForDay,
        isOverdue: vacinasForDay.some(v => isOverdue(v.proximaDose))
      });
    }
    
    return days;
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          Calendário de Vacinação
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
          >
            ←
          </Button>
          <span className="font-medium">
            {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </span>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
          >
            →
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {generateCalendarDays().map((dayData, index) => (
          <div
            key={index}
            className={`min-h-[80px] p-2 border rounded ${
              dayData ? 'bg-white hover:bg-gray-50' : 'bg-gray-100'
            } ${dayData?.isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
          >
            {dayData && (
              <>
                <div className="text-sm font-medium mb-1">{dayData.day}</div>
                {dayData.vacinas.map((vacina, vIndex) => (
                  <div
                    key={vIndex}
                    className={`text-xs p-1 rounded mb-1 ${
                      isOverdue(vacina.proximaDose)
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    <div className="flex items-center">
                      {isOverdue(vacina.proximaDose) ? (
                        <AlertTriangle className="w-3 h-3 mr-1" />
                      ) : (
                        <Syringe className="w-3 h-3 mr-1" />
                      )}
                      {vacina.vaca}
                    </div>
                    <div className="truncate">{vacina.vacina}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-100 rounded mr-2"></div>
            <span>Agendado</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-100 rounded mr-2"></div>
            <span>Atrasado</span>
          </div>
        </div>
        <Button size="sm" onClick={() => onSchedule?.()}>
          Agendar Vacinação
        </Button>
      </div>
    </Card>
  );
};