# 🌍 AfrisSol — A Sua Carteira Digital

<p align="center">
  <strong>AfrisSol</strong> is a modern digital wallet application built for Mozambique, enabling secure mobile payments, transfers, bill payments, and top-ups.
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 💰 **Digital Wallet** | View balances, manage multiple accounts, track income & expenses |
| 💳 **Virtual VISA Card** | Integrated virtual card with copy-to-clipboard card number |
| 🔄 **Transfers** | Send & receive money via contacts, phone number, or IBAN |
| ⚡ **Bill Payments** | Pay for electricity (EDM), water, internet, TV, insurance, education & more |
| 📱 **Top-ups** | Recharge Vodacom, Movitel, TMcel airtime and data bundles |
| 📊 **Transaction History** | Searchable, filterable transaction log with category badges |
| 👤 **Profile Management** | Edit personal info, security settings, biometrics, and support access |

## 🛠️ Tech Stack

- **Framework:** [React](https://react.dev/) 19 + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vite.dev/) 6 with `@tailwindcss/vite`
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4 + custom design tokens
- **Routing:** [React Router](https://reactrouter.com/) v7
- **Icons:** [Lucide React](https://lucide.dev/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) primitives + shadcn/ui
- **Fonts:** [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)

## 📁 Project Structure

```
src/
├── app/
│   ├── components/       # Shared layout components (Root, BottomNav)
│   │   ├── Root.tsx      # App shell — responsive container + nav
│   │   ├── BottomNav.tsx # Bottom tab navigation
│   │   ├── figma/        # Figma-exported components
│   │   └── ui/           # shadcn/ui primitives
│   ├── pages/            # Page-level screen components
│   │   ├── SplashScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── CarteiraScreen.tsx
│   │   ├── TransferenciasScreen.tsx
│   │   ├── PagamentosScreen.tsx
│   │   ├── RecargasScreen.tsx
│   │   ├── HistoricoScreen.tsx
│   │   └── PerfilScreen.tsx
│   └── routes.tsx        # Route definitions
├── assets/               # Static assets (logos, images)
├── styles/               # Global styles, Tailwind config, fonts
└── main.tsx              # App entry point
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- npm ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/AfriSol.git
cd AfriSol

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

## 📱 Responsive Design

AfrisSol is designed to work seamlessly across devices:

- **Mobile:** Full-screen native-like experience
- **Desktop:** Centered app container with subtle shadow, matching a premium fintech feel

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Blue | `#162456` |
| Accent Orange | `#F47C20` |
| Background | `#F5F7FA` |
| Success Green | `#22c55e` |
| Error Red | `#EF4444` |
| Font Family | Inter |

## 📄 License

This project is private. All rights reserved.

---

<p align="center">
  <sub>Built with ❤️ for Angola</sub>
</p>