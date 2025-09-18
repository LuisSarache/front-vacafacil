const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Sistema de persistência
const STORAGE_KEYS = {
  USERS: 'lunysse_users',
  PATIENTS: 'lunysse_patients',
  APPOINTMENTS: 'lunysse_appointments',
  REQUESTS: 'lunysse_requests'
};

const getStorageData = (key, defaultData) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
  } catch {
    return defaultData;
  }
};

const setStorageData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Dados iniciais dos usuários
const initialUsers = [
  { id: 2, email: 'ana@test.com', password: '123456', type: 'psicologo', name: 'Dra. Ana Costa', specialty: 'Terapia Cognitivo-Comportamental', crp: 'CRP 01/23456' },
  { id: 3, email: 'carlos@test.com', password: '123456', type: 'psicologo', name: 'Dr. Carlos Mendes', specialty: 'Psicologia Infantil', crp: 'CRP 01/34567' },
  { id: 4, email: 'lucia@test.com', password: '123456', type: 'psicologo', name: 'Dra. Lucia Ferreira', specialty: 'Terapia Familiar', crp: 'CRP 01/45678' },
  { id: 5, email: 'maria@test.com', password: '123456', type: 'paciente', name: 'Maria Santos' }
];

// Dados iniciais dos pacientes
const initialPatients = [
  // Pacientes da Dra. Ana Costa (ID: 2)
  { id: 5, name: 'Fernanda Lima', email: 'fernanda.lima@email.com', phone: '(11) 99999-5555', birthDate: '1992-03-12', age: 32, status: 'Em tratamento', psychologistId: 2 },
  { id: 6, name: 'Lucas Pereira', email: 'lucas.pereira@email.com', phone: '(11) 99999-6666', birthDate: '1987-11-25', age: 37, status: 'Ativo', psychologistId: 2 },
  { id: 7, name: 'Camila Rodrigues', email: 'camila.rodrigues@email.com', phone: '(11) 99999-7777', birthDate: '1993-09-08', age: 31, status: 'Em tratamento', psychologistId: 2 },
  { id: 8, name: 'Diego Santos', email: 'diego.santos@email.com', phone: '(11) 99999-8888', birthDate: '1991-06-30', age: 33, status: 'Ativo', psychologistId: 2 },
  // Pacientes do Dr. Carlos Mendes (ID: 3)
  { id: 9, name: 'Isabella Martins', email: 'isabella.martins@email.com', phone: '(11) 99999-9999', birthDate: '1994-04-14', age: 30, status: 'Em tratamento', psychologistId: 3 },
  { id: 10, name: 'Gabriel Alves', email: 'gabriel.alves@email.com', phone: '(11) 99999-0000', birthDate: '1989-10-07', age: 35, status: 'Ativo', psychologistId: 3 },
  { id: 11, name: 'Sophia Ferreira', email: 'sophia.ferreira@email.com', phone: '(11) 88888-1111', birthDate: '1996-01-20', age: 28, status: 'Em tratamento', psychologistId: 3 },
  { id: 12, name: 'Mateus Barbosa', email: 'mateus.barbosa@email.com', phone: '(11) 88888-2222', birthDate: '1986-12-11', age: 38, status: 'Ativo', psychologistId: 3 },
  // Pacientes da Dra. Lucia Ferreira (ID: 4)
  { id: 13, name: 'Beatriz Souza', email: 'beatriz.souza@email.com', phone: '(11) 88888-3333', birthDate: '1990-08-05', age: 34, status: 'Em tratamento', psychologistId: 4 },
  { id: 14, name: 'Thiago Nascimento', email: 'thiago.nascimento@email.com', phone: '(11) 88888-4444', birthDate: '1984-05-28', age: 40, status: 'Ativo', psychologistId: 4 },
  { id: 15, name: 'Larissa Campos', email: 'larissa.campos@email.com', phone: '(11) 88888-5555', birthDate: '1997-02-16', age: 27, status: 'Em tratamento', psychologistId: 4 },
  { id: 16, name: 'André Moreira', email: 'andre.moreira@email.com', phone: '(11) 88888-6666', birthDate: '1983-11-09', age: 41, status: 'Ativo', psychologistId: 4 }
];

// Gerar datas futuras dinamicamente
const generateFutureDate = (daysFromNow) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

