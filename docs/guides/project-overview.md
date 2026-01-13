# Project Overview

## 📖 Introduction

**Expo Firebase** is a comprehensive React Native Expo with Firebase template repository designed to serve as a production-ready foundation for mobile application projects. This document explains the architectural decisions, design philosophy, and rationale behind this template.

## 🎯 Philosophy

### Mobile-First by Design

This template is focused on **React Native Expo with Firebase integration**. We believe in:

1. **Cross-Platform** - Build for iOS and Android from a single codebase
2. **Firebase Ready** - Pre-configured for easy Firebase service integration
3. **Standards** - Enforcing best practices that apply to mobile app development
4. **Modern Tooling** - Using the latest React Native and Expo features

### What This Template IS

✅ **A solid foundation** for React Native Expo projects  
✅ **A development environment** with modern mobile tooling  
✅ **A Firebase integration** ready for auth, Firestore, storage, etc.  
✅ **A starting point** that can be customized for any mobile app  
✅ **A template** for production-ready mobile applications

### What This Template IS NOT

❌ **NOT a complete app** (no pre-built screens or features)  
❌ **NOT UI framework-specific** (bring your own component library)  
❌ **NOT opinionated about state management** (no Redux, MobX, etc.)  
❌ **NOT a production application** (no business logic)  
❌ **NOT feature-complete** (intentionally minimal)

## 🏗️ Architectural Decisions

### 1. ES Modules (ESM)

**Decision**: Use ES modules (`"type": "module"`) as the module system.

**Rationale**:

- **Modern Standard**: ESM is the official JavaScript module standard
- **Future-Proof**: Node.js is moving towards ESM
- **Tree Shaking**: Better support for bundler optimizations
- **Interoperability**: Works well with modern TypeScript settings

### 2. Strict Folder Structure

**Decision**: Enforce a strict folder structure with no loose files at the root of any directory.

**Rationale**:

- **Scalability**: Easy to add new modules without cluttering directories
- **Organization**: Clear separation of concerns
- **Consistency**: Everyone knows where files should go
- **Maintainability**: Easier to navigate large codebases

**Example**:

```
❌ BAD: src/main.ts (loose file in src/)
✅ GOOD: src/app/main.ts (file in proper subdirectory)
```

### 3. TypeScript First

**Decision**: Use TypeScript as the primary language with strict mode enabled.

**Rationale**:

- **Type Safety**: Catch errors at compile time, not runtime
- **Developer Experience**: Better autocomplete and IDE support
- **Documentation**: Types serve as inline documentation
- **Refactoring**: Safer and easier to refactor code
- **Industry Standard**: TypeScript is now the standard for modern Node.js projects

**Key TypeScript Settings**:

- ES2022 target with ESNext modules
- Bundler module resolution
- All strict options enabled
- Path aliases (`@/*` maps to `src/*`)
- Separate build config for production

### 4. Conventional Commits

**Decision**: Strictly enforce conventional commits using commitlint and Husky.

**Rationale**:

- **Automation**: Enables automated versioning and changelogs
- **Clarity**: Clear commit history for everyone
- **Standardization**: Industry-standard practice
- **Tooling**: Works with semantic-release and other tools
- **Consistency**: Branches and commits follow the same pattern

### 5. Git Flow Branch Strategy

**Decision**: Use a Git Flow-inspired branching model with `main`, `stage`, `develop`, and feature branches.

| Branch    | Purpose                     | EAS Channel | Deployment           |
| --------- | --------------------------- | ----------- | -------------------- |
| `main`    | Production releases         | production  | App Store/Play Store |
| `stage`   | Testing and QA              | staging     | TestFlight/Internal  |
| `develop` | Code review and integration | development | OTA updates only     |

**Rationale**:

