import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle } from 'lucide-react';
import * as api from '../services/api';

const HabitPage = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newHabit, setNewHabit] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  async function fetchHabits() {
    setLoading(true);
    setError('');
    try {
      const res = await api.getHabitStats();
      setHabits(res.habits || []);
    } catch {
      setError('Failed to load habits');
    }
    setLoading(false);
  }

  async function handleAddHabit(e) {
    e.preventDefault();
    if (!newHabit.trim()) return;
    setAdding(true);
    setError('');
    try {
      // This assumes you have an API endpoint to add a habit, e.g. api.addHabit({ name: newHabit })
      // If not, just update the UI for demo purposes
      // await api.addHabit({ name: newHabit });
      setHabits([...habits, { name: newHabit, streak: 0 }]);
      setNewHabit('');
    } catch {
      setError('Failed to add habit');
    }
    setAdding(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center py-8">
      <div className="w-full max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Habit-Building Engine</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddHabit} className="flex gap-2 mb-6">
              <Input
                placeholder="Add a new habit (e.g. Study 30 min)"
                value={newHabit}
                onChange={e => setNewHabit(e.target.value)}
                disabled={adding}
              />
              <Button type="submit" disabled={adding || !newHabit.trim()}>Add</Button>
            </form>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            {loading ? (
              <div>Loading habits...</div>
            ) : habits.length === 0 ? (
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
    </div>
  );
};

export default HabitPage; 