# Basic set up

You can simply call the bash script at the root

```bash
./cmd.sh up
```

**Or you can manually run all these commands**

- `npm ci`
- `docker compose up -d`
- wait a few seconds
- `./cmd.sh register`
- `npm run start:dev`
- wait a few seconds for docker containers to be ready and for apps to connect and sync up

# Load Test

```bash
./cmd.sh load-test 20
```

# Requirements

- docker
- jq
- nodem + npm
