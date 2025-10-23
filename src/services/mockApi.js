const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEYS = {
  USERS: 'vacafacil_users'
};

const hashPassword = (password) => {
  return btoa(password + 'vacafacil_salt');
};

const verifyPassword = (password, hash) => {
  return hashPassword(password) === hash;
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

const initialUsers = [
  { 
    id: 1, 
    email: 'admin@vacafacil.com', 
    password: hashPassword('123456'), 
    type: 'produtor', 
    name: 'João Silva', 
    farmName: 'Fazenda São José',
    location: 'Pouso Alegre/MG',
    phone: '(35) 99999-9999'
  },
  { 
    id: 2, 
    email: 'maria@fazenda.com', 
    password: hashPassword('123456'), 
    type: 'produtor', 
    name: 'Maria Santos', 
    farmName: 'Fazenda Boa Vista',
    location: 'Varginha/MG',
    phone: '(35) 98888-8888'
  }
];

if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
  setStorageData(STORAGE_KEYS.USERS, initialUsers);
}

export const mockApi = {
  async login(email, password) {
    await delay(1000);
    const currentUsers = getStorageData(STORAGE_KEYS.USERS, initialUsers);
    const user = currentUsers.find(u => u.email === email);
    
    if (!user || !verifyPassword(password, user.password)) {
      throw new Error('E-mail ou senha incorretos');
    }
    
    return { 
      user: { ...user, password: undefined }, 
      token: `token-${user.id}-${Date.now()}` 
    };
  },

  async register(userData) {
    try {
      await delay(1000);
      const currentUsers = getStorageData(STORAGE_KEYS.USERS, initialUsers);
      
      if (currentUsers.find(u => u.email === userData.email)) {
        throw new Error('E-mail já cadastrado');
      }
      
      const newUser = { 
        id: Date.now(), 
        email: userData.email,
        password: hashPassword(userData.password),
        name: userData.name,
        farmName: userData.farmName,
        location: userData.location,
        phone: userData.phone,
        cpfCnpj: userData.cpfCnpj,
        type: 'produtor',
        createdAt: new Date().toISOString()
      };
      
      currentUsers.push(newUser);
      setStorageData(STORAGE_KEYS.USERS, currentUsers);
      
      return { 
        user: { ...newUser, password: undefined }, 
        token: `token-${newUser.id}-${Date.now()}` 
      };
    } catch (error) {
      throw error;
    }
  }
};