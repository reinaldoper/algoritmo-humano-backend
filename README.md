# Projeto Algoritmo Humano — Backend (NestJS + Prisma + JWT)
 
A API contempla autenticação, gestão de usuários e gestão de cursos, utilizando boas práticas REST e documentação via Swagger.

---

## Tecnologias Utilizadas

### Backend
- Node.js (>= 20)
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Bcrypt
- Swagger
- Helmet

### Infraestrutura
- Docker Compose

---

## Funcionalidades Atendidas

### Autenticação
- Login com JWT via cookie HttpOnly  
- Logout  
- Registro  
- Acesso restrito a rotas privadas  

### Usuários
- Cadastro de usuários
- Retorno dos próprios dados
- Atualização de informações pessoais
- Remoção da conta

### 📘 Cursos
Usuário autenticado pode:
- Criar curso
- Atualizar curso
- Alterar status (ativo / inativo)
- Listar seus cursos
- Listar cursos públicos
- Excluir curso

Cada curso é associado ao usuário criador.

---

## Pré-requisitos

Antes de iniciar a aplicação, tenha instalado:

✔ Node JS (>=20)  
✔ Docker  

---

## Como Rodar a Aplicação

### 1. Clonar o repositório
```bash
git clone git@github.com:reinaldoper/algoritmo-humano-backend.git
cd algoritmo-humano-backend
```

### 2. Instalar as dependências:
```bash
npm install

```

### 3. Subir o banco de dados com Docker
```bash
docker compose up -d
```

### 4. Criar o arquivo .env
```
DATABASE_URL="postgresql://reinaldo:algoritmohumano@localhost:5432/algoritmo_humano?schema=public"
JWT_SECRET="chave_secreta"
PORT=3001
POSTGRES_USER=reinaldo
POSTGRES_PASSWORD=algoritmohumano
POSTGRES_DB=algoritmo_humano

```


### 5. Rodar as migrações do Prisma
```bash
npx prisma migrate dev
```

### 6. Iniciar o servidor
```bash
npm run start:dev
```

### 7. Fluxo de Autenticação

- Após login, um cookie será retornado:
```bash
access_token
```


### 8. Configuração:

- httpOnly
- secure
- sameSite=none
- Esse token é automaticamente enviado nas próximas requisições privadas.

# 🔑 Endpoints

---

## 🔐 Auth

### ➤ POST `/auth/register`
✔ Cria novo usuário

---

### ➤ POST `/auth/login`
✔ Retorna:
- Mensagem de sucesso  
- Cookie com token JWT  
- Token no body  

---

### ➤ POST `/auth/logout`
✔ Remove o cookie autenticador  

---

## 👤 Users *(necessita autenticação)*

### ➤ GET `/users/me`
✔ Retorna dados do usuário autenticado  

---

### ➤ PUT `/users/me`
✔ Atualiza dados  

---

### ➤ DELETE `/users/me`
✔ Deleta a conta  

---

## 📘 Courses

### ➤ POST `/courses`
✔ Cria curso vinculado ao usuário logado  

---

### ➤ PATCH `/courses`
✔ Atualiza informações de um curso  

---

### ➤ PATCH `/courses/:id/status`
✔ Atualiza status (ativo ou inativo)  

---

### ➤ DELETE `/courses/:id`
✔ Remove o curso  

---

### ➤ GET `/courses/me`
✔ Lista cursos criados pelo usuário autenticado  

---

### ➤ GET `/courses/published`
✔ Lista cursos públicos  

---

### ➤ GET `/courses`
✔ Lista todos os cursos (requer autenticação)  

---

### 9. Documentação Swagger

- Acesse a documentação em:

```bash
http://localhost:3001/api/docs
```


- Conteúdo disponível:
- rotas organizadas
- corpo de requisições
- exemplos de retorno
- status codes
- modelos e DTOs

---

### 10. A aplicação estara rodando:
```bash
http://localhost:3001/api
```
