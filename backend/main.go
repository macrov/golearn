package main

import (
	"encoding/json"
	"log"
	"net/http"
	"path/filepath"
	"strings"
)

func main() {
	mux := http.NewServeMux()

	// API routes
	mux.HandleFunc("/api/courses", coursesHandler)
	mux.HandleFunc("/api/courses/", courseByIDHandler)

	// Static file serving
	mux.HandleFunc("/", staticFileHandler)

	// Wrap with CORS middleware
	handler := corsMiddleware(mux)

	addr := ":8080"
	log.Printf("Server starting on %s", addr)
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatal(err)
	}
}

// corsMiddleware adds CORS headers to all responses
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// staticFileHandler serves static files from frontend/dist
func staticFileHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		// Try to serve the requested file
		filePath := filepath.Join("./frontend/dist", r.URL.Path)
		http.ServeFile(w, r, filePath)
		return
	}

	// Serve index.html for root path
	http.ServeFile(w, r, filepath.Join("./frontend/dist", "index.html"))
}

// coursesHandler handles GET /api/courses
func coursesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	courses := getCourses()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(courses)
}

// courseByIDHandler handles GET /api/courses/:id
func courseByIDHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extract ID from path
	id := strings.TrimPrefix(r.URL.Path, "/api/courses/")
	if id == "" {
		http.Error(w, "Course ID required", http.StatusBadRequest)
		return
	}

	course, found := getCourseByID(id)
	if !found {
		http.Error(w, "Course not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(course)
}
