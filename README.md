# Plataforma Allka 2026

Plataforma web moderna para gestão de empresas, projetos, equipes e serviços com interface responsiva em português brasileiro.

## 🛠️ Tecnologias Utilizadas

### **Frontend Framework**
- **Next.js 14** - Framework React com Server Components e API Routes
- **React 18+** - Biblioteca para construção de interface de usuário
- **TypeScript** - Linguagem tipada para melhor segurança e manutenibilidade

### **Estilização**
- **Tailwind CSS** - Framework de utilitários CSS
- **PostCSS** - Processador CSS
- **Componentes UI** - Sistema de componentes customizado e reutilizável

### **Gerenciamento de Estado**
- **React Context API** - Para gerenciamento de estado global:
  - `AccountTypeContext` - Contexto de tipo de conta
  - `CompanyContext` - Contexto de dados da empresa
  - `PricingContext` - Contexto de precificação
- **React Hooks** - useState, useEffect, useCallback, useContext, etc.

### **Armazenamento Local**
- **localStorage** - Persistência de dados no navegador (dashboard, preferências do usuário)

### **Autenticação & API**
- **Next.js API Routes** - Endpoints backend em `app/api/`
- **Fetch API** - Requisições HTTP client-side
- **Mock Data** - Simulação de dados (pronto para integração com backend real)

### **Recursos UI**
- **lucide-react** - Biblioteca de ícones
- **shadcn/ui** - Componentes UI reutilizáveis e acessíveis
- **Componentes Customizados** - Diversos componentes específicos da plataforma

### **Gerenciamento de Pacotes**
- **pnpm** - Gerenciador de pacotes moderno e eficiente

### **Desenvolvimento**
- **ESLint** - Linting de código
- **SWC/Terser** - Minificação de código (integrado ao Next.js)

---

## ✨ Funcionalidades da Plataforma

### **1. Autenticação e Tipos de Conta**
- Sistema de login/registro
- Suporte a dois tipos de conta:
  - **Conta Pessoal** - Para usuários individuais
  - **Conta Empresarial** - Para empresas e organizações
- Gerenciamento de contexto de tipo de conta ativo

### **2. Dashboard**
- Painel principal com visão geral da plataforma
- Estatísticas e widgets informativos
- Persistência de estado no localStorage
- Navegação intuitiva entre seções

### **3. Gestão de Empresas**
- Criar, visualizar e editar perfis empresariais
- Armazenamento de informações (nome, CNPJ, endereço, contatos)
- Gerenciamento de múltiplos usuários por empresa
- Suporte a logos customizados

### **4. Sistema de Precificação**
- Visualização de planos de preços
- Gerenciamento de assinatura/plano
- Integration pronta para sistema de pagamento
- Context dedicado para dados de pricing

### **5. Gerenciamento de Projetos**
- Criar, visualizar e editar projetos
- Tipo de projeto breakdown
- Assistente/wizard para criação de projetos
- Integração com modal de gerenciamento

### **6. Gerenciamento de Tarefas**
- Criar e gerenciar tarefas
- Importação de templates de tarefas
- Painel de tarefas pendentes
- Detalhes de tarefas em slide panels

### **7. Gestão de Usuários**
- Criar e gerenciar usuários
- Edição de perfis e senhas
- Perfis de permissão
- Context para gerenciamento de usuários

### **8. Catalogo de Produtos/Serviços**
- Visualização de produtos
- Sistema de filtros avançados
- Cards de produtos com informações detalhadas
- Integração com carrinho de compras

### **9. Carrinho de Compras**
- Adição de produtos
- Gerenciamento de itens
- Checkout flow
- Cálculo de totais

### **10. Gerenciamento de Agências**
- Perfis de agências
- Gerenciamento de agências parceiras
- Visualização e edição de informações

### **11. Premium Projects**
- Gerenciamento de projetos premium
- Funcionalidades específicas para projetos premium

### **12. Reports e Relatórios**
- Geração de relatórios
- Dados estatísticos e análises

