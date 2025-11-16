// Validações sincronizadas com o backend

export const vacaValidation = {
  numero: {
    required: true,
    minLength: 1,
    maxLength: 50,
    message: 'Número deve ter entre 1 e 50 caracteres'
  },
  nome: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Nome deve ter entre 2 e 100 caracteres'
  },
  raca: {
    required: true,
    enum: ['Holandesa', 'Jersey', 'Gir', 'Girolando', 'Pardo Suíço', 'Guzerá', 'Nelore', 'Brahman'],
    message: 'Raça inválida'
  },
  peso: {
    min: 0,
    max: 2000,
    message: 'Peso deve estar entre 0 e 2000 kg'
  }
};

export const userValidation = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'E-mail inválido'
  },
  nome: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Nome deve ter entre 2 e 100 caracteres'
  },
  password: {
    required: true,
    minLength: 6,
    maxLength: 100,
    message: 'Senha deve ter entre 6 e 100 caracteres'
  },
  telefone: {
    pattern: /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/,
    message: 'Telefone inválido. Use formato: (11) 99999-9999'
  }
};

export const producaoValidation = {
  quantidade: {
    required: true,
    min: 0,
    max: 100,
    message: 'Quantidade deve estar entre 0 e 100 litros'
  },
  data: {
    required: true,
    message: 'Data é obrigatória'
  }
};

// Função helper para validar
export const validateField = (value, rules) => {
  if (rules.required && (!value || value.toString().trim() === '')) {
    return rules.message || 'Campo obrigatório';
  }

  if (rules.minLength && value.length < rules.minLength) {
    return rules.message;
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return rules.message;
  }

  if (rules.min !== undefined && Number(value) < rules.min) {
    return rules.message;
  }

  if (rules.max !== undefined && Number(value) > rules.max) {
    return rules.message;
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return rules.message;
  }

  if (rules.enum && !rules.enum.includes(value)) {
    return rules.message;
  }

  return null;
};
