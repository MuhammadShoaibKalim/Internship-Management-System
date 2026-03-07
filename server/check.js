const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/internship-management').then(async () => {
    const PerformanceEvaluation = mongoose.model('PerformanceEvaluation', new mongoose.Schema({}, { strict: false }));
    const evals = await PerformanceEvaluation.find({});
    console.log('Evaluations count:', evals.length);
    console.log(JSON.stringify(evals, null, 2));
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
