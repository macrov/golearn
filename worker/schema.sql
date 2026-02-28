-- 课程表
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT,
  duration INTEGER,
  level TEXT,
  category TEXT,
  lessons_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 课时表
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  code TEXT,
  hints TEXT,
  expected_output TEXT,
  "order" INTEGER DEFAULT 0,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- 插入课程数据
INSERT OR REPLACE INTO courses (id, title, description, instructor, duration, level, category, lessons_count)
VALUES 
  ('go-basics', 'Go 编程基础', '学习 Go 语言的核心概念，包括变量、类型、函数和控制流', '张三', 12, 'beginner', 'programming', 5),
  ('go-functions', 'Go 函数进阶', '深入学习 Go 语言的函数特性', '李四', 10, 'intermediate', 'programming', 4);

-- 插入课时数据
INSERT OR REPLACE INTO lessons (id, course_id, title, content, code, expected_output, "order")
VALUES
  ('hello-world', 'go-basics', 'Hello World', '# Hello World\n\n让我们从经典的 Hello World 开始！\n\n## 代码说明\n\n- `package main` - 声明主包\n- `import "fmt"` - 导入格式化输出库\n- `func main()` - 主函数入口', 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}', 'Hello, World!', 1),
  ('variables', 'go-basics', '变量与类型', '# 变量与类型\n\nGo 是静态类型语言，变量必须声明类型。\n\n## 声明方式\n\n1. `var name type`\n2. `name := value` (短声明)', 'package main\n\nimport "fmt"\n\nfunc main() {\n    var name string = "Go"\n    age := 15\n    fmt.Printf("Language: %s, Age: %d years\n", name, age)\n}', 'Language: Go, Age: 15 years', 2);
