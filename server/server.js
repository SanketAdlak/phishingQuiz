const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const resultsFilePath = path.join(__dirname, 'results.json');
const csvFilePath = path.join(__dirname, 'results.csv');

app.post('/api/submit', (req, res) => {
  const newResults = req.body;

  // JSON part
  fs.readFile(resultsFilePath, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      console.error(err);
      return res.status(500).send('Error reading results file.');
    }

    const results = data ? JSON.parse(data) : {};
    const responseId = `response_${Object.keys(results).length + 1}`;
    results[responseId] = newResults;

    fs.writeFile(resultsFilePath, JSON.stringify(results, null, 2), (err) => {
      if (err) {
        console.error(err);
        // Continue to CSV writing even if JSON writing fails
      }
    });
  });

  // CSV part
  const responseId = `response_${Date.now()}`;
  const responseSubmitTime = new Date().toISOString();
  let csvRow = `${responseId},${responseSubmitTime}`;
  const csvHeader = ['responseId', 'responseSubmitTime'];

  newResults.forEach((result, index) => {
    const questionId = `Q${result.questionId}`;
    csvHeader.push(
      `Answer${questionId}`,
      `timeTaken${questionId}`,
      `ClickOnPhishingContent${questionId}`
    );
    csvRow += `,${result.isCorrect ? 'correct' : 'incorrect'},${
      result.timeTaken
    },${result.clickedPhishingLink}`;
  });

  fs.stat(csvFilePath, (err, stat) => {
    if (err || stat.size === 0) {
      // File doesn't exist or is empty, write header
      fs.writeFile(csvFilePath, csvHeader.join(',') + '\n', (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error writing CSV header.');
        }
        appendToCsv();
      });
    } else {
      appendToCsv();
    }
  });

  function appendToCsv() {
    fs.appendFile(csvFilePath, csvRow + '\n', (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error writing CSV row.');
      }
      res.status(200).send('Results saved successfully.');
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
