const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3001;

// Rate limiting to prevent abuse; removing as university address might have many users with same IP
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// app.use(limiter);

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React app
//app.use(express.static(path.join(__dirname, '../build')));

const resultsFilePath = path.join(__dirname, 'results.json');
const csvFilePath = path.join(__dirname, 'results.csv');

const answers = require('./answers.json');
const confidenceQuestions = require('./confidence-questions.json');
const questions = require('./questions.json');
const questions1 = require('./Question1.json');
const questions2 = require('./Question2.json');

// Validation rules for the submission
const submissionValidationRules = [
  body('quizResults').isArray(),
  body('quizResults.*.questionId').isInt(),
  body('quizResults.*.answer').not().isEmpty(),
  body('quizResults.*.timeTaken').isFloat().optional(),
  body('quizResults.*.clickedPhishingLink').isBoolean().optional(),
  body('quizResults.*.urlViewed').isBoolean().optional(),
  body('demographics.age').optional().isString(),
  body('demographics.gender').optional().isString(),
  body('demographics.degree').optional().isString(),
  body('demographics.cybersecurityTraining').optional().isString(),
  body('demographics.cyberFraudExposure').optional().isString(),
];

app.post(
  '/api/submit',
  submissionValidationRules,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quizResults, demographics } = req.body;

    // Atomically append to the CSV file
    const responseId = `response_${Date.now()}`;
    const responseSubmitTime = new Date().toISOString();
    const csvHeader = ['responseId', 'responseSubmitTime', 'age', 'gender', 'degree', 'cybersecurityTraining', 'cyberFraudExposure'];
    const rowData = {
      responseId,
      responseSubmitTime,
      age: demographics.age,
      gender: demographics.gender,
      degree: demographics.degree,
      cybersecurityTraining: demographics.cybersecurityTraining,
      cyberFraudExposure: demographics.cyberFraudExposure,
    };

    quizResults.forEach((result) => {
      const questionId = result.questionId;
      
      if (result.type === 'confidence') {
        const questionHeaderId = `confidenceQuestionID${questionId}`;
        csvHeader.push(questionHeaderId);
        rowData[questionHeaderId] = result.answer;
      } else {
        const questionHeaderId = `Q${questionId}`;

        const answerHeader = `Answer${questionHeaderId}`;
        const timeTakenHeader = `timeTaken${questionHeaderId}`;
        const phishingClickHeader = `ClickOnPhishingContent${questionHeaderId}`;
        const urlViewedHeader = `urlViewed${questionHeaderId}`;

        csvHeader.push(answerHeader, timeTakenHeader, phishingClickHeader, urlViewedHeader);
        rowData[answerHeader] = result.answer === 'legitimate' ? 'Legit' : 'Fraud';
        rowData[timeTakenHeader] = result.timeTaken;
        rowData[phishingClickHeader] = result.clickedPhishingLink;
        rowData[urlViewedHeader] = result.urlViewed;
      }
    });

    const csvRow = csvHeader.map(header => rowData[header]).join(',');
    const csvLine = csvRow + '\n';
    const csvHeaderLine = csvHeader.join(',') + '\n';

    // Use a lock file to prevent race conditions
    const lockFilePath = path.join(__dirname, 'results.lock');
    fs.open(lockFilePath, 'wx', (err, fd) => {
      if (err) {
        if (err.code === 'EEXIST') {
          return res.status(429).send('Too many requests, please try again later.');
        }
        console.error(err);
        return res.status(500).send('Error acquiring lock.');
      }

      const writeToCsv = () => {
        fs.stat(csvFilePath, (statErr, stat) => {
          if (statErr || stat.size === 0) {
            fs.writeFile(csvFilePath, csvHeaderLine, (writeErr) => {
              if (writeErr) {
                console.error(writeErr);
                return res.status(500).send('Error writing CSV header.');
              }
              appendData();
            });
          } else {
            appendData();
          }
        });
      };

      const appendData = () => {
        fs.appendFile(csvFilePath, csvLine, (appendErr) => {
          fs.close(fd, () => {
            fs.unlink(lockFilePath, () => {});
          });
          if (appendErr) {
            console.error(appendErr);
            return res.status(500).send('Error writing CSV row.');
          }
          res.status(200).send('Results saved successfully.');
        });
      };

      writeToCsv();
    });
  }
);

app.get('/api/confidence-questions/count', (req, res) => {
  res.json({ totalQuestions: confidenceQuestions.length });
});

app.get('/api/confidence-question/:id', (req, res) => {
  const questionId = parseInt(req.params.id, 10);
  const question = confidenceQuestions.find((q) => q.id === questionId);

  if (!question) {
    return res.status(404).send('Question not found');
  }

  res.json(question);
});

app.get('/api/questions/count', (req, res) => {
  res.json({ totalQuestions: questions.length });
});

app.get('/api/question/:id', (req, res) => {
  const questionId = parseInt(req.params.id, 10);
  const question = questions.find((q) => q.id === questionId);

  if (!question) {
    return res.status(404).send('Question not found');
  }

  res.json(question);
});

app.get('/api/questions1/count', (req, res) => {
  res.json({ totalQuestions: questions1.length });
});

app.get('/api/question1/:id', (req, res) => {
  const questionId = parseInt(req.params.id, 10);
  const question = questions1.find((q) => q.id === questionId);

  if (!question) {
    return res.status(404).send('Question not found');
  }

  res.json(question);
});

app.get('/api/questions2/count', (req, res) => {
  res.json({ totalQuestions: questions2.length });
});

app.get('/api/question2/:id', (req, res) => {
  const questionId = parseInt(req.params.id, 10);
  const question = questions2.find((q) => q.id === questionId);

  if (!question) {
    return res.status(404).send('Question not found');
  }

  res.json(question);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../build/index.html'));
// });

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
