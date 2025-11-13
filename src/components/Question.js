import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { toast } from 'react-toastify';

const Question = forwardRef(({ question, onAnswer }, ref) => {
  const [startTime, setStartTime] = useState(0);
  const clickedPhishingRef = useRef(false);
  const urlViewedRef = useRef(false);
  const scenarioRef = useRef(null);

  // Function to handle messages from the iframe
  const handleIframeMessage = (event) => {
    // Ensure the message is from the expected iframe (optional, but good practice)
    // For srcdoc, origin will be the parent's origin.
    if (event.source === scenarioRef.current.contentWindow) {
      if (event.data.type === 'phishingClick') {
        handlePhishingLinkClick(event.data.event);
      } else if (event.data.type === 'urlView') {
        handleUrlView(event.data.event);
      } else if (event.data.type === 'iframeHeight') {
        // Update iframe height based on content
        if (scenarioRef.current) {
          scenarioRef.current.style.height = `${event.data.height}px`;
        }
      }
    }
  };

  useEffect(() => {
    setStartTime(Date.now());
    clickedPhishingRef.current = false;
    urlViewedRef.current = false;

    const iframe = scenarioRef.current;

    const injectScript = () => {
      if (iframe && iframe.contentDocument) {
        const script = iframe.contentDocument.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = `
          let hoverTimeout;
          document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
              e.preventDefault(); // Prevent navigation within the iframe
              window.parent.postMessage({ type: 'phishingClick', event: { targetTagName: 'A' } }, '*');
            }
          });

          document.addEventListener('mouseover', (e) => {
            if (e.target.tagName === 'A') {
              hoverTimeout = setTimeout(() => {
                window.parent.postMessage({ type: 'urlView', event: { targetTagName: 'A' } }, '*');
              }, 500);
            }
          });

          document.addEventListener('mouseout', (e) => {
            if (e.target.tagName === 'A') {
              clearTimeout(hoverTimeout);
            }
          });

          // Observe content height and report to parent
          const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
              window.parent.postMessage({ type: 'iframeHeight', height: entry.contentRect.height }, '*');
            }
          });
          resizeObserver.observe(document.body);
        `;
        iframe.contentDocument.body.appendChild(script);
      }
    };

    // Attach load listener to iframe
    if (iframe) {
      iframe.onload = injectScript;
    }

    // Add message listener to window
    window.addEventListener('message', handleIframeMessage);

    return () => {
      // Clean up message listener
      window.removeEventListener('message', handleIframeMessage);
      if (iframe) {
        iframe.onload = null; // Remove iframe load listener
      }
    };
  }, [question]); // Re-run effect when question changes

  const handlePhishingLinkClick = (e) => {
    // e.preventDefault(); // Already prevented in iframe script
    clickedPhishingRef.current = true;
    // if (question.scenario.isPhishing) {
    //   toast.warn(question.scenario.toastMessage);
    // } else {
    //   toast.success(question.scenario.toastMessage);
    // }
  };

  const handleUrlView = (e) => {
    if (e.targetTagName === 'A') {
      urlViewedRef.current = true;
    }
  };

  const handleAnswer = (answer) => {
    const timeTaken = (Date.now() - startTime) / 1000;
    onAnswer({
      answer,
      timeTaken,
      clickedPhishingLink: clickedPhishingRef.current,
      urlViewed: urlViewedRef.current,
    });
    toast.success('Response received!');
  };

  return (
    <div className="question-container" ref={ref}>
      <div className="question-header">
        <h2>Question {question.id}</h2>
        <p>{question.description}</p>
      </div>
      <iframe
        ref={scenarioRef}
        title="scenario-content"
        srcDoc={question.scenario.html}
        style={{ width: '80%', minHeight: '70vh', border: 'none', overflow: 'hidden' }} // Removed fixed height, added overflow hidden
      />
      <div className="answers">
        <button className="legitimate-btn" onClick={() => handleAnswer('legitimate')}>Legit</button>
        <button className="phishing-btn" onClick={() => handleAnswer('phishing')}>Fraud</button>
      </div>
    </div>
  );
});

export default Question;