- **Stability**: `main` is always production-ready
- **Testing**: `stage` allows QA before production
- **Safety**: Development happens in isolation on `develop`
- **Review Process**: All changes go through PRs to `develop`
- **Deployment**: Clean separation between environments
- **Rollback**: Easy to roll back changes if needed

### 6. 100% Test Coverage

**Decision**: Require 100% code coverage for all tests.

**Rationale**:

- **Quality**: Forces thoughtful code design
- **Confidence**: High confidence in code correctness
- **Regression**: Prevents bugs from reappearing
- **Documentation**: Tests serve as usage examples
- **Best Practice**: Industry standard for quality assurance

### 7. CI/CD from Day One

**Decision**: Include CI/CD pipelines from the start, not as an afterthought.

**Workflows**:

- **validate.yml**: Lint, format check, typecheck
- **test.yml**: Run tests with coverage, upload to Codecov
- **eas-update.yml**: OTA updates for all branches
- **eas-build-stage.yml**: Preview builds for TestFlight/Internal Testing
- **eas-build-prod.yml**: Production builds with store submission

**Rationale**:

- **Automation**: Automated testing and deployment save time
- **Quality**: Catch issues before they reach production
- **Standards**: Enforce code quality automatically
- **OTA Updates**: Instant code updates without store review
- **Best Practice**: Modern development requires automation

### 8. ESLint Flat Config

**Decision**: Use ESLint's modern flat config format with TypeScript config file.

**Rationale**:

- **Modern**: Flat config is the future of ESLint
- **Type Safety**: TypeScript config file for better IDE support
- **Simpler**: Single file configuration
- **Explicit**: Clear configuration hierarchy

### 9. Code Style (No Semicolons, Single Quotes)

**Decision**: Use single quotes and no semicolons throughout the codebase.

**Rationale**:

- **Consistency**: One style everywhere
- **Simplicity**: Less visual noise
- **ASI**: JavaScript's automatic semicolon insertion works reliably
- **Modern**: Common in modern JavaScript/TypeScript projects

### 10. npm as Package Manager

**Decision**: Use npm as the official package manager (with future consideration for Bun).

**Rationale**:

- **Compatibility**: Works everywhere Node.js works
- **Stability**: Mature and battle-tested
- **Features**: Modern npm has most features of alternatives
- **Default**: Ships with Node.js by default
- **Future-Proof**: Can migrate to Bun when it's more mature

## 📁 Folder Structure

