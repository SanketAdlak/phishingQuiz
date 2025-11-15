import React from 'react';

const Demographics = ({ onDemographicsSubmit }) => {
  const [demographics, setDemographics] = React.useState({
    age: '',
    gender: '',
    degree: '',
    cybersecurityTraining: '',
    cyberFraudExposure: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDemographics((prevDemographics) => ({
      ...prevDemographics,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onDemographicsSubmit(demographics);
  };

  const ageOptions = [
    '17 or younger',
    '18-20',
    '21-23',
    '24-26',
    '27 or older',
  ].map((age) => (
    <option key={age} value={age}>
      {age}
    </option>
  ));

  const genderOptions = ['Male', 'Female', 'Non-Binary', 'Prefer not to say'].map((gender) => (
    <option key={gender} value={gender}>
      {gender}
    </option>
  ));

  const degreeOptions = ['Undergraduate', 'Postgraduate', 'Other'].map((degree) => (
    <option key={degree} value={degree}>
      {degree}
    </option>
  ));

  const cybersecurityTrainingOptions = ['Yes', 'No'].map((option) => (
    <option key={option} value={option}>
      {option}
    </option>
  ));

  const cyberFraudExposureOptions = [
    'I have personally been a victim of an online scam',
    'I have not but someone I know has',
    'No I have no significant exposure',
    'I am not sure',
  ].map((option) => (
    <option key={option} value={option}>
      {option}
    </option>
  ));

  return (
    <div className="demographics-container">
      <h1>Final Information</h1>
      <p>Just a few final questions to help us understand the results. Don't worry, your responses will remain anonymous and confidential!</p>
      <form onSubmit={handleSubmit} className="demographics-form">
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <select
            id="age"
            name="age"
            value={demographics.age}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select Age</option>
            {ageOptions}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={demographics.gender}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select Gender</option>
            {genderOptions}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="degree">Degree</label>
          <select
            id="degree"
            name="degree"
            value={demographics.degree}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select Degree</option>
            {degreeOptions}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="cybersecurityTraining">Prior Cybersecurity Training</label>
          <select
            id="cybersecurityTraining"
            name="cybersecurityTraining"
            value={demographics.cybersecurityTraining}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select an option</option>
            {cybersecurityTrainingOptions}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="cyberFraudExposure">Prior Exposure to Cyber Fraud</label>
          <select
            id="cyberFraudExposure"
            name="cyberFraudExposure"
            value={demographics.cyberFraudExposure}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select an option</option>
            {cyberFraudExposureOptions}
          </select>
        </div>

        <button type="submit" className="btn btn-primary btn-submit">
          Submit & Finish
        </button>
      </form>
    </div>
  );
};

export default Demographics;

