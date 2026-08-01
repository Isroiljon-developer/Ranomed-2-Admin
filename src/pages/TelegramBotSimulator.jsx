import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Clock, 
  User, 
  Calendar,
  CheckCircle,
  Building2,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import { initialBranches, initialDoctors } from '../data/initialData';

const TelegramBotSimulator = () => {
  const [branches] = useLocalStorage('branches', initialBranches);
  const [doctors] = useLocalStorage('doctors', initialDoctors);
  const [queues, setQueues] = useLocalStorage('telegramQueues', []);
  
  const [step, setStep] = useState('start');
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: ''
  });
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [queueNumber, setQueueNumber] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const chatRef = useRef(null);

  const activeBranches = branches.filter(b => b.status === 'active' && b.showInBot);
  
  const getAvailableDoctors = (branch) => {
    if (!branch) return [];
    return doctors.filter(d => 
      d.branchId === branch.id && 
      d.status === 'active' && 
      d.showInBot &&
      (d.acceptQueue || d.allowQueue)
    );
  };

  const generateQueueNumber = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayQueues = queues.filter(q => q.date === today);
    const maxNumber = todayQueues.reduce((max, q) => Math.max(max, q.queueNumber || 0), 0);
    return maxNumber + 1;
  };

  // Auto scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (content) => {
    setMessages(prev => [...prev, { ...content, time: new Date() }]);
  };

  const handleStart = () => {
    setMessages([]);
    setStep('welcome');
    setTimeout(() => {
      addMessage({
        type: 'bot',
        text: 'Assalomu alaykum! 👋\nRanomed -2  botiga xush kelibsiz! 🏥',
      });
      setTimeout(() => {
        addMessage({
          type: 'bot',
          text: "Davom etish uchun ro'yxatdan o'ting:",
          buttons: [{ label: "📝 Ro'yxatdan o'tish", action: 'register' }]
        });
      }, 600);
    }, 400);
  };

  const handleRegister = () => {
    addMessage({ type: 'user', text: "📝 Ro'yxatdan o'tish" });
    setStep('register_name');
    setTimeout(() => {
      addMessage({ type: 'bot', text: "👤 Iltimos, to'liq ism-familiyangizni kiriting:" });
    }, 400);
  };

  const handleNameSubmit = (name) => {
    if (!name.trim()) return;
    addMessage({ type: 'user', text: name });
    setUserData(prev => ({ ...prev, name }));
    setStep('register_age');
    setTimeout(() => {
      addMessage({ type: 'bot', text: '📅 Yoshingizni kiriting:' });
    }, 400);
  };

  const handleAgeSubmit = (age) => {
    if (!age.trim() || isNaN(age)) return;
    addMessage({ type: 'user', text: age + ' yosh' });
    setUserData(prev => ({ ...prev, age }));
    setStep('register_gender');
    setTimeout(() => {
      addMessage({
        type: 'bot',
        text: '👫 Jinsingizni tanlang:',
        buttons: [
          { label: '👨 Erkak', action: 'male' },
          { label: '👩 Ayol', action: 'female' }
        ]
      });
    }, 400);
  };

  const handleGenderSelect = (gender) => {
    addMessage({ type: 'user', text: gender === 'male' ? '👨 Erkak' : '👩 Ayol' });
    setUserData(prev => ({ ...prev, gender }));
    setStep('register_phone');
    setTimeout(() => {
      addMessage({ type: 'bot', text: '📱 Telefon raqamingizni kiriting:\n(Masalan: 998901234567)' });
    }, 400);
  };

  const handlePhoneSubmit = (phone) => {
    if (!phone.trim()) return;
    addMessage({ type: 'user', text: '+' + phone });
    setUserData(prev => ({ ...prev, phone }));
    setStep('registered');
    setTimeout(() => {
      addMessage({
        type: 'bot',
        text: "✅ Tabriklaymiz!\n\nSiz muvaffaqiyatli ro'yxatdan o'tdingiz!",
      });
      setTimeout(() => {
        addMessage({
          type: 'bot',
          text: '🏥 Endi filialni tanlang:',
          branchCards: activeBranches
        });
        setStep('select_branch');
      }, 600);
    }, 400);
  };

  const handleBranchSelect = (branchId) => {
    const branch = branches.find(b => b.id === parseInt(branchId));
    if (!branch) return;
    
    setSelectedBranch(branch);
    addMessage({ type: 'user', text: '🏥 ' + branch.name });
    setStep('branch_info');
    
    setTimeout(() => {
      addMessage({
        type: 'bot',
        branchInfo: branch
      });
      
      setTimeout(() => {
        const availableDoctors = getAvailableDoctors(branch);
        
        if (availableDoctors.length === 0) {
          addMessage({
            type: 'bot',
            text: '❌ Hozirda bu filialda shifokorlar mavjud emas.',
            buttons: [{ label: '⬅️ Orqaga', action: 'back_to_branches' }]
          });
        } else {
          addMessage({
            type: 'bot',
            text: '👨‍⚕️ Shifokorni tanlang:',
            doctorCards: availableDoctors
          });
          setStep('select_doctor');
        }
      }, 600);
    }, 400);
  };

  const handleDoctorSelect = (doctorId) => {
    const doctor = doctors.find(d => d.id === parseInt(doctorId));
    if (!doctor) return;
    
    setSelectedDoctor(doctor);
    addMessage({ type: 'user', text: '👨‍⚕️ ' + doctor.name });
    
    setTimeout(() => {
      addMessage({
        type: 'bot',
        doctorInfo: doctor
      });
      setTimeout(() => {
        addMessage({
          type: 'bot',
          text: '📋 Navbatga yozilasizmi?',
          buttons: [
            { label: '✅ Ha, yozilaman', action: 'confirm_queue' },
            { label: '⬅️ Orqaga', action: 'back_to_doctors' }
          ]
        });
        setStep('confirm_queue');
      }, 500);
    }, 400);
  };

  const handleConfirmQueue = () => {
    addMessage({ type: 'user', text: '✅ Ha, yozilaman' });
    
    const newQueueNumber = generateQueueNumber();
    setQueueNumber(newQueueNumber);
    
    const newQueue = {
      id: Date.now(),
      queueNumber: newQueueNumber,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      patient: { ...userData },
      branchId: selectedBranch.id,
      branchName: selectedBranch.name,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      status: 'waiting',
      createdAt: new Date().toISOString()
    };
    
    setQueues(prev => [...prev, newQueue]);
    setStep('queue_success');
    
    setTimeout(() => {
      addMessage({
        type: 'bot',
        queueSuccess: {
          queueNumber: newQueueNumber,
          doctor: selectedDoctor,
          branch: selectedBranch
        }
      });
      setTimeout(() => {
        addMessage({
          type: 'bot',
          text: 'Yana biror narsa kerakmi?',
          buttons: [
            { label: '🔄 Yangi navbat', action: 'new_queue' },
            { label: '🏠 Bosh menu', action: 'main_menu' }
          ]
        });
      }, 600);
    }, 400);
  };

  const handleBackToBranches = () => {
    addMessage({ type: 'user', text: '⬅️ Orqaga' });
    setSelectedBranch(null);
    setSelectedDoctor(null);
    setTimeout(() => {
      addMessage({
        type: 'bot',
        text: '🏥 Filialni tanlang:',
        branchCards: activeBranches
      });
      setStep('select_branch');
    }, 400);
  };

  const handleBackToDoctors = () => {
    addMessage({ type: 'user', text: '⬅️ Orqaga' });
    setSelectedDoctor(null);
    const availableDoctors = getAvailableDoctors(selectedBranch);
    setTimeout(() => {
      addMessage({
        type: 'bot',
        text: '👨‍⚕️ Shifokorni tanlang:',
        doctorCards: availableDoctors
      });
      setStep('select_doctor');
    }, 400);
  };

  const handleNewQueue = () => {
    addMessage({ type: 'user', text: '🔄 Yangi navbat' });
    setSelectedBranch(null);
    setSelectedDoctor(null);
    setQueueNumber(null);
    setTimeout(() => {
      addMessage({
        type: 'bot',
        text: '🏥 Filialni tanlang:',
        branchCards: activeBranches
      });
      setStep('select_branch');
    }, 400);
  };

  const handleMainMenu = () => {
    setMessages([]);
    setStep('start');
    setUserData({ name: '', age: '', gender: '', phone: '' });
    setSelectedBranch(null);
    setSelectedDoctor(null);
    setQueueNumber(null);
  };

  const handleAction = (action) => {
    if (action === 'register') handleRegister();
    else if (action === 'male' || action === 'female') handleGenderSelect(action);
    else if (action.startsWith('branch_')) handleBranchSelect(action.replace('branch_', ''));
    else if (action.startsWith('doctor_')) handleDoctorSelect(action.replace('doctor_', ''));
    else if (action === 'confirm_queue') handleConfirmQueue();
    else if (action === 'back_to_branches') handleBackToBranches();
    else if (action === 'back_to_doctors') handleBackToDoctors();
    else if (action === 'new_queue') handleNewQueue();
    else if (action === 'main_menu') handleMainMenu();
  };

  const handleInputSubmit = () => {
    if (!inputValue.trim()) return;
    
    if (step === 'register_name') handleNameSubmit(inputValue);
    else if (step === 'register_age') handleAgeSubmit(inputValue);
    else if (step === 'register_phone') handlePhoneSubmit(inputValue);
    
    setInputValue('');
  };

  // Render message content
  const renderMessage = (msg, idx) => {
    if (msg.type === 'user') {
      return (
        <div key={idx} className="flex justify-end mb-3">
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-br-sm max-w-[80%] shadow-sm">
            <p className="text-sm">{msg.text}</p>
          </div>
        </div>
      );
    }

    return (
      <div key={idx} className="flex justify-start mb-3">
        <div className="max-w-[85%] space-y-2">
          {/* Text message */}
          {msg.text && (
            <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
              <p className="text-sm whitespace-pre-line">{msg.text}</p>
            </div>
          )}

          {/* Branch Cards */}
          {msg.branchCards && (
            <div className="space-y-2">
              {msg.branchCards.map(branch => (
                <button
                  key={branch.id}
                  onClick={() => handleAction('branch_' + branch.id)}
                  className="w-full bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-all shadow-sm hover:shadow-md"
                >
                  <div className="h-28 bg-muted overflow-hidden">
                    <img 
                      src={branch.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'} 
                      alt={branch.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 text-left">
                    <h4 className="font-semibold text-foreground text-sm">{branch.name}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {branch.address}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {branch.workTime || branch.workingHours || '08:00-20:00'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Branch Info Card */}
          {msg.branchInfo && (
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="h-32 bg-muted overflow-hidden">
                <img 
                  src={msg.branchInfo.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'} 
                  alt={msg.branchInfo.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-foreground">{msg.branchInfo.name}</h4>
                <div className="mt-3 space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    {msg.branchInfo.address}
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4 text-accent" />
                    {msg.branchInfo.phone}
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4 text-warning" />
                    {msg.branchInfo.workTime || msg.branchInfo.workingHours || '08:00-20:00'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Doctor Cards */}
          {msg.doctorCards && (
            <div className="space-y-2">
              {msg.doctorCards.map(doctor => (
                <button
                  key={doctor.id}
                  onClick={() => handleAction('doctor_' + doctor.id)}
                  className="w-full bg-card border border-border rounded-xl p-3 hover:border-primary transition-all shadow-sm hover:shadow-md flex items-center gap-3"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    <img 
                      src={doctor.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200'} 
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-semibold text-foreground text-sm">{doctor.name}</h4>
                    <p className="text-xs text-primary">{doctor.specialty}</p>
                    <p className="text-xs text-muted-foreground">{doctor.experience} yil tajriba</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-primary" />
                </button>
              ))}
            </div>
          )}

          {/* Doctor Info Card */}
          {msg.doctorInfo && (
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
                  <img 
                    src={msg.doctorInfo.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200'} 
                    alt={msg.doctorInfo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{msg.doctorInfo.name}</h4>
                  <p className="text-sm text-primary">{msg.doctorInfo.specialty}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  {Array.isArray(msg.doctorInfo.workDays) ? msg.doctorInfo.workDays.join(', ') : msg.doctorInfo.workDays}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 text-accent" />
                  {msg.doctorInfo.workTime || msg.doctorInfo.workHours}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Stethoscope className="w-4 h-4 text-warning" />
                  {msg.doctorInfo.experience} yil tajriba
                </p>
              </div>
            </div>
          )}

          {/* Queue Success Card */}
          {msg.queueSuccess && (
            <div className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground rounded-xl p-4 shadow-lg">
              <div className="text-center mb-4">
                <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                <h4 className="font-bold text-lg">Navbat tasdiqlandi!</h4>
              </div>
              <div className="bg-white/20 rounded-lg p-4 text-center mb-4">
                <p className="text-sm opacity-80">Navbat raqamingiz</p>
                <p className="text-5xl font-bold">{msg.queueSuccess.queueNumber}</p>
              </div>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  {msg.queueSuccess.doctor.name}
                </p>
                <p className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {msg.queueSuccess.branch.name}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {msg.queueSuccess.branch.address}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {msg.queueSuccess.branch.phone}
                </p>
              </div>
            </div>
          )}

          {/* Buttons */}
          {msg.buttons && (
            <div className="flex flex-wrap gap-2">
              {msg.buttons.map((btn, btnIdx) => (
                <button
                  key={btnIdx}
                  onClick={() => handleAction(btn.action)}
                  className="bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors shadow-sm"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Phone Frame */}
        <div className="bg-foreground rounded-[3rem] p-3 shadow-2xl">
          <div className="bg-background rounded-[2.5rem] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Stethoscope className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Ranomed -2 </h3>
                <p className="text-xs text-white/70 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  online
                </p>
              </div>
            </div>

            {/* Chat Area */}
            <div 
              ref={chatRef}
              className="h-[480px] bg-muted/30 overflow-y-auto p-4"
            >
              {step === 'start' && (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Stethoscope className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl text-foreground mb-2">Ranomed -2  Bot</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Klinikaga online navbat olish uchun boshlang
                  </p>
                  <button
                    onClick={handleStart}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
                  >
                    /start
                  </button>
                </div>
              )}

              {messages.map((msg, idx) => renderMessage(msg, idx))}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-card border-t border-border">
              {(step === 'register_name' || step === 'register_age' || step === 'register_phone') ? (
                <div className="flex gap-2">
                  <input
                    type={step === 'register_age' || step === 'register_phone' ? 'tel' : 'text'}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
                    placeholder={
                      step === 'register_name' ? 'Ism-familiyangiz...' :
                      step === 'register_age' ? 'Yoshingiz...' :
                      '998901234567'
                    }
                    className="flex-1 px-4 py-3 rounded-full border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                    autoFocus
                  />
                  <button
                    onClick={handleInputSubmit}
                    className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="text-center text-muted-foreground text-sm py-2">
                  {step === 'start' ? "Boshlash uchun /start tugmasini bosing" : "Yuqoridagi variantlardan birini tanlang"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reset Button */}
        {step !== 'start' && (
          <button
            onClick={handleMainMenu}
            className="mt-4 w-full py-3 bg-destructive/10 text-destructive rounded-xl font-medium hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Qaytadan boshlash
          </button>
        )}
      </div>
    </div>
  );
};

export default TelegramBotSimulator;
