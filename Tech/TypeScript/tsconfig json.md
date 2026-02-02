---
tags:
  - typescript
  - syntax
  - function
  - tooling
created: 2026-01-03
status: active
---

# tsconfig.json

## allowJS/checkJS

JSを許すか、その上でチェックするか。

```YAML
{
  "compilerOptions": {
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "target": "ES2022",
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "outDir": "./dist",
    "rootDir": ".",
    "forceConsistentCasingInFileNames": true,
    "exactOptionalPropertyTypes": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true,
    "sourceMap": true,
    "verbatimModuleSyntax": true,
    "allowSyntheticDefaultImports": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
  ],
  "exclude": [
    "node_modules"
  ]
}
```
