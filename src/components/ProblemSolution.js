import React from 'react';

const ProblemSolution = () => {
  return (
    <section className="problem-solution">
      <div className="container">
        <div className="section-header">
          <h2>Why ScaleIoT?</h2>
          <p>Traditional parking problems meet innovative IoT solutions</p>
        </div>
        <div className="problem-solution-content">
          <div className="problem">
            <div className="problem-header">
              <i className="fas fa-exclamation-triangle problem-alert-icon"></i>
              <h3>The Parking Problem</h3>
            </div>
            <p>Circling around to find a spot, long lines at entry/exit, missed tickets, and parking fines – traditional parking is a headache for drivers and a challenge for businesses.</p>
            <div className="problem-icons">
              <div className="problem-icon">
                <div className="problem-icon-bg">
                  <i className="fas fa-clock"></i>
                </div>
                <span>Time Wasted</span>
              </div>
              <div className="problem-icon">
                <div className="problem-icon-bg">
                  <i className="fas fa-ticket-alt"></i>
                </div>
                <span>Lost Tickets</span>
              </div>
              <div className="problem-icon">
                <div className="problem-icon-bg">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <span>Frustration</span>
              </div>
            </div>
          </div>
          <div className="solution">
            <div className="solution-header">
              <i className="fas fa-lightbulb solution-idea-icon"></i>
              <h3>The ScaleIoT Solution</h3>
            </div>
            <p>ScaleIoT leverages IoT sensors and license plate recognition to automate parking. From the moment you arrive, the system takes over – no ticket needed. It finds you a spot and even processes payment on exit.</p>
            <div className="solution-benefits">
              <div className="benefit">
                <div className="benefit-icon-bg">
                  <i className="fas fa-check-circle"></i>
                </div>
                <span>Automated Entry & Exit</span>
              </div>
              <div className="benefit">
                <div className="benefit-icon-bg">
                  <i className="fas fa-check-circle"></i>
                </div>
                <span>Smart Spot Allocation</span>
              </div>
              <div className="benefit">
                <div className="benefit-icon-bg">
                  <i className="fas fa-check-circle"></i>
                </div>
                <span>Automatic Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
