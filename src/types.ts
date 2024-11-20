export interface Subject {
  id: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
}

export interface AttendanceRecord {
  id: string;
  subjectId: string;
  date: string;
  status: 'present' | 'absent';
}

export interface AttendanceCriteria {
  requiredPercentage: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}