### **13. Sistema de Notificações**
- Painel de notificações
- Preferências de notificações configuráveis
- Integração com notificações do sistema

### **14. Gerenciamento de Pagamentos**
- Configuração de métodos de pagamento
- Integração com processadores de pagamento
- Histórico financeiro

### **15. Team Management**
- Gerenciamento de equipes
- Atribuição de tarefas a membros
- Colaboração entre usuários

### **16. Qualificações**
- Sistema de qualificações/ratings
- Avaliação de serviços e profissionais

### **17. Formulários e Upload**
- Upload de arquivos/documentos
- Zonas de upload customizáveis
- Validação de formulários

### **18. Navegação Responsiva**
- Menu lateral (sidebar)
- Drawer de navegação
- Menu horizontal
- Navegação mobile com bottom nav
- Layout wrapper para mobile

### **19. Internacionalização**
- Interface em português brasileiro
- Estrutura preparada para múltiplos idiomas

### **20. Recursos Adicionais**
- Editor de logo
- Seletor de conta/agência
- Gerenciamento de links sociais
- Filtros de data avançados
- Tabelas de dados com paginação
- Lista de usuários parceiros

---

## 📁 Estrutura do Projeto

```
allka-2026/
├── app/                      # App Router do Next.js com todas as rotas
│   ├── api/                  # API Routes backend
│   ├── account/              # Páginas de conta do usuário
│   ├── admin/                # Páginas administrativas
│   ├── agencias/             # Gerenciamento de agências
│   ├── catalog/              # Catálogo de produtos/serviços
│   ├── clients/              # Gerenciamento de clientes
│   ├── company/              # Gerenciamento de empresas
│   ├── financial/            # Gestão financeira
│   ├── projects/             # Gerenciamento de projetos
│   ├── tasks/                # Gerenciamento de tarefas
│   ├── team/                 # Gerenciamento de equipes
│   └── ...                   # Outras rotas
├── components/               # Componentes React reutilizáveis
│   └── ui/                   # Componentes UI base
├── contexts/                 # React Contexts para estado global
├── hooks/                    # Custom React Hooks
├── lib/                      # Funções auxiliares e utilidades
├── scripts/                  # Scripts de desenvolvimento/build
├── styles/                   # Estilos globais
├── types/                    # Definições de tipos TypeScript
├── constants/                # Constantes da aplicação
├── docs/                     # Documentação adicional
├── package.json              # Dependências do projeto
├── tsconfig.json             # Configuração TypeScript
├── next.config.mjs           # Configuração do Next.js
├── tailwind.config.ts        # Configuração do Tailwind CSS
├── postcss.config.mjs        # Configuração do PostCSS
├── components.json           # Configuração de componentes
└── GOOGLE_MAPS_CONFIG.md     # Configuração do Google Maps
```

---

## 🚀 Como Começar

### **Pré-requisitos**
- Node.js 16+
- pnpm

### **Instalação**

```bash
# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Executar build em produção
pnpm start
```

---

## 📊 Arquitetura

A plataforma segue uma arquitetura moderna com:

- **Server Components** - Renderização no servidor quando possível
- **Client Components** - Componentes interativos no cliente
- **API Routes** - Backend serverless com Next.js
- **Context API** - Gerenciamento de estado global
- **Componentes Reutilizáveis** - Sistema de design modular

---

## 🌐 Status de Desenvolvimento

Projeto em desenvolvimento ativo com:
- ✅ Arquitetura base implementada
- ✅ Sistema de roteamento estruturado
- ✅ Context API para estado global
- ✅ Componentes UI reutilizáveis
- 🔄 Integração com backend em progresso
- 🔄 Autenticação a implementar
- 🔄 Integrações com serviços externos

---

## 📝 Notas

- A plataforma utiliza **localStorage** para persistência local de dados
- Pronta para integração com um backend real
- Interface completamente responsiva e mobile-friendly
- Componentes seguem padrões de acessibilidade (a11y)

---

**Última atualização:** Fevereiro de 2026
