const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Đọc dữ liệu từ db.json
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Tạo route custom cho đăng nhập
server.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get('users').value(); // Lấy dữ liệu users từ db.json

  // Kiểm tra email và password
  const user = users.find(user => user.email === email && user.password === password);

  if (user) {
    return res.jsonp({
      message: 'Login successful',
      user: { email: user.email, id: user.id }
    });
  } else {
    return res.status(400).jsonp({ message: 'Invalid credentials' });
  }
});

// Kết nối router với server
server.use(router);

// Chạy server trên port 5000
server.listen(5000, () => {
  console.log('Server is running');
});
