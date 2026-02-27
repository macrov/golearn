package main

import "time"

// Course represents a learning course
type Course struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Instructor  string    `json:"instructor"`
	Duration    int       `json:"duration"`    // in hours
	Level       string    `json:"level"`       // beginner, intermediate, advanced
	Category    string    `json:"category"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// getCourses returns all courses (hardcoded for now)
func getCourses() []Course {
	return []Course{
		{
			ID:          "go-basics",
			Title:       "Go 编程基础",
			Description: "学习 Go 语言的核心概念，包括变量、类型、函数和控制流",
			Instructor:  "张三",
			Duration:    12,
			Level:       "beginner",
			Category:    "programming",
			CreatedAt:   time.Date(2024, 1, 15, 0, 0, 0, 0, time.UTC),
			UpdatedAt:   time.Date(2024, 1, 15, 0, 0, 0, 0, time.UTC),
		},
		{
			ID:          "web-development",
			Title:       "Web 开发入门",
			Description: "使用 HTML、CSS 和 JavaScript 构建现代网站",
			Instructor:  "李四",
			Duration:    20,
			Level:       "beginner",
			Category:    "web",
			CreatedAt:   time.Date(2024, 1, 20, 0, 0, 0, 0, time.UTC),
			UpdatedAt:   time.Date(2024, 1, 20, 0, 0, 0, 0, time.UTC),
		},
		{
			ID:          "data-structures",
			Title:       "数据结构与算法",
			Description: "深入理解常用数据结构和算法设计",
			Instructor:  "王五",
			Duration:    30,
			Level:       "intermediate",
			Category:    "computer-science",
			CreatedAt:   time.Date(2024, 2, 1, 0, 0, 0, 0, time.UTC),
			UpdatedAt:   time.Date(2024, 2, 1, 0, 0, 0, 0, time.UTC),
		},
		{
			ID:          "database-design",
			Title:       "数据库设计原理",
			Description: "学习关系型数据库设计和 SQL 查询优化",
			Instructor:  "赵六",
			Duration:    15,
			Level:       "intermediate",
			Category:    "database",
			CreatedAt:   time.Date(2024, 2, 10, 0, 0, 0, 0, time.UTC),
			UpdatedAt:   time.Date(2024, 2, 10, 0, 0, 0, 0, time.UTC),
		},
	}
}

// getCourseByID returns a course by its ID
func getCourseByID(id string) (Course, bool) {
	courses := getCourses()
	for _, course := range courses {
		if course.ID == id {
			return course, true
		}
	}
	return Course{}, false
}
