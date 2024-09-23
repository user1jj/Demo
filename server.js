const express = require('express');
const path = require('path');
const app = express();

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());  // 添加这行来解析 JSON 请求体

// 其他服务器配置...

// 添加图片防盗链中间件
app.use('/images', (req, res, next) => {
  const referer = req.get('Referer');
  if (!referer || referer.includes(req.get('host'))) {
    next(); // 允许来自本站的请求
  } else {
    res.status(403).send('禁止访问'); // 拒绝其他来源的请求
  }
});

// 其他路由和中间件...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});