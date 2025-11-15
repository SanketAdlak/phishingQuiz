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

  const genderOptions = ['Male', 'Female', 'Non-Binary', 'Prefer not to say'];

  const degreeOptions = ['Undergraduate', 'Postgraduate', 'Other'].map((degree) => (
    <option key={degree} value={degree}>
      {degree}
    </option>
  ));

  const cyberFraudExposureOptions = [
    'I have personally been a victim of an online scam',
    'I have not, but someone I know has',
    'No, I have no significant exposure',
    'I am not sure',
  ];

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
          <label>Gender</label>
          <div className="radio-group-options">
            {genderOptions.map((option) => (
              <div key={option} className="form-check">
                <input
                  type="radio"
                  id={`gender-${option}`}
                  name="gender"
                  value={option}
                  checked={demographics.gender === option}
                  onChange={handleChange}
                  className="form-check-input"
                  required
                />
                <label htmlFor={`gender-${option}`} className="form-check-label">
                  {option}
                </label>
              </div>
            ))}
          </div>
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
          <label>Prior Cybersecurity Training</label>
          <div className="radio-group-options">
            <div className="form-check">
              <input
                type="radio"
                id="cybersecurityTraining-yes"
                name="cybersecurityTraining"
                value="Yes"
                checked={demographics.cybersecurityTraining === 'Yes'}
                onChange={handleChange}
                className="form-check-input"
                required
              />
              <label htmlFor="cybersecurityTraining-yes" className="form-check-label">
                Yes
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                id="cybersecurityTraining-no"
                name="cybersecurityTraining"
                value="No"
                checked={demographics.cybersecurityTraining === 'No'}
                onChange={handleChange}
                className="form-check-input"
                required
              />
              <label htmlFor="cybersecurityTraining-no" className="form-check-label">
                No
              </label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Prior Exposure to Cyber Fraud</label>
          <div className="radio-group-options">
            {cyberFraudExposureOptions.map((option) => (
              <div key={option} className="form-check">
                <input
                  type="radio"
                  id={`cyberFraudExposure-${option.replace(/\s/g, '-')}`}
                  name="cyberFraudExposure"
                  value={option}
                  checked={demographics.cyberFraudExposure === option}
                  onChange={handleChange}
                  className="form-check-input"
                  required
                />
                <label htmlFor={`cyberFraudExposure-${option.replace(/\s/g, '-')}`} className="form-check-label">
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-submit">
          Submit & Finish
        </button>
      </form>
    </div>
  );
};

export default Demographics;

