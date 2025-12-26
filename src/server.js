require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const Certification = require('./models/Certification');

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

async function testQuery() {
    try {
    const count = await Certification.countDocuments();
    console.log(`📊 Database verification: Found ${count} certifications in the cluster.`);
    } catch (error) {
    console.error('❌ Model verification failed:', error);
    }
}

testQuery();

app.get('/api/health', (req, res) => {
  res.status(200).json({"status": "ok"});
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});