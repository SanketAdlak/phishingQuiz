const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3001;

// Environment variables for configuration
const API_KEY = process.env.API_KEY || 'your-default-api-key';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
const corsOptions = {
  origin: ALLOWED_ORIGIN,
};

app.use(limiter);
app.use(cors(corsOptions));
app.use(bodyParser.json());

const resultsFilePath = path.join(__dirname, 'results.json');
const csvFilePath = path.join(__dirname, 'results.csv');

// Middleware for API key authentication
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.get('X-API-KEY');
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).send('Unauthorized');
  }
  next();
};

const answers = require('./answers.json');

// Validation rules for the submission
const submissionValidationRules = [
  body().isArray(),
  body('*.questionId').isInt(),
  body('*.answer').isString(),
  body('*.timeTaken').isFloat(),
  body('*.clickedPhishingLink').isBoolean(),
];

app.post(
  '/api/submit',
  apiKeyAuth,
  submissionValidationRules,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newResults = req.body;

    // Atomically append to the CSV file
    const responseId = `response_${Date.now()}`;
    const responseSubmitTime = new Date().toISOString();
    const csvHeader = ['responseId', 'responseSubmitTime'];
    const rowData = {
      responseId,
      responseSubmitTime,
    };

    newResults.forEach((result) => {
      const questionId = result.questionId;
      const isCorrect = answers[questionId] === result.answer;
      const questionHeaderId = `Q${questionId}`;

      const answerHeader = `Answer${questionHeaderId}`;
      const timeTakenHeader = `timeTaken${questionHeaderId}`;
      const phishingClickHeader = `ClickOnPhishingContent${questionHeaderId}`;

      csvHeader.push(answerHeader, timeTakenHeader, phishingClickHeader);
      rowData[answerHeader] = isCorrect ? 'correct' : 'incorrect';
      rowData[timeTakenHeader] = result.timeTaken;
      rowData[phishingClickHeader] = result.clickedPhishingLink;
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

const questions = require('./questions.json');

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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
