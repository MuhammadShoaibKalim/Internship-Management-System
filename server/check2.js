const fs = require('fs');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/internship-management').then(async () => {
    const PerformanceEvaluation = mongoose.model('PerformanceEvaluation', new mongoose.Schema({}, { strict: false }));
    const evals = await PerformanceEvaluation.find({});
    fs.writeFileSync('evals.json', JSON.stringify(evals, null, 2));
    process.exit(0);
}).catch(e => {
    fs.writeFileSync('evals_error.txt', String(e));
    process.exit(1);
});
