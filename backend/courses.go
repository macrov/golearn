package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"time"
)

// Course represents a learning course
type Course struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Instructor  string    `json:"instructor"`
	Duration    int       `json:"duration"`
	Level       string    `json:"level"`
	Category    string    `json:"category"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// CourseDetail extends Course with lessons
type CourseDetail struct {
	Course
	Lessons []Lesson `json:"lessons"`
}

// Lesson represents a lesson within a course
type Lesson struct {
	ID         string      `json:"id"`
	Title      string      `json:"title"`
	Description string     `json:"description"`
	Order      int         `json:"order"`
	Content    string      `json:"content"`
	Code       string      `json:"code"`
	TestCases  []TestCase  `json:"test_cases"`
}

// TestCase represents a test case for lesson code
type TestCase struct {
	Input          string `json:"input"`
	ExpectedOutput string `json:"expected_output"`
}

// courseData represents the structure of course JSON files
type courseData struct {
	ID          string   `json:"id"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Instructor  string   `json:"instructor"`
	Duration    int      `json:"duration"`
	Level       string   `json:"level"`
	Category    string   `json:"category"`
	Lessons     []Lesson `json:"lessons"`
}

var coursesCache []Course

// loadCourses loads all courses from JSON files
func loadCourses() []Course {
	if coursesCache != nil {
		return coursesCache
	}

	coursesDir := "./backend/data/courses"
	entries, err := os.ReadDir(coursesDir)
	if err != nil {
		return []Course{}
	}

	var courses []Course
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}

		filePath := filepath.Join(coursesDir, entry.Name())
		data, err := os.ReadFile(filePath)
		if err != nil {
			continue
		}

		var cd courseData
		if err := json.Unmarshal(data, &cd); err != nil {
			continue
		}

		courses = append(courses, Course{
			ID:          cd.ID,
			Title:       cd.Title,
			Description: cd.Description,
			Instructor:  cd.Instructor,
			Duration:    cd.Duration,
			Level:       cd.Level,
			Category:    cd.Category,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		})
	}

	coursesCache = courses
	return courses
}

// getCourses returns all courses
func getCourses() []Course {
	return loadCourses()
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

// getCourseDetail returns a course with its lessons
func getCourseDetail(id string) (CourseDetail, bool) {
	coursesDir := "./backend/data/courses"
	entries, err := os.ReadDir(coursesDir)
	if err != nil {
		return CourseDetail{}, false
	}

	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}

		filePath := filepath.Join(coursesDir, entry.Name())
		data, err := os.ReadFile(filePath)
		if err != nil {
			continue
		}

		var cd courseData
		if err := json.Unmarshal(data, &cd); err != nil {
			continue
		}

		if cd.ID == id {
			return CourseDetail{
				Course: Course{
					ID:          cd.ID,
					Title:       cd.Title,
					Description: cd.Description,
					Instructor:  cd.Instructor,
					Duration:    cd.Duration,
					Level:       cd.Level,
					Category:    cd.Category,
					CreatedAt:   time.Now(),
					UpdatedAt:   time.Now(),
				},
				Lessons: cd.Lessons,
			}, true
		}
	}

	return CourseDetail{}, false
}

// getLessonByID returns a specific lesson from a course
func getLessonByID(courseID, lessonID string) (Lesson, bool) {
	detail, found := getCourseDetail(courseID)
	if !found {
		return Lesson{}, false
	}

	for _, lesson := range detail.Lessons {
		if lesson.ID == lessonID {
			return lesson, true
		}
	}

	return Lesson{}, false
}
