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
    "load-test")
        # Set the number of threads from the second argument, or default to 100 if not provided
        max_threads=${2:-100}
        current_threads=0

        echo "Starting load test with $max_threads threads."

        for i in $(seq 1 50000); do
            # Run each curl command in the background
            curl -X POST "http://localhost:3000/" -H "Content-Type: application/json" \
                -d '{"text": "Hello, Apicurio!", "timestamp": "2024-11-03T12:34:56Z"}' &

            echo "Request $i sent."

            # Increment the number of active threads
            ((current_threads++))

            # If max_threads is reached, wait for all background processes to finish
            if [[ "$current_threads" -ge "$max_threads" ]]; then
                wait              # Wait for all background processes to complete
                current_threads=0 # Reset the thread counter
            fi
        done

        # Final wait to ensure all background processes complete
        wait
        ;;
    *)
        echo "nothing in here"
        ;;
    esac
}

main "$@"