// Dados iniciais das solicitações
const initialRequests = [
  {
    id: 1,
    patientName: 'João Silva',
    patientEmail: 'joao.silva@email.com',
    patientPhone: '(11) 99999-1111',
    preferredPsychologist: 2, // Dra. Ana Costa
    description: 'Gostaria de ser seu paciente. Preciso de ajuda com ansiedade e estresse no trabalho. Tenho disponibilidade nas tardes.',
    urgency: 'media',
    preferredDates: ['2024-12-20', '2024-12-21'],
    preferredTimes: ['14:00', '15:00'],
    status: 'pendente',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    patientName: 'Ana Oliveira',
    patientEmail: 'ana.oliveira@email.com',
    patientPhone: '(11) 88888-2222',
    preferredPsychologist: 3, // Dr. Carlos Mendes
    description: 'Gostaria que você atendesse meu filho de 8 anos que está com dificuldades comportamentais na escola. Preciso de um especialista em psicologia infantil.',
    urgency: 'alta',
    preferredDates: ['2024-12-19'],
    preferredTimes: ['09:00', '10:00'],
    status: 'pendente',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

// Dados iniciais dos agendamentos
const initialAppointments = [
  
  // Sessões da Dra. Ana Costa (ID: 2)
  { 
    id: 8, 
    patientId: 5, 
    psychologistId: 2, 
    date: generateFutureDate(-2), 
    time: '14:00', 
    status: 'concluido',
    description: 'Terapia cognitivo-comportamental',
    duration: 50,
    notes: 'Sessão produtiva com técnicas de TCC.',
    fullReport: 'Paciente respondeu bem às intervenções.'
  },
  { 
    id: 9, 
    patientId: 6, 
    psychologistId: 2, 
    date: generateFutureDate(2), 
    time: '15:00', 
    status: 'agendado',
    description: 'Sessão de acompanhamento',
    duration: 50,
    notes: '',
    fullReport: ''
  },
  { 
    id: 10, 
    patientId: 7, 
    psychologistId: 2, 
    date: generateFutureDate(-8), 
    time: '11:00', 
    status: 'concluido',
    description: 'Sessão inicial',
    duration: 60,
    notes: 'Primeira consulta bem-sucedida.',
    fullReport: 'Estabelecimento de vínculo terapêutico.'
  },
  
  // Sessões do Dr. Carlos Mendes (ID: 3)
  { 
    id: 11, 
    patientId: 9, 
    psychologistId: 3, 
    date: generateFutureDate(-1), 
    time: '09:00', 
    status: 'concluido',
    description: 'Psicologia infantil - Ludoterapia',
    duration: 45,
    notes: 'Sessão de ludoterapia muito produtiva.',
    fullReport: 'Criança demonstrou boa interação.'
  },
  { 
    id: 12, 
    patientId: 10, 
    psychologistId: 3, 
    date: generateFutureDate(4), 
    time: '10:00', 
    status: 'agendado',
    description: 'Avaliação comportamental',
    duration: 50,
    notes: '',
    fullReport: ''
  },
  
  // Sessões da Dra. Lucia Ferreira (ID: 4)
  { 
    id: 13, 
    patientId: 13, 
    psychologistId: 4, 
    date: generateFutureDate(-6), 
    time: '16:00', 
    status: 'concluido',
    description: 'Terapia familiar',
    duration: 60,
    notes: 'Sessão familiar muito produtiva.',
    fullReport: 'Família demonstrou boa comunicação.'
  },
  { 
    id: 14, 
    patientId: 14, 
    psychologistId: 4, 
    date: generateFutureDate(1), 
    time: '14:00', 
    status: 'agendado',
    description: 'Terapia de casal',
    duration: 60,
    notes: '',
    fullReport: ''
  },
  
  // Sessões do paciente de teste Maria Santos (ID: 5)
  { 
    id: 17, 
    patientId: 5, 
    psychologistId: 2, 
    date: generateFutureDate(-7), 
    time: '14:00', 
    status: 'concluido',
    description: 'Sessão inicial - Avaliação psicológica',
    duration: 60,
    notes: 'Primeira consulta realizada com sucesso. Paciente demonstrou boa receptividade.',
    fullReport: 'Anamnese completa. Identificados sintomas de ansiedade leve.'
  },
  { 
    id: 18, 
    patientId: 5, 
    psychologistId: 2, 
    date: generateFutureDate(-14), 
    time: '15:00', 
    status: 'concluido',
    description: 'Terapia cognitivo-comportamental',
    duration: 50,
    notes: 'Trabalhamos técnicas de respiração e reestruturação cognitiva.',
    fullReport: 'Paciente respondeu bem às técnicas de TCC aplicadas.'
  },
  { 
    id: 19, 
    patientId: 5, 
    psychologistId: 2, 
    date: generateFutureDate(-21), 
    time: '14:00', 
    status: 'concluido',
    description: 'Sessão de acompanhamento',
    duration: 50,
    notes: 'Progresso significativo observado. Paciente relatou melhora na qualidade do sono.',
    fullReport: 'Evolução positiva. Redução dos sintomas ansiosos.'
  },
  
  // Sessões antigas para dados históricos
  { 
    id: 15, 
    patientId: 1, 
    psychologistId: 1, 
    date: generateFutureDate(-28), 
    time: '14:00', 
    status: 'concluido',
    description: 'Sessão de acompanhamento',
    duration: 50,
    notes: 'Progresso contínuo observado.',
    fullReport: 'Paciente mantendo estabilidade.'
  },
  { 
    id: 16, 
    patientId: 2, 
    psychologistId: 1, 
    date: generateFutureDate(-35), 
    time: '10:00', 
    status: 'concluido',
    description: 'Sessão inicial',
    duration: 60,
    notes: 'Primeira consulta.',
    fullReport: 'Anamnese completa realizada.'
  },

];

// Inicializar dados se não existirem
if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
  setStorageData(STORAGE_KEYS.USERS, initialUsers);
}
if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
  setStorageData(STORAGE_KEYS.PATIENTS, initialPatients);
}
if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
  setStorageData(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
}
if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
  setStorageData(STORAGE_KEYS.REQUESTS, initialRequests);
}

