import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar,
  Award, 
  Sparkles, 
  Send, 
  CheckCircle, 
  ChevronRight, 
  User, 
  Mail, 
  Layers, 
  Lock, 
  Clock, 
  Compass, 
  X, 
  Check, 
  HelpCircle,
  FileText,
  Bookmark,
  ChevronDown,
  RefreshCw,
  Printer,
  Phone,
  MapPin,
  Menu,
  ShieldAlert,
  FileSpreadsheet,
  UserCheck,
  LogOut,
  Plus,
  Trash2
} from 'lucide-react';
import { 
  SCHOOL_MANIFESTO, 
  OFF_CLASSES_DATA, 
  SEED_STUDENTS, 
  calculateGrade, 
  calculateGPA 
} from './data';
import { 
  StudentRecord, 
  Message, 
  AdmissionApplication, 
  SubjectOffer 
} from './types';
import { OFFLINE_QUIZ_BANK, getFallbackQuestions, CbtQuestion, ensureExactly30Questions } from './questionBank';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'academics' | 'admissions' | 'portal' | 'crest-ai' | 'admin' | 'events'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Read More State (Home Tab)
  const [readMoreOpen, setReadMoreOpen] = useState(false);

  // Academics Tab State
  const [academicClass, setAcademicClass] = useState<string>('JSS 1');
  const [academicDept, setAcademicDept] = useState<string>('Sciences (STEM)');

  // Admissions Tab State
  const [admissionSubMode, setAdmissionSubMode] = useState<'main' | 'learn-more' | 'apply'>('main');
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>([]);
  // Form values
  const [applName, setApplName] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [applClass, setApplClass] = useState('Primary 6');
  const [applDept, setApplDept] = useState('Sciences (STEM)');
  const [prevSchool, setPrevSchool] = useState('');
  const [lastAvg, setLastAvg] = useState('82');
  const [appliedStatus, setAppliedStatus] = useState<AdmissionApplication | null>(null);

  // Student Portal State
  const [studentSearchName, setStudentSearchName] = useState('');
  const [studentSearchId, setStudentSearchId] = useState('');
  const [foundStudent, setFoundStudent] = useState<StudentRecord | null>(null);
  const [portalError, setPortalError] = useState('');
  const [isFetchingResult, setIsFetchingResult] = useState(false);

  // Active student list (synced with LocalStorage)
  const [studentsList, setStudentsList] = useState<StudentRecord[]>([]);

  // Tutor Chat State (Crest AI)
  const [chatSubject, setChatSubject] = useState<string>('General Mathematics');
  const [chatMode, setChatMode] = useState<'study-chat' | 'quiz'>('study-chat');
  const [chatLevel, setChatLevel] = useState<'senior' | 'junior' | 'primary'>('senior');
  const [openedSubject, setOpenedSubject] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('wolcrest_chat_v3');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [userMsgInput, setUserMsgInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  // Sync Crest AI chat history to localStorage
  useEffect(() => {
    localStorage.setItem('wolcrest_chat_v3', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Admin Control State
  const [adminPin, setAdminPin] = useState<string>(() => {
    return localStorage.getItem('wolcrest_admin_pin') || '666222';
  });
  const [adminPasscode, setAdminPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [adminError, setAdminError] = useState('');

  // JAMB Style CBT Exam Engine States
  const [cbtQuestions, setCbtQuestions] = useState<CbtQuestion[]>([]);
  const [cbtCurrentIdx, setCbtCurrentIdx] = useState<number>(0);
  const [cbtAnswers, setCbtAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [cbtTimeLeft, setCbtTimeLeft] = useState<number>(900); // 15 minutes = 900 seconds
  const [cbtRunning, setCbtRunning] = useState<boolean>(false);
  const [cbtSubmitted, setCbtSubmitted] = useState<boolean>(false);
  const [cbtScore, setCbtScore] = useState<number>(0);
  const [cbtGenerating, setCbtGenerating] = useState<boolean>(false);
  const [cbtShowConfirmSubmit, setCbtShowConfirmSubmit] = useState<boolean>(false);

  // Helper mapping function for subject lists by level
  const getSubjectsForLevel = (level: 'senior' | 'junior' | 'primary') => {
    if (level === 'primary') {
      return [
        { value: 'Quantitative Aptitude', label: 'Quantitative Aptitude', description: 'Tests mathematical patterns, logical arrays, and sequence discovery reasoning.' },
        { value: 'Verbal Aptitude', label: 'Verbal Aptitude', description: 'Enhances vocabulary skills, antonym/synonym layouts, and comprehension analysis.' },
        { value: 'Primary Mathematics', label: 'Primary Mathematics', description: 'Covers base units, simple fractions, areas, quantitative sums, and fast divisions.' },
        { value: 'General Studies', label: 'General Studies & Science', description: 'Examines elementary science, social facts, safety protocols, and environment units.' },
        { value: 'Yoruba Language', label: 'Yoruba Language', description: 'Enriches tone marks (ami ohun), vocabulary lists, and traditional cultural structures.' },
        { value: 'Civic Education', label: 'Civic Education', description: 'Teaches national values, civic duties, human rights guidelines, and cooperative behavior.' }
      ];
    } else if (level === 'junior') {
      return [
        { value: 'Basic Mathematics', label: 'Basic Mathematics', description: 'BECE preparation including simultaneous linear models, algebraic fractions, and polygon angles.' },
        { value: 'English Language', label: 'English Language', description: 'Covers essay letter styles, comprehension question strategies, and active grammar rules.' },
        { value: 'Basic Science', label: 'Basic Science & Tech', description: 'Focuses on electric structures, kinetic and thermal heat transformations, and eco networks.' },
        { value: 'Social Studies', label: 'Social Studies & Civics', description: 'Explores social systems, civic values, leadership hierarchies, and cultural concepts.' },
        { value: 'Yoruba Language', label: 'Yoruba Language', description: 'Explores proper tone marks (ami ohun), prose, poetry, and beautiful Yoruba heritage.' },
        { value: 'Civic Education', label: 'Civic Education', description: 'BECE syllabus: Human rights, national values, civic responsibilities, and constitution frameworks.' },
        { value: 'Agricultural Science', label: 'Agricultural Science', description: 'Soil science, crop classification, pest management, and livestock husbandry standards.' },
        { value: 'Cultural and Creative Arts (CCA)', label: 'Cultural & Creative Arts (CCA)', description: 'Features visual drawing techniques, local crafts, dramatic arts, and musical notation.' },
        { value: 'Christian Religious Studies (CRS)', label: 'Christian Religious Studies (CRS)', description: 'Biblical narratives, prophets, Christian morals, and loving human relations guidelines.' },
        { value: 'Home Economics', label: 'Home Economics', description: 'Home management, healthy nutrition protocols, clothing seams, and food preparation fundamentals.' }
      ];
    } else {
      return [
        { value: 'General Mathematics', label: 'General Mathematics', description: 'WAEC syllabus: Surds, sets, indices, quadratic and linear systems, statistics, and graphs.' },
        { value: 'Further Mathematics', label: 'Further Mathematics', description: 'Advanced calculus, vectors, complex algebraic derivations, binomial limits, and mechanics.' },
        { value: 'English Language', label: 'English Language', description: 'Develops narrative essay mechanics, comprehension summary techniques, and register definitions.' },
        { value: 'Literature-in-English', label: 'Literature-in-English', description: 'Syllabus poetry reviews, prose analysis, structural character sketches, and drama literary terms.' },
        { value: 'Physics', label: 'Physics (Practical & Theory)', description: 'Topics spanning electricity theory, light optics, wave reflections, magnetism, and calculations.' },
        { value: 'Chemistry', label: 'Chemistry (Volumetric/Sulphate)', description: 'Covers acid-base volumetric analysis calculations, qualitative tests, and organic compounds.' },
        { value: 'Biology', label: 'Biology (Cells & System Crosses)', description: 'Includes cell genetics, respiratory pathways, animal/plant classification, and cross-mapping.' },
        { value: 'Economics', label: 'Economics', description: 'Concepts of demand/supply elasticities, basic business accounts, and West African monetary structures.' },
        { value: 'Accountancy', label: 'Financial Accounting', description: 'Guides ledger postings, trial balances, final balance sheet equations, and bank reconciliations.' },
        { value: 'Government', label: 'Government & History', description: 'Covers constitution histories, executive/general arms of authority, and West African politics.' },
        { value: 'Yoruba Language', label: 'Yoruba Language', description: 'WAEC-aligned study: Composition, grammar syntax, orthography (Akoto), literature (Ewi/Ere kere), and cultural values.' },
        { value: 'Civic Education', label: 'Civic Education', description: 'Syllabus reviews: Citizenship, national values, human rights, rule of law, and drug abuse containment.' }
      ];
    }
  };

  const handleLevelChange = (lvl: 'senior' | 'junior' | 'primary') => {
    setChatLevel(lvl);
    const subjects = getSubjectsForLevel(lvl);
    setChatSubject(subjects[0].value);
    setOpenedSubject(null); // Reset opened subject when changing levels
  };

  const handleStartQuiz = async (subjectVal: string) => {
    setCbtGenerating(true);
    setChatSubject(subjectVal);
    setCbtQuestions([]);
    setCbtCurrentIdx(0);
    setCbtAnswers({});
    setCbtSubmitted(false);
    setCbtShowConfirmSubmit(false);

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: subjectVal,
          level: chatLevel,
        }),
      });

      const data = await response.json();
      if (data && data.questions && data.questions.length > 0) {
        setCbtQuestions(ensureExactly30Questions(data.questions, chatLevel, subjectVal));
      } else {
        const fallback = getFallbackQuestions(chatLevel, subjectVal);
        setCbtQuestions(ensureExactly30Questions(fallback, chatLevel, subjectVal));
      }
    } catch (err) {
      console.error('Error generating AI questions:', err);
      const fallback = getFallbackQuestions(chatLevel, subjectVal);
      setCbtQuestions(ensureExactly30Questions(fallback, chatLevel, subjectVal));
    } finally {
      setCbtGenerating(false);
      setCbtTimeLeft(900); // 15 minutes reset
      setCbtRunning(true);
    }
  };

  // Setup/Reset JAMB style quiz session on demand
  useEffect(() => {
    if (chatMode !== 'quiz') {
      setCbtRunning(false);
    }
  }, [chatMode]);

  // Handle active countdown timer
  useEffect(() => {
    let timerId: any = null;
    if (cbtRunning && cbtTimeLeft > 0 && !cbtSubmitted) {
      timerId = setInterval(() => {
        setCbtTimeLeft(prev => {
          if (prev <= 1) {
            handleCbtSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [cbtRunning, cbtTimeLeft, cbtSubmitted]);

  // Handle keyboard CBT hotkeys (JAMB Style: A, B, C, D to choose, N to next, P to prev, S to submit)
  useEffect(() => {
    const handleCbtKeyboard = (e: KeyboardEvent) => {
      if (chatMode !== 'quiz' || cbtSubmitted || !cbtRunning || activeTab !== 'crest-ai') return;
      
      const key = e.key.toUpperCase();
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }
      
      if (key === 'A' || key === 'B' || key === 'C' || key === 'D') {
        const currentQuestion = cbtQuestions[cbtCurrentIdx];
        if (currentQuestion) {
          setCbtAnswers(prev => ({ ...prev, [currentQuestion.id]: key as any }));
        }
      } else if (key === 'N') {
        if (cbtCurrentIdx < cbtQuestions.length - 1) {
          setCbtCurrentIdx(prev => prev + 1);
        }
      } else if (key === 'P') {
        if (cbtCurrentIdx > 0) {
          setCbtCurrentIdx(prev => prev - 1);
        }
      } else if (key === 'S') {
        setCbtShowConfirmSubmit(true);
      }
    };
    
    window.addEventListener('keydown', handleCbtKeyboard);
    return () => {
      window.removeEventListener('keydown', handleCbtKeyboard);
    };
  }, [chatMode, cbtQuestions, cbtCurrentIdx, cbtAnswers, cbtSubmitted, cbtRunning, activeTab]);

  const handleCbtSubmit = (isAutosubmit = false) => {
    if (!isAutosubmit) {
      setCbtShowConfirmSubmit(true);
      return;
    }
    
    let correctCount = 0;
    cbtQuestions.forEach(q => {
      if (cbtAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const percent = cbtQuestions.length > 0 ? Math.round((correctCount / cbtQuestions.length) * 100) : 0;
    setCbtScore(percent);
    setCbtSubmitted(true);
    setCbtRunning(false);
    setCbtShowConfirmSubmit(false);
  };
  
  // Admin Editing / Registration State
  const [selectedAdminStudent, setSelectedAdminStudent] = useState<StudentRecord | null>(null);
  const [isRegisteringStudent, setIsRegisteringStudent] = useState(false);
  // Reg values
  const [regName, setRegName] = useState('');
  const [regClass, setRegClass] = useState('JSS 1');
  const [regDept, setRegDept] = useState('Sciences (STEM)');
  const [regRemarks, setRegRemarks] = useState('');
  // Registrant responses
  const [lastGeneratedId, setLastGeneratedId] = useState('');
  const [lastGeneratedMotto, setLastGeneratedMotto] = useState('');
  const [isIdGenerating, setIsIdGenerating] = useState(false);

  // Load and seed students and applications into LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('wolcrest_students_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setStudentsList(parsed);
        } else {
          setStudentsList(SEED_STUDENTS);
        }
      } catch (e) {
        console.error("Local storage corruption", e);
        setStudentsList(SEED_STUDENTS);
      }
    } else {
      localStorage.setItem('wolcrest_students_v3', JSON.stringify(SEED_STUDENTS));
      setStudentsList(SEED_STUDENTS);
    }

    const savedAdmissions = localStorage.getItem('wolcrest_admissions');
    if (savedAdmissions) {
      try {
        const parsed = JSON.parse(savedAdmissions);
        if (Array.isArray(parsed)) {
          setAdmissions(parsed);
        }
      } catch (e) {
        console.error("Admissions load corruption", e);
      }
    }
  }, []);

  const saveStudentsToStorage = (updatedList: StudentRecord[]) => {
    setStudentsList(updatedList);
    localStorage.setItem('wolcrest_students_v3', JSON.stringify(updatedList));
  };

  // Handle deleting a single chat message
  const handleDeleteChatMessage = (messageId: string) => {
    setChatMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  // Handle clearing the entire study session history
  const handleClearChatHistory = () => {
    if (!isConfirmingClear) {
      setIsConfirmingClear(true);
    } else {
      setChatMessages([]);
      setIsConfirmingClear(false);
    }
  };

  // Switch tabs safely
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    // Reset temporary states
    setPortalError('');
    setAdminError('');
    setAppliedStatus(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Action 1: Admissions "Learn More" clicked - Shows About Us + Subjects of every class
  const handleAdmissionsLearnMore = () => {
    setAdmissionSubMode('learn-more');
  };

  // Action 2: Admissions Apply clicked
  const handleAdmissionsApply = () => {
    setAdmissionSubMode('apply');
    setAppliedStatus(null);
  };

  // Action 3: Handle Admissions Application Form Submission
  const handleAdmissionsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applName || !parentName || !parentEmail || !parentPhone) {
      alert("Please fill in all primary fields.");
      return;
    }
    const randRef = 'WOL-ADM-' + Math.floor(100000 + Math.random() * 900000);
    const newAppl: AdmissionApplication = {
      applicantName: applName,
      parentName,
      parentEmail,
      parentPhone,
      proposedClass: applClass,
      department: applClass.includes('SSS') ? applDept : undefined,
      previousSchool: prevSchool || 'N/A',
      lastAverageScore: parseFloat(lastAvg) || 75,
      refNumber: randRef,
      status: parseFloat(lastAvg) >= 80 ? 'Conditionally Approved' : 'Pending Review',
      dateApplied: new Date().toLocaleDateString('en-WA', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    const currentAppls = JSON.parse(localStorage.getItem('wolcrest_admissions') || '[]');
    currentAppls.push(newAppl);
    localStorage.setItem('wolcrest_admissions', JSON.stringify(currentAppls));
    setAdmissions(currentAppls);

    setAppliedStatus(newAppl);
    // Clear state
    setApplName('');
    setPrevSchool('');
  };

  // Action 4: Portal Result Fetching handler
  const handleFetchResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentSearchName.trim() || !studentSearchId.trim()) {
      setPortalError('Please provide both the student full name and active identification ID.');
      setFoundStudent(null);
      return;
    }

    setIsFetchingResult(true);
    setPortalError('');
    setFoundStudent(null);

    setTimeout(() => {
      const match = studentsList.find(s => 
        s.name.toLowerCase() === studentSearchName.trim().toLowerCase() &&
        s.id.toLowerCase() === studentSearchId.trim().toLowerCase()
      );

      if (match) {
        setFoundStudent(match);
      } else {
        setPortalError('Student record not found. Please verify spelling or contact Wolcrest administrative registry.');
      }
      setIsFetchingResult(false);
    }, 1100);
  };

  // Action 5: Admin Password Unlocker
  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === adminPin) {
      setIsUnlocked(true);
      setAdminError('');
    } else {
      setAdminError('Invalid verification credentials. Access restricted to authorized registrar staff.');
      setIsUnlocked(false);
    }
  };

  // Action 6: Admin registers student invoking our Server API for ID + motto
  const handleAdminRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      alert('Kindly provide the student name.');
      return;
    }

    setIsIdGenerating(true);
    setLastGeneratedId('');
    setLastGeneratedMotto('');

    try {
      const response = await fetch('/api/generate-student-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: regName,
          className: regClass,
          department: regClass.includes('SSS') ? regDept : 'General'
        })
      });

      const data = await response.json();
      if (response.ok && data.studentId) {
        setLastGeneratedId(data.studentId);
        setLastGeneratedMotto(data.motto);

        // Seed initial subjects based on their class
        const initialResults: Record<string, { ca: number; exam: number }> = {};
        
        const matchingClass = OFF_CLASSES_DATA[regClass];
        if (matchingClass) {
          let subsToSeed: SubjectOffer[] = [];
          if (matchingClass.isSenior && matchingClass.departments) {
            subsToSeed = matchingClass.departments[regDept] || [];
          } else {
            subsToSeed = matchingClass.subjects || [];
          }

          subsToSeed.forEach(sub => {
            // Seed a realistic initial grade (eg 0 on all new registrants)
            initialResults[sub.name] = { ca: 0, exam: 0 };
          });
        }

        const newStudent: StudentRecord = {
          name: regName.trim(),
          id: data.studentId,
          className: regClass,
          department: regClass.includes('SSS') ? regDept : 'General',
          results: initialResults,
          remarks: regRemarks || 'Newly registered student in good standing.',
          motto: data.motto
        };

        const updated = [...studentsList, newStudent];
        saveStudentsToStorage(updated);
        setRegName('');
        setRegRemarks('');
      } else {
        alert('Server API was unable to generate student identifier properly.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred connecting to the identity generator backend.');
    } finally {
      setIsIdGenerating(false);
    }
  };

  // Action 7: Admin edits student scorecard grades
  const handleAdminScoreChange = (subjectName: string, type: 'ca' | 'exam', val: string) => {
    if (!selectedAdminStudent) return;
    const parsed = parseInt(val) || 0;
    const bounded = type === 'ca' ? Math.min(40, Math.max(0, parsed)) : Math.min(60, Math.max(0, parsed));

    const updatedResults = {
      ...selectedAdminStudent.results,
      [subjectName]: {
        ...selectedAdminStudent.results[subjectName],
        [type]: bounded
      }
    };

    const updatedStudentObj = {
      ...selectedAdminStudent,
      results: updatedResults
    };

    setSelectedAdminStudent(updatedStudentObj);

    // Sync state
    const updatedAll = studentsList.map(s => s.id === selectedAdminStudent.id ? updatedStudentObj : s);
    saveStudentsToStorage(updatedAll);
  };

  // Action 8: Admin updates final remarks
  const handleAdminRemarksUpdate = (remarkStr: string) => {
    if (!selectedAdminStudent) return;
    const updatedStudentObj = {
      ...selectedAdminStudent,
      remarks: remarkStr
    };
    setSelectedAdminStudent(updatedStudentObj);

    // Sync
    const updatedAll = studentsList.map(s => s.id === selectedAdminStudent.id ? updatedStudentObj : s);
    saveStudentsToStorage(updatedAll);
  };

  // Action 9: Admin removes a student
  const handleAdminDeleteStudent = (studentId: string) => {
    if (confirm('Are you absolutely sure you want to deactivate and remove this student profile?')) {
      const updatedAll = studentsList.filter(s => s.id !== studentId);
      saveStudentsToStorage(updatedAll);
      setSelectedAdminStudent(null);
    }
  };

  // Action 10: AI Chat (Crest AI WAEC Tutor)
  // Ensure model does NOT reveal 666222
  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userMsgInput.trim()) return;

    const userText = userMsgInput.trim();
    setUserMsgInput('');

    // Pre-filter passcode inquiries in the UI layer for bulletproof security!
    const userTextLower = userText.toLowerCase();
    const hasAdminKeywords = 
      userTextLower.includes('admin') || 
      userTextLower.includes('passcode') || 
      userTextLower.includes('password') || 
      userTextLower.includes('666222') || 
      userTextLower.includes('pin') || 
      userTextLower.includes('registry code') || 
      userTextLower.includes('passkey') || 
      userTextLower.includes('bypass') || 
      userTextLower.includes('credential') || 
      userText.includes(adminPin);

    if (hasAdminKeywords) {
      const securityFilterMsg: Message = {
        id: 'user-' + Date.now(),
        sender: 'user',
        text: userText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };
      
      const crestSecurityResponseMsg: Message = {
        id: 'bot-' + (Date.now() + 1),
        sender: 'bot',
        text: "🔒 **Crest Security Notice**: Hello, my exceptional future leader! I am **Crest AI**, your classroom-focused academic tutor. Please note that I am completely decoupled from the school's administrative console and student registrar databases. I do not have access to registry validation keys, PIN numbers, or administrative configuration switches—this keeps our student archives perfectly secure! Let us return to preparing for your syllabus concepts and achieving your academic goals together! What topic are we mastering today?",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, securityFilterMsg, crestSecurityResponseMsg]);
      return;
    }

    const newUserMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newUserMsg]);
    setIsAiLoading(true);

    try {
      // Map history object for Gemini server proxy
      const formattedHistory = chatMessages.slice(-8).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const response = await fetch('/api/teach-waec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          subject: chatSubject,
          mode: chatMode,
          level: chatLevel,
          history: formattedHistory
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        const botReply: Message = {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: data.text,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, botReply]);
      } else {
        const fallbackReply: Message = {
          id: 'bot-err-' + Date.now(),
          sender: 'bot',
          text: "My apologies, I had a brief network interruption. Ask me again shortly, and we'll unlock this syllabus concept!",
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, fallbackReply]);
      }
    } catch (err) {
      console.error(err);
      const errReply: Message = {
        id: 'bot-err-' + Date.now(),
        sender: 'bot',
        text: "Connection failed. Please configure your API credentials inside AI Studio settings or check backend stability logs.",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errReply]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Helper template prompt inputs
  const triggerConceptPrompt = (concept: string) => {
    setUserMsgInput(concept);
    // Submit in next frame
    setTimeout(() => {
      const inp = document.getElementById('chat-input-box') as HTMLInputElement;
      if (inp) inp.focus();
    }, 50);
  };

  return (
    <div id="wolcrest-app-root" className="min-h-screen bg-slate-50 text-slate-850 flex flex-col font-sans transition-all selection:bg-[#7A0C2E]/25 text-sm antialiased pb-12">
      
      {/* HEADER NAVBAR - Royal Crimson (#7A0C2E) & Deep Navy (#0A1931) Frosted Luxury Bar */}
      <header id="main-header" className="sticky top-0 z-50 bg-[#0A1931]/95 backdrop-blur-lg text-white shadow-xl border-b border-[#7A0C2E]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <div 
            id="brand-signature" 
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => handleTabChange('home')}
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#7A0C2E] to-[#4A0519] flex items-center justify-center border border-rose-400/30 text-white font-cinzel font-black shadow-lg ring-4 ring-[#7A0C2E]/10 group-hover:scale-105 group-hover:ring-[#7A0C2E]/30 transition-all duration-300">
              <span className="text-xl tracking-tighter text-amber-200">W</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 font-cinzel text-white">
                WOLCREST <span className="text-amber-200/90 font-sans font-light text-[10px] sm:text-xs tracking-[0.25em] border-l border-slate-600/70 pl-2.5 uppercase">Schools</span>
              </h1>
              <span className="block text-[8.5px] text-slate-300 tracking-[0.18em] font-medium font-sans uppercase">
                Where the Future is Assured
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav" className="hidden lg:flex items-center gap-1.5 bg-black/20 p-1 rounded-full border border-white/5">
            <button 
              id="btn-nav-home"
              onClick={() => handleTabChange('home')}
              className={`px-4.5 py-2 rounded-full font-sans font-semibold text-xs transition-all pointer-events-auto ${activeTab === 'home' ? 'bg-[#7A0C2E] text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
            >
              Overview
            </button>
            <button 
              id="btn-nav-academics"
              onClick={() => handleTabChange('academics')}
              className={`px-4.5 py-2 rounded-full font-sans font-semibold text-xs transition-all pointer-events-auto ${activeTab === 'academics' ? 'bg-[#7A0C2E] text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
            >
              Academics
            </button>
            <button 
              id="btn-nav-admissions"
              onClick={() => handleTabChange('admissions')}
              className={`px-4.5 py-2 rounded-full font-sans font-semibold text-xs transition-all pointer-events-auto ${activeTab === 'admissions' ? 'bg-[#7A0C2E] text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
            >
              Admissions
            </button>
            <button 
              id="btn-nav-events"
              onClick={() => handleTabChange('events')}
              className={`px-4.5 py-2 rounded-full font-sans font-semibold text-xs transition-all pointer-events-auto ${activeTab === 'events' ? 'bg-[#7A0C2E] text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
            >
              School Events
            </button>
            <button 
              id="btn-nav-portal"
              onClick={() => handleTabChange('portal')}
              className={`px-4.5 py-2 rounded-full font-sans font-semibold text-xs transition-all pointer-events-auto ${activeTab === 'portal' ? 'bg-[#7A0C2E] text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
            >
              Student Portal
            </button>
            <button 
              id="btn-nav-crest-ai"
              onClick={() => handleTabChange('crest-ai')}
              className={`px-4.5 py-2 rounded-full font-sans font-semibold text-xs transition-all pointer-events-auto ${activeTab === 'crest-ai' ? 'bg-gradient-to-r from-[#7A0C2E] to-rose-700 text-white shadow-md glow-red ring-1 ring-rose-400/40 animate-pulse' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
            >
              Crest AI Tutor
            </button>
            <button 
              id="btn-nav-admin"
              onClick={() => handleTabChange('admin')}
              className={`px-4.5 py-2 rounded-full font-sans font-semibold text-xs transition-all pointer-events-auto flex items-center gap-1.5 ${activeTab === 'admin' ? 'bg-[#7A0C2E] text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
            >
              <Lock className="w-3 h-3 text-amber-200" /> Registry Portal
            </button>
          </nav>

          {/* Toggle Mobile Menu */}
          <div className="lg:hidden">
            <button 
              id="btn-mobile-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-200 hover:text-white rounded-md focus:outline-none transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div id="mobile-nav-panel" className="lg:hidden bg-[#0A1931] border-b-2 border-[#7A0C2E] text-white transition-all flex flex-col px-4 py-3 gap-1">
          <button 
            onClick={() => handleTabChange('home')}
            className={`w-full text-left py-2.5 px-3 rounded text-sm font-semibold ${activeTab === 'home' ? 'bg-[#7A0C2E]' : 'hover:bg-white/10'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => handleTabChange('academics')}
            className={`w-full text-left py-2.5 px-3 rounded text-sm font-semibold ${activeTab === 'academics' ? 'bg-[#7A0C2E]' : 'hover:bg-white/10'}`}
          >
            Academics
          </button>
          <button 
            onClick={() => handleTabChange('admissions')}
            className={`w-full text-left py-2.5 px-3 rounded text-sm font-semibold relative ${activeTab === 'admissions' ? 'bg-[#7A0C2E]' : 'hover:bg-white/10'}`}
          >
            Admissions
          </button>
          <button 
            onClick={() => handleTabChange('events')}
            className={`w-full text-left py-2.5 px-3 rounded text-sm font-semibold ${activeTab === 'events' ? 'bg-[#7A0C2E]' : 'hover:bg-white/10'}`}
          >
            School Events
          </button>
          <button 
            onClick={() => handleTabChange('portal')}
            className={`w-full text-left py-2.5 px-3 rounded text-sm font-semibold ${activeTab === 'portal' ? 'bg-[#7A0C2E]' : 'hover:bg-white/10'}`}
          >
            Student Portal
          </button>
          <button 
            onClick={() => handleTabChange('crest-ai')}
            className={`w-full text-left py-2.5 px-3 rounded text-sm font-semibold bg-gradient-to-r from-[#7A0C2E] to-rose-700 text-white`}
          >
            Crest AI WAEC Tutor
          </button>
          <button 
            onClick={() => handleTabChange('admin')}
            className={`w-full text-left py-2.5 px-3 rounded text-sm font-semibold flex items-center gap-1.5 ${activeTab === 'admin' ? 'bg-[#7A0C2E]' : 'hover:bg-white/10'}`}
          >
            <Lock className="w-4 h-4" /> Registrar Admin
          </button>
        </div>
      )}

      {/* CENTRAL STAGE CONTAINER */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: OVERVIEW / ABOUT US */}
        {activeTab === 'home' && (
          <div id="tab-content-home" className="animate-fade-in space-y-8">
            
            {/* Quick Access Directories at the Top of Homepage */}
            <div id="homepage-quick-links" className="bg-white rounded-2xl border border-slate-200/80 p-5.5 shadow-sm">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A0C2E] font-black block mb-3.5 px-1 font-sans">
                ⚡ CRITICAL ACADEMIC CHANNELS
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                <button
                  id="quick-link-academics"
                  onClick={() => handleTabChange('academics')}
                  className="p-3.5 bg-slate-50/70 hover:bg-[#7A0C2E]/5 rounded-xl border border-slate-100/80 hover:border-[#7A0C2E]/30 text-left transition-all flex flex-col items-start gap-3.5 active:scale-95 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#7A0C2E]/10 text-[#7A0C2E] flex items-center justify-center flex-shrink-0 group-hover:bg-[#7A0C2E] group-hover:text-white transition-all duration-300">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#0A1931] text-xs leading-snug">Curricula Map</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Syllabus Subjects</p>
                  </div>
                </button>

                <button
                  id="quick-link-admissions"
                  onClick={() => handleTabChange('admissions')}
                  className="p-3.5 bg-slate-50/70 hover:bg-[#7A0C2E]/5 rounded-xl border border-slate-100/80 hover:border-[#7A0C2E]/30 text-left transition-all flex flex-col items-start gap-3.5 active:scale-95 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#7A0C2E]/10 text-[#7A0C2E] flex items-center justify-center flex-shrink-0 group-hover:bg-[#7A0C2E] group-hover:text-white transition-all duration-300">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#0A1931] text-xs leading-snug">Admissions</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Apply Online</p>
                  </div>
                </button>

                <button
                  id="quick-link-events"
                  onClick={() => handleTabChange('events')}
                  className="p-3.5 bg-slate-50/70 hover:bg-[#7A0C2E]/5 rounded-xl border border-slate-100/80 hover:border-[#7A0C2E]/30 text-left transition-all flex flex-col items-start gap-3.5 active:scale-95 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#7A0C2E]/10 text-[#7A0C2E] flex items-center justify-center flex-shrink-0 group-hover:bg-[#7A0C2E] group-hover:text-white transition-all duration-300">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#0A1931] text-xs leading-snug">School Calendar</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Key Events</p>
                  </div>
                </button>

                <button
                  id="quick-link-portal"
                  onClick={() => handleTabChange('portal')}
                  className="p-3.5 bg-slate-50/70 hover:bg-[#7A0C2E]/5 rounded-xl border border-slate-100/80 hover:border-[#7A0C2E]/30 text-left transition-all flex flex-col items-start gap-3.5 active:scale-95 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#7A0C2E]/10 text-[#7A0C2E] flex items-center justify-center flex-shrink-0 group-hover:bg-[#7A0C2E] group-hover:text-white transition-all duration-300">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#0A1931] text-xs leading-snug">Records Portal</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Check Result Slips</p>
                  </div>
                </button>

                <button
                  id="quick-link-crest-ai"
                  onClick={() => handleTabChange('crest-ai')}
                  className="p-3.5 bg-rose-50/50 hover:bg-rose-100/50 rounded-xl border border-rose-100/80 hover:border-[#7A0C2E]/30 text-left transition-all flex flex-col items-start gap-3.5 active:scale-95 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#7A0C2E]/15 text-[#7A0C2E] flex items-center justify-center flex-shrink-0 group-hover:bg-[#7A0C2E] group-hover:text-white transition-all duration-300 glow-red">
                    <Sparkles className="w-4 h-4 text-rose-600 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#7A0C2E] text-xs leading-snug">Crest AI Coach</h4>
                    <p className="text-[10px] text-rose-700/80 mt-0.5 font-semibold">Tutor & CBA quiz</p>
                  </div>
                </button>

                <button
                  id="quick-link-admin"
                  onClick={() => handleTabChange('admin')}
                  className="p-3.5 bg-slate-50/70 hover:bg-[#7A0C2E]/5 rounded-xl border border-slate-100/80 hover:border-[#7A0C2E]/30 text-left transition-all flex flex-col items-start gap-3.5 active:scale-95 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-200 text-[#0A1931] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0A1931] group-hover:text-white transition-all duration-300">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#0A1931] text-xs leading-snug">Registrar Desk</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Staff Console</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Elegant Campus Banner */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#0A1931] via-[#0E223F] to-[#450C22] text-white p-6 sm:p-10.5 shadow-xl border border-white/5 flex flex-col lg:flex-row gap-8 items-center">
              <div className="relative z-10 flex-1 space-y-4">
                <span className="bg-[#7A0C2E]/90 text-amber-200 text-[9px] uppercase font-bold tracking-[0.2em] px-3.5 py-1 rounded-full border border-rose-500/20 shadow-sm inline-block">
                  🏰 Wolcrest Prestige Academy
                </span>
                <h2 className="text-3xl sm:text-4.5xl font-black font-serif tracking-tight leading-[1.12] text-white">
                  Unlocking Human Genius, <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-white">Securing Great Destinies.</span>
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
                  Welcome to <strong className="text-white">Wolcrest Schools</strong>, where rigorous high-character scholarship meets digital innovation. We integrate disciplined national curriculum mastery with Socratic artificial intelligence coaching to guarantee excellent results.
                </p>
                
                <div className="pt-2.5 flex flex-wrap gap-3">
                  <button 
                    onClick={() => handleTabChange('admissions')}
                    className="bg-gradient-to-r from-[#7A0C2E] to-rose-700 hover:opacity-95 text-white text-xs font-bold px-5.5 py-3 rounded-xl flex items-center gap-2 transform active:scale-95 transition-all shadow-lg shadow-rose-950/40 border border-rose-400/20"
                  >
                    Admissions Open 2026/2027 <ChevronRight className="w-4 h-4 text-amber-200" />
                  </button>
                  <button 
                    onClick={() => setReadMoreOpen(true)}
                    className="bg-white/10 hover:bg-white/15 text-white text-xs font-bold px-5 py-3 rounded-xl border border-white/10 transition-all active:scale-95"
                  >
                    Read Our History
                  </button>
                </div>
              </div>

              {/* Advanced Real-time metrics dashboard right inside hero banner */}
              <div className="relative z-10 w-full lg:max-w-xs bg-black/35 backdrop-blur-md rounded-2xl border border-white/10 p-5 space-y-4 shadow-2xl shrink-0">
                <div className="border-b border-white/10 pb-2.5">
                  <h4 className="text-xs font-black font-cinzel text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-300" /> SCHOLASTIC INSIGHTS
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">West African Syllabus Standard Integration</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[10.5px] text-slate-300">Tutor AI Engine</span>
                    <span className="font-mono text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> 3.5-FLASH
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[10.5px] text-slate-300">CBT Exam Mode</span>
                    <span className="font-mono text-amber-200 text-xs font-bold">30 Qs / 15 MINS</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[10.5px] text-slate-300">Grade Mapping Rules</span>
                    <span className="text-[10px] bg-[#7A0C2E]/30 text-pink-200 font-extrabold px-2 py-0.5 rounded font-mono uppercase">WAEC A1-F9</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] text-slate-300">Admin Lock Status</span>
                    <span className="text-[11px] text-slate-200 font-mono font-bold flex items-center gap-1">
                      🔒 DECOUPLED
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Decorative grid pattern absolute background */}
              <div className="absolute inset-0 opacity-15 bg-grid-pattern z-0 pointer-events-none" />
            </div>

            {/* Mission, Vision, and Motto Core Panel */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Mission Statement Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#7A0C2E]/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
                <div className="w-10 h-10 rounded-xl bg-[#7A0C2E]/10 flex items-center justify-center text-[#7A0C2E] mb-4.5">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-[#0A1931] font-serif mb-2">Our Mission</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">
                  {SCHOOL_MANIFESTO.mission}
                </p>
                <div className="absolute -bottom-4 -right-1.5 text-slate-100 font-serif font-black text-8xl select-none pointer-events-none opacity-[0.25]">M</div>
              </div>

              {/* Vision Statement Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#0A1931]/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
                <div className="w-10 h-10 rounded-xl bg-[#0A1931]/10 flex items-center justify-center text-[#0A1931] mb-4.5">
                  <Bookmark className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-[#0A1931] font-serif mb-2">Our Vision</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">
                  {SCHOOL_MANIFESTO.vision}
                </p>
                <div className="absolute -bottom-4 -right-1.5 text-slate-100 font-serif font-black text-8xl select-none pointer-events-none opacity-[0.25]">V</div>
              </div>

            </div>

            {/* School Motto Callout */}
            <div className="bg-[#0A1931] border border-white/5 p-7 sm:p-9.5 rounded-2xl shadow-xl text-center max-w-3xl mx-auto space-y-2.5 relative overflow-hidden">
              <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-rose-900/10 blur-xl pointer-events-none" />
              <span className="text-amber-200 text-[9px] uppercase tracking-[0.25em] font-extrabold block">Our Standing Pledge & Insignia</span>
              <p className="text-2.5xl sm:text-3.5xl font-serif font-bold italic tracking-tight text-white leading-tight">
                "Wolcrest, where the future is assured"
              </p>
              <div className="absolute inset-0 border border-[#7A0C2E]/15 rounded-2xl pointer-events-none m-1.5" />
            </div>

            {/* About Us expanded Read More block */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6.5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#0A1931] font-serif">Comprehensive School Charter</h3>
                  <span className="text-xs text-slate-400 block mt-1.5">Pioneering standard regional pedagogy integrated with interactive educational tools.</span>
                </div>
                <button
                  id="btn-read-more-toggle"
                  onClick={() => setReadMoreOpen(!readMoreOpen)}
                  className="bg-gradient-to-r from-[#7A0C2E] to-rose-700 hover:opacity-95 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl transition-all self-start md:self-auto active:scale-95 shadow-sm uppercase tracking-wider"
                >
                  {readMoreOpen ? "Collapse Charter" : "Read Full Charter"}
                </button>
              </div>

              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${readMoreOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-6.5 pt-4.5 border-t border-slate-100 text-slate-650 text-sm leading-relaxed font-sans">
                  <p className="leading-relaxed">{SCHOOL_MANIFESTO.aboutUsDescription}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 pt-1.5">
                    {SCHOOL_MANIFESTO.coreValues.map((val, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl transition-all hover:border-[#7A0C2E]/20">
                        <h4 className="font-extrabold text-[#0A1931] flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#7A0C2E]" /> {val.title}</h4>
                        <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">{val.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-5.5 bg-rose-50/50 border border-rose-100/60 rounded-xl space-y-3">
                    <h4 className="font-extrabold text-[#7A0C2E] flex items-center gap-2"><Clock className="w-4 h-4 text-[#7A0C2E]" /> Academic Term Tracker</h4>
                    <span className="block text-xs text-slate-700 font-extrabold font-mono uppercase bg-[#7A0C2E]/10 py-1 px-2.5 rounded w-fit">{SCHOOL_MANIFESTO.academicCalendar.term}</span>
                    <ul className="mt-3.5 space-y-2.5 text-xs text-slate-600 font-medium">
                      {SCHOOL_MANIFESTO.academicCalendar.events.map((ev, idx) => (
                        <li key={idx} className="flex justify-between border-b border-rose-100/40 pb-2">
                          <span>{ev.title}</span>
                          <strong className="text-[#0A1931] font-mono">{ev.date}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {!readMoreOpen && (
                <p className="text-slate-400 text-xs italic mt-3 text-center block">
                  Click 'Read Full Charter' to explore school history, core cultural pillars, and dynamic term event scheduling.
                </p>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: COMPREHENSIVE ACADEMICS SUBJECTS EXPLORER */}
        {activeTab === 'academics' && (
          <div id="tab-content-academics" className="animate-fade-in space-y-6">
            <div className="border-b border-slate-200/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3.5xl font-serif font-black text-[#0A1931]">Academy Curricula and Offered Subjects</h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">Browse our entire scope of offered subjects spanning Kindergarten up to Senior SS3 departments.</p>
              </div>
              
              <span className="bg-rose-50 text-[#7A0C2E] text-[10px] font-bold border border-rose-200 px-3.5 py-1.5 rounded-full shadow-sm font-sans uppercase tracking-wider self-start sm:self-center">
                🏫 WAEC SSCE / BECE Syllabus Aligned
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              {/* Left Column: Interactive Class Level Navigation Sidebar (Desktop only, fallback dropdown on mobile) */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white border border-slate-200/80 p-4.5 rounded-2xl shadow-sm">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">Academic Levels</h3>
                  
                  {/* Desktop navigation list */}
                  <div className="hidden lg:flex flex-col gap-1.5 max-h-[480px] overflow-y-auto scrollbar-thin pr-1">
                    {Object.keys(OFF_CLASSES_DATA).map((cl) => {
                      const isActive = academicClass === cl;
                      return (
                        <button
                          key={cl}
                          onClick={() => {
                            setAcademicClass(cl);
                          }}
                          className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-ellipsis overflow-hidden ${isActive ? 'bg-[#0A1931] text-white shadow-md' : 'bg-slate-50/70 hover:bg-[#7A0C2E]/5 hover:text-[#7A0C2E] text-slate-600 border border-slate-100/50'}`}
                        >
                          {OFF_CLASSES_DATA[cl].name}
                        </button>
                      );
                    })}
                  </div>

                  {/* Mobile Select Fallback */}
                  <div className="lg:hidden">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Select Class Level</label>
                    <div className="relative">
                      <select
                        value={academicClass}
                        onChange={(e) => {
                          setAcademicClass(e.target.value);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-1 focus:ring-[#7A0C2E] focus:outline-none appearance-none font-bold pr-8 text-xs"
                      >
                        {Object.keys(OFF_CLASSES_DATA).map((cl) => (
                          <option key={cl} value={cl}>{OFF_CLASSES_DATA[cl].name}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                </div>

                {/* Nice helper block */}
                <div className="bg-[#0A1931]/5 border border-[#0A1931]/10 rounded-2xl p-4 text-xs text-slate-500 leading-relaxed">
                  <span className="font-extrabold text-[#0A1931] uppercase block mb-1">💡 CO-OP TUTOR LINK</span>
                  Hover on any offered subject card and click the <strong className="text-[#7A0C2E]">Launch Crest AI</strong> action button to trigger study topics on Gemini immediately.
                </div>
              </div>

              {/* Right Column: Dynamic Curricula Board */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Department selectors as luxury buttons instead of standard drop */}
                {OFF_CLASSES_DATA[academicClass]?.isSenior && (
                  <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm space-y-3 animate-slide-up bg-grid-pattern">
                    <span className="block text-[10px] font-extrabold text-[#7A0C2E] tracking-widest uppercase">Department Filter (Senior High SSS)</span>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {['Sciences (STEM)', 'Arts & Humanities', 'Commercial & Social Sciences'].map((dept) => {
                        const isActive = academicDept === dept;
                        return (
                          <button
                            key={dept}
                            onClick={() => setAcademicDept(dept)}
                            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-center ${isActive ? 'bg-[#7A0C2E] text-white shadow-md glow-red' : 'bg-slate-50 text-slate-600 hover:bg-slate-100/70 border border-slate-100'}`}
                          >
                            {dept}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Subjects Grid Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <h3 className="text-lg font-bold font-serif text-[#0A1931]">
                    Offered Curricula for {OFF_CLASSES_DATA[academicClass]?.name}
                    {OFF_CLASSES_DATA[academicClass]?.isSenior && ` - ${academicDept}`}
                  </h3>
                  <span className="bg-[#0A1931]/10 text-[#0A1931] font-mono text-[9px] uppercase font-bold px-3 py-1 rounded-full border border-[#0A1931]/10 w-fit">
                    {OFF_CLASSES_DATA[academicClass]?.isSenior ? 'Specialized Elective Path' : 'Core Basic Studies'}
                  </span>
                </div>

                {/* Subjets Cards list */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
                  {(() => {
                    const details = OFF_CLASSES_DATA[academicClass];
                    if (!details) return null;

                    let subjectArray: SubjectOffer[] = [];
                    if (details.isSenior && details.departments) {
                      subjectArray = details.departments[academicDept] || [];
                    } else {
                      subjectArray = details.subjects || [];
                    }

                    if (subjectArray.length === 0) {
                      return (
                        <div className="col-span-full py-12 text-center text-slate-400 italic bg-white border border-slate-180 rounded-2xl shadow-inner">
                          No specialized subject maps compiled for this selection path.
                        </div>
                      );
                    }

                    return subjectArray.map((sub, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white border border-slate-200/90 hover:border-[#7A0C2E]/40 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                      >
                        <div className="space-y-3.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="bg-[#7A0C2E]/10 text-[#7A0C2E] text-[10px] font-mono tracking-widest font-extrabold px-3 py-1 rounded-full uppercase border border-[#7A0C2E]/15">
                              {sub.code}
                            </span>
                          </div>
                          <h4 className="font-extrabold font-serif text-[#0A1931] text-base group-hover:text-[#7A0C2E] transition-colors">{sub.name}</h4>
                          <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{sub.description}</p>
                        </div>
                        
                        <button 
                          onClick={() => {
                            setChatSubject(sub.name);
                            handleTabChange('crest-ai');
                            triggerConceptPrompt(`Hello Crest AI! Teach me the core syllabus topics or equations for ${sub.name}`);
                          }}
                          className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-bold text-[#7A0C2E] hover:text-[#5C0821] w-full text-center transition-all group-hover:translate-x-0.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> Launch Crest AI Tutoring
                        </button>
                      </div>
                    ));
                  })()}
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 3: ADMISSIONS WITH LEARN MORE & APPLY */}
        {activeTab === 'admissions' && (
          <div id="tab-content-admissions" className="animate-fade-in space-y-6">
            
            {admissionSubMode === 'main' && (
              <div className="space-y-10 animate-fade-in">
                {/* admissions hero */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1931] to-[#12284C] text-white p-8 sm:p-12 shadow-xl border border-slate-800 bg-grid-pattern">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#7A0C2E]/10 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="relative max-w-2xl mx-auto text-center space-y-6">
                    <span className="inline-block bg-[#7A0C2E]/20 text-rose-300 text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full border border-[#7A0C2E]/30">
                      Admission Cohort 2026 / 2027
                    </span>
                    
                    <h2 className="text-3xl sm:text-4.5xl font-serif font-black tracking-tight leading-tight">
                      Begin Your Scholar's <span className="text-rose-400">Journey</span>
                    </h2>
                    
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
                      Wolcrest Schools is welcoming registrations for the upcoming academic session. Join a network of outstanding achievers backed by standard school systems and smart AI coaching metrics.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
                      <button 
                        id="btn-admissions-learn-more"
                        onClick={handleAdmissionsLearnMore}
                        className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#0A1931] text-xs font-black uppercase tracking-wider shadow-md transform active:scale-95 transition-all text-center"
                      >
                        📖 Read Prospectus Handbook
                      </button>
                      <button 
                        id="btn-admissions-apply"
                        onClick={handleAdmissionsApply}
                        className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#7A0C2E] hover:bg-[#911239] hover:shadow-[#7A0C2E]/25 text-white text-xs font-black uppercase tracking-wider shadow-md transform active:scale-95 transition-all text-center glow-red"
                      >
                        ✍️ Apply Online Form
                      </button>
                    </div>
                  </div>
                </div>

                {/* Admission Steps */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#7A0C2E] text-center">Dynamic Enrollment Pathway</h4>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-[#7A0C2E]/30 transition-all">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#7A0C2E]"></div>
                      <span className="font-mono text-[#7A0C2E] font-black text-3xl mb-3 block">01</span>
                      <h4 className="font-extrabold text-[#0A1931] text-base mb-1.5">Apply Online</h4>
                      <p className="text-slate-500 text-xs leading-relaxed">Complete our smart enrollment application with previous school grades and guardian configurations in under 5 minutes.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-[#7A0C2E]/30 transition-all">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0A1931]"></div>
                      <span className="font-mono text-[#0A1931] font-black text-3xl mb-3 block">02</span>
                      <h4 className="font-extrabold text-[#0A1931] text-base mb-1.5">Aptitude Diagnostics</h4>
                      <p className="text-slate-500 text-xs leading-relaxed">Candidates undergo a robust cognitive diagnostic review. High achieving students get automatic conditional placement.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-[#7A0C2E]/30 transition-all">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#7A0C2E]"></div>
                      <span className="font-mono text-[#7A0C2E] font-black text-3xl mb-3 block">03</span>
                      <h4 className="font-extrabold text-[#0A1931] text-base mb-1.5">Launch Integration</h4>
                      <p className="text-slate-500 text-xs leading-relaxed">Confirmed scholars receive their academic ID and initial user state pre-loaded to prepare on Crest AI.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ADMISSIONS MODE: LEARN MORE (Shows About Us + EVERY Offered Subject) */}
            {admissionSubMode === 'learn-more' && (
              <div className="animate-slide-up space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
                  <div>
                    <button 
                      onClick={() => setAdmissionSubMode('main')}
                      className="text-xs font-bold text-slate-400 hover:text-[#7A0C2E] mb-1 block flex items-center gap-1.5"
                    >
                      ← Back to Admissions
                    </button>
                    <h2 className="text-2xl font-serif font-black text-[#0A1931]">Wolcrest Scholastic Prospectus</h2>
                  </div>
                  <button 
                    onClick={handleAdmissionsApply}
                    className="bg-[#7A0C2E] hover:bg-[#5C0821] text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl shadow-md glow-red transition-all self-start sm:self-center"
                  >
                    Go To Application Form
                  </button>
                </div>

                {/* Section A: About us in depth */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 bg-grid-pattern relative">
                  <span className="absolute top-4 right-4 text-[9px] font-mono text-slate-300 font-bold uppercase tracking-widest hidden sm:inline-block">Document Code: WHS-2026</span>
                  <h3 className="text-xl font-serif font-black text-[#0A1931] border-b border-slate-100 pb-3 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-[#7A0C2E] rounded-full inline-block"></span>
                    Institutional Manifesto & History
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl font-sans">{SCHOOL_MANIFESTO.aboutUsDescription}</p>
                  
                  <div className="grid sm:grid-cols-3 gap-5 pt-3">
                    <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 text-center space-y-2">
                      <h4 className="font-extrabold text-[#7A0C2E] text-xs tracking-wider uppercase">Our Mission Plan</h4>
                      <p className="text-slate-500 text-xs leading-relaxed">{SCHOOL_MANIFESTO.mission}</p>
                    </div>
                    <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 text-center space-y-2">
                      <h4 className="font-extrabold text-[#0A1931] text-xs tracking-wider uppercase">Our Vision System</h4>
                      <p className="text-slate-500 text-xs leading-relaxed">{SCHOOL_MANIFESTO.vision}</p>
                    </div>
                    <div className="bg-rose-50/60 p-5 rounded-2xl border border-rose-100/60 text-center flex flex-col justify-center items-center space-y-1">
                      <span className="font-mono text-[#7A0C2E] text-[10px] font-black tracking-wider uppercase">School Creed</span>
                      <p className="text-[#0A1931] text-base font-serif font-bold italic leading-tight">"{SCHOOL_MANIFESTO.motto}"</p>
                    </div>
                  </div>
                </div>

                {/* Section B: Subjects of every class lookup */}
                <div className="space-y-6 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-inner">
                  <div className="text-center max-w-xl mx-auto space-y-1.5">
                    <h3 className="text-lg font-black font-serif text-[#0A1931]">Comprehensive Curricula Registry</h3>
                    <p className="text-slate-500 text-xs text-balance">Review specific academic subjects of study and terminal exam alignment for every class level in our system.</p>
                  </div>

                  <div className="space-y-6 pt-2">
                    {Object.keys(OFF_CLASSES_DATA).map((clKey) => {
                      const details = OFF_CLASSES_DATA[clKey];
                      return (
                        <div key={clKey} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
                          <h4 className="font-extrabold font-serif text-[#0A1931] text-base border-b border-slate-100 pb-2.5 flex items-center justify-between">
                            <span>{details.name} Curriculum</span>
                            <span className="text-[10px] text-slate-400 font-bold bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
                              {details.isSenior ? 'Specialized Departments Available' : `${details.subjects?.length || 0} Core Subjects`}
                            </span>
                          </h4>

                          {details.isSenior && details.departments ? (
                            <div className="grid md:grid-cols-3 gap-4 mt-4">
                              {Object.keys(details.departments).map((deptKey) => (
                                <div key={deptKey} className="bg-[#0A1931]/5 p-4 rounded-xl border border-[#0A1931]/10 space-y-3">
                                  <h5 className="font-black text-[10px] uppercase text-[#7A0C2E] tracking-widest border-b border-[#7A0C2E]/10 pb-1.5">{deptKey} Department</h5>
                                  <ul className="space-y-3">
                                    {details.departments?.[deptKey].map((s, idx) => (
                                      <li key={idx} className="text-xs group">
                                        <div className="font-extrabold text-slate-800 flex items-center justify-between">
                                          <span>{s.name}</span> 
                                          <span className="text-[9px] text-[#7A0C2E] font-mono select-none bg-rose-50 px-1.5 py-0.5 rounded font-bold">({s.code})</span>
                                        </div>
                                        <p className="text-slate-500 text-[10px] leading-relaxed mt-0.5">{s.description}</p>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
                              {details.subjects?.map((s, idx) => (
                                <div key={idx} className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-100/80 hover:bg-slate-50 transition-colors">
                                  <div className="font-bold text-slate-800 text-xs flex items-center justify-between">
                                    <span>{s.name}</span>
                                    <span className="text-[9px] font-mono text-[#7A0C2E] font-bold bg-rose-50 px-1.5 py-0.5 rounded uppercase">{s.code}</span>
                                  </div>
                                  <p className="text-slate-500 text-[10px] leading-relaxed mt-1">{s.description}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* ADMISSIONS MODE: APPLICATION FORM */}
            {admissionSubMode === 'apply' && (
              <div className="animate-slide-up max-w-3xl mx-auto space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-2">
                  <div>
                    <button 
                      onClick={() => setAdmissionSubMode('main')}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600 mb-0.5 block flex items-center gap-1"
                    >
                      ← Back to Admissions
                    </button>
                    <h2 className="text-2xl font-serif font-black text-[#0A1931]">Enrollment Intake Application</h2>
                  </div>
                </div>

                {!appliedStatus ? (
                  <form onSubmit={handleAdmissionsSubmit} className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
                    
                    <div className="text-[#0A1931] font-medium text-xs bg-slate-50 p-3.5 rounded-xl border-l-4 border-[#7A0C2E] leading-relaxed flex items-start gap-2">
                      <span className="text-rose-600 mt-0.5">ℹ️</span>
                      <span>Kindly supply accurate information. Wolcrest Schools utilizes previous academic history parameters to customize the initial learning profile on Crest AI.</span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Scholar's Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Amina Yusuf Adebayo"
                          value={applName}
                          onChange={(e) => setApplName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs focus:ring-1 focus:ring-[#7A0C2E] focus:outline-none focus:bg-white text-slate-800 font-medium"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Parent or Guardian Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Chief Dr. Adebayo"
                          value={parentName}
                          onChange={(e) => setParentName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs focus:ring-1 focus:ring-[#7A0C2E] focus:outline-none focus:bg-white text-slate-800 font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Parent Contact Email</label>
                        <input
                          type="email"
                          required
                          placeholder="guardian@mail.com"
                          value={parentEmail}
                          onChange={(e) => setParentEmail(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs focus:ring-1 focus:ring-[#7A0C2E] focus:outline-none focus:bg-white text-slate-800 font-medium"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Parent Contact Telephone</label>
                        <input
                          type="tel"
                          required
                          placeholder="+234..."
                          value={parentPhone}
                          onChange={(e) => setParentPhone(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs focus:ring-1 focus:ring-[#7A0C2E] focus:outline-none focus:bg-white text-slate-800 font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Proposed Class Level</label>
                        <div className="relative">
                          <select
                            value={applClass}
                            onChange={(e) => setApplClass(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs focus:ring-1 focus:ring-[#7A0C2E] focus:outline-none appearance-none pr-8 text-slate-800 font-medium"
                          >
                            <option value="Kindergarten">Kindergarten</option>
                            <option value="Primary 1">Primary 1</option>
                            <option value="Primary 3">Primary 3</option>
                            <option value="Primary 6">Primary 6</option>
                            <option value="JSS 1">Junior Secondary 1</option>
                            <option value="JSS 3">Junior Secondary 3</option>
                            <option value="SSS 1">Senior Secondary 1 (SS1)</option>
                            <option value="SSS 2">Senior Secondary 2 (SS2)</option>
                            <option value="SSS 3">Senior Secondary 3 (SS3)</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                        </div>
                      </div>

                      {applClass.includes('SSS') ? (
                        <div>
                          <label className="block text-xs font-bold text-[#7A0C2E] mb-1.5 uppercase">Requested Department (SS Class)</label>
                          <div className="relative">
                            <select
                              value={applDept}
                              onChange={(e) => setApplDept(e.target.value)}
                              className="w-full bg-rose-50 border border-rose-100 text-[#7A0C2E] font-bold rounded-xl p-3 text-xs focus:ring-1 focus:ring-[#7A0C2E] focus:outline-none appearance-none pr-8"
                            >
                              <option value="Sciences (STEM)">Sciences (STEM)</option>
                              <option value="Arts & Humanities">Arts & Humanities</option>
                              <option value="Commercial & Social Sciences">Commercial & Social Sciences</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#7A0C2E] absolute right-3 top-3.5 pointer-events-none" />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Previous School Attended</label>
                          <input
                            type="text"
                            placeholder="e.g. Lagos Primary Academy"
                            value={prevSchool}
                            onChange={(e) => setPrevSchool(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs focus:ring-1 focus:ring-[#7A0C2E] focus:outline-none focus:bg-white text-slate-800 font-medium"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Prior Class Average Score (%)</label>
                        <input
                          type="number"
                          max="100"
                          min="0"
                          value={lastAvg}
                          onChange={(e) => setLastAvg(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs focus:ring-1 focus:ring-[#7A0C2E] focus:outline-none focus:bg-white text-slate-800 font-semibold"
                        />
                      </div>
                      <div className="flex items-center text-slate-400 text-[10.5px] leading-relaxed">
                        ⚠️ Average scores of 85% and above receive instant <strong>Conditional Admission</strong> status pending physical certificate verification audited by our Registrar.
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3.5 bg-[#7A0C2E] hover:bg-[#5C0821] text-white text-xs tracking-wider uppercase font-black rounded-xl shadow-md glow-red hover:shadow-[#7A0C2E]/30 transition-all pt-3 pb-3"
                    >
                      Submit Electronic Application Form
                    </button>

                  </form>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-6 shadow-xl animate-scale-up relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-3xl border border-emerald-100">
                      ✓
                    </div>
                    
                    <div>
                      <span className="text-[10px] uppercase bg-emerald-100 text-emerald-800 font-extrabold px-3.5 py-1.5 rounded-full tracking-wider">
                        {appliedStatus.status}
                      </span>
                      <h3 className="text-2xl font-serif font-black text-[#0A1931] mt-3">Enrollment Application Catalogued</h3>
                      <p className="text-slate-400 text-xs mt-1.5">Your official digital receipt has been generated with unique Reference Number:</p>
                      <span className="inline-block mt-2 bg-slate-50 border border-slate-100 rounded-lg px-4 py-1.5 font-mono text-[#7A0C2E] font-bold text-sm select-all">
                        {appliedStatus.refNumber}
                      </span>
                    </div>

                    <div className="bg-slate-50/80 p-5 rounded-2xl text-left space-y-2.5 border border-slate-200/80 text-xs text-slate-600 max-w-md mx-auto relative bg-grid-pattern">
                      <div className="border-b border-slate-100 pb-2 flex justify-between">
                        <strong>REGISTRATION METRICS</strong>
                        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">SYS STATED</span>
                      </div>
                      <div className="flex justify-between"><span>Scholar:</span> <strong className="text-slate-800">{appliedStatus.applicantName}</strong></div>
                      <div className="flex justify-between"><span>Guardian:</span> <strong className="text-slate-800">{appliedStatus.parentName}</strong></div>
                      <div className="flex justify-between"><span>Contact Phone:</span> <strong className="text-slate-800">{appliedStatus.parentPhone}</strong></div>
                      <div className="flex justify-between"><span>Class Target:</span> <strong className="text-slate-800">{appliedStatus.proposedClass} {appliedStatus.department ? ` - ${appliedStatus.department}` : ''}</strong></div>
                      <div className="border-t border-slate-100 pt-2 text-[10.5px] leading-relaxed text-slate-500 italic">
                        <strong>Decision logic:</strong> {appliedStatus.status === 'Conditionally Approved' ? 'Automatic conditional pass granted due to high prior grades (≥ 80%). Bring physical files to the Registrar to initiate ID printing.' : 'Awaiting physical cognitive diagnostic review.'}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <p className="text-[11px] text-[#7A0C2E] font-bold tracking-wider">"{SCHOOL_MANIFESTO.motto}"</p>
                      <button 
                        onClick={() => {
                          setAdmissionSubMode('main');
                          setAppliedStatus(null);
                        }}
                        className="bg-[#0A1931] hover:bg-[#12284C] text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all inline-block"
                      >
                        Enroll Another Candidate
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* TAB 4: STUDENT PORTAL (Fetch Results) */}
        {activeTab === 'portal' && (
          <div id="tab-content-portal" className="animate-fade-in space-y-6">
            <div className="border-b border-slate-200/80 pb-4">
              <h2 className="text-2xl sm:text-3.5xl font-serif font-black text-[#0A1931]">High Academic Standard Student Portal</h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">Authenticate credentials and print verified digital score reports safely via the Wolcrest Secure Registry DB.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Fetch Column */}
              <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/90 h-fit space-y-5 shadow-sm">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold font-serif text-[#0A1931] text-base flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#7A0C2E]" /> 
                    Student Verification
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">Provide official name and pre-assigned identity token to view grades.</span>
                </div>

                <form onSubmit={handleFetchResult} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Scholar's Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amina Bello"
                      value={studentSearchName}
                      onChange={(e) => setStudentSearchName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-[#7A0C2E] focus:outline-none focus:bg-white text-slate-800 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Access ID Tag</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. WOL/2026/SCI/AMB-3942"
                      value={studentSearchId}
                      onChange={(e) => setStudentSearchId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono focus:ring-1 focus:ring-[#7A0C2E] focus:outline-none focus:bg-white text-slate-800 font-bold"
                    />
                  </div>

                  {portalError && (
                    <div className="bg-rose-50 border border-rose-100 text-[#7A0C2E] text-xs p-3 rounded-xl leading-relaxed font-semibold">
                      ⚠️ {portalError}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isFetchingResult}
                    className="w-full bg-[#7A0C2E] hover:bg-[#5C0821] text-white py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider disabled:opacity-50 shadow-md glow-red hover:shadow-[#7A0C2E]/25 transition-all flex items-center justify-center gap-2 pt-3 pb-3"
                  >
                    {isFetchingResult ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-300" /> Locating Vault Records...
                      </>
                    ) : (
                      '🔐 Pull Certified Transcript'
                    )}
                  </button>
                </form>

                {/* Info Tip */}
                <div className="bg-[#0A1931]/5 border border-[#0A1931]/10 rounded-2xl p-4.5 text-xs text-slate-500 space-y-2.5 leading-relaxed bg-grid-pattern">
                  <strong className="text-[#0A1931] font-black uppercase text-[10px] tracking-wider block">🛡️ Live Sandbox Demonstration:</strong>
                  <p className="scale-95 origin-top-left">To test dynamic transcript query matching:</p>
                  <ol className="list-decimal pl-4.5 space-y-1.5 text-slate-600 font-medium scale-95 origin-top-left">
                    <li>Go to the <strong className="text-[#7A0C2E]">Registry Area</strong> in the main header tabs.</li>
                    <li>Provision a new student record choosing their class and department.</li>
                    <li>Update grade scores (CA + terminal SSCE scores) for added subjects.</li>
                    <li>Come back here, input their catalog name and unique ID to view their luxury certificate instantly!</li>
                  </ol>
                </div>

              </div>

              {/* Result display transcript panel */}
              <div className="lg:col-span-2 space-y-4">
                {foundStudent ? (
                  <div className="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-md animate-scale-up border-t-8 border-t-[#0A1931] relative">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#7A0C2E]/5 rounded-full blur-3xl pointer-events-none"></div>
                    
                    {/* Transcript Header Seal strip */}
                    <div className="bg-slate-50/80 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150">
                      <div className="space-y-1">
                        <span className="text-[9px] tracking-widest font-black text-[#7A0C2E] bg-[#7A0C2E]/10 px-2.5 py-1 rounded-full uppercase inline-block border border-[#7A0C2E]/10">
                          Official Certified Grade Record
                        </span>
                        <h4 className="text-xl sm:text-2xl font-serif font-black text-[#0A1931]">{foundStudent.name}</h4>
                        <span className="block text-xs text-slate-400 font-mono font-semibold tracking-wider">{foundStudent.id}</span>
                      </div>
                      <div className="sm:text-right space-y-1.5 self-start sm:self-center">
                        <span className="bg-[#0A1931] text-white font-extrabold text-[9px] px-3 py-1.5 rounded-full uppercase tracking-wider">
                          {foundStudent.className}
                        </span>
                        <div className="text-xs text-slate-500 font-bold">GPA METRIC: <strong className="text-[#7A0C2E] text-base font-mono">{calculateGPA(foundStudent.results)} / 5.00</strong></div>
                      </div>
                    </div>

                    {/* Report Content */}
                    <div className="p-6 space-y-6">
                      
                      {/* Sub details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-slate-100 text-xs text-slate-600">
                        <div>
                          <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">Academic Dept</span>
                          <strong className="text-[#0A1931] font-semibold">{foundStudent.department || 'Basic Core Division'}</strong>
                        </div>
                        <div>
                          <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">Session Term</span>
                          <strong className="text-[#0A1931] font-semibold">2026/2027 Term 3</strong>
                        </div>
                        <div>
                          <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">Syllabus Format</span>
                          <strong className="text-[#0A1931] font-semibold">WAEC / National</strong>
                        </div>
                        <div>
                          <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">Audit Verification</span>
                          <span className="text-emerald-600 font-black flex items-center gap-1">🟢 SECURE PASS</span>
                        </div>
                      </div>

                      {/* Scoreboard table */}
                      <div className="space-y-3">
                        <span className="block font-black text-xs text-[#0A1931] uppercase tracking-wider">Subjects Grades Summary Ledger</span>
                        <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                          <table className="w-full text-left text-xs text-slate-700">
                            <thead className="bg-[#0A1931]/5 text-[#0A1931] font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
                              <tr>
                                <th className="p-3">Course / Subject Description</th>
                                <th className="p-3 text-center">CA (40)</th>
                                <th className="p-3 text-center">Exam (60)</th>
                                <th className="p-3 text-center">Total (100)</th>
                                <th className="p-3 text-center">Grade</th>
                                <th className="p-3 text-center">Status Remark</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {Object.keys(foundStudent.results).map((subjName) => {
                                const marks = foundStudent.results[subjName];
                                const total = marks.ca + marks.exam;
                                const gradeInfo = calculateGrade(total);

                                return (
                                  <tr key={subjName} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-3 font-extrabold text-[#0A1931]">{subjName}</td>
                                    <td className="p-3 text-center font-mono font-bold text-slate-600">{marks.ca}</td>
                                    <td className="p-3 text-center font-mono font-bold text-slate-600">{marks.exam}</td>
                                    <td className="p-3 text-center font-extrabold text-[#0A1931] font-mono">{total}</td>
                                    <td className="p-3 text-center">
                                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black border uppercase tracking-wider ${gradeInfo.isPass ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                                        {gradeInfo.grade}
                                      </span>
                                    </td>
                                    <td className="p-3 text-center text-slate-500 font-medium italic text-[11px]">{gradeInfo.remark}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Head remarks & seals */}
                      <div className="grid md:grid-cols-2 gap-5 bg-rose-50/50 p-5 rounded-2xl border border-rose-100/50">
                        <div className="space-y-1.5">
                          <span className="block text-[10px] uppercase font-black text-[#7A0C2E] tracking-wider">Registrar General Statement</span>
                          <p className="text-slate-600 italic text-xs leading-relaxed font-serif">
                            "{foundStudent.remarks || 'The candidate has completed all required testing cycles representing balanced aptitude across all examined modules of study.'}"
                          </p>
                        </div>
                        <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-[#7A0C2E]/15 pt-3 md:pt-0 md:pl-5 flex flex-col justify-between">
                          <div>
                            <span className="block text-[10px] uppercase font-black text-[#0A1931] tracking-wider">Crest AI Blessing Directive</span>
                            <span className="text-xs text-[#0A1931] font-serif leading-relaxed block italic mt-1 font-bold">
                              "{foundStudent.motto || 'A scholar of high prestige.'}"
                            </span>
                          </div>
                          
                          <div className="text-[10px] text-slate-400 italic pt-2.5 border-t border-slate-100 flex justify-between">
                            <span>Motto reference: {SCHOOL_MANIFESTO.motto}</span>
                            <span>OFFICIAL SEAL</span>
                          </div>
                        </div>
                      </div>

                      {/* Print utility option */}
                      <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                        <button 
                          onClick={() => window.print()}
                          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-[#0A1931] hover:text-white text-[#0A1931] font-bold text-xs transition-colors shadow-sm"
                        >
                          <Printer className="w-3.5 h-3.5" /> Print Scholar Transcript
                        </button>
                      </div>

                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-180 rounded-2xl p-12 text-center space-y-4 shadow-sm flex flex-col items-center justify-center min-h-[440px]">
                    <div className="w-14 h-14 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center text-xl shadow-inner border border-slate-100">
                      📋
                    </div>
                    <div className="space-y-1 px-4">
                      <h4 className="text-lg font-serif font-black text-slate-800">No Transcript Loaded</h4>
                      <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">Please authenticate student profiles in the left sidebar by supplying verified database name and assigned index code.</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: CREST AI WAEC TUTOR */}
        {activeTab === 'crest-ai' && (
          <div id="tab-content-crest-ai" className="animate-fade-in space-y-6">
            
            {/* Tutoring Header Banner */}
            <div className="bg-gradient-to-r from-[#0A1931] to-[#7A0C2E] border-b-2 border-[#7A0C2E] text-white p-5 rounded-xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="bg-rose-500/20 uppercase text-rose-300 border border-rose-500/30 text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded-full inline-block mb-1.5 animate-pulse">
                  Connected to Gemini Brain core
                </span>
                <h2 className="text-2xl font-serif font-black flex items-center gap-2">
                  Crest AI <span className="text-xs bg-white text-[#7A0C2E] font-sans font-black px-1.5 py-0.5 rounded uppercase">{chatLevel === 'primary' ? 'Common Entrance Coach' : chatLevel === 'junior' ? 'Junior WAEC BECE' : 'WAEC SSCE Coach'}</span>
                </h2>
                <p className="text-slate-300 text-xs mt-0.5">High-scoring Socratic preparation for any WAEC subject exam.</p>
              </div>

              {/* Chat settings selection controls */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-xs">
                  <span className="block text-[9px] text-slate-300 mb-0.5 uppercase tracking-wider font-extrabold">Active Academic Level</span>
                  <select
                    value={chatLevel}
                    onChange={(e) => handleLevelChange(e.target.value as any)}
                    className="p-1.5 bg-black/30 border border-white/20 text-white font-bold rounded text-xs focus:ring-1 focus:ring-rose-400 focus:outline-none"
                  >
                    <option value="senior">Senior WAEC & UTME</option>
                    <option value="junior">Junior WAEC (BECE)</option>
                    <option value="primary">Primary Common Entrance</option>
                  </select>
                </div>

                <div className="text-xs">
                  <span className="block text-[9px] text-slate-300 mb-0.5 uppercase tracking-wider font-extrabold">Active Topic Subject</span>
                  <select
                    value={chatSubject}
                    onChange={(e) => setChatSubject(e.target.value)}
                    className="p-1.5 bg-black/30 border border-white/20 text-white font-bold rounded text-xs focus:ring-1 focus:ring-rose-400 focus:outline-none"
                  >
                    {getSubjectsForLevel(chatLevel).map(subj => (
                      <option key={subj.value} value={subj.value}>{subj.label}</option>
                    ))}
                  </select>
                </div>

                <div className="text-xs">
                  <span className="block text-[9px] text-slate-300 mb-0.5 uppercase tracking-wider font-extrabold">Strategy Mode</span>
                  <div className="flex bg-black/20 rounded p-0.5 border border-white/10">
                    <button
                      onClick={() => setChatMode('study-chat')}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all ${chatMode === 'study-chat' ? 'bg-[#7A0C2E] text-white' : 'text-slate-300 hover:text-white'}`}
                    >
                      Study
                    </button>
                    <button
                      onClick={() => setChatMode('quiz')}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all ${chatMode === 'quiz' ? 'bg-[#7A0C2E] text-white' : 'text-slate-300 hover:text-white'}`}
                    >
                      Quiz Me
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleClearChatHistory}
                  onBlur={() => setIsConfirmingClear(false)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all self-end flex items-center gap-1.5 shadow-sm active:scale-95 ${isConfirmingClear ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                  title={isConfirmingClear ? "Click once more to confirm resetting" : "Reset Conversation History"}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isConfirmingClear ? 'animate-spin' : ''}`} />
                  <span>{isConfirmingClear ? "Confirm Clear?" : "Reset Session"}</span>
                </button>
              </div>
            </div>

            {/* Layout grids: syllabus concepts list (left) & chat box (right) OR JAMB CBT layout */}
            {chatMode === 'study-chat' ? (
              <div className="grid lg:grid-cols-4 gap-6">
                
                {/* Syllabus Core Rails (Left) */}
                <div className="lg:col-span-1 bg-white border border-slate-200 p-4 rounded-xl shadow-sm h-fit space-y-4">
                  <span className="block font-bold text-xs text-slate-500 uppercase border-b border-slate-100 pb-1.5">Quick Lesson Boosters</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">Select a high-frequency exam concept button below to populate the chat inputs immediately:</p>
                  
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => triggerConceptPrompt(chatLevel === 'primary' ? "Explain Common Entrance Quantitative Intelligence, common speed patterns, and how to find sequence rules." : chatLevel === 'junior' ? "Explain how to solve BECE algebraic expressions and common sign errors in brackets expansion." : "Explain how to solve quadratic inequalities and the direction flip rules.")}
                      className="w-full text-left p-2.5 rounded bg-slate-50 border border-slate-150 text-xs hover:border-[#7A0C2E]/50 hover:bg-rose-50/20 text-[#0A1931] font-medium transition-all"
                    >
                      {chatLevel === 'primary' ? '🧮 Sequence Intelligence (Primary)' : chatLevel === 'junior' ? '🧮 Algebraic Expression Simplifier (BECE)' : '🧮 Quadratic Inequalities (Senior)'}
                    </button>
                    <button 
                      onClick={() => triggerConceptPrompt(chatLevel === 'primary' ? "Explain the core difference between vertebrates and invertebrates with primary school examples." : chatLevel === 'junior' ? "What are the common forms of energy conversions in a circuit resister according to Basic Science?" : "What is the difference between breathing and biochemical respiration equations?")}
                      className="w-full text-left p-2.5 rounded bg-slate-50 border border-slate-150 text-xs hover:border-[#7A0C2E]/50 hover:bg-rose-50/20 text-[#0A1931] font-medium transition-all"
                    >
                      {chatLevel === 'primary' ? '🧬 Vertebrate Divisions (Basic Science)' : chatLevel === 'junior' ? '⚡ Energy Conversions (Basic Science)' : '🧬 Respiration Equations (Biology)'}
                    </button>
                    <button 
                      onClick={() => triggerConceptPrompt(chatLevel === 'primary' ? "Explain how to change decimals to percentages and fractions step-by-step for entrance exams." : chatLevel === 'junior' ? "Explain how electricity flows through simple series vs parallel circuits in Basic Science." : "Explain volumetric titration parameters and burette readings Concordance rules.")}
                      className="w-full text-left p-2.5 rounded bg-slate-50 border border-slate-150 text-xs hover:border-[#7A0C2E]/50 hover:bg-rose-50/20 text-[#0A1931] font-medium transition-all"
                    >
                      {chatLevel === 'primary' ? '🔢 Fraction Transformations (Math)' : chatLevel === 'junior' ? '⚡ Electric Circulatory Layouts' : '🧪 Acid-Base Titrations (Chemistry)'}
                    </button>
                    <button 
                      onClick={() => triggerConceptPrompt(chatLevel === 'primary' ? "Explain standard letter writing protocols and how to answer read comprehension questions in Common Entrance." : chatLevel === 'junior' ? "Explain the letters layout structure for letters to my BECE school principals vs letters to friends." : "Explain how to calculate ammeter resistance parameters in split parallel circuits.")}
                      className="w-full text-left p-2.5 rounded bg-slate-50 border border-slate-150 text-xs hover:border-[#7A0C2E]/50 hover:bg-rose-50/20 text-[#0A1931] font-medium transition-all"
                    >
                      {chatLevel === 'primary' ? '📝 Letter Protocols (Primary English)' : chatLevel === 'junior' ? '📝 Formal vs Informal Layouts (BECE)' : '⚡ Parallel Electric Circuits (Physics)'}
                    </button>
                    <button 
                      onClick={() => triggerConceptPrompt("Give me an introduction of the most critical subjects topics to get an outstanding grade in my examination!")}
                      className="w-full text-left p-2.5 rounded bg-slate-50 border border-slate-150 text-xs hover:border-[#7A0C2E]/50 hover:bg-rose-50/20 text-[#0A1931] font-medium transition-all"
                    >
                      📌 Strategic Syllabus Outline
                    </button>
                  </div>
                </div>

                {/* Active Chat Windows (Right) */}
                <div className="lg:col-span-3 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-[500px]">
                  
                  {/* Messages Panel Scroll Area */}
                  <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50 bg-grid-pattern/5 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
                    {chatMessages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-3 p-8">
                        <div className="w-14 h-14 rounded-full bg-rose-50 text-[#7A0C2E] flex items-center justify-center text-2xl animate-bounce">
                          🎓
                        </div>
                        <div className="space-y-1">
                          <strong className="text-slate-700 block text-base font-serif">Welcome dynamically to Wolcrest AI!</strong>
                          <p className="text-slate-400 text-xs max-w-sm">
                            I am calibrated for {chatLevel === 'primary' ? 'Primary Common Entrance' : chatLevel === 'junior' ? 'Junior WAEC (BECE)' : 'Senior WAEC SSCE'} syllabus protocols.
                            Choose your subject, click a booster or type directly below!
                          </p>
                        </div>
                      </div>
                    ) : (
                      chatMessages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-scale-up`}
                        >
                          <div className={`group/msg relative max-w-[85%] rounded-xl p-4 shadow-sm leading-relaxed text-xs sm:text-sm ${msg.sender === 'user' ? 'bg-[#0A1931] text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none border-l-4 border-l-[#7A0C2E]'}`}>
                            
                            {/* Sender meta */}
                            <div className="text-[9px] font-bold uppercase mb-1 flex items-center justify-between gap-1.5 border-b border-slate-100/15 pb-1 select-none">
                              <div className={`flex items-center gap-1.5 ${msg.sender === 'user' ? 'text-rose-200' : 'text-[#7A0C2E]'}`}>
                                {msg.sender === 'user' ? <User className="w-3 h-3" /> : <Sparkles className="w-3 h-3 animate-spin text-rose-500" />}
                                {msg.sender === 'user' ? 'You (Candidate)' : 'Crest AI Coach'}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteChatMessage(msg.id)}
                                title="Delete message"
                                className="md:opacity-0 md:group-hover/msg:opacity-100 opacity-60 hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-red-600 focus:outline-none flex items-center justify-center -mr-1 -mt-0.5"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="whitespace-pre-wrap font-sans text-xs sm:text-[13px] tracking-normal">
                              {msg.text}
                            </div>

                            <div className={`text-[9.5px] mt-2 text-right block ${msg.sender === 'user' ? 'text-rose-300' : 'text-slate-400'}`}>
                              {msg.timestamp}
                            </div>
                          </div>
                        </div>
                      ))
                    )}

                    {isAiLoading && (
                      <div className="flex justify-start items-center gap-2 animate-pulse text-xs text-slate-400">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#7A0C2E]" /> Crest AI is compiling curriculum databases...
                      </div>
                    )}
                  </div>

                  {/* Input Controls form */}
                  <form onSubmit={handleSendChatMessage} className="border-t border-slate-100 p-3 bg-white flex gap-2">
                    <input
                      id="chat-input-box"
                      type="text"
                      required
                      value={userMsgInput}
                      onChange={(e) => setUserMsgInput(e.target.value)}
                      placeholder={`Ask Crest AI a high-level ${chatSubject} equation, lesson, or question...`}
                      className="flex-grow bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-[#7A0C2E] focus:outline-none"
                    />
                    <button 
                      type="submit"
                      disabled={isAiLoading}
                      className="bg-[#7A0C2E] hover:bg-[#5C0821] text-white font-bold text-xs uppercase px-5 rounded py-2 transition-all flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" /> Send
                    </button>
                  </form>

                </div>
              </div>
            ) : cbtGenerating ? (
              
              /* PROGRESSIVE CLASSROOM LOADING DISPLAY */
              <div className="bg-slate-100 border border-slate-250 rounded-2xl p-6 sm:p-10 shadow-md text-center space-y-6 animate-fade-in flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-slate-200 border-t-[#7A0C2E] animate-spin flex items-center justify-center">
                    <span className="text-3xl animate-bounce">🎒</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#0A1931] text-white rounded-full flex items-center justify-center text-[10px] font-bold font-serif shadow-md animate-pulse">
                    AI
                  </div>
                </div>

                <div className="space-y-3 max-w-md">
                  <span className="text-[10px] tracking-widest uppercase font-black text-[#7A0C2E]">
                    Crest AI Academic Laboratory
                  </span>
                  <h3 className="text-xl font-bold font-serif text-[#0A1931]">
                    Formulating Your WAEC Exam Questions
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Please wait, precious scholar! Crest AI is currently analyzing previous West African examination patterns and formulating syllabus-aligned problems specifically for <strong className="text-[#7A0C2E]">{chatSubject}</strong> ({chatLevel.toUpperCase()}).
                  </p>
                </div>

                <div className="bg-white px-4 py-2.5 rounded-lg border border-slate-200 text-slate-500 text-[11px] font-mono shadow-inner flex items-center gap-2 animate-pulse font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                  Modeling options, marking guides, and teacher proofs...
                </div>
              </div>
            ) : !cbtRunning && !cbtSubmitted ? (
              
              /* SUBJECT HUB WINDOW FOR ACTIVE LEVEL */
              <div className="bg-slate-100 border border-slate-250 rounded-2xl p-4 sm:p-6 shadow-md space-y-6 text-start animate-fade-in">
                
                {/* Subject Hub Header */}
                <div className="bg-[#0A1931] text-white p-5 rounded-xl border-l-4 border-[#7A0C2E] flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase font-black text-rose-300">
                      Wolcrest Computer-Based Test System (CBT Laboratory)
                    </span>
                    <h3 className="text-xl font-bold font-serif flex items-center gap-2 mt-0.5">
                      Crest AI Subject Quiz Hub &mdash; <span className="uppercase text-slate-200 text-sm font-sans font-extrabold">{chatLevel === 'primary' ? 'Common Entrance' : chatLevel === 'junior' ? 'Junior WAEC' : 'Senior WAEC'}</span>
                    </h3>
                    <p className="text-slate-300 text-xs mt-1">
                      Choose from our active syllabus subjects below to test your mastery in standard West African exams.
                    </p>
                  </div>
                  <BookOpen className="w-8 h-8 text-rose-400 shrink-0 hidden md:block opacity-80" />
                </div>

                {openedSubject === null ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Available Syllabus Subjects ({getSubjectsForLevel(chatLevel).length})</span>
                      <span className="text-[10px] text-slate-400 font-mono italic">Click select & view guide to trigger prep</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                      {getSubjectsForLevel(chatLevel).map((subj) => (
                        <div key={subj.value} className="bg-white border hover:border-[#7A0C2E]/40 border-slate-200 hover:shadow-md transition-all rounded-xl p-5 flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-[#7A0C2E] font-black text-lg">
                              📚
                            </div>
                            <h4 className="font-serif font-bold text-[#0A1931] text-base">{subj.label}</h4>
                            <p className="text-slate-500 text-xs leading-relaxed">{subj.description}</p>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setOpenedSubject(subj.value);
                              setChatSubject(subj.value);
                            }}
                            className="w-full py-2 bg-slate-50 text-slate-700 hover:bg-[#7A0C2E] hover:text-white border border-slate-200 hover:border-[#7A0C2E] font-bold text-xs uppercase rounded-lg transition-all text-center"
                          >
                            Select & View Guide
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* GUIDELINES & PRE-FLIGHT PAGE */
                  <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-6 animate-fade-in">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <div className="w-12 h-12 rounded-full bg-rose-50 text-[#7A0C2E] border border-rose-100 flex items-center justify-center text-xl shadow-inner font-bold font-serif">
                        🎯
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-black tracking-wider text-[#7A0C2E] block mb-0.5 font-sans">Syllabus Practice Module ({chatLevel.toUpperCase()})</span>
                        <h3 className="text-xl font-bold font-serif text-[#0A1931]">{openedSubject}</h3>
                      </div>
                    </div>

                    <p className="text-slate-650 text-xs sm:text-sm leading-relaxed whitespace-pre-line text-start">
                      {getSubjectsForLevel(chatLevel).find(s => s.value === openedSubject)?.description}
                    </p>

                    <div className="bg-slate-50 p-4 border border-slate-150 rounded-xl space-y-3">
                      <h5 className="text-[#0A1931] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" /> Assessment Standards and Instructions:
                      </h5>
                      <ul className="text-xs text-slate-650 space-y-2 list-decimal pl-4 leading-relaxed">
                        <li>This simulated CBT covers standard West African WAEC / UTME questions.</li>
                        <li>You have <strong className="font-bold text-[#0A1931]">15 Minutes (900 seconds)</strong> to answer exactly <strong className="font-bold text-[#7A0C2E]">30 questions</strong>.</li>
                        <li>When you select an option, it will <strong className="font-bold text-[#7A0C2E]">automatically advance</strong> you to the next question.</li>
                        <li>The grading is scaled automatically (CA Max 40, Final Exam Max 60).</li>
                        <li>Press <strong className="font-bold text-[#0A1931]">A, B, C, D</strong> on your keyboard to answer options.</li>
                        <li>Press <strong className="font-bold text-[#0A1931]">N</strong> to jump next, and <strong className="font-bold text-[#0A1931]">P</strong> to jump previous.</li>
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          handleStartQuiz(openedSubject);
                        }}
                        className="w-full sm:w-auto px-6 py-3 bg-[#7A0C2E] hover:bg-[#5C0821] text-white font-black text-xs uppercase rounded-lg shadow-md transition-all hover:scale-[1.01] flex items-center justify-center gap-1.5 active:scale-95 text-center animate-pulse"
                      >
                        Quiz Me (Start CBT Exam)
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpenedSubject(null)}
                        className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase rounded-lg transition-all text-center"
                      >
                        &larr; Back to Subjects List
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              
              /* JAMB CBT STYLE QUIZ LAYOUT FOR ACTIVE EDUCATION LEVEL */
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-6">
                
                {/* JAMB Exam Banner strip */}
                <div className="bg-[#0A1931] text-white p-5 rounded-2xl border-l-4 border-[#7A0C2E] flex flex-col sm:flex-row items-center justify-between gap-4 shadow">
                  <div className="text-center sm:text-left">
                    <span className="text-[10px] tracking-widest uppercase font-black text-rose-300">
                      Wolcrest Computer-Based Test System (CBT Mock Labs)
                    </span>
                    <h3 className="text-lg font-bold font-serif">
                      {chatSubject} &mdash; <span className="uppercase text-slate-200">{chatLevel === 'primary' ? 'Common Entrance' : chatLevel === 'junior' ? 'Junior WAEC (BECE)' : 'Senior WAEC (JAMB Template)'}</span>
                    </h3>
                  </div>

                  {/* Countdown Timer with color alerts */}
                  <div className="flex items-center gap-2.5 bg-black/40 border border-white/15 px-3 py-1.5 rounded-lg">
                    <Clock className={`w-4 h-4 animate-pulse ${cbtTimeLeft < 60 ? 'text-red-500' : cbtTimeLeft < 180 ? 'text-amber-500' : 'text-emerald-400'}`} />
                    <div className="font-mono text-xs text-slate-100 tracking-wider">
                      TIME REMAINING: 
                      <span className={`text-base font-bold ml-1.5 ${cbtTimeLeft < 60 ? 'text-red-500 font-extrabold animate-ping' : cbtTimeLeft < 180 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {Math.floor(cbtTimeLeft / 60).toString().padStart(2, '0')}:{(cbtTimeLeft % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>

                {!cbtSubmitted && cbtQuestions && cbtQuestions.length > 0 && (
                  <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#7A0C2E] animate-pulse"></span>
                        <span className="text-xs font-bold text-[#0A1931] uppercase tracking-wider">
                          Test Pacing & Progression Indicator
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-[#7A0C2E] font-black">{Object.keys(cbtAnswers).length}</span>
                        <span className="text-slate-400">Answered</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-[#0A1931] font-black">{Math.max(0, cbtQuestions.length - Object.keys(cbtAnswers).length)}</span>
                        <span className="text-slate-400">Remaining</span>
                        <span className="text-slate-250">|</span>
                        <span className="font-mono bg-slate-100 text-[#0A1931] px-1.5 py-0.5 rounded font-black text-[10px]">
                          {Math.round((Object.keys(cbtAnswers).length / cbtQuestions.length) * 100)}% Complete
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress tracking track bar */}
                    <div className="w-full bg-slate-150 h-2.5 rounded-full overflow-hidden border border-slate-200/50">
                      <div 
                        className="bg-gradient-to-r from-[#7A0C2E] to-[#b31b40] h-full rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${(Object.keys(cbtAnswers).length / cbtQuestions.length) * 100 || 0}%` }}
                      />
                    </div>
                  </div>
                )}

                {!cbtSubmitted ? (
                  /* EXAM HALL ACTIVE PANEL */
                  <div className="grid lg:grid-cols-4 gap-6">
                    
                    {/* Main Question Card display (3 cols) */}
                    <div className="lg:col-span-3 bg-white border border-slate-200 p-5 sm:p-6 rounded-xl shadow-sm flex flex-col justify-between min-h-[440px] space-y-6 relative overflow-hidden">
                      
                      {cbtShowConfirmSubmit && (
                        <div className="absolute inset-0 bg-[#0A1931]/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center text-white animate-fade-in">
                          <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center text-3xl mb-4 animate-bounce">
                            ⚠️
                          </div>
                          <h4 className="text-xl font-bold font-serif mb-2">Submit CBT Exam Paper?</h4>
                          <p className="text-slate-300 text-xs sm:text-sm max-w-md leading-relaxed mb-6">
                            {(() => {
                              const unansweredCount = (cbtQuestions || []).filter(q => !cbtAnswers[q.id]).length;
                              if (unansweredCount > 0) {
                                return `Attention! You have left ${unansweredCount} out of ${cbtQuestions.length} questions unanswered. Are you sure you wish to submit your paper now to the registry server for final grading?`;
                              }
                              return `Excellent work! You have answered all ${cbtQuestions.length} questions. Are you ready to submit your paper for final grading?`;
                            })()}
                          </p>
                          <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-xs">
                            <button
                              type="button"
                              onClick={() => handleCbtSubmit(true)}
                              className="flex-1 py-3 bg-[#7A0C2E] hover:bg-[#5C0821] text-white font-extrabold text-xs uppercase rounded-lg shadow-lg active:scale-95 transition-all text-center"
                            >
                              Yes, Submit Now
                            </button>
                            <button
                              type="button"
                              onClick={() => setCbtShowConfirmSubmit(false)}
                              className="flex-1 py-3 bg-white/10 hover:bg-white/15 text-slate-100 font-bold text-xs uppercase rounded-lg border border-white/15 active:scale-95 transition-all text-center"
                            >
                              Go Back & Edit
                            </button>
                          </div>
                        </div>
                      )}

                      {!cbtQuestions || cbtQuestions.length === 0 ? (
                        <div className="flex-grow flex flex-col items-center justify-center text-center p-8 space-y-2">
                          <HelpCircle className="w-12 h-12 text-[#7A0C2E]/30 animate-pulse" />
                          <strong className="text-slate-700 text-sm">No Mock Questions loaded inside cache for this subject.</strong>
                          <p className="text-slate-400 text-xs">Switch your level or active subject target on the headers to generate standard dynamic tests!</p>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-5">
                            {/* Question Meta Row */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                              <span className="bg-[#7A0C2E]/10 text-[#7A0C2E] uppercase font-bold text-[10px] px-2.5 py-1 rounded-full">
                                Question {cbtCurrentIdx + 1} of {cbtQuestions.length}
                              </span>
                              <span className="text-slate-400 font-mono text-[10px]">
                                CLASSICAL UTME SCALER SYSTEM
                              </span>
                            </div>

                            {/* Question text nicely padded (strictly clean text math) */}
                            <div className="text-slate-880 text-sm font-medium leading-relaxed bg-slate-50/40 p-4 rounded-lg border border-slate-100/70 whitespace-pre-line text-start shadow-inner">
                              {cbtQuestions[cbtCurrentIdx]?.question}
                            </div>

                            {/* Options A, B, C, D choices list */}
                            <div className="grid gap-3 pt-2">
                              {cbtQuestions[cbtCurrentIdx] && cbtQuestions[cbtCurrentIdx].options && (Object.entries(cbtQuestions[cbtCurrentIdx].options) as [ 'A' | 'B' | 'C' | 'D', string][]).map(([optLetter, optValue]) => {
                                const activeQ = cbtQuestions[cbtCurrentIdx];
                                const isSelected = activeQ ? cbtAnswers[activeQ.id] === optLetter : false;
                                return (
                                  <button
                                    key={optLetter}
                                    type="button"
                                    onClick={() => {
                                      if (activeQ) {
                                        setCbtAnswers(prev => ({ ...prev, [activeQ.id]: optLetter }));
                                      }
                                      // Automatically move to the next question after a brief 250ms feedback delay
                                      if (cbtCurrentIdx < cbtQuestions.length - 1) {
                                        setTimeout(() => {
                                          setCbtCurrentIdx(prev => prev + 1);
                                        }, 250);
                                      }
                                    }}
                                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-3.5 active:scale-[0.99] select-none ${isSelected ? 'bg-[#0A1931]/5 border-[#0A1931] ring-2 ring-[#0A1931]/10 text-[#0A1931] font-bold' : 'bg-white border-slate-200 hover:border-slate-350 text-slate-705 hover:bg-slate-50'}`}
                                  >
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${isSelected ? 'bg-[#0A1931] border-[#0A1931] text-white' : 'bg-slate-50 border-slate-300 text-slate-500'}`}>
                                      {optLetter}
                                    </div>
                                    <span className="leading-snug">{optValue}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Navigation Button Footer actions */}
                          <div className="border-t border-slate-100 pt-5 flex items-center justify-between gap-3">
                            <button
                              type="button"
                              disabled={cbtCurrentIdx === 0}
                              onClick={() => setCbtCurrentIdx(prev => prev - 1)}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs rounded transition-colors disabled:opacity-40 uppercase"
                            >
                              &larr; Previous [P]
                            </button>

                            <div className="text-[10px] text-slate-400 font-medium italic hidden md:block">
                              Tip: You can use your computer keyboard keys [A, B, C, D] to select choices!
                            </div>

                            <div className="flex items-center gap-2">
                              {cbtCurrentIdx < cbtQuestions.length - 1 ? (
                                <button
                                  type="button"
                                  onClick={() => setCbtCurrentIdx(prev => prev + 1)}
                                  className="px-5 py-2 bg-[#0A1931] hover:bg-[#102A4A] text-white font-bold text-xs rounded transition-colors uppercase"
                                >
                                  Next [N] &rarr;
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleCbtSubmit(false)}
                                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded shadow-md transition-colors uppercase animate-pulse"
                                >
                                  Submit Paper [S]
                                </button>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* JAMB Style Sidebar: Candidate Info & Circular Question Palette (1 col) */}
                    <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-5 text-start flex flex-col justify-between">
                      <div className="space-y-4">
                        {/* Profile Section */}
                        <div className="border-b border-slate-100 pb-3 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg border border-slate-200 text-[#7A0C2E] shrink-0 font-bold uppercase shadow-inner">
                            {chatSubject ? chatSubject.charAt(0) : 'C'}
                          </div>
                          <div className="min-w-0">
                            <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-black">Candidate Profile</span>
                            <div className="font-bold text-[#0A1931] text-xs truncate">STUDENT CANDIDATE</div>
                            <span className="block text-[9px] font-mono text-[#7A0C2E]">WOL/2026/CBT-{chatSubject.substring(0,3).toUpperCase()}</span>
                          </div>
                        </div>

                        {/* circular numbers palette grid */}
                        <div className="space-y-2">
                          <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-black">Question Grid Map</span>
                          <div className="grid grid-cols-5 gap-2">
                            {cbtQuestions.map((q, idx) => {
                              const isCurrent = idx === cbtCurrentIdx;
                              const isAnswered = !!cbtAnswers[q.id];
                              return (
                                <button
                                  key={q.id}
                                  type="button"
                                  onClick={() => setCbtCurrentIdx(idx)}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all border ${isCurrent ? 'bg-[#0A1931] text-white ring-2 ring-rose-300 border-[#0A1931]' : isAnswered ? 'bg-[#7A0C2E] border-[#7A0C2E] text-white font-black' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                                >
                                  {idx + 1}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Hotkey Indicators */}
                      <div className="border-t border-slate-100 pt-4 bg-slate-50/50 p-2.5 rounded-lg border text-[9.5px] text-slate-500 space-y-1.5 leading-relaxed mt-4">
                        <span className="font-extrabold text-[#7A0C2E] uppercase block tracking-wider">💡 CBT Hall Keyboards:</span>
                        <ul className="list-disc pl-3.5 space-y-0.5">
                          <li>Press <strong className="font-bold text-[#0A1931]">A, B, C, D</strong> to select choice</li>
                          <li>Press <strong className="font-bold text-[#0A1931]">N</strong> to jump next</li>
                          <li>Press <strong className="font-bold text-[#0A1931]">P</strong> to jump previous</li>
                          <li>Press <strong className="font-bold text-[#0A1931]">S</strong> to submit exam</li>
                        </ul>
                      </div>
                    </div>

                  </div>
                ) : (
                  
                  /* COGNITIVE REPORT AND SOCRATIC EXERCISES SUMMARY SHEET */
                  <div className="bg-white border border-slate-250 rounded-xl p-5 sm:p-8 shadow-md space-y-8 text-start">
                    
                    {/* Score sheet Header */}
                    <div className="text-center space-y-2 border-b border-slate-100 pb-5">
                      <div className="w-14 h-14 rounded-full bg-rose-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-2xl mx-auto shadow-inner">
                        📊
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0A1931]">Academic Assessment Scoreboard</h3>
                      <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                        Wolcrest computer registers have graded your answers according to West African scoring standards. Excellent study is the gateway to greatness!
                      </p>
                    </div>

                    {/* Metrics Grid Cards summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      
                      <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center">
                        <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">Assessment Level</span>
                        <div className="font-bold font-serif text-[#0A1931] text-lg uppercase truncate">
                          {chatLevel === 'primary' ? 'Common entrance' : chatLevel === 'junior' ? 'Junior WAEC' : 'Senior WAEC'}
                        </div>
                        <span className="text-[9px] text-slate-400 block mt-0.5">{chatSubject}</span>
                      </div>

                      <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center">
                        <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">Correct Answers</span>
                        <div className="text-2xl font-bold text-slate-800 font-mono">
                          {cbtQuestions.filter(q => cbtAnswers[q.id] === q.correctAnswer).length} <span className="text-xs font-sans text-slate-400">/ {cbtQuestions.length}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 block mt-1">Accuracy Factor</span>
                      </div>

                      <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center">
                        <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">Grading Yield</span>
                        <div className={`text-2xl font-bold font-mono ${cbtScore >= 75 ? 'text-emerald-700' : cbtScore >= 50 ? 'text-amber-700' : 'text-red-700'}`}>
                          {cbtScore}%
                        </div>
                        <span className="text-[9.5px] font-black uppercase tracking-wider block mt-1 shrink-0 truncate">
                          {cbtScore >= 75 ? '🔥 Excellent A1' : cbtScore >= 60 ? '👍 Credit B' : cbtScore >= 45 ? 'Pass C' : 'Pass / Needs Boost!'}
                        </span>
                      </div>

                      <div className="bg-slate-50 border border-[#7A0C2E]/10 p-4 rounded-xl text-center">
                        <span className="text-[10px] uppercase font-black tracking-wider text-slate-[#7A0C2E] block mb-1">UTME / JAMB Points</span>
                        <div className="text-2xl font-bold text-[#7A0C2E] font-mono">
                          {Math.round((cbtScore / 100) * 400)} <span className="text-xs font-sans text-slate-400">/ 400</span>
                        </div>
                        <span className="text-[9px] text-slate-400 block mt-1">Aggregate Scale</span>
                      </div>

                    </div>

                    {/* Progressive Bar */}
                    <div className="space-y-1 bg-slate-50 p-4 border border-slate-150 rounded-xl">
                      <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-500 uppercase">
                        <span>Cognitive Performance Map Yield</span>
                        <span>{cbtScore}% Accuracy</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#7A0C2E] h-full transition-all duration-1000" 
                          style={{ width: `${cbtScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Socratic Explanation Review Workspace */}
                    <div className="space-y-4">
                      <h4 className="font-serif font-black text-[#0A1931] text-base border-b border-slate-100 pb-2 flex items-center gap-1.5">
                        <span>Crest AI Socratic Explanation Lab</span>
                        <span className="text-xs font-sans font-bold text-slate-400 uppercase">&mdash; Answer Explanations Review</span>
                      </h4>

                      <div className="space-y-4">
                        {cbtQuestions.map((q, idx) => {
                          const userAns = cbtAnswers[q.id];
                          const isCorrect = userAns === q.correctAnswer;
                          return (
                            <div 
                              key={q.id} 
                              className={`p-4 sm:p-5 rounded-xl border leading-relaxed ${isCorrect ? 'bg-emerald-50/20 border-emerald-200' : 'bg-rose-50/15 border-rose-200'}`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5 ${isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                                  {isCorrect ? '✓' : '✗'}
                                </div>
                                
                                <div className="space-y-2.5 flex-grow">
                                  {/* Question Title */}
                                  <div className="font-bold text-slate-800 text-xs sm:text-sm">
                                    <span className="text-[#7A0C2E] font-mono mr-1">Q{idx + 1}.</span> {q.question}
                                  </div>

                                  {/* Selections feedback */}
                                  <div className="flex flex-wrap gap-4 text-xs font-mono">
                                    <div className="bg-slate-50 px-2 py-1 rounded border border-slate-150">
                                      Your Choice: <span className={`font-black uppercase ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>{userAns || 'Unanswered'}</span>
                                    </div>
                                    <div className="bg-emerald-50 px-2 py-1 border border-emerald-150 text-emerald-800 rounded">
                                      Correct Answer: <span className="font-black uppercase">{q.correctAnswer}</span>
                                    </div>
                                  </div>

                                  {/* Socratic Coach Explanation block */}
                                  <div className="bg-white p-3.5 border border-slate-150 rounded-lg text-xs leading-relaxed text-slate-600 space-y-2">
                                    <strong className="text-[#0A1931] font-bold block select-none">🏫 Crest Teacher's Guide:</strong>
                                    <div className="font-sans whitespace-pre-wrap leading-relaxed text-slate-600 text-xs text-start">
                                      {q.explanation}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Exits and resets block */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 justify-end border-t border-slate-100 pt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setCbtSubmitted(false);
                          setCbtRunning(false);
                          setOpenedSubject(null);
                        }}
                        className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-705 font-bold text-xs uppercase rounded transition-all text-center active:scale-95"
                      >
                        &larr; Exit to Quiz Hub
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          // Force reload questions state
                          const rawQuestions = getFallbackQuestions(chatLevel, chatSubject);
                          const questions = ensureExactly30Questions(rawQuestions, chatLevel, chatSubject);
                          setCbtQuestions(questions);
                          setCbtCurrentIdx(0);
                          setCbtAnswers({});
                          setCbtTimeLeft(900);
                          setCbtRunning(true);
                          setCbtSubmitted(false);
                          setCbtShowConfirmSubmit(false);
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        className="w-full sm:w-auto px-5 py-2.5 border-2 border-[#0A1931] text-[#0A1931] hover:bg-[#0A1931]/5 font-extrabold text-xs uppercase rounded transition-all tracking-wide active:scale-95"
                      >
                        Retake This Quiz Pattern
                      </button>

                      <button
                        type="button"
                        onClick={() => setChatMode('study-chat')}
                        className="w-full sm:w-auto px-6 py-2.5 bg-[#7A0C2E] hover:bg-[#5C0821] text-white font-black text-xs uppercase rounded shadow active:scale-95 transition-all text-center"
                      >
                        Discuss Concepts in Socratic Chat &rarr;
                      </button>
                    </div>

                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* TAB 7: SCHOOL EVENTS */}
        {activeTab === 'events' && (
          <div id="tab-content-events" className="animate-fade-in space-y-8">
            {/* Header section with school colors */}
            <div className="relative rounded-2xl overflow-hidden text-white p-6 sm:p-10 shadow-lg border border-slate-200 bg-gradient-to-r from-[#0A1931] via-[#102A4A] to-[#2B0E1B]">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none select-none">
                <Calendar className="w-32 h-32" />
              </div>
              <div className="relative z-10 space-y-3 max-w-2xl">
                <span className="bg-[#7A0C2E] uppercase text-xs font-bold tracking-widest px-3 py-1 rounded-full text-white inline-block">
                  📅 Co-Curricular Calendar
                </span>
                <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-white leading-tight">
                  Academic Showcases & Outdoor Expeditions
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  At Wolcrest, learning expands beyond pages. Our co-curricular events are designed to cultivate team cohesion, athletic discipline, self-reliance, and outstanding academic stamina.
                </p>
              </div>
            </div>

            {/* General Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Event 1: Terminal Examinations */}
              <div id="event-card-exams" className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-[#7A0C2E] group-hover:scale-110 transition-all">
                      <BookOpen className="w-5 h-5 focus:outline-none" />
                    </div>
                    <span className="bg-[#7A0C2E]/10 text-[#7A0C2E] text-[9px] uppercase font-black px-2.5 py-1 rounded-full border border-rose-200">
                      3rd Term / Promotion
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-serif font-black text-[#0A1931]">
                      3rd Term Comprehensive Examinations
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">
                      TARGET: ALL YEAR GROUPS (NURSERY - SSS 3)
                    </p>
                  </div>

                  <p className="text-slate-500 text-xs leading-relaxed">
                    The ultimate scholastic arena of the academic year where cumulative theoretical mastery meets promotional verification. These terminal checks assess dynamic understanding of general subjects, advanced mathematics, science laboratories, and languages. Standardized questions build psychological fortitude, diagnostic precision, and complete promotion day readiness.
                  </p>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span className="text-amber-700">📆 Date yet to be released</span>
                  <span>Registrar Office</span>
                </div>
              </div>

              {/* Event 2: Camping Expedition */}
              <div id="event-card-camping" className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-lg bg-[#7A0C2E]/10 border border-[#7A0C2E]/20 flex items-center justify-center text-[#7A0C2E] group-hover:scale-110 transition-all">
                      <Compass className="w-5 h-5" />
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] uppercase font-black px-2.5 py-1 rounded-full border border-emerald-200">
                      End of term
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-serif font-black text-[#0A1931]">
                      Under-the-Stars School Camping Expedition
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">
                      LOCATION: SAFELY HOSTED WITHIN THE SCHOOL PREMISES
                    </p>
                  </div>

                  <p className="text-slate-500 text-xs leading-relaxed">
                    Safety meets high adventure—our campus is transformed into an outdoor wonderland! Set inside secure school boundaries, scholars embark on an exciting survival simulation cultivating character resilience, teamwork, and outdoor navigation. Activities include celestial path-finding under the night sky, safe pitch tents setup, team scavenger-hunts, and lively fire-circle songs.
                  </p>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span className="text-emerald-750">📆 Dec 14 - Dec 18, 2026</span>
                  <span>Outdoor Coord.</span>
                </div>
              </div>

              {/* Event 3: Inter-House Sports */}
              <div id="event-card-sports" className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700 group-hover:scale-110 transition-all">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="bg-[#7A0C2E]/10 text-[#7A0C2E] text-[9px] uppercase font-black px-2.5 py-1 rounded-full border border-amber-200">
                      2nd Term / Mid-Term
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-serif font-black text-[#0A1931]">
                      Annual Inter-House Sports Extravaganza
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">
                      COHORT CHAMPS: RED, BLUE, GOLD, & GREEN HOUSES
                    </p>
                  </div>

                  <p className="text-slate-500 text-xs leading-relaxed">
                    A colorful, electric festival where rapid athletic sprints and heavy fields matches meet healthy rivalry! Scholars represent their houses across tracks, dynamic gymnastics, field vaults, and chess challenges. Featuring professional live brass bands, delicious refreshments, parents' track races, and the coronation of the ultimate champion house.
                  </p>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span className="text-[#7A0C2E]">📆 Feb 25 - Feb 26, 2027</span>
                  <span>Sports Ministry</span>
                </div>
              </div>

            </div>

            {/* Extra FAQ or Dynamic Reminder Banner */}
            <div className="p-5 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 bg-rose-50 border-[#7A0C2E]/10">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-bold text-[#0A1931] text-xs sm:text-sm">Looking to prepare for exams early?</h4>
                <p className="text-xs text-slate-500 leading-snug">
                  Use our custom-trained <strong className="text-[#7A0C2E]">Crest AI Tutor</strong> tab to practice WAEC quiz formats, review formulas, and verify diagnostic solutions.
                </p>
              </div>
              <button
                onClick={() => handleTabChange('crest-ai')}
                className="bg-[#7A0C2E] hover:bg-[#5C0821] text-white font-bold text-xs uppercase px-4 py-2.5 rounded shadow-sm transition-all whitespace-nowrap active:scale-95 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Study with Crest AI Now
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: ADMIN REGISTRAR PANEL (Verification Role Mode) */}
        {activeTab === 'admin' && (
          <div id="tab-content-admin" className="animate-fade-in space-y-6">
            
            {!isUnlocked ? (
              <div className="max-w-md mx-auto bg-white border border-slate-250 p-6 rounded-xl shadow-lg mt-10 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-[#7A0C2E] text-xl mx-auto border border-rose-100 shadow-inner">
                    🔐
                  </div>
                  <h3 className="text-xl font-serif font-black text-[#0A1931]">Registrar Administrative Lock</h3>
                  <p className="text-slate-400 text-xs">Enter your school-issued administrative security key to access student registrars, record scores, and design digital IDs.</p>
                </div>

                <form onSubmit={handleAdminUnlock} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Administrative Security Key</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••"
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      className="w-full text-center tracking-widest font-mono text-xl bg-slate-50 border border-slate-2.00 rounded p-2.5 focus:ring-1 focus:ring-[#7A0C2E] focus:outline-none"
                    />
                  </div>

                  {adminError && (
                    <div className="bg-rose-50 border border-rose-200 text-[#7A0C2E] text-xs p-3 rounded">
                      ⚠ {adminError}
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="w-full bg-[#7A0C2E] hover:bg-[#5C0821] text-white py-2.5 rounded font-bold text-xs uppercase tracking-wider shadow"
                  >
                    Authorize Registry Clearance
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-8 animate-scale-up">
                
                {/* Admin Header with Lock State */}
                <div className="bg-[#0A1931] text-white p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-[#7A0C2E]">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#ffccd5]">Registry Administrative controls unlocked</span>
                    <h2 className="text-2xl font-serif font-black">Wolcrest Administrative Console</h2>
                  </div>
                  <button 
                    onClick={() => {
                      setIsUnlocked(false);
                      setAdminPasscode('');
                    }}
                    className="bg-[#7A0C2E] hover:bg-[#5C0821] text-white text-xs px-4 py-2 rounded flex items-center gap-1.5 transition-colors font-bold self-start md:self-auto pt-1.5 pb-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Close Session
                  </button>
                </div>

                {/* Dashboard summary values */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Certified Scholars</span>
                    <strong className="text-[#0A1931] text-2xl font-serif">{studentsList.length}</strong>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-[#7A0C2E]/10 text-center">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Intake Applications</span>
                    <strong className="text-[#0A1931] text-2xl font-serif">{admissions.length}</strong>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-slate-200 text-center flex flex-col justify-between items-center gap-1">
                    <div>
                      <span className="text-slate-[#7A0C2E] text-[10px] uppercase font-extrabold block">Registry Security Key</span>
                      <strong className="text-[#7A0C2E] text-sm font-mono block mt-0.5">&bull;&bull;&bull;&bull;&bull;&bull;</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newPin = prompt("Enter new administrative security key:");
                        if (newPin) {
                          const trimmed = newPin.trim();
                          if (trimmed.length >= 4) {
                            setAdminPin(trimmed);
                            localStorage.setItem('wolcrest_admin_pin', trimmed);
                            alert(`Success! Administrative verification key securely updated.`);
                          } else {
                            alert("For safety, code must contain at least 4 characters.");
                          }
                        }
                      }}
                      className="bg-[#7A0C2E]/10 hover:bg-[#7A0C2E]/20 text-[#7A0C2E] text-[9px] font-bold px-2.5 py-1 rounded transition-all uppercase active:scale-95"
                    >
                      Update Key
                    </button>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
                    <span className="text-[#7A0C2E] text-[10px] uppercase font-extrabold block">Crest AI Integration</span>
                    <strong className="text-emerald-700 text-sm block mt-1">Dual-Orbital Active</strong>
                  </div>
                </div>

                {/* Main Admin Working Columns */}
                <div className="grid lg:grid-cols-3 gap-6">
                  
                  {/* Registry students list (Left column) */}
                  <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl max-h-[600px] overflow-hidden flex flex-col shadow-sm">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-bold text-[#0A1931] text-sm">Active Registrar Database</h3>
                      <button 
                        onClick={() => setIsRegisteringStudent(!isRegisteringStudent)}
                        className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-extrabold text-[10px] px-2.5 py-1.5 rounded flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> {isRegisteringStudent ? 'View List' : 'Add Student'}
                      </button>
                    </div>

                    {!isRegisteringStudent ? (
                      <div className="flex-grow overflow-y-auto p-3 space-y-2">
                        {studentsList.length === 0 ? (
                          <div className="p-8 text-center text-xs text-slate-400 italic">
                            No student profiles loaded in administrative cache.
                          </div>
                        ) : (
                          studentsList.map((stud) => (
                            <div 
                              key={stud.id}
                              onClick={() => {
                                setSelectedAdminStudent(stud);
                                setIsRegisteringStudent(false);
                              }}
                              className={`p-3 rounded border text-left cursor-pointer transition-all ${selectedAdminStudent?.id === stud.id ? 'bg-rose-50/40 border-[#7A0C2E]/60 ring-1 ring-[#7A0C2E]/30' : 'bg-slate-50 border-slate-150 hover:border-slate-300'}`}
                            >
                              <div className="font-bold text-[#0A1931] text-xs sm:text-sm">{stud.name}</div>
                              <span className="block text-[10px] font-mono text-[#7A0C2E]">{stud.id}</span>
                              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                                <span>Class: {stud.className}</span>
                                <span className="font-bold">{Object.keys(stud.results).length} Subjects Seeded</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    ) : (
                      
                      /* REGISTER NEW STUDENT (Invoking AI server generator) */
                      <form onSubmit={handleAdminRegisterStudent} className="p-4 space-y-4 overflow-y-auto">
                        <h4 className="font-black text-rose-800 text-xs uppercase border-b border-rose-50 pb-1.5">Register New Scholar</h4>
                        
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Scholar Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Amina Yusuf Adebayo"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs focus:ring-1 focus:ring-[#7A0C2E] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Assigned Class level</label>
                          <select
                            value={regClass}
                            onChange={(e) => setRegClass(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs focus:ring-1 focus:ring-[#7A0C2E]"
                          >
                            <option value="Kindergarten">Kindergarten</option>
                            <option value="Nursery 1">Nursery 1</option>
                            <option value="Primary 1">Primary 1</option>
                            <option value="Primary 3">Primary 3</option>
                            <option value="Primary 6">Primary 6</option>
                            <option value="JSS 1">Junior Secondary 1 (JSS1)</option>
                            <option value="JSS 2">Junior Secondary 2 (JSS2)</option>
                            <option value="JSS 3">Junior Secondary 3 (JSS3)</option>
                            <option value="SSS 1">Senior Secondary 1 (SSS1)</option>
                            <option value="SSS 2">Senior Secondary 2 (SSS2)</option>
                            <option value="SSS 3">Senior Secondary 3 (SSS3)</option>
                          </select>
                        </div>

                        {regClass.includes('SS') && (
                          <div>
                            <label className="block text-[10px] font-bold text-[#7A0C2E] mb-0.5">Assigned Department</label>
                            <select
                              value={regDept}
                              onChange={(e) => setRegDept(e.target.value)}
                              className="w-full bg-rose-50 border border-rose-100 text-[#7A0C2E] font-bold rounded p-1.5 text-xs"
                            >
                              <option value="Sciences (STEM)">Sciences (STEM)</option>
                              <option value="Arts & Humanities">Arts & Humanities</option>
                              <option value="Commercial & Social Sciences">Commercial & Social Sciences</option>
                            </select>
                          </div>
                        )}

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Seeding remarks / Profile context</label>
                          <textarea
                            placeholder="e.g. Exhibited superb intellectual vigor during admission diagnostics."
                            value={regRemarks}
                            onChange={(e) => setRegRemarks(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs focus:ring-1 focus:ring-[#7A0C2E] focus:outline-none h-16"
                          />
                        </div>

                        <button 
                          type="submit"
                          disabled={isIdGenerating}
                          className="w-full bg-[#7A0C2E] hover:bg-[#5C0821] text-white py-2 rounded text-xs tracking-wider uppercase font-black disabled:opacity-50 transition-all flex items-center justify-center gap-1"
                        >
                          {isIdGenerating ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Querying ID core...
                            </>
                          ) : (
                            'Authorize Student Profile'
                          )}
                        </button>

                        {lastGeneratedId && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-[11px] leading-normal animate-fade-in text-emerald-900 space-y-1">
                            <strong>✓ Authorization Profile Setup:</strong>
                            <div>ID Tag: <code className="bg-white font-mono px-1 border rounded text-[10px] block mt-0.5">{lastGeneratedId}</code></div>
                            <div>Dynamic Motto Quote: <span className="italic">"{lastGeneratedMotto}"</span></div>
                          </div>
                        )}

                      </form>
                    )}

                  </div>

                  {/* Editing & grading board (Right column) */}
                  <div className="lg:col-span-2 space-y-4">
                    {selectedAdminStudent ? (
                      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 animate-scale-up">
                        
                        {/* Student details header with deletion button */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#7A0C2E]">Selected profile files</span>
                            <h3 className="text-xl font-bold text-[#0A1931]">{selectedAdminStudent.name}</h3>
                            <span className="text-xs font-mono text-slate-400">{selectedAdminStudent.id}</span>
                          </div>
                          
                          <button 
                            type="button"
                            onClick={() => handleAdminDeleteStudent(selectedAdminStudent.id)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs px-3 py-1.5 rounded"
                          >
                            Deactivate Profile
                          </button>
                        </div>

                        {/* Grading editor */}
                        <div className="space-y-3">
                          <span className="block text-xs font-black text-slate-500 uppercase">Input / Modify Course scores</span>
                          <span className="block text-[10px] text-slate-400">Values are bound dynamically: CA accepts max 40, Final Exam accepts max 60. Instantly recalculated.</span>

                          <div className="space-y-3 pt-2">
                            {Object.keys(selectedAdminStudent.results).map((subjName) => {
                              const marks = selectedAdminStudent.results[subjName];
                              const total = marks.ca + marks.exam;
                              const gradeInfo = calculateGrade(total);

                              return (
                                <div key={subjName} className="p-3 bg-slate-50 border border-slate-150 rounded flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  
                                  <div className="flex-grow">
                                    <h4 className="font-bold text-[#0A1931] text-xs sm:text-sm">{subjName}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-[10px] text-slate-400">Grade Score:</span>
                                      <strong className="text-xs text-[#0A1931]">{total} points ({gradeInfo.grade})</strong>
                                      <span className="text-[10px] text-slate-400 font-sans italic"> - {gradeInfo.remark}</span>
                                    </div>
                                  </div>

                                  <div className="flex gap-3">
                                    <div>
                                      <span className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">CA (Max 40)</span>
                                      <input
                                        type="number"
                                        max="40"
                                        min="0"
                                        value={marks.ca}
                                        onChange={(e) => handleAdminScoreChange(subjName, 'ca', e.target.value)}
                                        className="w-16 bg-white border border-slate-200 rounded p-1 text-center font-mono text-xs focus:ring-1 focus:ring-[#7A0C2E] focus:outline-none"
                                      />
                                    </div>
                                    <div>
                                      <span className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Exam (Max 60)</span>
                                      <input
                                        type="number"
                                        max="60"
                                        min="0"
                                        value={marks.exam}
                                        onChange={(e) => handleAdminScoreChange(subjName, 'exam', e.target.value)}
                                        className="w-16 bg-white border border-slate-200 rounded p-1 text-center font-mono text-xs focus:ring-1 focus:ring-[#7A0C2E] focus:outline-none"
                                      />
                                    </div>
                                  </div>

                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Principal comments modifier */}
                        <div>
                          <label className="block text-xs font-black text-slate-500 uppercase mb-1">Set Principal Registry Comments</label>
                          <textarea
                            value={selectedAdminStudent.remarks}
                            onChange={(e) => handleAdminRemarksUpdate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-[#7A0C2E] focus:outline-none h-20"
                          />
                        </div>

                        {/* Quick validation indicator */}
                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded text-xs text-emerald-800 leading-snug flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" /> Synchronized: Report card is immediately queryable by students inside the Active Student Portal. Values are cached in local browser memories.
                        </div>

                      </div>
                    ) : (
                      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 italic flex items-center justify-center min-h-[400px]">
                        Select a certified scholar profile from the left index panel to edit academic parameters, or launch a new student intake.
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* FOOTER: CONTACT INFO & QUICK LINKS */}
      <footer id="main-footer" className="bg-[#0A1931] border-t-4 border-[#7A0C2E] text-white pt-10 pb-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
          
          {/* Logo, Motto & Brief */}
          <div className="space-y-3">
            <h4 className="text-lg font-serif font-black tracking-wider text-white">WOLCREST SCHOOLS</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Leading West African academy leveraging standard pedagogical systems and cutting edge dual-orbital tutoring AI to cultivate elite, high-scoring academic scholars.
            </p>
            <span className="block text-xs text-[#ffccd5] italic font-semibold font-serif pt-1.5">
              "{SCHOOL_MANIFESTO.motto}"
            </span>
          </div>

          {/* Quick links set tab instantly */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#7A0C2E] bg-rose-50/10 px-3 py-1 rounded w-fit">Quick Directories</h4>
            <ul className="text-xs text-slate-300 space-y-2 font-medium">
              <li>
                <button onClick={() => handleTabChange('home')} className="hover:text-white transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-[#7A0C2E]" /> Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleTabChange('academics')} className="hover:text-white transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-[#7A0C2E]" /> Academy Curricula
                </button>
              </li>
              <li>
                <button onClick={() => handleTabChange('admissions')} className="hover:text-white transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-[#7A0C2E]" /> Admissions Procedure
                </button>
              </li>
              <li>
                <button onClick={() => handleTabChange('events')} className="hover:text-white transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-[#7A0C2E]" /> School Events Calendar
                </button>
              </li>
              <li>
                <button onClick={() => handleTabChange('portal')} className="hover:text-white transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-[#7A0C2E]" /> Student Report Card Portal
                </button>
              </li>
              <li>
                <button onClick={() => handleTabChange('crest-ai')} className="hover:text-white transition-colors flex items-center gap-1 font-bold text-rose-300">
                  <ChevronRight className="w-3.5 h-3.5 text-[#7A0C2E]" /> Crest AI WAEC Tutor
                </button>
              </li>
            </ul>
          </div>

          {/* Contact us info */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#7A0C2E] bg-rose-50/10 px-3 py-1 rounded w-fit">Secure Registry Contact</h4>
            <ul className="text-xs text-slate-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#7A0C2E] flex-shrink-0 mt-0.5" />
                <span>4/6 karonwi street,modina road,egan,igando</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#7A0C2E] flex-shrink-0" />
                <span>+2348023235270</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#7A0C2E] flex-shrink-0" />
                <a href="mailto:Wolcrestschools@gmail.com" className="hover:underline hover:text-white font-semibold">Wolcrestschools@gmail.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Copy bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400 font-sans">
          <span>&copy; {new Date().getFullYear()} Wolcrest Schools corporate registry. All Rights Reserved.</span>
          <span>Designed with high scholarship metrics. "Where the Future is Assured"</span>
        </div>
      </footer>

    </div>
  );
}
