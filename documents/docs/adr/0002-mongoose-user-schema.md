# ADR 0002 — User schema with virtual password (HMAC-SHA1)

- **Status**: Accepted
- **Decision**: Keep legacy `hashed_password` + `salt` with virtual `password` and `authenticate()`.
- **Consequences**: Compatible with existing data; bcrypt migration would need a plan.
