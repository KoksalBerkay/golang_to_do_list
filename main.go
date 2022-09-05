package main

import (
	"database/sql"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"

	_ "github.com/jackc/pgx/v4/stdlib"
)

// It creates a file server that serves files from the directory "./static" and then it creates a
// handler that serves the index.html file from the same directory
func main() {
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	http.HandleFunc("/", serveTemplate)

	ConnectToDB()

	log.Print("Listening on :8080...")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}

// It takes a request, parses the template files, and writes the output to the response
func serveTemplate(w http.ResponseWriter, r *http.Request) {
	lp := filepath.Join("templates", "layout.html")
	fp := filepath.Join("templates", filepath.Clean(r.URL.Path))

	// Return a 404 if the template doesn't exist
	info, err := os.Stat(fp)
	if err != nil {
		if os.IsNotExist(err) {
			http.NotFound(w, r)
			return
		}
	}

	// Return a 404 if the request is for a directory
	if info.IsDir() {
		http.NotFound(w, r)
		return
	}

	tmpl, err := template.ParseFiles(lp, fp)
	if err != nil {
		// Log the detailed error
		log.Print(err.Error())
		// Return a generic "Internal Server Error" message
		http.Error(w, http.StatusText(500), 500)
		return
	}

	err = tmpl.ExecuteTemplate(w, "layout", nil)
	if err != nil {
		log.Print(err.Error())
		http.Error(w, http.StatusText(500), 500)
	}
}

func ConnectToDB() {
	// connect to database
	conn, err := sql.Open("pgx", "host=localhost port=5432 user=postgres password=12345 dbname=gotodo")
	if err != nil {
		log.Fatalf("Error opening database: %v\n", err)
	}
	defer conn.Close()

	log.Println("Connected to database")

	// test my connection
	err = conn.Ping()
	if err != nil {
		log.Fatal("Cannot ping database!")
	}

	log.Println("Pinged database!")

	// get rows from table
	err = getAllRows(conn)
	if err != nil {
		log.Fatal(err)
	}

	// insert a row
	query := `insert into todos (task_name, task_status, id) values ($1, $2, $3)`
	_, err = conn.Exec(query, "Study History", "checked", a_id)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Inserted a row!")

	// get rows from table again
	err = getAllRows(conn)
	if err != nil {
		log.Fatal(err)
	}
}

var a_id int

func getAllRows(conn *sql.DB) error {
	rows, err := conn.Query("select id, task_name, task_status from todos")
	if err != nil {
		log.Println(err)
		return err
	}
	defer rows.Close()

	var taskName, taskStatus string
	var id int

	for rows.Next() {
		err := rows.Scan(&id, &taskName, &taskStatus)
		if err != nil {
			log.Println(err)
			return err
		}
		a_id = id + 1
		fmt.Println("Record is", id, taskName, taskStatus)
	}

	if err = rows.Err(); err != nil {
		log.Fatal("Error scanning rows:", err)
	}

	fmt.Println("-----------------------")

	return nil
}
