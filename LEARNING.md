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

---
## Architecture Decisions
### Decision 1: Separate Frontend and Backend Repos vs Monorepo
**Options Considered:**
1. Single repository with `client/` and `server/` folders
2. Separate repositories for frontend and backend  
**Decision:** Single repository (monorepo)  
**Reasoning:**
- Simpler for portfolio project (one URL to share)
- Easier local development (one `git clone`)
- Version control stays in sync
- Can deploy both from same CI/CD pipeline
**Trade-offs:**
- Would need to split for larger teams
- Some duplication in CI/CD config
- All-or-nothing deployments  
**Would I change this?** No, for a portfolio project this was the right choice.
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
1. **Test-Driven Development**
- Writing tests first improves design
- Test pyramid strategy prevents over-testing
- Test data management is critical
2. **API Design**
- RESTful conventions make APIs intuitive
- Input validation prevents bad data
- Error handling improves debugging
3. **Database Relationships**
- Understand populate() vs manual joins
- Query optimization matters early
- Schema design impacts performance
4. **CI/CD Best Practices**
- Fail fast with strict checks
- Coverage thresholds prevent regression
- In-memory databases simplify CI
### Process Learnings:
1. **Scope Management**
- Saying "no" to features is a skill
- Time-boxing prevents perfection paralysis
- Finishing > polishing
2. **Documentation**
- Write as you go, not at the end
- Future you is your first user
- Good README = professional project
3. **Problem Solving**
- Document blockers before asking for help
- Sometimes the solution is simpler than you think
- Google the error message first
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