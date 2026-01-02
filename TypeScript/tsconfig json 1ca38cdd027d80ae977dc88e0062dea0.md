 

# tsconfig.json

[allowJS/checkJS](#1cb38cdd-027d-801f-8d63-f13bb87d68a1)

# allowJS/checkJS

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