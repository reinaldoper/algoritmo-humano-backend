por que esse erro:
The datasource property url is no longer supported in schema files. Move connection URLs for Migrate to prisma.config.ts and pass either adapter for a direct database connection or accelerateUrl for Accelerate to the PrismaClient constructor. See https://pris.ly/d/config-datasource and https://pris.ly/d/prisma7-client-configPrisma
O ChatGPT disse:

Esse erro acontece porque agora, nas versões mais recentes do Prisma (7.x), não é mais permitido colocar a URL do banco diretamente dentro do schema.prisma.

👉 Antes era assim (e isso agora dá erro ❌):

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}


Agora precisamos seguir um novo formato:
➡ A URL deve sair do schema.prisma
➡ E ir para um arquivo chamado prisma.config.ts

✅ PASSO A PASSO PARA CORRIGIR
🟦 1. Ajustar o schema.prisma

Dentro dele, troque a datasource para:

datasource db {
  provider = "postgresql"
}


👉 Repare que não tem mais URL.

🟦 2. Criar o arquivo prisma.config.ts na raiz do projeto

Crie um arquivo:

/backend/prisma.config.ts


E coloque:

import { defineConfig } from '@prisma/client';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!, // <-- vem do .env
  },
});


👉 Esse arquivo substitui o uso da URL no schema.prisma.

----------------

por que este erro?
nest g resource auth
Comando 'nest' não encontrado, você quis dizer:
  comando 'newt' do snap newt (0.0.1)
  comando 'nes' do deb fceux (2.5.0+dfsg1-1)
  comando 'nes' do deb mednafen (1.29.0+dfsg-1)
  comando 'nes' do deb nestopia (1.51.1-1)
  comando 'net' do deb samba-common-bin (2:4.15.13+dfsg-0ubuntu1.10)
  comando 'test' do deb coreutils (8.32-4.1ubuntu1.2)
  comando 'next' do deb mailutils-mh (1:3.14-1)
  comando 'next' do deb mmh (0.4-4)
  comando 'next' do deb nmh (1.7.1-11)
  comando 'nast' do deb nast (0.2.0-9)
  comando 'jest' do deb jest (27.5.1~ds+~cs69.51.22-2)
  comando 'neat' do deb neat (2.3.2-2)
Veja 'snap info <snapname>' para versões adicionais.
O ChatGPT disse:

Esse erro aconteceu porque o comando nest não está instalado globalmente no seu sistema.
Ou seja, o Nest CLI não foi instalado, por isso o terminal não reconhece nest.

✅ Para resolver:

Execute:

npm i -g @nestjs/cli


Isso instala o Nest CLI globalmente.

------------------
por que esse erro na importação do prismaClient?
Module '"@prisma/client"' has no exported member 'PrismaClient'.

2 import { PrismaClient } from '@prisma/client';
           ~~~~~~~~~~~~

[04:11:57] Found 1 error. Watching for file changes.
O ChatGPT disse:

Esse erro acontece por causa da mudança recente do Prisma (versão 7.x).
Agora o PrismaClient não é mais importado direto de @prisma/client, o import mudou.

❌ ANTES (não funciona mais)
import { PrismaClient } from '@prisma/client';

✅ AGORA (correto)

Você deve importar assim:

import { PrismaClient } from '@prisma/client/runtime/library';

----------------
pq esse erro?
[Nest] 130216  - 09/12/2025, 12:32:32   ERROR [ExceptionsHandler] Error: Unknown authentication strategy "jwt"
    at attempt (/home/reinaldo/algoritmo-humano-backend/node_modules/passport/lib/middleware/authenticate.js:193:39)
    at authenticate (/home/reinaldo/algoritmo-humano-backend/node_modules/passport/lib/middleware/authenticate.js:379:7)
    at /home/reinaldo/algoritmo-humano-backend/node_modules/@nestjs/passport/dist/auth.guard.js:88:3
    at new Promise (<anonymous>)
    at /home/reinaldo/algoritmo-humano-backend/node_modules/@nestjs/passport/dist/auth.guard.js:80:83
    at JwtAuthGuard.canActivate (/home/reinaldo/algoritmo-humano-backend/node_modules/@nestjs/passport/dist/auth.guard.js:44:32)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
O ChatGPT disse:

Esse erro:

