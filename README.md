# LinkedIn API

API Node.js com Express, Prisma e integração com Gemini para gerar conteúdos e consultar prompts salvos no banco.

## Stack

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- Docker

## Estrutura

- `src/` API principal
- `service/` serviços de IA e agendamento
- `prisma/` schema e migrations
- `generated/` client gerado pelo Prisma

## Pré-requisitos

- Node.js 20+
- Docker Desktop
- npm

## Variáveis de ambiente

Crie ou ajuste o arquivo `.env` com os valores necessários:

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/banco"
GEMINI_API_KEY="sua_chave_aqui"
PORT=5001
```

## Como subir rapidamente

Hoje, a forma mais rápida e estável de rodar o projeto é:

1. Subir apenas o banco com Docker
2. Rodar a API localmente

### 1. Subir o banco

```bash
docker compose up -d db
```

O Postgres ficará disponível na porta `5432`.

### 2. Rodar a API

```bash
npm install
npm start
```

A API sobe na porta definida em `PORT`. No momento, o projeto usa `tsx src/server.ts` no script `start`.

## Endpoint disponível

### Listar prompts

```http
GET /prompts
```

Exemplo:

```bash
curl http://localhost:5001/prompts
```

## Banco de dados

O modelo atual salvo no Prisma é:

- `Prompt`
  - `id`
  - `resultPrompt`

Se precisar gerar o client do Prisma manualmente:

```bash
npm run build
```

## Docker

O projeto possui estes arquivos Docker:

- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`

Neste momento, o fluxo mais seguro é usar o Docker para o banco e deixar a API rodando localmente.

Se você quiser rodar a API e o banco 100% via Docker, ainda vale ajustar os arquivos Docker para refletirem exatamente a forma atual como a aplicação inicia.

## Parar os containers

```bash
docker compose down
```

Para remover também o volume do Postgres:

```bash
docker compose down -v
```