// Obter dados atuais
const users = getStorageData(STORAGE_KEYS.USERS, initialUsers);
const patients = getStorageData(STORAGE_KEYS.PATIENTS, initialPatients);
const appointments = getStorageData(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
const requests = getStorageData(STORAGE_KEYS.REQUESTS, initialRequests);

export const mockApi = {
  async login(email, password) {
    await delay(1000);
    const currentUsers = getStorageData(STORAGE_KEYS.USERS, initialUsers);
    const user = currentUsers.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Credenciais inválidas');
    return { user: { ...user, password: undefined }, token: 'mock-token' };
  },

  async register(userData) {
    await delay(1000);
    const currentUsers = getStorageData(STORAGE_KEYS.USERS, initialUsers);
    const newUser = { 
      id: Date.now(), 
      ...userData,
      ...(userData.type === 'psicologo' && {
        crm: userData.crm,
        specialty: userData.specialty,
        phone: userData.phone
      })
    };
    currentUsers.push(newUser);
    setStorageData(STORAGE_KEYS.USERS, currentUsers);
    return { user: { ...newUser, password: undefined }, token: 'mock-token' };
  },

  async getAppointments(userId, userType) {
    await delay(500);
    const currentAppointments = getStorageData(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
    return currentAppointments.filter(apt => 
      userType === 'psicologo' ? apt.psychologistId === userId : apt.patientId === userId
    );
  },

  async createAppointment(appointmentData) {
    await delay(1000);
    const currentAppointments = getStorageData(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
    const newAppointment = { id: Date.now(), ...appointmentData, status: 'agendado' };
    currentAppointments.push(newAppointment);
    setStorageData(STORAGE_KEYS.APPOINTMENTS, currentAppointments);
    return newAppointment;
  },

  async getPsychologists() {
    await delay(500);
    const currentUsers = getStorageData(STORAGE_KEYS.USERS, initialUsers);
    return currentUsers.filter(user => user.type === 'psicologo').map(psych => ({
      id: psych.id,
      name: psych.name,
      specialty: psych.specialty,
      crp: psych.crp
    }));
  },

  async getAvailableSlots(date, psychologistId) {
    await delay(500);
    const currentAppointments = getStorageData(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
    const allSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    const occupiedSlots = currentAppointments
      .filter(apt => apt.date === date && apt.psychologistId === psychologistId && apt.status === 'agendado')
      .map(apt => apt.time);
    
    return allSlots.filter(slot => !occupiedSlots.includes(slot));
  },

  async cancelAppointment(appointmentId) {
    await delay(500);
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      appointment.status = 'cancelado';
      return appointment;
    }
    throw new Error('Agendamento não encontrado');
  },

  async updateAppointment(appointmentId, updateData) {
    await delay(500);
    const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
    if (appointmentIndex !== -1) {
      appointments[appointmentIndex] = { ...appointments[appointmentIndex], ...updateData };
      return appointments[appointmentIndex];
    }
    throw new Error('Agendamento não encontrado');
  },

  async getPatients(psychologistId) {
    await delay(500);
    const currentPatients = getStorageData(STORAGE_KEYS.PATIENTS, initialPatients);
    const currentAppointments = getStorageData(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
    
    // Filtrar pacientes do psicólogo logado
    const psychologistPatients = currentPatients.filter(patient => patient.psychologistId === psychologistId);
    
    // Calcular total de sessões por paciente
    const patientSessions = {};
    currentAppointments.forEach(apt => {
      if (apt.psychologistId === psychologistId) {
        patientSessions[apt.patientId] = (patientSessions[apt.patientId] || 0) + 1;
      }
    });

    return psychologistPatients.map(patient => ({
      ...patient,
      totalSessions: patientSessions[patient.id] || 0
    }));
  },

  async addPatientNote(patientId, noteData) {
    await delay(500);
    return { id: Date.now(), ...noteData };
  },

  async updateSessionStatus(sessionId, status) {
    await delay(500);
    const sessionIndex = appointments.findIndex(apt => apt.id === sessionId);
    if (sessionIndex !== -1) {
      appointments[sessionIndex].status = status;
      return appointments[sessionIndex];
    }
    throw new Error('Sessão não encontrada');
  },

  async updateSessionNotes(sessionId, notes, fullReport) {
    await delay(500);
    const sessionIndex = appointments.findIndex(apt => apt.id === sessionId);
    if (sessionIndex !== -1) {
      appointments[sessionIndex].notes = notes;
      appointments[sessionIndex].fullReport = fullReport;
      return appointments[sessionIndex];
    }
    throw new Error('Sessão não encontrada');
  },

  async getSessionDetails(sessionId) {
    await delay(500);
    const currentAppointments = getStorageData(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
    const session = currentAppointments.find(apt => apt.id === sessionId);
    if (!session) throw new Error('Sessão não encontrada');
    return session;
  },

  async getReportsData(psychologistId) {
    await delay(500);
    const currentAppointments = getStorageData(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
    const currentPatients = getStorageData(STORAGE_KEYS.PATIENTS, initialPatients);
    
    const psychologistAppointments = currentAppointments.filter(apt => apt.psychologistId === psychologistId);
    const psychologistPatients = currentPatients.filter(patient => patient.psychologistId === psychologistId);
    
    // Calcular estatísticas
    const totalSessions = psychologistAppointments.length;
    const completedSessions = psychologistAppointments.filter(apt => apt.status === 'concluido').length;
    const canceledSessions = psychologistAppointments.filter(apt => apt.status === 'cancelado').length;
    const rescheduledSessions = psychologistAppointments.filter(apt => apt.status === 'reagendado').length;
    
    // Dados para gráfico de frequência (últimos 6 meses)
    const frequencyData = [];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    
    months.forEach((month, index) => {
      const monthSessions = Math.floor(Math.random() * 20) + 10; // Simular dados
      frequencyData.push({ month, sessions: monthSessions });
    });
    
    // Dados para gráfico de status
    const statusData = [
      { name: 'Concluídas', value: Math.round((completedSessions / totalSessions) * 100) || 0, color: '#26B0BF' },
      { name: 'Canceladas', value: Math.round((canceledSessions / totalSessions) * 100) || 0, color: '#ef4444' },
      { name: 'Reagendadas', value: Math.round((rescheduledSessions / totalSessions) * 100) || 0, color: '#f59e0b' }
    ];
    
    // Alertas de risco (simular baseado nos pacientes)
    const riskAlerts = psychologistPatients.slice(0, 3).map((patient, index) => ({
      id: patient.id,
      patient: patient.name,
      risk: index === 0 ? 'Alto' : 'Médio',
      reason: index === 0 ? 'Faltas consecutivas' : 'Cancelamentos frequentes',
      date: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
    
    return {
      stats: {
        activePatients: psychologistPatients.length,
        totalSessions,
        completedSessions,
        attendanceRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
        riskAlerts: riskAlerts.length
      },
      frequencyData,
      statusData,
      riskAlerts
    };
  },

  async getRequests(psychologistId) {
    await delay(500);
    const currentRequests = getStorageData(STORAGE_KEYS.REQUESTS, initialRequests);
    return currentRequests.filter(req => 
      !psychologistId || req.preferredPsychologist === psychologistId
    );
  },

  async updateRequestStatus(requestId, status, notes = '') {
    await delay(500);
    const currentRequests = getStorageData(STORAGE_KEYS.REQUESTS, initialRequests);
    const requestIndex = currentRequests.findIndex(req => req.id === requestId);
    
    if (requestIndex !== -1) {
      currentRequests[requestIndex] = {
        ...currentRequests[requestIndex],
        status,
        notes,
        updatedAt: new Date().toISOString()
      };
      setStorageData(STORAGE_KEYS.REQUESTS, currentRequests);
      return currentRequests[requestIndex];
    }
    throw new Error('Solicitação não encontrada');
  },

  async createRequest(requestData) {
    await delay(1000);
    const currentRequests = getStorageData(STORAGE_KEYS.REQUESTS, initialRequests);
    const newRequest = {
      id: Date.now(),
      ...requestData,
      status: 'pendente',
      createdAt: new Date().toISOString()
    };
    currentRequests.push(newRequest);
    setStorageData(STORAGE_KEYS.REQUESTS, currentRequests);
    return newRequest;
  }
};

// Exportar dados para uso em componentes se necessário
export { users, patients, appointments, requests };