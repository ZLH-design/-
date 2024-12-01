// 获取所有学生的函数
async function fetchStudents() {
  try {
    const response = await fetch('http://localhost:3000/students');
    if (response.ok) {
      const data = await response.json();
      renderStudents(data);
    } else {
      console.error('获取学生数据失败');
    }
  } catch (error) {
    console.error('请求发生错误：', error);
  }
}

// 渲染学生列表的函数
function renderStudents(students) {
  const studentList = document.getElementById('student-list');
  studentList.innerHTML = '';  // 清空现有的列表

  students.forEach(student => {
    const studentItem = document.createElement('li');
    // 显示学生ID、姓名、年龄、性别和绩点
    studentItem.textContent = `ID: ${student.id}, Name: ${student.name}, Age: ${student.age}, Gender: ${student.gender}, GPA: ${student.gpa || '无'}`;
    studentList.appendChild(studentItem);
  });
}

// 创建新学生的函数
async function createStudent() {
  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;
  const gender = document.getElementById('gender').value;

  if (!name || !age || !gender) {
    alert('请填写完整的信息');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        age: age,
        gender: gender,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      alert(`学生已成功添加！学生ID: ${result.studentId}`);
      fetchStudents();  // 更新学生列表
    } else {
      alert('添加学生失败');
    }
  } catch (error) {
    console.error('请求发生错误：', error);
  }
}

// 更新学生信息的函数
async function updateStudent() {
  const id = document.getElementById('update-id').value;
  const name = document.getElementById('update-name').value;
  const age = document.getElementById('update-age').value;
  const gender = document.getElementById('update-gender').value;

  if (!id || !name || !age || !gender) {
    alert('请填写完整的信息');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/students/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        age: age,
        gender: gender,
      }),
    });

    if (response.ok) {
      alert('学生信息更新成功');
      fetchStudents();  // 更新学生列表
    } else {
      alert('更新学生信息失败');
    }
  } catch (error) {
    console.error('请求发生错误：', error);
  }
}

// 删除学生的函数
async function deleteStudent() {
  const id = document.getElementById('delete-id').value;

  if (!id) {
    alert('请输入学生ID');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/students/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('学生删除成功');
      fetchStudents();  // 更新学生列表
    } else {
      alert('删除学生失败');
    }
  } catch (error) {
    console.error('请求发生错误：', error);
  }
}

// 更新学生绩点的函数
async function updateGPA() {
  const id = document.getElementById('gpa-id').value;  // 获取学生ID
  const gpa = document.getElementById('gpa').value;  // 获取绩点

  // 检查输入
  if (!id || !gpa) {
    alert('请输入学生ID和绩点');
    return;
  }

  // 确保绩点在合法范围内
  if (isNaN(gpa) || gpa < 0 || gpa > 4) {
    alert('绩点应在0到4之间');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/students/${id}/gpa`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gpa: parseFloat(gpa),
      }),
    });

    if (response.ok) {
      alert('学生绩点更新成功');
    } else {
      const errorData = await response.json();
      alert(errorData.message || '更新学生绩点失败');
    }
  } catch (error) {
    console.error('请求发生错误：', error);
    alert('请求失败');
  }
}


// 初始化页面时获取学生数据
document.addEventListener('DOMContentLoaded', () => {
  fetchStudents();  // 获取并显示学生数据
});

// 监听按钮点击事件
document.getElementById('add-student-btn').addEventListener('click', createStudent);
document.getElementById('update-student-btn').addEventListener('click', updateStudent);
document.getElementById('delete-student-btn').addEventListener('click', deleteStudent);
document.getElementById('update-gpa-btn').addEventListener('click', updateGPA);
