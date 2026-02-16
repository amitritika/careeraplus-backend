# ADR 0001 — Auth token in cookie vs Authorization header

- **Status**: Accepted
- **Decision**: Use httpOnly cookie `token`; support `Authorization: Bearer` as fallback.
- **Consequences**: Simpler browser integration; ensure CORS/cookie flags are correct.
