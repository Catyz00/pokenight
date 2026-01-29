const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Digite a senha: ', (password) => {
  const hash = crypto.createHash('sha1').update(password).digest('hex');
  console.log('\n=== Resultado ===');
  console.log('Senha digitada:', password);
  console.log('Hash SHA1:', hash);
  console.log('\nHash no banco (Catyz): 0b94fdf8dfa620dd1f2b0147e94ad71f9697ac25');
  console.log('Hashes coincidem?', hash === '0b94fdf8dfa620dd1f2b0147e94ad71f9697ac25');
  rl.close();
});
