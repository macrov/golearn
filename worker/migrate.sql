-- 删除旧表
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS courses;

-- 重新创建
CREATE TABLE courses (
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

CREATE TABLE lessons (
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
