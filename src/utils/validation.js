export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
};

export const validateCPF = (cpf) => {
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.length === 11;
};

export const validateCNPJ = (cnpj) => {
  const cleaned = cnpj.replace(/\D/g, '');
  return cleaned.length === 14;
};

export const validatePassword = (password) => {
  if (password.length < 6) return { valid: false, message: 'Senha deve ter no mínimo 6 caracteres' };
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Senha deve conter pelo menos uma letra maiúscula' };
  if (!/[0-9]/.test(password)) return { valid: false, message: 'Senha deve conter pelo menos um número' };
  return { valid: true };
};

export const validateRequired = (value, fieldName = 'Campo') => {
  if (!value || value.trim().length === 0) {
    return { valid: false, message: `${fieldName} é obrigatório` };
  }
  return { valid: true };
};

export const validateNumber = (value, min = 0, max = Infinity) => {
  const num = parseFloat(value);
  if (isNaN(num)) return { valid: false, message: 'Valor deve ser um número' };
  if (num < min) return { valid: false, message: `Valor deve ser maior que ${min}` };
  if (num > max) return { valid: false, message: `Valor deve ser menor que ${max}` };
  return { valid: true };
};

export const validateDate = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return { valid: false, message: 'Data inválida' };
  return { valid: true };
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR');
};
