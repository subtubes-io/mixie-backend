#!/usr/bin/env bash

# curl -X POST \
#     "http://localhost:8888/apis/ccompat/v6/subjects/MessageEvent/versions" \
#     -H "Content-Type: application/vnd.schemaregistry.v1+json" \
#     -d '{"schema": "{\"type\": \"record\", \"name\": \"MessageEvent\", \"namespace\": \"com.example.events\", \"fields\": [{\"name\": \"text\", \"type\": \"string\"}, {\"name\": \"timestamp\", \"type\": \"string\"}]}", "schemaType": "AVRO"}'

function main {

    case $1 in

    "register")
        curl -X POST http://localhost:8081/subjects/MessageEventJson/versions \
            -H "Content-Type: application/vnd.schemaregistry.v1+json" \
            -d '{"schemaType":"JSON","schema":'"$(jq -Rs . <schemas/message.json)"'}'

        ;;
    "message")
        curl -X POST "http://localhost:3000/" -H "Content-Type: application/json" \
            -d '{"text": "Hello, Apicurio!",  "timestamp": "2024-11-03T12:34:56Z"}'

        ;;
    *)
        echo "nothing in here"
        ;;
    esac
}

main "$@"
