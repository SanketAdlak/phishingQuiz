# Investigating the Dunning-Kruger Effect and the Efficacy of Embedded Nudges in Phishing Detection

This repository contains the source code for the web-based experimental application used in the project report: **"Investigating the Dunning-Kruger Effect and the Efficacy of Embedded Nudges in Phishing Detection Among Technical University Students"**.

The study explores the "confidence-competence gap" in cybersecurity, where individuals' perceived ability to detect phishing attacks often doesn't align with their actual skills. It also tests the effectiveness of subtle "nudges" embedded in the user interface to improve detection accuracy.

## About the Project

This application is a phishing and smishing quiz designed to simulate real-world scenarios. It presents users with a series of potential fraud messages (emails and SMS) and asks them to classify each as either "Legitimate" or "Fraudulent".

The experiment was designed to capture data on:
-   **Detection Accuracy:** The ability to correctly classify messages.
-   **Decision Confidence:** A user's self-reported confidence in their classification.
-   **Response Time:** The time taken to make a decision.
-   **The Dunning-Kruger Effect:** The correlation between self-assessed ability and actual performance.
-   **Nudge Efficacy:** The impact of subtle UI hints on detection accuracy and response bias.

## Key Features

-   **Realistic Scenarios:** Presents 20 real-world phishing and legitimate messages.
-   **Within-Subjects Design:** Each participant experiences both a "nudged" and "un-nudged" condition.
    -   **Un-nudged:** A baseline block of 10 questions.
    -   **Nudged:** A treatment block of 10 questions with embedded visual warnings and hints.
-   **Confidence & Competence Measurement:**
    -   Pre-test questionnaire to gauge overall confidence.
    -   Post-decision confidence rating for each question.
-   **Data Collection:** Gathers demographic information and detailed results (accuracy, confidence, response times) for each participant.
-   **Data Export:** Anonymously saves all experimental data into `results.csv` on the server for easy analysis.

## Technology Stack

-   **Frontend:** React.js
-   **Backend:** Node.js / Express.js
-   **Data:** Questions and scenarios are stored in JSON files (`questions.json`, `confidence-questions.json`, etc.) on the server.

## Project Structure

```
phishing-quiz/
├── server/         # Node.js backend
│   ├── server.js   # Express server logic
│   ├── questions.json # Main quiz questions
│   └── results.csv # Output data file
│
└── src/            # React.js frontend
    ├── components/ # React components for the quiz UI
    ├── App.js      # Main application component
    └── ...
```

## Getting Started

To run the experiment locally, you need to set up both the server and the client.

### Prerequisites

-   Node.js and npm installed on your machine.

### 1. Backend Setup

The server handles question delivery and data recording.

```bash
# Navigate to the server directory
cd phishing-quiz/server

# Install dependencies
npm install

# Start the server (runs on http://localhost:5000)
npm start
```

### 2. Frontend Setup

The client provides the user interface for the quiz.

```bash
# Open a new terminal and navigate to the root project directory
cd phishing-quiz

# Install dependencies
npm install

# Start the React development server (runs on http://localhost:3000)
npm start
```

Once both are running, open [http://localhost:3000](http://localhost:3000) in your browser to begin the experiment.

## Experimental Flow

The user progresses through the application in the following order:

1.  **Welcome & Consent:** A title page that introduces the study.
2.  **Demographics:** A form to collect anonymous demographic data.
3.  **Confidence Questionnaire:** A 10-item Likert scale to assess the participant's initial confidence in their phishing detection skills.
4.  **Quiz Part 1 (Un-nudged):** The participant answers the first 10 questions without any assistance.
5.  **Quiz Part 2 (Nudged):** The participant answers the final 10 questions, which include embedded security nudges.
6.  **Thank You:** A final page thanking the participant for their time.

All results are saved to `phishing-quiz/server/results.csv` as the participant completes the quiz.

## Citing This

- If you use this project for your own research, please consider citing our original work.
- *(Details to be added upon publication)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.