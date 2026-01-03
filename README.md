# Learning Progress Dashboard

A full-stack Learning Progress Dashboard built to track certification study progress, demonstrating enterprise-grade software engineering practices with emphasis on test automation, API design, and software quality.

[![Build Status](https://github.com/AGibert13/learning-dashboard/actions/workflows/ci.yml/badge.svg)]([link](https://github.com/AGibert13/learning-dashboard/actions/workflows/ci.yml))
<!-- [![Test Coverage](badge-url)](link)
[![License](badge-url)](link)  
![Screenshot](./docs/images/dashboard-screenshot.png) -->
---

## 📖 About This Project

### Why I Built This

**Personal motivation:** Built while studying for certifications
**Technical showcase:** Prove capability in full-stack development with production-ready practices

### What Problem It Solves

As professionals pursue certifications (AWS, Python, etc.), they need a systematic way to:

- Track study sessions and progress toward certification goals
- Visualize learning patterns and identify knowledge gaps
- Manage learning resources (courses, books, practice exams)
- Monitor study streaks and maintain accountability

### What I Learned

TBD

---

## ✨ Features

### Current (Phase 1 - Complete)

- ✅ **Full CRUD API** - Create, read, update, delete certifications
- ✅ **Data Validation** - Mongoose schemas with custom validators
- ✅ **Error Handling** - Centralized middleware with user-friendly messages
- ✅ **RESTful Design** - Proper HTTP methods and status codes
- ✅ **Automated Testing** - 85%+ test coverage with Jest & Supertest
- ✅ **CI/CD Pipeline** - GitHub Actions running tests on every push
- ✅ **Multi-version Support** - Tested on Node.js 18.x and 20.x

### Planned (Future Phases)

- 📊 Track study sessions with topics and duration
- 📈 Visualize progress with charts and analytics
- 🎯 Monitor study streaks and milestones
- 🖥️ React frontend with dashboard
- 🚀 Deployed to production (Render + Vercel)

---

## 🛠️ Tech Stack

**Frontend:**

<!-- - React 18
- Chart.js (data visualization)
- Tailwind CSS (styling)
- Axios (API calls)   -->

**Backend:**

- Node.js + Express
- MongoDB + Mongoose
- RESTful API design

**Testing:**

- Jest (unit & integration tests)
<!-- - Cypress (E2E tests) -->
- Supertest (API testing)
- MongoDB Memory Server (test database)
- 80%+ test coverage

**DevOps:**

- GitHub Actions (CI/CD)
<!-- Coming Soon
 - Docker (containerization)
- Render (backend hosting)
- Vercel (frontend hosting) -->

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository

    ```bash
    git clone https://github.com/yourusername/learning-dashboard.git
    cd learning-dashboard
    ```

2. Install dependencies

    ```bash
    npm install
    cp .env.example .env
    # Edit .env with your MongoDB URI
    ```

3. Start the development servers

    ```bash
    npm run dev
    # Server runs on http://localhost:5000
    ```

---

## 🧪 Running Tests

```bash
cd server
# Run all tests
npm test
```

### Test Coverage

Current coverage: **XX%**  
View coverage report:

```bash
cd server
npm run test:coverage
open coverage/lcov-report/index.html
```

---

## 🔄 Continous Integration

This project uses Github Actions for continous integration. The CI pipeline automatically:

- ✅ Runs on every push to `main` and `develop` branches
- ✅ Tests on multiple Node.js versions (22.x and 24.x)
- ✅ Executes linting checks (ESLint)
- ✅ Runs full test suite with coverage reporting
- ✅ Uploads coverage reports as artifacts

### CI Workflow

The workflow is defined in `.github/workflows/ci.yml` and runs the following steps:

1. **Checkout code** - Pulls the latest code from the repsoitory
2. **Setup Node.js** - Configures the Node.js environment
3. **Install dependencies** - Runs `npm ci` for clean installs
4. **Run linter** - Checks code quality with ESLint
5. **Run tests** - Executes Jest test suite with coverage
6. **Upload artifacts** - Saves coverage reports for review

### Viewing CI Results

- Check the badge at the top of this README for current build status
- View detailed workflow runs: [Actions tab](https://github.com/AGibert13/learning-dashboard/actions)
- Download coverage reports from workflow artifacts

## 🤝 Contributing

This is a portfolio project built for learning purposes. However, feedback and
suggestions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for
details.

---

## 👤 Author

### Adrien Gibert

- GitHub: [@AGibert13](https://github.com/AGibert13)
- LinkedIn: [Adrien Gibert](https://www.linkedin.com/in/adrien-gibert-fsd/)
- Portfolio: [Engineer Resume](https://agibert13.github.io/engineerResume/)

---

## 🙏 Acknowledgments

- Built while studying for AWS AI Practitioner certification
- Inspired by the need for better certification tracking tools

---

## 📚 Additional Documentation

- [Learning Log](./LEARNING.md)

---
**⭐ If you found this project interesting, please consider giving it a star!**

---
