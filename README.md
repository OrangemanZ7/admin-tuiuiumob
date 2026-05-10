# 🚗 TuiuiuMob — Plataforma de Mobilidade Urbana

> Monorepo full-stack para gerenciamento de corridas, motoristas, usuários e veículos.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Estrutura do Repositório](#estrutura-do-repositório)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Rodando o Projeto](#rodando-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Estrutura de Pastas](#estrutura-de-pastas)

---

## 📌 Sobre o Projeto

O **TuiuiuMob** é uma plataforma de mobilidade urbana composta por três aplicações front-end e uma API back-end, organizadas em um monorepo:

- **Admin** — Painel administrativo para gerenciar corridas, motoristas, usuários, veículos e solicitações.
- **User** — Interface voltada aos passageiros, com dashboard, finanças, relatórios e configurações.
- **Driver** — Aplicativo do motorista _(em desenvolvimento)_.
- **Server** — API REST com Node.js, TypeScript e MongoDB.

---

## 🛠 Tecnologias

### Front-end

| Tecnologia            | Versão |
| --------------------- | ------ |
| React                 | 19     |
| TypeScript            | ~6.0   |
| Vite                  | 8      |
| React Router DOM      | 7      |
| Tailwind CSS          | 3.4    |
| Axios                 | 1.x    |
| PWA (vite-plugin-pwa) | 1.x    |

### Back-end

| Tecnologia           | Descrição                         |
| -------------------- | --------------------------------- |
| Node.js + TypeScript | Servidor e lógica de negócio      |
| MongoDB              | Banco de dados                    |
| REST API             | Comunicação entre apps e servidor |

---

## 📁 Estrutura do Repositório

```
admin-tuiuiumob/
├── apps/
│   ├── admin/          # Painel administrativo (React + TS)
│   │   └── src/
│   │       ├── api/        # Chamadas à API (drivers, rides, users, vehicles)
│   │       ├── components/ # Header, Sidebar, Modal, Table, StatusBadge
│   │       └── pages/      # Dashboard, Drivers, Requests, Rides, Users, Vehicles
│   ├── user/           # App do usuário (React)
│   │   └── src/
│   │       ├── pages/      # Dashboard, Finance, Reports, Rides, Settings, Users
│   │       └── services/   # api.js
│   └── driver/         # App do motorista (em desenvolvimento)
├── server/             # API REST (Node.js + TypeScript + MongoDB)
│   └── src/
│       ├── controllers/    # driverController, rideController, userController...
│       ├── models/         # Driver, Ride, RideRequest, User, Vehicle
│       ├── routes/         # Rotas da API
│       └── db/             # Conexão com MongoDB
├── public/             # Favicon e ícones globais
├── package.json        # Scripts raiz do monorepo
└── vite.config.ts
```

---

## ✅ Pré-requisitos

Antes de começar, você vai precisar ter instalado:

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) (v9+)
- [MongoDB](https://www.mongodb.com/) (local ou Atlas)

---

## 📦 Instalação

Clone o repositório e instale as dependências raiz:

```bash
git clone https://github.com/OrangemanZ7/admin-tuiuiumob.git
cd admin-tuiuiumob
npm install
```

Instale também as dependências de cada sub-aplicação:

```bash
# Painel admin
cd apps/admin && npm install && cd ../..

# App do usuário
cd apps/user && npm install && cd ../..

# Servidor
cd server && npm install && cd ..
```

---

## ▶️ Rodando o Projeto

Os scripts estão disponíveis na raiz do monorepo:

```bash
# Iniciar o servidor back-end
npm run server

# Iniciar o painel administrativo
npm run admin

# Iniciar o app do usuário
npm run user

# Iniciar o app do motorista
npm run driver
```

> Configure as variáveis de ambiente do servidor (string de conexão do MongoDB, portas, etc.) em um arquivo `.env` dentro da pasta `server/`.

---

## ✨ Funcionalidades

### Painel Admin

- 📊 **Dashboard** — Visão geral da plataforma
- 👤 **Usuários** — Listagem e gerenciamento de passageiros
- 🚗 **Motoristas** — Cadastro e acompanhamento de motoristas
- 🛻 **Veículos** — Gestão da frota
- 🗺️ **Corridas** — Histórico e monitoramento de corridas
- 📋 **Solicitações** — Gestão de pedidos de corrida

### App do Usuário

- 🏠 Dashboard pessoal
- 💰 Finanças
- 📈 Relatórios
- 🚕 Histórico de corridas
- ⚙️ Configurações

### API (Server)

- Endpoints REST para: **Usuários**, **Motoristas**, **Veículos**, **Corridas** e **Solicitações de Corrida**
- Integração com MongoDB via Mongoose

---

## 📄 Licença

Este projeto é privado. Todos os direitos reservados.
