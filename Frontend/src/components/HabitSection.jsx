import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const HabitSection = ({ habits }) => (
  <div className="mt-12">
    <Card>
      <CardHeader>
        <CardTitle>Habit-Building</CardTitle>
      </CardHeader>
      <CardContent>
        {(!habits || habits.length === 0) ? (
          <div className="text-gray-600">No habits tracked yet. Start building your study habits!</div>
        ) : (
          <ul className="space-y-2">
            {habits.map((habit, idx) => (
              <li key={habit.id || idx} className="flex items-center gap-2 p-2 border rounded">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium text-gray-900">{habit.name || 'Habit'}</span>
                {habit.streak !== undefined && (
                  <span className="ml-auto text-xs text-gray-500">Streak: {habit.streak}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  </div>
);

export default HabitSection; 