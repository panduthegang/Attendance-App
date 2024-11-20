import React, { useState } from 'react';
import { Calendar, Percent, School, Edit2, Trash2, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Subject } from '../types';

interface SubjectCardProps {
  subject: Subject;
  onMarkAttendance: (subjectId: string, date: string, status: 'present' | 'absent', classNumber: number) => void;
  onEditSubject: (subject: Subject) => void;
  onDeleteSubject: (subjectId: string) => void;
}

export default function SubjectCard({ subject, onMarkAttendance, onEditSubject, onDeleteSubject }: SubjectCardProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [classCount, setClassCount] = useState(1);
  const percentage = (subject.attendedClasses / subject.totalClasses) * 100 || 0;

  const handleClassCountChange = (increment: boolean) => {
    setClassCount(prev => {
      const newCount = increment ? prev + 1 : prev - 1;
      return Math.max(1, Math.min(newCount, 4)); // Limit between 1 and 4 classes
    });
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <h3 className="text-xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          {subject.name}
        </h3>
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEditSubject(subject)}
            className="p-2 hover:bg-indigo-100 rounded-full transition-colors"
          >
            <Edit2 className="w-4 h-4 text-indigo-600" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDeleteSubject(subject.id)}
            className="p-2 hover:bg-red-100 rounded-full transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </motion.button>
          <div className="flex items-center gap-2 bg-indigo-100 px-3 py-1 rounded-full">
            <School className="w-5 h-5 text-indigo-600" />
            <span className="text-indigo-600 font-medium">{subject.attendedClasses}/{subject.totalClasses}</span>
          </div>
        </div>
      </div>
      
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4"
        style={{ maxWidth: '100%' }}
      />
      
      <div className="flex items-center gap-2 mb-6">
        <Percent className="w-5 h-5 text-indigo-600" />
        <span className="text-lg font-semibold" style={{
          color: percentage >= 75 ? 'rgb(22 163 74)' : 'rgb(220 38 38)'
        }}>
          {percentage.toFixed(1)}%
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-indigo-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-indigo-100 px-3 py-1 rounded-lg">
          <button
            onClick={() => handleClassCountChange(false)}
            className="p-1 hover:bg-indigo-200 rounded-full transition-colors"
            disabled={classCount <= 1}
          >
            <Minus className="w-4 h-4 text-indigo-600" />
          </button>
          <span className="text-indigo-600 font-medium w-4 text-center">{classCount}</span>
          <button
            onClick={() => handleClassCountChange(true)}
            className="p-1 hover:bg-indigo-200 rounded-full transition-colors"
            disabled={classCount >= 4}
          >
            <Plus className="w-4 h-4 text-indigo-600" />
          </button>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMarkAttendance(subject.id, selectedDate, 'present', classCount)}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Present
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMarkAttendance(subject.id, selectedDate, 'absent', classCount)}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Absent
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}