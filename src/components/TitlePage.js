import React from 'react';
import './TitlePage.css';

const TitlePage = ({ title, description, buttonText, onStart }) => {
  return (
    <div className="title-page-container">
      <div className="title-page-content">
        <h1 className="title-page-title">{title}</h1>
        <p className="title-page-description">{description}</p>
        <button onClick={onStart} className="btn btn-start">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default TitlePage;
