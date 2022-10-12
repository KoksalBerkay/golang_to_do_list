package main

import (
	"database/sql"
	"net/http"
	"testing"

	_ "github.com/jackc/pgx/v4/stdlib"
)

func Test_main(t *testing.T) {
	tests := []struct {
		name string
	}{}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			main()
		})
	}
}

func Test_serveTemplate(t *testing.T) {
	type args struct {
		w http.ResponseWriter
		r *http.Request
	}
	tests := []struct {
		name string
		args args
	}{}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			serveTemplate(tt.args.w, tt.args.r)
		})
	}
}

func Test_connectToDB(t *testing.T) {
	tests := []struct {
		name string
	}{}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			connectToDB()
		})
	}
}

func Test_getAllRows(t *testing.T) {
	type args struct {
		conn *sql.DB
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := getAllRows(tt.args.conn); (err != nil) != tt.wantErr {
				t.Errorf("getAllRows() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func Test_listTodos(t *testing.T) {
	type args struct {
		w http.ResponseWriter
		r *http.Request
	}
	tests := []struct {
		name string
		args args
	}{}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			listTodos(tt.args.w, tt.args.r)
		})
	}
}

func Test_receiveAjax(t *testing.T) {
	type args struct {
		w http.ResponseWriter
		r *http.Request
	}
	tests := []struct {
		name string
		args args
	}{}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			receiveAjax(tt.args.w, tt.args.r)
		})
	}
}
