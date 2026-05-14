# 🌍 AfriSol — A Sua Carteira Digital

<p align="center">
  <strong>AfrisSol</strong> é uma aplicação de carteira digital moderna desenvolvida para o mercado angolano, permitindo pagamentos móveis seguros, transferências, pagamentos de serviços e recargas.
</p>

---

## ✨ Funcionalidades Principais

| Funcionalidade | Descrição |
|---------|-------------|
| 💰 **Gestão de Carteira** | Consulta de saldos, criação e gestão dinâmica de sub-contas (cofres) e acompanhamento de receitas e despesas. |
| 💳 **Cartão VISA Virtual** | Geração instantânea de cartões virtuais com gestão de estado e funcionalidade de cópia do número do cartão para a área de transferência. |
| 🔄 **Transferências** | Envio e receção de dinheiro via lista de contactos, número de telefone ou IBAN de forma intuitiva. |
| ⚡ **Pagamento de Serviços** | Integração com entidades nacionais para pagamento de energia (ENDE), água (EPAL), internet e televisão (ZAP, DSTV, TV Cabo), seguros, educação, entre outros. |
| 📱 **Recargas** | Carregamento direto de saldo e pacotes de dados para Unitel, Africel e Movicel. |
| 📊 **Histórico de Transações** | Registo detalhado de transações com pesquisa, filtros avançados e categorização visual. |
| 👤 **Perfil e Segurança** | Gestão de dados pessoais, configurações de segurança, autenticação biométrica avançada e acesso ao suporte. |
| 🔔 **Notificações em Tempo Real** | Centro de notificações animado para alertas de pagamentos, transferências e dicas de segurança. |

## 🛠️ Stack Tecnológica

- **Framework:** [React](https://react.dev/) 19 + [TypeScript](https://www.typescriptlang.org/)
- **Ferramenta de Build:** [Vite](https://vite.dev/) 6 com `@tailwindcss/vite`
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) v4 + design tokens personalizados
- **Gestão de Estado:** [Zustand](https://zustand-demo.pmnd.rs/) (Arquitetura atómica e global via `useAppStore`)
- **Roteamento:** [React Router](https://reactrouter.com/) v7
- **Animações:** [Framer Motion](https://www.framer.com/motion/) para transições de interface e micro-interações fluidas
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Componentes de Interface:** [Radix UI](https://www.radix-ui.com/) primitives + shadcn/ui
- **Tipografia:** [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)

## 🚀 Guia de Iniciação

### Pré-requisitos

- [Node.js](https://nodejs.org/) ≥ 18
- npm ≥ 9

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/imanthonypeter/AfriSol.git
cd AfriSol

# Instalar as dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173`.

### Compilação para Produção

```bash
npm run build
npm run preview
```

## 📱 Design Responsivo

A aplicação AfrisSol foi arquitetada para proporcionar uma experiência fluida em todos os dispositivos:

- **Mobile:** Experiência nativa imersiva em ecrã inteiro.
- **Desktop:** Contentor centralizado com sombras subtis, simulando a estética premium de aplicações fintech.

## 🎨 Design System e Identidade Visual

A identidade visual transmite confiança e segurança, pilares essenciais no setor financeiro angolano.

| Token | Valor Hexadecimal | Aplicação Principal |
|-------|-------|---|
| Azul Primário | `#162456` | Identidade da marca, cabeçalhos e botões principais |
| Laranja Destaque | `#F47C20` | Ações de chamada (CTAs) e alertas |
| Fundo Base | `#F5F7FA` | Fundo principal da aplicação |
| Verde Sucesso | `#22c55e` | Confirmações e entradas financeiras |
| Vermelho Erro | `#EF4444` | Alertas críticos e saídas financeiras |
| Fonte Primária | `Inter` | Toda a tipografia da aplicação |

## 📄 Licença

Este projeto é privado. Todos os direitos reservados.

---

<p align="center">
  <sub>Criado com ❤️ para Angola</sub>
</p>