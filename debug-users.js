// Execute este código no console do navegador (F12) para verificar os usuários
console.log('=== USUÁRIOS CADASTRADOS ===');
const users = JSON.parse(localStorage.getItem('vacafacil_users') || '[]');
console.table(users.map(u => ({
  id: u.id,
  email: u.email,
  name: u.name,
  farmName: u.farmName,
  createdAt: u.createdAt
})));

console.log('Total de usuários:', users.length);