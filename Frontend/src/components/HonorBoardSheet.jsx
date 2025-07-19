import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Trophy, Flame, Search } from 'lucide-react';
import api from "../services/api";

const HonorBoardSheet = ({ open, onOpenChange }) => {
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchHonorBoard() {
      try {
        const data = await api.getHonourBoard();
        if (Array.isArray(data)) {
          setTopStudents(data);
        } else if (Array.isArray(data.students)) {
          setTopStudents(data.students);
        } else if (Array.isArray(data.users)) {
          setTopStudents(data.users);
        } else {
          setTopStudents([]);
        }
      } catch {
        setTopStudents([]);
      }
      setLoading(false);
    }
    if (open) fetchHonorBoard();
  }, [open]);

  const filteredStudents = topStudents.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <Trophy className="h-4 w-4 mr-2" />
          Honor Board
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
            Honor Board
          </SheetTitle>
          <SheetDescription>
            Top students with highest streaks
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center text-gray-500">No students found.</div>
            ) : (
              filteredStudents.map((student, index) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{student.name}</p>
                      <div className="flex items-center text-sm text-gray-600">
                        <Flame className="h-3 w-3 mr-1 text-orange-500" />
                        {student.streak} day streak
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">Level {student.level}</Badge>
                    <p className="text-xs text-gray-500 mt-1">{student.xp} XP</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HonorBoardSheet; 