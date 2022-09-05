package main

import (
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
