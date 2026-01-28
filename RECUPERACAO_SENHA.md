# Configuração de Recuperação de Senha e Registro

## ✅ Funcionalidades Implementadas

### 1. **Registro de Conta** (/auth/register)
- Criação de conta + personagem
- Integração com banco de dados MyAAC
- Validações completas
- Email de confirmação

### 2. **Recuperação de Senha** (/auth/recuperar-senha)
- Solicitação por email
- Email com link seguro
- Redirecionamento automático para Next.js

### 3. **Nova Senha** (/auth/nova-senha)
- Interface moderna para redefinir senha
- Validação de código
- Atualização no banco de dados

## 📋 Fluxo Completo

1. **Usuário esquece a senha** → Acessa `/auth/recuperar-senha`
2. **Preenche email cadastrado** → Sistema envia email
3. **Clica no link do email** → Redireciona para `localhost:3000/auth/nova-senha?code=XXX&email_rcv=YYY`
4. **Define nova senha** → Senha atualizada no banco
5. **Redireciona para login** → Usuário pode fazer login

## 🔧 Configuração

### Variável de ambiente SMTP_PASS
```powershell
[Environment]::SetEnvironmentVariable('SMTP_PASS','SUA_APP_PASSWORD','Machine')
```

### Backend URL (.env.local)
```
BACKEND_URL=http://localhost
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### config.local.php (C:\xampp\htdocs)
```php
// URL base (para links em emails)
$config['server_url'] = 'http://localhost';
$config['home_url'] = 'http://localhost';

// SMTP
$config['smtp_enabled'] = true;
$config['smtp_host'] = 'smtp.gmail.com';
$config['smtp_port'] = 587;
$config['smtp_user'] = 'pokenightguiis7@gmail.com';
$config['smtp_pass'] = getenv('SMTP_PASS') ?: '';
$config['smtp_secure'] = 'tls';

// reCAPTCHA
$config['recaptcha_enabled'] = true;
$config['recaptcha_site_key'] = '6Lc9O1csAAAAAIl8H5nU8Dz6MY6dz578XUC6-7l2';
$config['recaptcha_secret_key'] = '6Lc9O1csAAAAAP3b1sJz3DBvgvDAXhKk0cpTiwLk';
```

### Redirecionamento automático
O arquivo `C:\xampp\htdocs\index.php` foi modificado para redirecionar automaticamente links de recuperação de senha para o Next.js.

**Backup criado em:** `C:\xampp\htdocs\index_backup.php`

## 🧪 Como Testar

### 1. Registro
```
http://localhost:3000/auth/register
```
- Preencha todos os campos
- Verifique se a conta foi criada em: http://localhost/phpmyadmin

### 2. Recuperação de Senha
```
http://localhost:3000/auth/recuperar-senha
```
- Use o email cadastrado na conta
- Verifique sua caixa de entrada (e spam)
- Clique no link → Deve redirecionar para `/auth/nova-senha`

### 3. Nova Senha
- O link do email deve abrir: `http://localhost:3000/auth/nova-senha?code=XXX&email_rcv=YYY`
- Digite nova senha (mínimo 6 caracteres)
- Confirme a senha
- Clique em "Redefinir Senha"
- Deve redirecionar para `/auth/login`

## 🐛 Troubleshooting

### Link redireciona para site errado
- Verifique `server_url` no config.local.php
- Reinicie o Apache

### Email não chega
- Verifique SMTP_PASS: `[Environment]::GetEnvironmentVariable('SMTP_PASS','Machine')`
- Teste: http://localhost/test_smtp_direct.php
- Verifique spam

### Conta não existe
- Verifique email cadastrado: http://localhost/update_email.php
- Use o MESMO email da conta

### Código inválido/expirado
- Códigos expiram após algum tempo
- Solicite nova recuperação de senha

## 🔒 Segurança

⚠️ **IMPORTANTE**: Nunca comite no Git:
- `config.local.php`
- `.env.local`
- Senhas ou keys

Arquivos já protegidos no `.gitignore`:
```
config.local.php
.env*
```

## 📝 Logs e Debug

- Apache error: `C:\xampp\apache\logs\error.log`
- PHP error: `C:\xampp\php\logs\php_error_log`
- MyAAC mailer: `C:\xampp\htdocs\system\logs\mailer-error.log`
- Next.js: Console do terminal onde roda `pnpm dev`

Habilite debug SMTP: `$config['smtp_debug'] = true;`

## 🚀 Próximos Passos

- [ ] Testar fluxo completo
- [ ] Desabilitar debug em produção (`smtp_debug = false`)
- [ ] Configurar domínio real (se aplicável)
- [ ] Adicionar rate limiting para recuperação de senha
- [ ] Implementar login integrado

