import React, { useState } from 'react';
import { GraduationCap, Plus, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SubjectCard from './SubjectCard';
import AttendanceStats from './AttendanceStats';
import SubjectModal from './SubjectModal';
import { useStore } from '../store/useStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<string | undefined>();
  
  const {
    user,
    subjects,
    criteria,
    setCriteria,
    addSubject,
    updateSubject,
    deleteSubject,
    markAttendance,
    setUser
  } = useStore();

  const handleCriteriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(100, Math.max(0, Number(e.target.value)));
    setCriteria({ requiredPercentage: value });
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-lg"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Attendance Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {user?.name}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <main className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-white rounded-xl shadow-lg p-6 backdrop-blur-lg bg-opacity-80"
        >
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Required Attendance Percentage
          </label>
          <input
            type="number"
            value={criteria.requiredPercentage}
            onChange={handleCriteriaChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min="0"
            max="100"
          />
        </motion.div>

        <AttendanceStats subjects={subjects} criteria={criteria} />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Subjects
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingSubject(undefined);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Subject
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {subjects.map(subject => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onMarkAttendance={markAttendance}
                onEditSubject={() => {
                  setEditingSubject(subject.id);
                  setShowModal(true);
                }}
                onDeleteSubject={deleteSubject}
              />
            ))}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {showModal && (
          <SubjectModal
            subject={subjects.find(s => s.id === editingSubject)}
            onClose={() => {
              setShowModal(false);
              setEditingSubject(undefined);
            }}
            onSave={(subjectData) => {
              if (editingSubject) {
                updateSubject(editingSubject, subjectData);
              } else {
                addSubject(subjectData);
              }
              setShowModal(false);
              setEditingSubject(undefined);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}