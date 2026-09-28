# StudyEAD — Plataforma EAD para Cursinhos Preparatórios

Plataforma de ensino a distância projetada para cursinhos preparatórios com arquitetura moderna, escalável e preparada para expansão SaaS multi-tenant.

---

## 🚀 Arquitetura & Stack Tecnológica

- **Frontend (`apps/web`)**: [Nuxt 3](https://nuxt.com/) (Vue 3 + TypeScript), [Tailwind CSS](https://tailwindcss.com/), [PrimeVue 4](https://primevue.org/), [Pinia](https://pinia.vuejs.org/)
- **Backend (`apps/api`)**: [NestJS](https://nestjs.com/) (TypeScript), [Prisma ORM](https://www.prisma.io/), [Passport JWT](http://www.passportjs.org/), Helmet, Compression, Throttler
- **Banco de Dados**: PostgreSQL 16 (com isolamento lógico via `tenant_id` e 18+ modelos normalizados)
- **Cache & Sessões**: Redis 7
- **Validação Compartilhada**: [Zod](https://zod.dev/) compartilhado via monorepo (`packages/validators`)
- **Contratos e Tipos**: TypeScript interfaces e enums compartilhados (`packages/shared-types`)
- **Monorepo Engine**: [Turborepo](https://turbo.build/) + npm workspaces
- **Containerização**: Docker & Docker Compose

---

## 📁 Estrutura do Repositório

```
studyead/
├── apps/
│   ├── api/                    # Backend NestJS (REST API /api/v1)
│   └── web/                    # Frontend Nuxt 3 (SSR + SPA)
├── packages/
│   ├── shared-types/           # Enums, interfaces de domínio e DTOs
│   ├── validators/             # Schemas Zod compartilhados
│   └── config/                 # TSConfig e configurações base
├── docker/
│   ├── docker-compose.yml      # Stack completa em containers
│   └── docker-compose.dev.yml  # PostgreSQL e Redis para dev local
├── turbo.json                  # Pipeline de build e cache
└── package.json
```

---

## 🛠️ Como Executar Localmente

### 1. Pré-requisitos

- **Node.js**: v22 LTS (instalado e configurado)
- **npm**: v10+
- **Docker & Docker Compose** (ou instância local de PostgreSQL 16 e Redis 7)

### 2. Instalação das dependências

```bash
npm install
```

### 3. Configuração do Banco de Dados & Prisma

1. Inicie os containers de banco de dados e cache:
   ```bash
   docker compose -f docker/docker-compose.dev.yml up -d
   ```

2. Execute as migrations do Prisma:
   ```bash
   npm run db:migrate
   ```

3. Popule o banco com o tenant inicial e contas de teste:
   ```bash
   npm run db:seed
   ```

### 4. Executando em Modo de Desenvolvimento

Para rodar frontend e backend simultaneamente com hot-reload:

```bash
npm run dev
```

- **Frontend (Nuxt 3)**: [http://localhost:3000](http://localhost:3000)
- **Backend API (NestJS)**: [http://localhost:3001/api/v1](http://localhost:3001/api/v1)
- **Health Check**: [http://localhost:3001/api/v1/health](http://localhost:3001/api/v1/health)

---

## 👥 Credenciais Iniciais de Demonstração (Seed)

| Perfil | E-mail | Senha | Acesso |
|---|---|---|---|
| **Administradora** | `admin@cursinhoalpha.com.br` | `Admin@123456` | Painel Gestor (`/admin`) |
| **Aluno** | `aluno@cursinhoalpha.com.br` | `Aluno@123456` | Área do Aluno (`/student`) |

---

## 🛡️ Segurança Implementada Desde o Início

- Autenticação stateless via **JWT** com tempo de expiração configurável
- Hash de senhas com **bcrypt** (fator de custo 12)
- Autorização baseada em papéis (**RBAC**) com decorators `@Roles(...)` e `RolesGuard`
- Sanitização de cabeçalhos HTTP com **Helmet**
- Compressão gzip de payloads com **Compression**
- **Rate limiting** global e por rota com `@nestjs/throttler`
- Validação estrita de todos os corpos de requisição com **Zod Pipes**
- Respostas padronizadas com formato `{ success: true, statusCode: 200, data: ... }`
