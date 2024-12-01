const { Client } = require('pg');

// 配置数据库连接信息
const client = new Client({
  host: '123.249.92.120',    // openGauss 数据库主机地址
  port: 26000,              // openGauss 数据库端口，通常是 5432
  database: 'db_test2', // 数据库名
  user: 'test2',     // 数据库用户名
  password: 'Zlh040726', // 数据库密码
});

client.connect()
  .then(() => {
    console.log('Connected to the database!');
    // 不在此时关闭连接
  })
  .catch(err => {
    console.error('Database connection error:', err.stack);
  });


  module.exports = client;