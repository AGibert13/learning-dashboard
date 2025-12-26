require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in development on port ${PORT}`);
  console.log(`🔗 Health check available at http://localhost:${PORT}/api/health`);
});