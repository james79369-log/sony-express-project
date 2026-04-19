const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// 載入資料 (確保 data/lens.json 格式正確)
const lensData = require('./data/lens.json').data;

// 1. 全域中間件：記錄日誌 (Global Middleware)
app.use((req, res, next) => {
  const log = `[${new Date().toLocaleString()}] ${req.method} ${req.url}\n`;
  fs.appendFileSync('access.log', log);
  next();
});

// 2. 靜態資源處理 (Static)
app.use(express.static('public'));

// 3. 管理後台：驗證暗號 (Route Authorization)
app.get('/admin', (req, res) => {
  if (req.query.code === '521') {
    res.status(200).send('<h1>Welcome to Admin (歡迎進入後台)</h1>');
  } else {
    res.status(403).send('<h1>Access Denied (暗號錯誤)</h1>');
  }
});

// 4. 動態產品頁面 (Dynamic Routing)
app.get('/product/:model.html', (req, res) => {
  const model = req.params.model;
  const product = lensData.find(item => item.model === model);

  if (product) {
    // 運用 Chaining 寫法與樣板字串
    res.status(200).send(`
      <h1>${product.name}</h1>
      <p>型號: ${product.model}</p>
      <img src="/images/${product.imageUrl}" style="width:400px;"> 
      <br><a href="/">回首頁</a>
` );
  } else {
    res.status(404).send('<h1>404 找不到型號</h1>');
  }
});

// 5. 萬用防呆路由 (必須放在最後面)
app.all(/.*$/, (req, res) => {
  res.status(404).send('<h1>404 Not Found (抱歉，路徑不存在)</h1>');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});