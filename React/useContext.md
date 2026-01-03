 

# useContext

propのバケツリレーを避けることができるよ。アプリ全体などでシェアしたい場合にはこちらを使うと良いよ。

あとは、三親等などで更新関数を実行するみたいなケースがある時、それぞれの子供に対してバケツリレーが発生して冗長になる。

状態を共有したい最上位のコンポーネントでProviderを定義する。

その中で、その配下でそのコンテクストを取得する様に `useContext`を使用する

# Sample

```TypeScript
// Example.tsx
import "./Example.css";
import Header from "./components/Header";
import Main from "./components/Main";
import { ThemeProvider } from "./contexts/themeContext";

const Example = () => {

  return (
    <ThemeProvider >
      <Header />
      <Main />
    </ThemeProvider>
  );
};

export default Example;
```

```TypeScript

// theme.ts
export const THEMES = ['light', 'dark', 'red'] as const;
export type Theme = typeof THEMES[number]

export function isTheme(value: any): value is Theme {
  return THEMES.includes(value);
}
```

```TypeScript

// contexts/themeContext.tsx

//Providerと、そのプロバイダーで管理するstateを取得するカスタムフックを定義している。
import { createContext, useContext, useState } from "react";
import { Theme } from '../theme';

type ThemeContextType = [Theme, React.Dispatch<React.SetStateAction<Theme>>]
export const ThemeContext = createContext<ThemeContextType>(["light", () => { }])

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light')

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

```TypeScript

// components/Header.txsx
import { isTheme, THEMES } from "../theme";
import { useTheme } from '../contexts/themeContext';

const Header = () => {
  const [theme, setTheme] = useTheme()

  const changeTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!isTheme(value)) return;
    setTheme(value)
  }

  return (
    <header className={`content-${theme}`}>
      {THEMES.map(_theme =>
        <label key={_theme}>
          <input
            type="radio"
            value={_theme}
            onChange={changeTheme}
            checked={theme === _theme}
          />
          {_theme}
        </label>
      )}
    </header>
  )
};

export default Header;
```

# **useContextを使用する上での注意点**

- useContextが管理しているstateを更新した場合には、当該のstateを使用している全てのコンポーネントにおいて再レンダーされる。  
    言い換えると、useContextでは、共通しているstateが更新関数なのか、変更を反映したい値なのか？ということについては感知しないため、紐づいている部分全てで、自動的に再レンダーが発生する。
    
    - Providerに渡されるvalueはなんであればグローバルに管理されるStateがであるよ。
    

### **すべてのcontextで再レンダーをさせない工夫**

渡された側で実際に使うかは別として、Providerの値にuseState[0]などと含まれていると、すべてのuseContextに渡されるので、一箇所での変更は、すべてコンポーネントを再レンダーの対象として伝播する。  
そのため,useStateの更新用関数と値を別々のProviderによって、定義すると、パフォーマンスの向上が見込める。

## useReducerをuseContextを使ってみた

```TypeScript
import { useReducer, useContext, createContext } from "react";

type Action = { type: "+" | "-", step: number };
type CountFunc = (step?: number) => void

const CounterContext = createContext<number>(0)
const CounterUpdateContext = createContext<[CountFunc, CountFunc]>([() => { }, () => { }])

function countReducer(
  prev: number,
  { type, step }: Action
): number {
  switch (type) {
    case "+":
      return prev + step;
    case "-":
      return prev - step;
    default:
      throw new Error('不明なactionです。')
  }
}

const CounterProvider = (
  { children }: { children: React.ReactNode }
) => {
  const [state, dispatch] = useReducer(countReducer, 0);

  const countUp = (_step: number = 2) => dispatch({ type: "+", step: _step });
  const countDown = (_step: number = 2) => dispatch({ type: "-", step: _step });

  return (
    <CounterContext.Provider value={state}>
      <CounterUpdateContext.Provider value={[countUp, countDown]}>
        {children}
      </CounterUpdateContext.Provider>
    </CounterContext.Provider >
  );
};

const useCounter = () => useContext(CounterContext);
const useCounterUpdate = () => useContext(CounterUpdateContext)

export { useCounter, useCounterUpdate, CounterProvider };
export type { Action };
```