import React, { useState, useEffect, useRef, forwardRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import ConfidenceSlider from './ConfidenceSlider';

const Question = forwardRef(({ question, onAnswer }, ref) => {
  const [startTime, setStartTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [confidence, setConfidence] = useState(1);
  const [sliderInteracted, setSliderInteracted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [highlightHint, setHighlightHint] = useState(false); // New state for highlighting
  const clickedPhishingRef = useRef(false);
  const urlViewedRef = useRef(false);
  const scenarioRef = useRef(null);
  const timerRef = useRef(null);
  const hintBoxRef = useRef(null); // New ref for the hint box

  const handleIframeMessage = useCallback((event) => {
    if (event.source === scenarioRef.current.contentWindow) {
      if (event.data.type === 'phishingClick') {
        handlePhishingLinkClick(event.data.event);
      } else if (event.data.type === 'urlView') {
        handleUrlView(event.data.event);
      } else if (event.data.type === 'iframeHeight') {
        if (scenarioRef.current) {
          scenarioRef.current.style.height = `${event.data.height}px`;
        }
      }
    }
  }, []);

  useEffect(() => {
    setStartTime(Date.now());
    clickedPhishingRef.current = false;
    urlViewedRef.current = false;
    setSelectedAnswer(null);
    setConfidence(0);
    setSliderInteracted(false);
    setTimeRemaining(30);
    setShowHint(false);
    setHighlightHint(false); // Reset highlight when question changes

    if (question.id <= 10) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    }

    const iframe = scenarioRef.current;
    const injectScript = () => {
      if (iframe && iframe.contentDocument) {
        const script = iframe.contentDocument.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = `
          let hoverTimeout;
          document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
              e.preventDefault();
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

    if (iframe) {
      iframe.onload = injectScript;
    }
    window.addEventListener('message', handleIframeMessage);

    return () => {
      clearInterval(timerRef.current);
      window.removeEventListener('message', handleIframeMessage);
      if (iframe) {
        iframe.onload = null;
      }
    };
  }, [question, handleIframeMessage]);

  const handlePhishingLinkClick = (e) => {
    clickedPhishingRef.current = true;
  };

  const handleUrlView = (e) => {
    if (e.targetTagName === 'A') {
      urlViewedRef.current = true;
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    if (question.id > 10) { // Only show hint and scroll for questions after ID 10
      setShowHint(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setHighlightHint(true);
      setTimeout(() => {
        setHighlightHint(false);
      }, 2000); // Highlight for 2 seconds
    }
  };
  const handleConfidenceChange = (e) => {
    setConfidence(e.target.value);
  };

  const handleSliderInteraction = () => {
    setSliderInteracted(true);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) {
      toast.error('Please select an answer (Legit or Fraud) before submitting.');
      return;
    }
    if (!sliderInteracted) {
      toast.error('Please adjust the confidence slider before submitting.');
      return;
    }

    const timeTaken = (Date.now() - startTime) / 1000;
    onAnswer({
      answer: selectedAnswer,
      timeTaken,
      clickedPhishingLink: clickedPhishingRef.current,
      urlViewed: urlViewedRef.current,
      confidence: confidence,
    });
    toast.success('Response received!');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDisabledSubmit = () => {
    if (!selectedAnswer && !sliderInteracted) {
      toast.error('Please select an answer and adjust the confidence slider before submitting.');
    } else if (!selectedAnswer) {
      toast.error('Please select an answer (Legit or Fraud) before submitting.');
    } else if (!sliderInteracted) {
      toast.error('Please adjust the confidence slider before submitting.');
    }
  };

  const formatTime = (seconds) => {
    const isNegative = seconds < 0;
    const absSeconds = Math.abs(seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    return `${isNegative ? '-' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="question-container" ref={ref}>
      <div className="question-header">
        <h2>Scenario {question.id}</h2>
        {question.id <= 10 && (
          <div className={`timer ${timeRemaining < 0 ? 'red' : ''}`}>
            {formatTime(timeRemaining)}
          </div>
        )}
        {question.id > 10 ? (
          <div
            ref={hintBoxRef} // Attach the ref here
            className={`hint-box ${!showHint ? 'hidden' : ''} ${highlightHint ? 'highlight' : ''}`}
            dangerouslySetInnerHTML={{ __html: question.description }}
          />
        ) : (
          <p>{question.description}</p>
        )}
      </div>
      <iframe
        ref={scenarioRef}
        title="scenario-content"
        srcDoc={question.scenario.html}
        style={{ width: '80%', minHeight: '70vh', border: '2px solid #494545ff', borderRadius: 10, overflow: 'hidden' }}
      />
      <div className="answers">
        <button
          className={`legitimate-btn ${selectedAnswer === 'legitimate' ? 'selected' : ''}`}
          onClick={() => handleAnswerSelect('legitimate')}
        >
          Legit
        </button>
        <button
          className={`phishing-btn ${selectedAnswer === 'phishing' ? 'selected' : ''}`}
          onClick={() => handleAnswerSelect('phishing')}
        >
          Fraud
        </button>
      </div>
      <ConfidenceSlider
        confidence={confidence}
        onConfidenceChange={handleConfidenceChange}
        onInteraction={handleSliderInteraction}
        min={0}
        max={10}
      />
      <button
        className="submit-btn"
        onClick={selectedAnswer && sliderInteracted ? handleSubmit : handleDisabledSubmit}
        disabled={false} // Always enabled, but calls handleDisabledSubmit if conditions not met
      >
        Submit
      </button>
    </div>
  );
});

export default Question;
