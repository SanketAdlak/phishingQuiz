import React from 'react';

const Demographics = ({ onDemographicsSubmit }) => {
  const [demographics, setDemographics] = React.useState({
    age: '',
    year: '',
    degree: '',
    course: '',
  });

  const handleChange = (e) => {
    setDemographics({
      ...demographics,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onDemographicsSubmit(demographics);
  };

  const ageOptions = [];
  for (let i = 15; i <= 60; i++) {
    ageOptions.push(<option key={i} value={i}>{i}</option>);
  }

  const yearOptions = [1, 2, 3, 4, 5, 6, 'Other'].map((year) => (
    <option key={year} value={year}>{year}</option>
  ));

  const degreeOptions = ['BTech', 'MTech', 'Dual Degree', 'PhD', 'Other'].map((degree) => (
    <option key={degree} value={degree}>{degree}</option>
  ));

  return (
    <div className="demographics-container">
      <h1>Demographics</h1>
      <p>Please provide some demographic information.</p>
      <form onSubmit={handleSubmit} className="demographics-form">
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <select
            id="age"
            name="age"
            value={demographics.age}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Age</option>
            {ageOptions}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="year">Year of Study</label>
          <select
            id="year"
            name="year"
            value={demographics.year}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Year</option>
            {yearOptions}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="degree">Degree Program</label>
          <select
            id="degree"
            name="degree"
            value={demographics.degree}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Degree</option>
            {degreeOptions}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="course">Branch</label>
          <input
            type="text"
            className="form-control"
            id="course"
            name="course"
            value={demographics.course}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Demographics;