Unknown authentication strategy "jwt"


significa literalmente que o Nest não conseguiu registrar a sua JwtStrategy.

👉 Ou seja, a Strategy existe, seu código está correto, MAS ela não está sendo carregada no módulo.

📌 A SUA STRATEGY PRECISA ESTAR NO AUTH MODULE
Abra o auth.module.ts e confirme que está assim:
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // <-- MUITO IMPORTANTE!!!
  exports: [AuthService],
})
export class AuthModule {}

🔥 QUANDO NÃO REGISTRA A STRATEGY ACONTECE ISSO

👉 Você criou sua Strategy
mas o Nest nunca a instanciou

➡ Isso significa que o Passport não sabe que ela existe
➡ Logo:

❌ Guard 'jwt' não encontra a strategy
❌ Requisição cai no erro
❌ Nenhuma autenticação funciona

🧠 Entendendo o que o Nest faz por trás

Quando você coloca:

providers: [AuthService, JwtStrategy]


O Nest:

✔ instancia sua Strategy
✔ registra ela com Passport usando o nome 'jwt'
✔ AuthGuard('jwt') agora passa a conhecer a estratégia

Se isso não for registrado:

🔥 Passport tenta encontrar um strategy chamado "jwt"
🔥 Mas ele não existe
🔥 Lança o erro que você viu

❗ Outro erro comum

👉 Verifique se sua strategy está realmente no caminho correto:

Se seu arquivo estiver em:

src/auth/jwt.strategy.ts


Importe assim:

import { JwtStrategy } from './jwt.strategy';


Se estiver em:

src/auth/strategy/jwt.strategy.ts


Importe assim:

import { JwtStrategy } from './strategy/jwt.strategy';


Se importar com caminho errado → dá exatamente esse mesmo erro

🎯 Checklist final

Se todos estes estiverem certos, funciona:

✔ JwtModule importado no AuthModule
✔ JwtStrategy registrado no providers
✔ UsersModule exportando UsersService
✔ UsersService disponível para AuthService
✔ JwtAuthGuard importado no controller corretamente

--------------

monte isso em um markdown:
🔑 Endpoints
Auth
POST /auth/register

Cria novo usuário

POST /auth/login

Retorna:

Mensagem de sucesso

Cookie com token JWT

Token no body

POST /auth/logout

Remove o cookie autenticador

Users (necessita autenticação)
GET /users/me

Retorna dados do usuário autenticado

PUT /users/me

Atualiza dados

DELETE /users/me

Deleta a conta

Courses
POST /courses

Cria curso vinculado ao usuário logado

PATCH /courses

Atualiza informações de um curso

PATCH /courses/:id/status

Atualiza status (ativo ou inativo)

DELETE /courses/:id

Remove o curso

GET /courses/me

Lista cursos criados pelo usuário autenticado

GET /courses/published

Lista cursos públicos

GET /courses

Lista todos os cursos (autenticado)
O ChatGPT disse:

Aqui está seu conteúdo formatado em Markdown organizado e legível:

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

---------------------
me ajude a resolver isso: A propriedade 'mockResolvedValue' não existe no tipo '<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<DefaultArgs>>) => Prisma__UserClient<GetFindResult<$UserPayload<DefaultArgs>, T, PrismaClientOptions> | null, null, DefaultArgs, PrismaClientOptions>'.ts(2339)
Esse erro acontece porque você está tentando usar mockResolvedValue diretamente em um método real do Prisma, e não em um mock. O TypeScript está certo: o método real prisma.user.findUnique não é um mock, então ele não tem mockResolvedValue.

A solução é simples: garantir que o PrismaService seja mockado corretamente, e que os métodos (findUnique, create, etc.) sejam funções mockadas do Jest.

Vamos resolver isso de forma limpa e definitiva.

✅ ✅ Causa do erro
Você provavelmente tem algo assim no teste:

ts
prisma.user.findUnique.mockResolvedValue(...)
Mas prisma.user.findUnique não é um mock — é o método real do Prisma.

✅ ✅ Solução: mockar o PrismaService corretamente
Você precisa substituir o PrismaService por um objeto mockado:

ts
const prismaMock = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};
E registrar isso no módulo de testes:

ts
providers: [
  UsersService,
  { provide: PrismaService, useValue: prismaMock },
],