```
expo-firebase/
├── src/
│   ├── app/                    # Application entry point
│   │   └── App.tsx
│   ├── core/                   # Domain layer (ports/interfaces)
│   │   └── ports/
│   │       ├── analytics/      # Analytics port interface
│   │       ├── crash-reporting/# Crash reporting port interface
│   │       ├── auth/           # Authentication port interface
│   │       ├── otp/            # OTP verification port interface
│   │       ├── storage/        # File storage port interface
│   │       ├── database/       # Database port interface
│   │       ├── functions/      # Cloud functions port interface
│   │       └── ads/            # Ads port interface
│   ├── adapters/               # Infrastructure layer (implementations)
│   │   ├── firebase/           # Firebase implementations
│   │   │   ├── analytics/
│   │   │   ├── crash-reporting/
│   │   │   ├── auth/
│   │   │   ├── otp/            # OTP adapter (Cloud Functions)
│   │   │   ├── storage/
│   │   │   ├── database/
│   │   │   └── functions/
│   │   └── admob/              # AdMob implementation
│   ├── services/               # Service factories (dependency injection)
│   │   ├── analytics.service.ts
│   │   ├── crash-reporting.service.ts
│   │   ├── auth.service.ts
│   │   ├── otp.service.ts       # OTP service factory
│   │   ├── storage.service.ts
│   │   ├── database.service.ts
│   │   ├── functions.service.ts
│   │   ├── ads.service.ts
│   │   └── index.ts
│   ├── hooks/                  # React hooks
│   │   └── telemetry/
│   ├── components/             # Reusable UI components
│   │   ├── ads/
│   │   │   └── banner/
│   │   └── ui/                 # UI components
│   │       └── otp-input/      # OTP input component
│   ├── config/                 # Configuration modules
│   │   └── telemetry/
│   └── flows/                  # Feature modules
│       ├── auth/               # Authentication flow
│       │   ├── components/
│       │   │   ├── login-form/
│       │   │   ├── register-form/
│       │   │   └── verify-email-form/ # OTP verification
│       │   └── screens/
│       ├── profile/
│       └── onboarding/
├── functions/                  # Firebase Cloud Functions
│   ├── src/
│   │   ├── index.ts            # Functions entry point
│   │   ├── otp/                # OTP verification functions
│   │   │   ├── send-otp-email.function.ts
│   │   │   ├── verify-otp-email.function.ts
│   │   │   ├── otp.utils.ts
│   │   │   └── otp.types.ts
│   │   └── cleanup/            # Scheduled cleanup
│   ├── package.json
│   └── tsconfig.json
├── tests/
│   ├── setup.ts                # Global test setup
│   ├── __mocks__/              # Manual mocks
│   └── unit/                   # Unit tests mirror src/ structure
├── docs/
│   ├── CONTRIBUTING.md
│   ├── README.md
│   ├── guides/                 # Detailed documentation
│   │   ├── cost-optimization.md  # Cloud Functions costs
│   │   └── ...
│   └── services/               # Third-party service docs
│       ├── sendgrid/
│       │   └── setup.md        # Email verification setup
│       ├── firebase/
│       └── admob/
├── scripts/
│   └── setup.sh                # Setup and utility scripts
├── .github/
│   ├── workflows/              # CI/CD automation
│   └── copilot-instructions.md # AI agent rules
├── .vscode/                    # Editor configuration
└── dist/                       # Build output (git ignored)
```

### Architecture: Ports & Adapters (Hexagonal)

This project follows the **Ports & Adapters** (Hexagonal) architecture pattern:

