export interface SubjectOffer {
  name: string;
  code: string;
  description: string;
}

export interface ClassData {
  name: string;
  isSenior?: boolean;
  subjects?: SubjectOffer[];
  departments?: Record<string, SubjectOffer[]>;
}

export interface StudentResult {
  ca: number;
  exam: number;
}

export interface StudentRecord {
  name: string;
  id: string;
  className: string;
  department?: string;
  results: Record<string, StudentResult>;
  remarks: string;
  motto: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface AdmissionApplication {
  applicantName: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  proposedClass: string;
  department?: string;
  previousSchool: string;
  lastAverageScore: number;
  refNumber: string;
  status: 'Pending Review' | 'Conditionally Approved';
  dateApplied: string;
}
