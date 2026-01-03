 

# 外部画像をlocalに保存する方法

```JavaScript
// 外部画像をローカルに保存
async function downloadImage(url, filePath) {
  // 1. fetch で画像を取得
  const response = await fetch(url);
  
  // 2. ArrayBuffer として取得
  const arrayBuffer = await response.arrayBuffer();
  
  // 3. Buffer に変換
  const buffer = Buffer.from(arrayBuffer);
  
  // 4. ファイルに書き込み
  fs.writeFileSync(filePath, buffer);
}

// 使用例
await downloadImage(
  'https://example.com/image.png',
  './downloads/image.png'
);
```