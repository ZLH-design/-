// backend/app.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const client = require('./db'); // 引入数据库模块
const cors = require('cors');
app.use(cors());  // 启用跨域支持

// 使用 body-parser 来解析请求体
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// 添加学生接口
app.post('/students', (req, res) => {
  const { name, age, gender } = req.body;
  if (!name || !age || !gender) {
    return res.status(400).json({ message: '缺少必要参数' });
  }

  const query = 'INSERT INTO users (name, age, gender) VALUES ($1, $2, $3) RETURNING id';  // 使用 PostgreSQL 占位符
  const values = [name, age, gender];

  client.query(query, values)
    .then(result => {
      res.status(201).json({ message: '学生添加成功', studentId: result.rows[0].id });
    })
    .catch(err => {
      console.error('插入学生数据失败：', err);
      res.status(500).json({ message: '服务器错误' });
    });
});

// 获取所有学生接口
app.get('/students', (req, res) => {
  const query = 'SELECT * FROM users';

  client.query(query)
    .then(result => {
      res.status(200).json(result.rows);  // 返回结果 rows 数组
    })
    .catch(err => {
      console.error('查询学生数据失败：', err);
      res.status(500).json({ message: '服务器错误' });
    });
});

// 获取单个学生接口
app.get('/students/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM users WHERE id = $1';

  client.query(query, [id])
    .then(result => {
      if (result.rows.length === 0) {
        return res.status(404).json({ message: '学生未找到' });
      }
      res.status(200).json(result.rows[0]);
    })
    .catch(err => {
      console.error('查询学生数据失败：', err);
      res.status(500).json({ message: '服务器错误' });
    });
});

// 更新学生信息接口
app.put('/students/:id', (req, res) => {
  const { id } = req.params;
  const { name, age, gender } = req.body;
  const query = 'UPDATE users SET name = $1, age = $2, gender = $3 WHERE id = $4';
  const values = [name, age, gender, id];

  client.query(query, values)
    .then(result => {
      if (result.rowCount === 0) {
        return res.status(404).json({ message: '学生未找到' });
      }
      res.status(200).json({ message: '学生信息更新成功' });
    })
    .catch(err => {
      console.error('更新学生数据失败：', err);
      res.status(500).json({ message: '服务器错误' });
    });
});

// 删除学生接口
app.delete('/students/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = $1';

  client.query(query, [id])
    .then(result => {
      if (result.rowCount === 0) {
        return res.status(404).json({ message: '学生未找到' });
      }
      res.status(200).json({ message: '学生删除成功' });
    })
    .catch(err => {
      console.error('删除学生数据失败：', err);
      res.status(500).json({ message: '服务器错误' });
    });
});


// 添加GPA
app.put('/students/:id/gpa', (req, res) => {
  const studentId = parseInt(req.params.id); // 获取 URL 中的学生ID
  const { gpa } = req.body; // 获取请求体中的 GPA

  const query = 'UPDATE users SET gpa = $1 WHERE id = $2 RETURNING id'; // 更新GPA的查询

  if (isNaN(gpa) || gpa < 0 || gpa > 4) {
    return res.status(400).json({ message: '绩点应在0到4之间' }); // 如果 GPA 不合法，返回 400
  }

  client.query(query, [gpa, studentId])
    .then(result => {
      if (result.rowCount === 0) {
        return res.status(404).json({ message: '未找到该学生' }); // 如果找不到学生，返回 404
      }
      res.status(200).json({ message: '学生绩点更新成功', studentId: result.rows[0].id }); // 返回成功消息和更新后的学生数据
    })
    .catch(err => {
      console.error('更新学生数据失败：', err);
      res.status(500).json({ message: '服务器错误' });
    });
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器正在监听 http://localhost:${port}`);
});
