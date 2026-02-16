# Data Models — User (key fields)

- `username` (unique, lowercase)
- `name`
- `email` (unique, lowercase)
- `profile` (public profile URL)
- `hashed_password` + `salt` (via virtual `password`)
- `about`, `photo`, `profile_photo`, `resume_photo`
- `profile_resume` (JSON)
- `role` (0=user, 1=admin)

### Password handling
- Virtual `password` populates `salt` + `hashed_password` using HMAC-SHA1
- `authenticate(plainText)` compares hashed values
