# GitHub User Search

Uma aplicação moderna desenvolvida com **Next.js 15 + React 19** para pesquisar usuários do GitHub, visualizar seus detalhes, explorar seus repositórios e identificar seus principais projetos com base na quantidade de estrelas. O projeto também inclui uma estrutura robusta para testes, documentação de componentes e monitoramento analítico.

---

# Funcionalidades

## 🔍 Pesquisa de Usuários do GitHub

Pesquise usuários utilizando o nome de usuário do GitHub e visualize os resultados retornados pela API oficial.

## 👤 Visualização de Perfil

Acesse informações detalhadas dos usuários, incluindo:

- Nome
- Login
- Biografia
- Localização
- Seguidores
- Seguindo
- Quantidade de repositórios públicos

## 📦 Listagem de Repositórios

Visualize os repositórios públicos de cada usuário.

## ⭐ Repositório Principal

Identificação automática do repositório mais relevante do usuário com base na quantidade de estrelas.

## 🔄 Ordenação

Permite ordenar resultados e repositórios por:

- Quantidade de estrelas
- Nome do repositório

Com suporte para ordem crescente e decrescente.

## 📊 Analytics

Registro de eventos importantes da aplicação:

- Pesquisas realizadas
- Visualização de usuários
- Visualização de repositórios

Incluindo rastreamento por Correlation ID.

## 🧪 Testes Automatizados

O projeto possui:

- Testes unitários com Vitest
- Testes End-to-End com Cypress
- Ambiente Storybook para desenvolvimento isolado de componentes

---

# Tecnologias Utilizadas

| Tecnologia | Finalidade |
|------------|------------|
| Next.js 15 | Framework React |
| React 19 | Construção da interface |
| TypeScript | Tipagem estática |
| SCSS Modules | Estilização |
| Vitest | Testes unitários |
| Cypress | Testes E2E |
| Storybook | Desenvolvimento de componentes |
| ESLint | Padronização de código |
| Prettier | Formatação automática |

---

# Estrutura do Projeto

```text
src/
├── app/
│   ├── api/
│   ├── search/
│   ├── results/
│   └── user/
│
├── entities/
│   ├── github-user/
│   ├── github-repo/
│   └── search-analytics/
│
├── shared/
│   └── lib/
│       ├── analytics/
│       ├── api/
│       └── hooks/
│
public/
cypress/
.storybook/
scripts/
```

---

# Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn
- (Opcional) Token de acesso da API do GitHub

---

# Instalação

## 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd github-user-search
```

## 2. Instale as dependências

```bash
npm install
```

ou

```bash
yarn install
```

## 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` com base em um dos arquivos existentes (`.env.dev`, `.env.hom` ou `.env.prod`).

Exemplo:

```env
NEXT_PUBLIC_GITHUB_API_BASE_URL=https://api.github.com
GITHUB_API_KEY=

NEXT_PUBLIC_ANALYTICS_API_BASE_URL=http://localhost:3001
ANALYTICS_KEY=dev-analytics-key

NEXT_PUBLIC_FEATURE_SEND_ANALYTICS=true
```

---

## 4. Execute o projeto

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:3000/search
```

---

# Variáveis de Ambiente

| Variável | Descrição |
|-----------|-----------|
| NEXT_PUBLIC_GITHUB_API_BASE_URL | URL base da API do GitHub |
| GITHUB_API_KEY | Token da API do GitHub |
| NEXT_PUBLIC_ANALYTICS_API_BASE_URL | URL do serviço de Analytics |
| ANALYTICS_KEY | Chave de autenticação do Analytics |
| NEXT_PUBLIC_FEATURE_SEND_ANALYTICS | Ativa ou desativa o envio de eventos |

---

# Scripts Disponíveis

## Desenvolvimento

```bash
npm run dev
```

Inicia o servidor local.

---

## Build

```bash
npm run build
```

Gera a versão de produção.

---

## Executar Produção

```bash
npm run start
```

Executa a aplicação já compilada.

---

## Lint e Formatação

```bash
npm run lint
```

Executa:

- ESLint
- Prettier

---

## Verificação de Tipos

```bash
npm run type-check
```

Valida a tipagem TypeScript.

---

## Testes Unitários

```bash
npm run test
```

---

## Cobertura de Testes

```bash
npm run test:coverage
```

---

## Testes E2E

```bash
npm run e2e
```

---

## Cypress Interativo

```bash
npm run e2e:open
```

---

## Storybook

```bash
npm run storybook
```

Disponível em:

```text
http://localhost:6006
```

---

# Como Utilizar

## Pesquisar Usuários

1. Acesse `/search`
2. Digite um nome de usuário do GitHub
3. Clique em **Pesquisar**

A aplicação exibirá os usuários encontrados juntamente com informações relevantes.

---

## Visualizar Detalhes do Usuário

1. Clique em um usuário na lista de resultados
2. Consulte:
   - Perfil
   - Estatísticas
   - Repositórios públicos

---

## Ordenar Repositórios

Na página do usuário é possível ordenar os repositórios por:

- Nome
- Quantidade de estrelas

Além de alternar entre:

- Crescente
- Decrescente

---

# Endpoints da Aplicação

## Buscar Usuários

```http
GET /api/search/users?q=<usuario>
```

Exemplo:

```http
GET /api/search/users?q=octocat
```

---

## Buscar Detalhes do Usuário

```http
GET /api/users/<username>
```

Exemplo:

```http
GET /api/users/octocat
```

---

# Analytics

A aplicação possui uma camada dedicada de analytics composta por:

- `AnalyticsAdapter`
- `SearchEventFactory`
- `CorrelationIdUtil`

Os eventos suportados são:

| Evento | Descrição |
|----------|------------|
| search | Pesquisa realizada |
| user_view | Visualização de perfil |
| repo_view | Visualização de repositório |

Os eventos são enviados apenas quando a feature flag:

```env
NEXT_PUBLIC_FEATURE_SEND_ANALYTICS=true
```

estiver habilitada.

---

# Arquitetura

## App Router

Utiliza o App Router do Next.js para gerenciamento de páginas e APIs.

## Hooks Customizados

### useSearchUsers

Responsável por:

- Buscar usuários
- Enriquecer resultados com o principal repositório
- Enviar eventos de analytics

### useUserRepositories

Responsável por:

- Buscar repositórios
- Gerenciar ordenação
- Controlar estados de loading e erro

## Adapters

A comunicação com serviços externos é centralizada em adapters:

- GitHubAdapter
- AnalyticsAdapter

Facilitando manutenção, testes e desacoplamento.

## Entidades

Os modelos de domínio estão organizados em:

- GitHubUser
- GitHubRepository
- SearchAnalytics

Garantindo forte tipagem em toda a aplicação.

---

# Testes

O projeto inclui:

### Testes Unitários

Cobrem:

- Analytics
- Adapters
- Utilitários

Executados com:

```bash
npm run test
```

### Testes End-to-End

Cobrem os principais fluxos da aplicação.

Executados com:

```bash
npm run e2e
```

---