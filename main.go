package main

import (
	"database/sql"
	"encoding/json"
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
	http.HandleFunc("/receive", receiveAjax)
	http.HandleFunc("/todos", listTodos)

	connectToDB()

	log.Print("Listening on :8080...")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}

func listTodos(w http.ResponseWriter, r *http.Request) {
	conn, err := sql.Open("pgx", "host=localhost port=5432 user=postgres password=12345 dbname=gotodo")
	if err != nil {
		log.Fatalf("Error opening database: %v\n", err)
	}
	defer conn.Close()

	rows, err := conn.Query("select id, task_name, task_status from todos")
	if err != nil {
		log.Println(err)
	}
	defer rows.Close()

	var taskName, taskStatus string
	var id int

	for rows.Next() {
		err := rows.Scan(&id, &taskName, &taskStatus)
		if err != nil {
			log.Println(err)
		}
		a_id = id + 1
		req := Request{TaskName: taskName, TaskStatus: taskStatus}
		json.NewEncoder(w).Encode(req)
	}

	if err = rows.Err(); err != nil {
		log.Fatal("Error scanning rows:", err)
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

// Creates a connection to the database
func connectToDB() {
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
}

// a_id is 1 more than the id of the last element
var a_id int = 0

// Prints all the rows in the table
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

// It inserts to the database (Pay attention to the id)
func insertToDB(conn *sql.DB) error {
	query := `insert into todos (task_name, task_status, id) values ($1, $2, $3)`
	_, err := conn.Exec(query, "Study math", "not_checked", a_id)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Inserted a row!")
	return nil
}

// Updates the row (Don't forget to change the id)
func updateRow(conn *sql.DB) error {
	query := `update todos set task_status = $1 where id = $2`
	_, err := conn.Exec(query, "checked", 1)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Updated a row!")
	return nil
}

// It deletes a row (Pay attention to the id)
func deleteRow(conn *sql.DB) error {
	query := `delete from todos where id = $1`
	_, err := conn.Exec(query, (a_id - 1))
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Deleted a row!")
	return nil
}

type Request struct {
	TaskName   string `json:"task"`
	TaskStatus string `json:"status"`
}

func receiveAjax(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		// Receive the request
		decoder := json.NewDecoder(r.Body)
		req := Request{}
		err := decoder.Decode(&req)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Print("\n Req: ", req, "\n")

		// Connect to database
		conn, err := sql.Open("pgx", "host=localhost port=5432 user=postgres password=12345 dbname=gotodo")
		if err != nil {
			log.Fatalf("Error opening database: %v\n", err)
		}
		defer conn.Close()

		// Insert to database
		query := `insert into todos (task_name, task_status, id) values ($1, $2, $3)`
		_, err = conn.Exec(query, req.TaskName, req.TaskStatus, a_id)
		if err != nil {
			log.Fatal(err)
		}

		log.Println("Inserted a row!")
	}
}
