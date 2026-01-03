 

![](Vitest/Vitest--Streamline-Svg-Logos.svg)

# Vitest

# テスト

### mock使い方

[

Vitest のモック関数 fn、spyOn、mock の使い分け - Qiita

はじめにこの記事では、Vitest というテストフレームワークのモックに利用される vi.fn、vi.spyOn、vi.mock の概要とそれらの使い分けをサンプルつきで記載していきます。htt…

![](Import%20tech/Attachments/apple-touch-icon-ec5ba42a24ae923f16825592efdc356f%201.png)https://qiita.com/Yasushi-Mo/items/811456b9a0e9ee735b4b

![](Import%20tech/Attachments/article-ogp-background-9f5428127621718a910c8b63951390ad%202.png)](https://qiita.com/Yasushi-Mo/items/811456b9a0e9ee735b4b)

- `**vi.spyOn()**` - 既存のメソッドを監視する場合（**デフォルト選択**）

- `**vi.fn()**` - 新しいモック関数が必要な場合

- `**vi.mock()**` - どうしてもモジュール全体のモックが必要な場合（最終手段）

```JavaScript
import { mount } from '@vue/test-utils'
import Thumbnail from '@/components/mypage/viewed-items/lists/thumbnail.vue'
import Anchor from '@/components/commons/anchor.vue'
import defaultItemImage from '@/assets/images/components/mypage/index/mypage_favorite_car/camera_black.svg'

describe('コンポーネント/マイページ/閲覧履歴/リストビュー/サムネイル', () => {
  it('デフォルトで表示できること', () => {
    const component = mount(Thumbnail)
    expect(component.find('.thumbnail--new').exists()).toBe(false)
    expect(component.findComponent(Anchor).attributes('href')).toBe('')
    expect(component.find('img').attributes('alt')).toBe('商品画像')
    expect(component.find('img').attributes('src')).toBe(defaultItemImage)
  })

  it('正常に表示できること', () => {
    const component = mount(Thumbnail, {
      props: {
        source:       'https://example.com/image.png',
        description:  'これは商品を説明するための文言です。',
        destination:  'https://example.com',
        isNewArrival: false,
      },
    })

    expect(component.find('.thumbnail--new').exists()).toBe(false)
    expect(component.findComponent(Anchor).attributes('href')).toBe('https://example.com')
    expect(component.find('img').attributes('alt')).toBe('これは商品を説明するための文言です。')
    expect(component.find('img').attributes('src')).toBe('https://example.com/image.png')
  })

  it('新着アイテムである場合、新着ラベルがつくこと', () => {
    const component = mount(Thumbnail, {
      props: {
        source:       null, // required: trueのため
        isNewArrival: true,
      },
    })
    expect(component.find('.thumbnail--new').exists()).toBe(true)
  })

  it('商品画像がない時、デフォルトの画像が表示されること', () => {
    const component = mount(Thumbnail, {
      props: {
        source: null,
      },
    })
    expect(component.find('img').attributes('src')).toBe(defaultItemImage)
  })
})
```

# Browser Mode

# テスト環境の切り替え

config.ファイルでも設定できるが、 `@vitest-enviromnment`アノテーションを追加する。

[https://vitest.dev/guide/environment.html#environments-for-specific-files](https://vitest.dev/guide/environment.html#environments-for-specific-files)

## projectを複数用意する。

storybookとunitを分けるみたいにね。

[https://vitest.dev/guide/projects](https://vitest.dev/guide/projects)

# 環境変数の読み込み

vite環境だと

`console.log(import.meta.env.STORYBOOK_THEME);`  
のような参照形式が必要になる。

defineにproccess.envのオブジェクトを渡してあげる処理を追加する必要がありそう。

### HACK:

```CSS


/**
 * Storybook用の環境変数を読み込み、Viteのdefineオプション用に変換する
 *
 * @param mode - 環境変数ファイルのモード（例: 'test'）
 * @param root - プロジェクトルートディレクトリ（デフォルト: process.cwd()）
 * @param additionalEnvVars - 追加の環境変数（vitest環境特有の設定など）
 * @returns Viteのdefineオプション用の環境変数オブジェクト
 */
export function loadStorybookEnv(): Record<string, string> {

const storybookEnvVars: Record<string, string> = {
  IBIS_API_SSR_BASE_PATH: 'http://mocking-ibis:5000',
};

const env = loadEnv('development', process.cwd(), '');
console.log('env', env)
  // 追加の環境変数とマージ（additionalEnvVarsを確実に優先するため、後からマージ）
  // これにより、vitestEnvVarsなどの明示的な設定がシステム環境変数や.envファイルの値を上書きする
  const mergedEnv = {
    ...env,
    ...storybookEnvVars,
  };

  // process.envで環境変数を参照可能にする形式に変換
  // Viteのdefineオプションでは、process.env.XXXの形式で定義する必要がある
  // 重要: JSON.stringify()で値をラップすることで、文字列として正しく展開される
  return Object.keys(mergedEnv).reduce((obj, key) => {
    // additionalEnvVarsで指定された値が確実に使用される
    const value = mergedEnv[key];
    if (value !== undefined && value !== null) {
      obj[`process.env.${key}`] = JSON.stringify(value);
    }
    return obj;
  }, {} as Record<string, string>);
}




export default config
```