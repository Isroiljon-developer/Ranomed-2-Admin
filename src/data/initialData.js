export const initialBranches = [];
export const initialDoctors = [];
export const initialServices = [];
export const initialDepartments = [];
export const initialWards = [];
export const initialUsers = [];
export const initialRoles = [
  { id: 1, name: 'admin', label: 'Administrator', baseRole: 'admin', permissions: ['all'] },
  { id: 2, name: 'director', label: 'Direktor', baseRole: 'director', permissions: ['view_reports', 'view_stats', 'manage_branches'] },
  { id: 3, name: 'reception', label: 'Qabulxona', baseRole: 'reception', permissions: ['manage_queue', 'view_patients', 'create_patients'] },
  { id: 4, name: 'cashier', label: 'Kassir', baseRole: 'cashier', permissions: ['manage_payments', 'view_payments'] },
  { id: 5, name: 'doctor', label: 'Shifokor', baseRole: 'doctor', permissions: ['view_patients', 'manage_appointments', 'create_records'] },
  { id: 6, name: 'nurse', label: 'Hamshira', baseRole: 'nurse', permissions: ['view_patients', 'update_vitals'] },
  { id: 7, name: 'lab', label: 'Laborant', baseRole: 'lab', permissions: ['manage_tests', 'view_tests'] },
];
export const initialAuditLogs = [];
export const initialNotifications = [];
export const initialTelegramQueues = [];
export const initialBotSettings = {
  welcomeText: 'Assalomu alaykum! Ranomed -2  botiga xush kelibsiz.',
  paymentText: '',
  queueConfirmText: '',
  workingHoursText: '',
};
export const initialSettings = {
  clinicName: 'Ranomed -2 ',
  logo: '',
  primaryColor: '#0066CC',
  language: 'uz',
  timezone: 'Asia/Tashkent',
  currency: 'UZS',
};
