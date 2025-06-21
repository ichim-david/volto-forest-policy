# AGENTS instructions

This repository uses Docker Compose for running tests, linters and the development stack.

- Use `./scripts/setup-docker.sh` once to pull images and build the frontend container. It falls back to plain `docker` commands if `docker compose` is not available.
- Run tests with `make test` and lint the code with `yarn lint` or `make lint`.
- These commands require Docker. Without Docker available they will fail.
- No special instructions for documentation changes.