```
┌─────────────────────────────────────────────────────────────┐
│                        Application                          │
│  ┌───────────┐  ┌────────────┐  ┌────────────────────────┐  │
│  │   Hooks   │  │ Components │  │         Flows          │  │
│  └─────┬─────┘  └──────┬─────┘  └───────────┬────────────┘  │
│        │               │                    │               │
│        └───────────────┼────────────────────┘               │
│                        ▼                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    Services                         │    │
│  │           (Dependency Injection Layer)              │    │
│  └─────────────────────┬───────────────────────────────┘    │
│                        ▼                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  Core (Ports)                       │    │
│  │              Interfaces/Contracts                   │    │
│  └─────────────────────┬───────────────────────────────┘    │
│                        ▼                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    Adapters                         │    │
│  │    Firebase │ AdMob │ AWS │ Custom implementations  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

**Benefits:**

- **Backend Agnostic**: Swap Firebase for Supabase/AWS by creating new adapters
- **Testable**: Mock services easily without touching real implementations
- **Maintainable**: Clear separation of concerns
- **Scalable**: Add new features without affecting existing code

### Barrel Files (index.ts) Rule

- Only create `index.ts` in **leaf folders** (folders with no subfolders)
- Never create `index.ts` in parent folders
- Always use specific imports: `@/components/ads/banner`, not `@/components`

### Why This Structure

1. **Ports define contracts**: Interfaces in `core/ports/` define what services must do
2. **Adapters implement contracts**: `adapters/` contains actual implementations
3. **Services inject dependencies**: `services/` factories return the right adapter
4. **Tests mirror src/**: Easy to find corresponding tests
5. **Docs in dedicated folder**: Documentation organized separately

## 🛠️ Tooling Stack

| Tool                   | Purpose                | Version  |
| ---------------------- | ---------------------- | -------- |
| Node.js                | Runtime                | v24.12.0 |
| Expo                   | React Native framework | ~54.0.30 |
| React Native           | Mobile framework       | 0.81.5   |
| TypeScript             | Type system            | ^5.9.3   |
| @react-native-firebase | Firebase SDK           | ^23.7.0  |
| ESLint                 | Linting                | ^9.39.2  |
| Prettier               | Formatting             | ^3.7.4   |
| Jest                   | Testing                | ^29.7.0  |
| Husky                  | Git hooks              | ^9.1.7   |
| lint-staged            | Pre-commit linting     | ^16.2.7  |
| commitlint             | Commit message linting | ^20.2.0  |
| EAS CLI                | Build & deploy         | latest   |

## 📜 Available Scripts

| Script                  | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `npm run dev`           | Run TypeScript directly                          |
| `npm run dev:watch`     | Run with hot reload                              |
| `npm run build`         | Compile to JavaScript                            |
| `npm start`             | Run built application                            |
| `npm run typecheck`     | Check TypeScript types                           |
| `npm run lint`          | Check code with ESLint                           |
| `npm run lint:fix`      | Auto-fix ESLint issues                           |
| `npm run format`        | Format with Prettier                             |
| `npm run format:check`  | Check formatting                                 |
| `npm run validate`      | Run all quality checks (lint, format, typecheck) |
| `npm test`              | Run tests                                        |
| `npm run test:watch`    | Tests in watch mode                              |
| `npm run test:coverage` | Generate coverage report                         |
| `npm run check`         | Interactive dependency update                    |
| `npm run clean`         | Remove build artifacts                           |

## 🎓 Design Principles

### 1. Convention Over Configuration

We prefer established conventions (conventional commits, Git Flow, etc.) over custom configurations.

### 2. Explicit Over Implicit

Configuration files are explicit and well-documented. No "magic" behavior.

### 3. Quality Over Speed

We prioritize code quality and maintainability over rapid development.

### 4. Documentation is Code

Documentation is treated with the same importance as code.

### 5. Automation Where Possible

Automate repetitive tasks (testing, linting, deployment) to reduce human error.

## 🚀 Future Plans

### Specialized Templates

This template can serve as the foundation for specialized mobile templates:

1. **E-commerce Mobile App Template**
   - Add product listings and cart
   - Add payment integration (Stripe, PayPal)
   - Add order management
   - Add push notifications

2. **Social Media App Template**
   - Add user profiles and feeds
   - Add real-time messaging
   - Add media upload/sharing
   - Add social features (likes, comments, follows)

3. **Productivity App Template**
   - Add task management
   - Add calendar integration
   - Add collaboration features
   - Add offline sync

### Expo & Firebase Enhancements

Planned enhancements for Expo and Firebase:

- Pre-configured Firebase services (Auth, Firestore, Storage)
- Example screens and navigation setup
- Push notification configuration
- Offline data sync patterns
- App store deployment guides

### Continuous Improvement

We will continuously:

- **Update dependencies** to latest stable versions
- **Improve documentation** based on feedback
- **Add best practices** as they emerge
- **Simplify setup** to reduce friction
- **Enhance automation** to improve efficiency

## 📚 Learning Resources

To understand the concepts in this template:

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [Jest Testing](https://jestjs.io/docs/getting-started)
- [Husky](https://typicode.github.io/husky/)

## 🎯 Success Metrics

We consider this template successful if:

1. **Easy to start**: New projects can be created in minutes
2. **Easy to maintain**: Code remains clean and organized
3. **Easy to scale**: Adding features doesn't create chaos
4. **Easy to understand**: New developers can onboard quickly
5. **Production-ready**: Can deploy to production with confidence

## 💭 Philosophy Summary

> "A mobile template should provide the foundation, not the complete app. It should enforce quality without restricting creativity. It should be simple to start with, yet powerful enough to grow into any mobile application."

---

**Next Steps**: Check out our [Development Guide](development.md) to start building on this foundation.
