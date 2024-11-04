#!/usr/bin/env bash

function register {
    if curl -X POST http://localhost:8081/subjects/MessageEventJson/versions \
        -H "Content-Type: application/vnd.schemaregistry.v1+json" \
        -d '{"schemaType":"JSON","schema":'"$(jq -Rs . <schemas/message.json)"'}'; then
        echo "Schema registered successfully."
    else
        echo "Failed to register schema." >&2
        exit 1
    fi
}

function main {

    case $1 in

    "up")
        mkdir -p ./.vols/postgres
        mkdir -p ./.vols/kafka
        npm ci
        docker compose up -d
        wait 20
        register
        npm run start:dev
        ;;
    "register")
        register
        ;;
    "message")
        curl -X POST "http://localhost:3000/" -H "Content-Type: application/json" \
            -d '{"text": "Hello, Apicurio!",  "timestamp": "2024-11-03T12:34:56Z"}'

        ;;
    "load-test")
        # Set the number of threads from the second argument, or default to 100 if not provided
        max_threads=${2:-10}
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
