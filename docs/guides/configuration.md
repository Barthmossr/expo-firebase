# Configuration Guide

Comprehensive guide to all configuration files in this template.

## 📋 Table of Contents

- [package.json](#packagejson)
- [Expo Configuration](#expo-configuration)
- [EAS Configuration](#eas-configuration)
- [TypeScript Configuration](#typescript-configuration)
- [ESLint Configuration](#eslint-configuration)
- [Prettier Configuration](#prettier-configuration)
- [Jest Configuration](#jest-configuration)
- [Git Configuration](#git-configuration)
- [Editor Configuration](#editor-configuration)
- [Node Version](#node-version)
- [Environment Variables](#environment-variables)

## 📦 package.json

The heart of your Node.js project.

### Basic Metadata

```json
{
  "name": "expo-firebase",
  "version": "1.0.0",
  "description": "A production-ready Expo with Firebase template",
  "main": "src/index.ts",
  "author": "Barthmossr",
  "license": "MIT",
  "private": false,
  "type": "module",
  "repository": {
    "type": "git",
    "url": "https://github.com/Barthmossr/expo-firebase.git"
  },
  "keywords": [
    "react-native",
    "expo",
    "firebase",
    "typescript",
    "template",
    "boilerplate"
  ],
  "engines": {
    "node": "24.12.0"
  }
}
```

**Fields Explained**:

- **name**: Package name (kebab-case recommended)
- **version**: Semantic version (major.minor.patch)
- **description**: Brief description of the project
- **main**: Entry point for the built application
- **author**: Your name or organization
- **license**: License type (MIT in our case)
- **private**: Set to `true` to prevent accidental publishing
- **type**: Set to `module` for ES modules support
- **repository**: Git repository URL
- **keywords**: Help others find your package
- **engines**: Specifies the Node.js version required

### Scripts

```json
{
  "scripts": {
    "prebuild": "expo prebuild",
    "build:dev:android": "eas build --profile development --platform android",
    "dev": "tsx src/app/main.ts",
    "dev:watch": "tsx watch src/app/main.ts",
    "start": "node dist/main.mjs",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "clean": "rimraf dist coverage",
    "validate": "npm run lint && npm run format:check && npm run typecheck",
    "check": "ncu -ui",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "prepare": "husky"
  }
}
```

**Scripts Explained**:

- **build**: Compile TypeScript to JavaScript using build config
- **dev**: Run TypeScript directly with tsx
- **dev:watch**: Development mode with hot reload
- **start**: Run the built application
- **typecheck**: Check TypeScript types without building
- **lint**: Check code with ESLint
- **lint:fix**: Auto-fix linting issues
- **format**: Format code with Prettier
- **format:check**: Check if code is formatted
- **clean**: Remove build artifacts (dist and coverage)
- **validate**: Run all quality checks (lint, format check, typecheck)
- **check**: Interactive dependency update check with npm-check-updates
- **test**: Run all tests
- **test:watch**: Run tests in watch mode
- **test:coverage**: Generate coverage report
- **prepare**: Set up Husky hooks (runs after npm install)

### Dependencies

```json
{
  "devDependencies": {
    "@commitlint/cli": "^20.x.x",
    "@commitlint/config-conventional": "^20.x.x",
    "@eslint/js": "^9.x.x",
    "@types/jest": "^30.x.x",
    "@types/node": "^24.x.x",
    "eslint": "^9.x.x",
    "eslint-config-prettier": "^10.x.x",
    "eslint-plugin-prettier": "^5.x.x",
    "globals": "^16.x.x",
    "husky": "^9.x.x",
    "jest": "^30.x.x",
    "jiti": "^2.x.x",
    "lint-staged": "^16.x.x",
    "npm-check-updates": "^19.x.x",
    "prettier": "^3.x.x",
    "rimraf": "^6.x.x",
    "ts-jest": "^29.x.x",
    "tsx": "^4.x.x",
    "typescript": "^5.x.x",
    "typescript-eslint": "^8.x.x"
  }
}
```

**Important**: Since this is a template with no application logic yet, all dependencies are dev dependencies. When you add your application code, runtime dependencies will go in `dependencies`.

## 📱 Expo Configuration

### app.config.ts

Dynamic Expo configuration using TypeScript:

```typescript
import { ExpoConfig } from 'expo/config'

const defineConfig = (): ExpoConfig => ({
  name: 'expo-firebase',
  slug: 'expo-firebase',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.barthmossr.expofirebase',
    googleServicesFile: './GoogleService-Info.plist',
  },
  android: {
    package: 'com.barthmossr.expofirebase',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    googleServicesFile: './google-services.json',
  },
  plugins: [
    '@react-native-firebase/app',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
  ],
  extra: {
    eas: {
      projectId: 'your-project-id',
    },
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      // ... other Firebase config from env
    },
  },
})

export default defineConfig
```

**Why TypeScript Config**:

- Dynamic configuration with environment variables
- Type safety for config values
- Firebase credentials from environment
- Conditional configuration per environment

**Firebase Files** (not committed to git):

- `google-services.json` - Android Firebase config
- `GoogleService-Info.plist` - iOS Firebase config

## 🔧 EAS Configuration

### eas.json

EAS Build and Submit configuration:

```json
{
  "cli": {
    "version": ">= 16.28.0",
    "appVersionSource": "remote"
  },
  "build": {
    "base": {
      "node": "24.12.0",
      "env": {
        "NODE_ENV": "production"
      }
    },
    "development": {
      "extends": "base",
      "developmentClient": true,
      "distribution": "internal",
      "channel": "development"
    },
    "preview": {
      "extends": "base",
      "distribution": "internal",
      "channel": "staging",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "extends": "base",
      "autoIncrement": true,
      "channel": "production"
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "${APPLE_ID}",
        "ascAppId": "${ASC_APP_ID}",
        "appleTeamId": "${APPLE_TEAM_ID}"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

**Build Profiles**:

| Profile       | Purpose                     | Channel     | Distribution |
| ------------- | --------------------------- | ----------- | ------------ |
| `development` | Local development           | development | internal     |
| `preview`     | TestFlight/Internal Testing | staging     | internal     |
| `production`  | App Store/Play Store        | production  | store        |

**EAS Update Channels**:

- `development` - OTA updates for develop branch
- `staging` - OTA updates for stage branch
- `production` - OTA updates for main branch

## 📘 TypeScript Configuration

### tsconfig.json

Main TypeScript configuration for editor support and type checking:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "resolveJsonModule": true,
    "allowImportingTsExtensions": false,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false,
    "skipLibCheck": true,
    "noEmit": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true
  },
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Why These Settings**:

- **target: ES2022**: Modern JavaScript with good Node.js support
- **module: ESNext**: ES modules for modern Node.js
- **moduleResolution: bundler**: Modern resolution strategy
- **paths**: Path alias `@/*` maps to `src/*` for clean imports
- **strict: true**: All strict type-checking options enabled
- **noUncheckedIndexedAccess**: Safer array/object access
- **verbatimModuleSyntax**: Enforce explicit import/export type annotations
- **skipLibCheck**: Faster compilation

### Expo Build Configuration

Expo builds are configured through `app.json` and `eas.json`:

- **app.json** - Expo app configuration (name, icons, splash screens, etc.)
- **eas.json** - EAS Build profiles for development, preview, and production builds

For native builds, Expo handles the bundling through Metro bundler and native build tools.

## 🎨 ESLint Configuration

### eslint.config.ts (Flat Config)

We use ESLint's modern flat config format with TypeScript:

```typescript
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig([
  {
    ignores: ['dist/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js, prettier: eslintPluginPrettier },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
    rules: {
      ...eslintConfigPrettier.rules,
      'prettier/prettier': 'error',
      semi: ['error', 'never'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'no-console': 'warn',
    },
  },
  {
    files: ['**/*.{ts,mts,cts}'],
    extends: [tseslint.configs.recommended],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
    },
  },
])
```

**Key Rules Explained**:

- **semi: never**: No semicolons (project style)
- **quotes: single**: Single quotes only
- **no-console: warn**: Warns on console usage (use custom loggers)
- **no-explicit-any: error**: Never use `any` type
- **explicit-function-return-type: error**: Always specify return types

**Required Package**: `jiti` is needed to run TypeScript ESLint config files.

## 💅 Prettier Configuration

### .prettierrc

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "printWidth": 80,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**Settings Explained**:

- **semi: false**: No semicolons (matches ESLint rule)
- **singleQuote: true**: Use single quotes (matches ESLint rule)
- **trailingComma: all**: Add trailing commas everywhere
- **tabWidth: 2**: 2 spaces for indentation
- **printWidth: 80**: Max line length 80 characters
- **arrowParens: always**: Always use parentheses in arrow functions
- **endOfLine: lf**: Use LF line endings (Unix-style)

### .prettierignore

```
node_modules
dist
coverage
build
```

## 🧪 Jest Configuration

### jest.config.ts

```typescript
import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.types.ts',
    '!src/**/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
}

export default config
```

**Settings Explained**:

- **preset: ts-jest**: TypeScript support for Jest
- **testEnvironment: node**: Node.js environment (not browser)
- **roots**: Tests located in `tests/` directory
- **moduleNameMapper**: Support for `@/*` path alias
- **setupFilesAfterEnv**: Global test setup file
- **coverageThreshold**: 100% coverage required
- **coverageReporters**: Multiple report formats including json-summary for badges
- **clearMocks/resetMocks/restoreMocks**: Clean slate between tests

### tests/setup.ts

Global test setup file:

```typescript
beforeAll(() => {
  // Global setup before all tests
})

afterAll(() => {
  // Global cleanup after all tests
})
```

## 🔧 Git Configuration

### .gitignore

```
# Dependencies
node_modules

# Build output
dist

# Test coverage
coverage

# IDE
.idea
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
.env.*.local

# Logs
logs
*.log
npm-debug.log*

# Cache
.cache
*.tsbuildinfo
```

### Git Hooks (Husky)

**.husky/pre-commit**:

```bash
npx lint-staged
```

**.husky/commit-msg**:

```bash
npx --no -- commitlint --edit $1
```

**.husky/pre-push**:

```bash
npm test
```

### lint-staged (.lintstagedrc)

```json
{
  "*.{js,ts}": ["eslint --fix", "prettier --write"]
}
```

### commitlint (commitlint.config.js)

```javascript
export default { extends: ['@commitlint/config-conventional'] }
```

## 📝 Editor Configuration

### .editorconfig

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

### .vscode/settings.json

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "files.trimTrailingWhitespace": false
  }
}
```

**Key Settings**:

- **typescript.tsdk**: Use project's TypeScript version
- **formatOnSave**: Auto-format with Prettier
- **codeActionsOnSave**: Auto-fix ESLint issues

### .vscode/extensions.json

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "editorconfig.editorconfig",
    "orta.vscode-jest",
    "eamodio.gitlens",
    "vivaxy.vscode-conventional-commits"
  ]
}
```

**Recommended Extensions**:

- **ESLint**: Linting integration
- **Prettier**: Code formatting
- **EditorConfig**: Basic editor settings
- **GitLens**: Git history and blame
- **Conventional Commits**: Commit message helper

## 📌 Node Version

### .nvmrc

```
24.12.0
```

### .node-version

```
24.12.0
```

**Usage with nvm**:

```bash
nvm use
```

**Why Both Files**: Different tools support different files. Include both for maximum compatibility.

## 🌍 Environment Variables

### .env.example (In git)

```bash
# Node environment
NODE_ENV=development

# Firebase Configuration (Web/JS SDK)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Android (from google-services.json)
FIREBASE_ANDROID_APP_ID=your_android_app_id
FIREBASE_ANDROID_API_KEY=your_android_api_key
FIREBASE_ANDROID_CLIENT_ID=your_android_client_id

# Firebase iOS (from GoogleService-Info.plist)
FIREBASE_IOS_APP_ID=your_ios_app_id
FIREBASE_IOS_API_KEY=your_ios_api_key
FIREBASE_IOS_CLIENT_ID=your_ios_client_id
```

**Important**: Never commit `.env` to git! It's in `.gitignore`. The `.env.example` shows what environment variables are needed without exposing secrets.

### Firebase Config Files

These files contain sensitive API keys and are **NOT committed to git**:

| File                       | Platform | Source           |
| -------------------------- | -------- | ---------------- |
| `google-services.json`     | Android  | Firebase Console |
| `GoogleService-Info.plist` | iOS      | Firebase Console |

**Setup Steps**:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Add iOS/Android apps with your bundle identifiers
4. Download config files to project root
5. Run `expo prebuild --clean` to regenerate native folders

### GitHub Secrets (for CI/CD)

Add these secrets in GitHub repository settings:

| Secret                        | Description                            |
| ----------------------------- | -------------------------------------- |
| `EXPO_TOKEN`                  | EAS authentication token from expo.dev |
| `APPLE_ID`                    | Apple ID email for submissions         |
| `ASC_APP_ID`                  | App Store Connect App ID               |
| `APPLE_TEAM_ID`               | Apple Developer Team ID                |
| `APPLE_APP_SPECIFIC_PASSWORD` | App-specific password                  |
| `GOOGLE_SERVICE_ACCOUNT_KEY`  | Google Play Service Account JSON       |

## 🔗 Related Guides

- [Development Guide](development.md) - Development workflow
- [Libraries](libraries.md) - Why we chose these tools
- [Project Overview](project-overview.md) - Understanding the project

---

**Questions?** Open an issue on [GitHub](https://github.com/Barthmossr/expo-firebase/issues).
