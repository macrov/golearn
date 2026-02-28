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
  description TEXT,
  content TEXT,
  code TEXT,
  hints TEXT,
  expected_output TEXT,
  "order" INTEGER DEFAULT 0,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- 清空现有数据
DELETE FROM lessons;
DELETE FROM courses;

-- 插入课程数据
INSERT INTO courses (id, title, description, instructor, duration, level, category, lessons_count)
VALUES 
  ('go-basics', 'Go 编程基础', '学习 Go 语言的核心概念，包括变量、类型、函数和控制流', '张三', 12, 'beginner', 'programming', 5),
  ('go-functions', 'Go 函数进阶', '深入学习 Go 语言的函数特性', '李四', 10, 'intermediate', 'programming', 4);

-- 插入课时数据 - Go 基础
INSERT INTO lessons (id, course_id, title, description, content, code, hints, expected_output, "order")
VALUES
  ('hello-world', 'go-basics', 'Hello World', '第一个 Go 程序', 
   '# Hello World\n\n让我们从经典的 Hello World 开始！\n\n## 代码说明\n\n- `package main` - 声明主包\n- `import "fmt"` - 导入格式化输出库\n- `func main()` - 主函数入口\n\n## 练习\n\n修改程序，输出你的名字！',
   'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
   '["fmt.Println 会自动换行", "字符串用双引号包围"]',
   'Hello, World!', 1),

  ('variables', 'go-basics', '变量与类型', '学习 Go 的变量声明', 
   '# 变量与类型\n\nGo 是静态类型语言，变量必须声明类型。\n\n## 声明方式\n\n1. `var name type` - 标准声明\n2. `name := value` - 短声明（推荐）\n\n## 常见类型\n\n- `string` - 字符串\n- `int` - 整数\n- `bool` - 布尔值\n- `float64` - 浮点数',
   'package main\n\nimport "fmt"\n\nfunc main() {\n    var name string = "Go"\n    age := 15\n    fmt.Printf("Language: %s, Age: %d years\\n", name, age)\n}',
   '[":= 是短声明语法", "Printf 用于格式化输出", "%s 是字符串占位符, %d 是整数占位符"]',
   'Language: Go, Age: 15 years', 2),

  ('functions', 'go-basics', '函数', '学习如何定义和调用函数', 
   '# 函数\n\n函数是组织代码的基本单元。\n\n## 语法\n\n```go\nfunc name(params) returnType {\n    // 函数体\n    return value\n}\n```\n\n## 要点\n\n- 函数名首字母大写 = 导出（公开）\n- 函数名首字母小写 = 私有',
   'package main\n\nimport "fmt"\n\nfunc greet(name string) string {\n    return "Hello, " + name + "!"\n}\n\nfunc main() {\n    message := greet("Go")\n    fmt.Println(message)\n}',
   '["函数可以有参数和返回值", "用 + 连接字符串"]',
   'Hello, Go!', 3),

  ('if-else', 'go-basics', '条件判断', '学习 if/else 语句', 
   '# 条件判断\n\nGo 的条件语句不需要括号包围条件。\n\n## 语法\n\n```go\nif condition {\n    // true\n} else {\n    // false\n}\n```\n\n## 注意\n\n- 花括号必须保留\n- else 必须在同一行',
   'package main\n\nimport "fmt"\n\nfunc main() {\n    age := 18\n    if age >= 18 {\n        fmt.Println("成年人")\n    } else {\n        fmt.Println("未成年")\n    }\n}',
   '["条件不需要括号", "花括号必须保留"]',
   '成年人', 4),

  ('loops', 'go-basics', '循环', '学习 Go 的循环语句', 
   '# 循环\n\nGo 只有 `for` 一种循环，但可以模拟 while。\n\n## 基本语法\n\n```go\nfor i := 0; i < 5; i++ {\n    // 循环体\n}\n```\n\n## 模拟 while\n\n```go\nfor condition {\n    // 循环体\n}\n```',
   'package main\n\nimport "fmt"\n\nfunc main() {\n    for i := 1; i <= 3; i++ {\n        fmt.Printf("第 %d 次\\n", i)\n    }\n    fmt.Println("完成！")\n}',
   '["i++ 是 i = i + 1 的简写", "Printf 用于格式化输出"]',
   '第 1 次\n第 2 次\n第 3 次\n完成！', 5);

-- 插入课时数据 - Go 函数进阶
INSERT INTO lessons (id, course_id, title, description, content, code, hints, expected_output, "order")
VALUES
  ('multiple-returns', 'go-functions', '多返回值', '学习函数返回多个值', 
   '# 多返回值\n\nGo 函数可以返回多个值。\n\n## 语法\n\n```go\nfunc divmod(a, b int) (int, int) {\n    return a / b, a % b\n}\n```\n\n## 常见用法\n\n返回值 + 错误：\n\n```go\nfunc readFile(path string) ([]byte, error) {\n    // ...\n}\n```',
   'package main\n\nimport "fmt"\n\nfunc divmod(a, b int) (int, int) {\n    return a / b, a % b\n}\n\nfunc main() {\n    q, r := divmod(10, 3)\n    fmt.Printf("商: %d, 余数: %d\\n", q, r)\n}',
   '["用逗号分隔多个返回值", "q, r := 接收多个返回值"]',
   '商: 3, 余数: 1', 1),

  ('variadic', 'go-functions', '可变参数', '学习可变参数函数', 
   '# 可变参数\n\n函数可以接受任意数量的参数。\n\n## 语法\n\n```go\nfunc sum(nums ...int) int {\n    total := 0\n    for _, n := range nums {\n        total += n\n    }\n    return total\n}\n```\n\n## 要点\n\n- `...type` 表示可变参数\n- 参数在函数内是切片',
   'package main\n\nimport "fmt"\n\nfunc sum(nums ...int) int {\n    total := 0\n    for _, n := range nums {\n        total += n\n    }\n    return total\n}\n\nfunc main() {\n    result := sum(1, 2, 3, 4, 5)\n    fmt.Printf("总和: %d\\n", result)\n}',
   '["...int 表示可变数量的 int", "_ 忽略索引，只取值"]',
   '总和: 15', 2),

  ('closures', 'go-functions', '闭包', '学习匿名函数和闭包', 
   '# 闭包\n\n匿名函数可以捕获外部变量。\n\n## 语法\n\n```go\nadder := func(a, b int) int {\n    return a + b\n}\n```\n\n## 闭包特性\n\n函数引用外部变量，即使变量已离开作用域。',
   'package main\n\nimport "fmt"\n\nfunc counter() func() int {\n    count := 0\n    return func() int {\n        count++\n        return count\n    }\n}\n\nfunc main() {\n    c := counter()\n    fmt.Println(c())\n    fmt.Println(c())\n    fmt.Println(c())\n}',
   '["匿名函数没有名字", "闭包可以访问外部变量"]',
   '1\n2\n3', 3),

  ('defer', 'go-functions', 'Defer', '学习 defer 语句', 
   '# Defer\n\n`defer` 延迟执行到函数返回前。\n\n## 用途\n\n- 关闭文件\n- 释放锁\n- 清理资源\n\n## 特性\n\n- 多个 defer 按 LIFO 顺序执行\n- 参数在 defer 时就已计算',
   'package main\n\nimport "fmt"\n\nfunc main() {\n    defer fmt.Println("最后执行")\n    fmt.Println("第一步")\n    fmt.Println("第二步")\n}',
   '["defer 延迟到函数返回前执行", "多个 defer 按后进先出顺序"]',
   '第一步\n第二步\n最后执行', 4);
