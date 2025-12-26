# Learning Log
> Documentation of challenges faced, solutions implemented, and lessons learned
while building the Learning Progress Dashboard.
---
## Project Context
**Start Date:** 12/25/25  
**Completion Date:** [Date]  
**Time Investment:** ~30 hours over 8 weeks
**Primary Goal:** Demonstrate full-stack development with test-first approach
---
## Table of Contents
1. [Technical Challenges](#technical-challenges)
2. [Architecture Decisions](#architecture-decisions)
3. [Testing Insights](#testing-insights)
4. [Things I Would Do Differently](#things-i-would-do-differently)
5. [Key Learnings](#key-learnings)
---
## Technical Challenges
## Phase 1: Backend Foundation

### Challenge: Node.js Environment Failure (WSL2)
**Issue:** `node -v` failed with `error while loading shared libraries: libatomic.so.1`.  
**Cause:** Missing system-level library in the minimal Linux distribution within WSL.  
**Solution:** Installed `libatomic1` via `apt-get`.  
**Takeaway:** Even in a "Node.js project," the underlying OS environment matters. This reinforced my Ops mindset regarding environment parity.

### Challenge: MongoDB Memory Server Binary Failure (WSL2)
**Issue:** `mongodb-memory-server` failed to start or find its binary within the WSL environment.  
**Cause:** Underlying dependency issues in the Linux subsystem (similar to the `libatomic1` issue).  
**Solution:** Verified system libraries and ensured the test runner had the correct permissions to execute the downloaded binary.  
**Takeaway:** Troubleshooting environment-specific "handshakes" between the OS and Node modules is a core SRE skill.

### Challenge: Designing for Testability vs. Speed
**Issue:** Initial instinct was to combine server listening logic and app configuration in a single file to "just get it working."
**Cause:** Previous experience with simple CRUD tutorials prioritized speed over professional architecture.
**Solution:** Decoupled `app.js` (logic/middleware) from `server.js` (listener/entry point). 
**Takeaway:** This separation prevents "Address already in use" errors during automated testing. By not binding the app to a network port during tests, Supertest can run "virtual" requests, making the test suite faster and more reliable—a key requirement for the Quality Strategy defined in this project.

---
## Architecture Decisions
### Decision 1: MongoDB Atlas (Cloud) vs. Local MongoDB
**Decision:** MongoDB Atlas for Development.  
**Reasoning:** - **Portability:** Allows development across different environments without re-configuring local database services.  
- **Ops Exposure:** Provided experience with cloud network access, IP whitelisting, and managed database security.  
- **Deployment Readiness:** Prepared the infrastructure for the Phase 5 deployment milestone.  

### Decision 2: In-Memory Testing vs. Mocking
**Options Considered:** `mongodb-memory-server` vs. `mockingoose`.  
**Decision:** `mongodb-memory-server`.  
**Reasoning:** - **High Fidelity:** Mocks can pass even if the schema validation is broken. Using an in-memory database ensures that Mongoose constraints (like `min/max` and `required`) are actually enforced during tests.  
- **Reliability:** It creates a "hermetic" test environment that doesn't rely on the internet or pollute the dev database.
---
## Testing Insights
### Insight 1: Writing Tests First Changed My Design
**What Happened:**
Started writing tests before implementing controller logic.
**Impact:**
- Functions became smaller and more focused
- Easier to test = better designed
- Caught edge cases earlier
- Less refactoring needed later
**Example:**
Initially had one large `createCertification` function. Tests revealed it was doing too
much. Split into:
- Input validation
- Data transformation
- Database operation
- Response formatting
Each piece became independently testable.
**Takeaway:** TDD isn't just about tests—it improves code design.
---
## Things I Would Do Differently
### 1. Start with OpenAPI/Swagger Documentation
**What I Did:**
Documented API in README after building it.
**What I'd Do:**
Write OpenAPI spec first, then implement endpoints to match.
**Why:**
- API contract defined upfront
- Can generate client code
- Better for team collaboration
- Forces thinking about API design
---
## Key Learnings
### Technical Skills Gained:

### Process Learnings:
1. **Strategic Scope Management**
- **The "Quick Win" Filter:** Decided to add `overallProgress` to the Certification model early. Even though it wasn't in the initial plan, I identified it as a high-value/low-effort addition that allowed me to implement and test complex Mongoose validations immediately.
### Career Learnings:
1. **Portfolio Projects**
- One good project > three half-finished
- Tests prove you care about quality
- Documentation proves you can communicate
2. **Transitioning Roles**
- Leverage existing skills (ops → reliability)
- Build evidence, not just claims
- Connect past experience to new skills
---
## Statistics
**Total Time:** ~30 hours
**Code Written:** ~2,500 lines (app) + ~1,500 lines (tests)
**Tests Written:** 38 (25 unit, 10 integration, 3 E2E)
**Test Coverage:** 72%
**Commits:** 87
**Bugs Fixed:** 12
**Features Deferred to V2:** 15
---
## Resources That Helped
**Documentation:**
- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [Jest Docs](https://jestjs.io/)
**Tutorials:**
- MongoDB University (free courses)
- Traversy Media YouTube channel
- FreeCodeCamp articles
**Tools:**
- Postman (API testing)
- MongoDB Compass (database visualization)
- Cypress Test Runner (E2E debugging)
---
## Final Thoughts
This project solidified my understanding of full-stack development and test-driven
practices. The biggest surprise was how much writing tests first improved my code
design—I expected it to slow me down, but it actually saved time by catching issues
early.
If I were to start another project tomorrow, I would:
1. Write OpenAPI spec first
2. Set up logging and monitoring from Day 1
3. Create seed data for manual testing
4. Document architecture decisions as I make them
The goal was to demonstrate software engineering discipline while transitioning
from IT Operations to a development role. I believe this project accomplishes that
goal.