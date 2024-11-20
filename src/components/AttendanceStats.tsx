import React from 'react';
import { Target, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Subject, AttendanceCriteria } from '../types';

interface AttendanceStatsProps {
  subjects: Subject[];
  criteria: AttendanceCriteria;
}

export default function AttendanceStats({ subjects, criteria }: AttendanceStatsProps) {
  const totalClasses = subjects.reduce((acc, subject) => acc + subject.totalClasses, 0);
  const totalAttended = subjects.reduce((acc, subject) => acc + subject.attendedClasses, 0);
  const overallPercentage = (totalAttended / totalClasses) * 100 || 0;

  const calculateClassesNeeded = () => {
    if (overallPercentage >= criteria.requiredPercentage) {
      const maxAbsences = Math.floor(totalClasses * (1 - criteria.requiredPercentage / 100));
      const remainingAbsences = maxAbsences - (totalClasses - totalAttended);
      return `You can miss ${remainingAbsences} more classes while maintaining ${criteria.requiredPercentage}% attendance`;
    } else {
      const required = Math.ceil((criteria.requiredPercentage * totalClasses - 100 * totalAttended) / 
                               (100 - criteria.requiredPercentage));
      return `You need to attend ${required} more classes to reach ${criteria.requiredPercentage}% attendance`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-8 backdrop-blur-lg bg-opacity-80"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
        Overall Attendance Statistics
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 bg-gradient-to-br from-white to-indigo-50 p-4 rounded-xl shadow-md"
        >
          <Target className="w-6 h-6 text-indigo-600" />
          <div>
            <p className="text-gray-600">Overall Attendance</p>
            <p className="text-2xl font-bold" style={{
              color: overallPercentage >= criteria.requiredPercentage ? 'rgb(22 163 74)' : 'rgb(220 38 38)'
            }}>
              {overallPercentage.toFixed(1)}%
            </p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 bg-gradient-to-br from-white to-indigo-50 p-4 rounded-xl shadow-md"
        >
          <AlertCircle className="w-6 h-6 text-indigo-600" />
          <div>
            <p className="text-gray-600">Status</p>
            <p className="text-lg font-medium text-gray-800">
              {calculateClassesNeeded()}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}