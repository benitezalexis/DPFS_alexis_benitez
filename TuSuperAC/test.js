const bcrypt = require('bcryptjs');
const password = '123456';
const hashed = bcrypt.hashSync(password, 10);
console.log('Nuevo hash bcrypt para "123456":', hashed);
