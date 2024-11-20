import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subject, AttendanceRecord, AttendanceCriteria, User } from '../types';

interface Store {
  user: User | null;
  subjects: Subject[];
  records: AttendanceRecord[];
  criteria: AttendanceCriteria;
  setUser: (user: User | null) => void;
  setSubjects: (subjects: Subject[]) => void;
  setRecords: (records: AttendanceRecord[]) => void;
  setCriteria: (criteria: AttendanceCriteria) => void;
  addSubject: (subject: Omit<Subject, 'id' | 'totalClasses' | 'attendedClasses'>) => void;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  markAttendance: (subjectId: string, date: string, status: 'present' | 'absent', classCount: number) => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: null,
      subjects: [],
      records: [],
      criteria: { requiredPercentage: 75 },

      setUser: (user) => set({ user }),
      setSubjects: (subjects) => set({ subjects }),
      setRecords: (records) => set({ records }),
      setCriteria: (criteria) => set({ criteria }),

      addSubject: (subjectData) => {
        const newSubject: Subject = {
          id: Date.now().toString(),
          ...subjectData,
          totalClasses: 0,
          attendedClasses: 0,
        };
        set((state) => ({
          subjects: [...state.subjects, newSubject],
        }));
      },

      updateSubject: (id, updatedSubject) => {
        set((state) => ({
          subjects: state.subjects.map((subject) =>
            subject.id === id ? { ...subject, ...updatedSubject } : subject
          ),
        }));
      },

      deleteSubject: (id) => {
        set((state) => ({
          subjects: state.subjects.filter((s) => s.id !== id),
          records: state.records.filter((r) => r.subjectId !== id),
        }));
      },

      markAttendance: (subjectId, date, status, classCount) => {
        const newRecords: AttendanceRecord[] = Array.from(
          { length: classCount },
          (_, i) => ({
            id: `${Date.now()}-${i}`,
            subjectId,
            date,
            status,
          })
        );

        set((state) => {
          const updatedSubjects = state.subjects.map((subject) => {
            if (subject.id === subjectId) {
              return {
                ...subject,
                totalClasses: subject.totalClasses + classCount,
                attendedClasses:
                  subject.attendedClasses + (status === 'present' ? classCount : 0),
              };
            }
            return subject;
          });

          return {
            subjects: updatedSubjects,
            records: [...state.records, ...newRecords],
          };
        });
      },
    }),
    {
      name: 'attendance-storage',
      partialize: (state) => ({
        user: state.user,
        subjects: state.subjects,
        records: state.records,
        criteria: state.criteria,
      }),
    }
  )
);