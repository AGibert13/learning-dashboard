# Learning Log

> Documentation of challenges faced, solutions implemented, and lessons learned while building the Learning Progress Dashboard.
---

## Project Context

- **Start Date:** 12/25/25  
- **Completion Date:** [Date]  
- **Time Investment:** ~30 hours over 8 weeks  
- **Primary Goal:** Demonstrate full-stack development with test-first approach

---

## Table of Contents

1. [Technical Challenges](#technical-challenges)
2. [Technical Decisions](#technical-decisions)
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

### Challenge: Pre-Save Hooks Not Executing on Updates

**Issue:** Provider name capitalization was working on POST (create) but not on PATCH (update).

**Code:**

    ```javascript
    // Model had pre-save hook
    CertificationSchema.pre('save', function () {
        if (this.provider) {
            this.provider = this.provider.charAt(0).toUpperCase() + this.provider.slice(1);
        }
    });

    // But controller used findByIdAndUpdate
    const updatedCert = await Certification.findByIdAndUpdate(id, updateData, { runValidators: true });
    ```

**Result:**

- ✅ POST `/api/certifications` with `{ provider: "aws" }` → Saved as "Aws"
- ❌ PATCH `/api/certifications/:id` with `{ provider: "microsoft" }` → Saved as "microsoft"

**Cause:**

- Discovered that `findByIdAndUpdate()` performs a direct database query
- Bypasses the Mongoose document lifecycle
- `runValidators: true` runs validation but NOT pre-save hooks
- Pre-save hooks only fire when calling `.save()` on a document

**Solution:**
Changed to document-based updates:

    ```javascript
    // 1. Fetch document
    const certification = await Certification.findById(id);

    // 2. Apply updates
    Object.assign(certification, updateData);

    // 3. Save (triggers hooks)
    const updatedCert = await certification.save();
    ```

**Takeaways:**

- Mongoose has two update paths: query-based (faster) and document-based (runs hooks)
- Always test that business logic runs consistently for both creates and updates
- When choosing between performance and consistency, prefer consistency in portfolio projects
- Read framework documentation carefully for subtle behavior differences

---

### Challenge: Preventing Undefined Field Overwrites

**Issue:**
Partial updates could accidentally set fields to `undefined` instead of leaving them unchanged.

**Scenario:**

    ```javascript
    // User wants to update only status
    PATCH /api/certifications/123
    { "status": "Completed" }

    // But controller extracts ALL fields
    const { name, provider, status } = req.body;
    // name = undefined, provider = undefined, status = "Completed"

    // Then updates with all fields
    await Certification.findByIdAndUpdate(id, { name, provider, status });
    // Accidentally overwrites name and provider with undefined!
    ```

**Solution:**
Created `filterDefinedFields` utility:

    ```javascript
    // /src/utils/objectUtils.js
    function filterDefinedFields(inputObj) {
        return Object.fromEntries(
            Object.entries(inputObj).filter(([_, value]) => value !== undefined)
        );
    }

    // Controller
    const updateData = filterDefinedFields({ name, provider, status });
    // Only includes fields that were actually sent
    ```

**Takeaways:**

- JavaScript doesn't distinguish between "property not sent" and "property sent as undefined"
- Destructuring creates `undefined` for missing properties
- Always filter before applying partial updates
- Utility functions improve code reusability and testability

---

## Technical Decisions

### Decision 1: MongoDB Atlas (Cloud) vs. Local MongoDB

**Decision:** MongoDB Atlas for Development.  
**Reasoning:**

- **Portability:** Allows development across different environments without re-configuring local database services.  
- **Ops Exposure:** Provided experience with cloud network access, IP whitelisting, and managed database security.
- **Deployment Readiness:** Prepared the infrastructure for the Phase 5 deployment milestone.  

### Decision 2: In-Memory Testing vs. Mocking

**Options Considered:** `mongodb-memory-server` vs. `mockingoose`.  
**Decision:** `mongodb-memory-server`.  
**Reasoning:**

- **High Fidelity:** Mocks can pass even if the schema validation is broken. Using an in-memory database ensures that Mongoose constraints (like `min/max` and `required`) are actually enforced during tests.  
- **Reliability:** It creates a "hermetic" test environment that doesn't rely on the internet or pollute the dev database.

### Decision 3: Fail-Fast Startup Pattern

**Decision:** Connect to MongoDB before starting the Express server
**Reasoning:**

- Implements fail-fast principle: detect errors at startup rather than runtime
- Prevents serving HTTP requests when database is unavailable
- Uses `process.exit(1)` for observability (process managers can detect failures)
- Clearer error messages (fails immediately with context)
**Trade-offs:**
- Server won't start if DB is temporarily unavailable (could add retry logic in V2)
- Requires process manager for auto-restart in production
**Why this matters:**
Coming from an ops background, I designed this with production deployment in mind.  
Container orchestrators like Kubernetes use exit codes to determine if a pod is healthy and should be restarted.

### Decision 4: PATCH-Only for Updates (No PUT)

**Decision:** Using single PATCH operation for all updates
**Reasoning:** Simpler API, matches industry standards (GitHub, Stripe)
**Trade-off:** One less endpoint, less REST "purity"  

### Decision 5: Centralized Error Handling

**Decision:** Maintain all error handling logic in separate middleware
**Rationale:** DRY principle, consistent error responses, easier maintenance
**Trade-off:** More abstraction, harder to trace initially  

### 4. filterDefinedFields Utility

**Decision:** Create utility function to handle undefined field logic
**Rationale:** Reusable across controllers, testable in isolation, clear intent
**Trade-off:** Extra file, more indirection  

---

## Testing Insights

- **Integration tests mirror manual testing** - Write tests by codifying Postman workflows
- **Arrange-Act-Assert pattern** - Makes tests readable and maintainable
- **Database isolation** - MongoDB Memory Server ensures tests don't affect each other
- **Test coverage as quality gate** - CI fails below 70% prevents regressions

---

## Things I Would Do Differently

- Add test utilities for creating test data (factory pattern)
- Separate happy path tests from error case tests more clearly
- Add tests for edge cases earlier (discovered some during manual testing)

---

## Key Learnings

### Technical Skills Gained

### Process Learnings

1. **Strategic Scope Management**

- **The "Quick Win" Filter:** Decided to add `overallProgress` to the Certification model early. Even though it wasn't in the initial plan, I identified it as a high-value/low-effort addition that allowed me to implement and test complex Mongoose validations immediately.

### Career Learnings

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

- **Total Time:** ~15 hours
- **API Endpoints:** 6 (1 health check, 5 CRUD)
- **Tests Written:** 46 (2 unit, 43 integration, 0 E2E)
- **Test Coverage:** 84%+
- **Commits:** 31
- **Bugs Fixed:** 1
- **Features Deferred to V2:** 1

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

- Insomnia (API testing)

---

## Final Thoughts

This project solidified my understanding of full-stack development and test-driven practices. The biggest surprise was how much writing tests first improved my code design—I expected it to slow me down, but it actually saved time by catching issues early.
If I were to start another project tomorrow, I would:

1. Write OpenAPI spec first
2. Set up logging and monitoring from Day 1
3. Create seed data for manual testing
4. Document architecture decisions as I make them
The goal was to demonstrate software engineering discipline while transitioning
from IT Operations to a development role. I believe this project accomplishes that
goal.
