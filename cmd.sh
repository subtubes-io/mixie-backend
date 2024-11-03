#!/usr/bin/env bash

curl -X POST \
    "http://localhost:8888/apis/ccompat/v6/subjects/MessageEvent/versions" \
    -H "Content-Type: application/vnd.schemaregistry.v1+json" \
    -d '{"schema": "{\"type\": \"record\", \"name\": \"MessageEvent\", \"namespace\": \"com.example.events\", \"fields\": [{\"name\": \"text\", \"type\": \"string\"}, {\"name\": \"timestamp\", \"type\": \"string\"}]}", "schemaType": "AVRO"}'
