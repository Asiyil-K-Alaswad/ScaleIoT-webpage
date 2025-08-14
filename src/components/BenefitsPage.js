import React from 'react';
import { Link } from 'react-router-dom';
import Features from './Features';
import BenefitsOrganizations from './BenefitsOrganizations';

const BenefitsPage = () => {
  return (
    <div className="benefits-page">
      <div className="container">
        <div className="page-header">
          <div className="back-button-container">
            <Link to="/" className="back-button">
              ← Back to Home
            </Link>
          </div>
          <h1>Benefits & Features</h1>
          <p>Discover how ScaleIoT transforms parking management for drivers and organizations</p>
        </div>
        
        <Features />
        <BenefitsOrganizations />
      </div>
    </div>
  );
};

export default BenefitsPage;
