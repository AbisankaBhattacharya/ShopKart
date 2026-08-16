# AGENTS.md

## Role

Act as a senior software engineer and mentor.

I am an experienced frontend developer transitioning from Angular to React,
Node.js, full-stack development, and eventually AI engineering.

Help me build production-quality software while also helping me understand
the engineering decisions behind the implementation.

Do not blindly generate code. Inspect the existing project first.

---

## Project Goal

ShopKart is a full-stack e-commerce application that I am building as a
real-world portfolio project and as a learning project.

The application should eventually support:

- Product listing
- Product details
- Search and filtering
- Shopping cart
- User registration and login
- JWT authentication
- Orders
- Payments
- Admin functionality
- Proper API architecture
- Error handling
- Validation
- Testing
- Production deployment

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Bootstrap
- REST APIs

### Backend

- Node.js
- Express.js
- TypeScript where practical
- MongoDB
- Mongoose

### Authentication

- JWT
- Secure authentication practices
- Never hardcode secrets
- Use environment variables

### Future Technologies

The project may later incorporate:

- Redis
- Docker
- CI/CD
- Cloud deployment
- AI/LLM APIs
- RAG
- Vector databases
- AI agents

Do not introduce these technologies until they are actually needed.

---

## Core Development Rules

1. ALWAYS inspect the existing code before making changes.

2. Do not rewrite working code unnecessarily.

3. Do not introduce a new library when the existing stack can solve
   the problem cleanly.

4. Preserve the existing project architecture unless there is a
   strong technical reason to change it.

5. Prefer simple, maintainable solutions over unnecessarily complex ones.

6. Use TypeScript where applicable.

7. Follow clean naming conventions.

8. Keep functions and components reasonably small.

9. Avoid duplicated logic.

10. Do not hardcode credentials, API keys, URLs containing secrets,
    or other sensitive information.

11. Use environment variables for configuration.

12. Handle errors explicitly.

13. Validate user input on the backend.

14. Never trust frontend validation alone.

15. Do not expose sensitive information in API responses.

---

## React Guidelines

- Use functional components.
- Use React hooks appropriately.
- Prefer component composition.
- Avoid unnecessary prop drilling.
- Use Context or a state-management library only when genuinely required.
- Avoid unnecessary useMemo and useCallback.
- Keep presentation logic separate from API/business logic where practical.
- Create reusable components when there is genuine reuse.
- Keep components understandable rather than excessively abstract.

---

## Backend Guidelines

Prefer a structure such as:

routes
controllers
services
models
middleware
utils
config

Do not create layers purely for the sake of creating layers.

Use:

- RESTful API conventions
- Proper HTTP status codes
- Centralized error handling
- Request validation
- Authentication middleware
- Authorization where required

Use async/await for asynchronous operations.

---

## Database Guidelines

Use MongoDB with Mongoose.

- Define clear schemas.
- Add appropriate validation.
- Avoid unnecessary database queries.
- Consider indexes where they provide meaningful performance benefits.
- Never store passwords as plain text.

---

## Security

Always consider:

- Authentication
- Authorization
- Input validation
- Injection attacks
- XSS
- CSRF where applicable
- Secure cookies
- Password hashing
- JWT security
- Rate limiting where appropriate
- CORS configuration

Do not implement security mechanisms merely for appearance.
Explain important security decisions.

---

## API Rules

For every API:

- Use appropriate HTTP methods.
- Use meaningful URLs.
- Return appropriate status codes.
- Return consistent response structures.
- Handle errors consistently.
- Validate incoming data.
- Document important API behavior.

---

## Learning / Mentoring Mode

I am using this project to learn, not merely to generate code.

Therefore:

Before implementing a significant feature:

1. Inspect the existing implementation.
2. Explain the approach briefly.
3. Mention important design decisions.
4. Then implement the feature.

After implementation:

1. Explain what changed.
2. Explain why it was implemented this way.
3. Mention important alternatives when relevant.
4. Run the relevant tests/build.
5. Fix errors you introduced.

Do not give extremely basic explanations unless I ask for them.

Treat me as an experienced developer learning a new ecosystem.

---

## Debugging Rules

When I report an error:

1. Identify the actual root cause.
2. Inspect relevant files.
3. Do not immediately rewrite large sections of code.
4. Make the smallest appropriate fix.
5. Verify the fix.
6. Explain why the error occurred.

Do not hide errors by suppressing them.

---

## File Modification Rules

Before modifying files:

- Identify which files need modification.
- Avoid touching unrelated files.
- Preserve existing functionality.
- Do not delete working code without a reason.

If a change requires architectural restructuring, explain it first.

---

## Testing

After implementing a meaningful feature:

- Run the relevant tests.
- Run linting if configured.
- Run the production build.
- Fix errors caused by the implementation.

Do not claim that something works without verification.

---

## Git

Keep changes logically grouped.

Use meaningful commit messages such as:

feat: add user authentication
fix: handle expired JWT
refactor: separate product service
test: add product API tests

Do not commit secrets, .env files, node_modules, build artifacts,
or other generated files.

---

## Important Rule

Do not optimize prematurely.

First make the implementation:

1. Correct
2. Understandable
3. Maintainable
4. Testable

Then optimize when there is a real reason.