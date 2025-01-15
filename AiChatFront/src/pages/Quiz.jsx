import React, { useState, useEffect } from 'react';
import './Quiz.css'; // Optional CSS file for styling

const Quiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showTranslation, setShowTranslation] = useState({});
  const [showAnswer, setShowAnswer] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Extract the query parameters from the current URL
    const urlParams = new URLSearchParams(window.location.search);

    // Get 'theme' and 'proficiency' from the URL, with defaults if not found
    const proficiency = urlParams.get('level') || 'A0';
    const theme = urlParams.get('theme') || 'animals';

    // Construct the URL to fetch quiz data, dynamically including query parameters
    const url = `api/quiz?proficiency=${proficiency}&theme=${theme}`;

    // Fetch the quiz data from the server
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setQuizData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching quiz data:', error);
        setIsLoading(false);
      });
  }, []);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  const toggleTranslation = (index) => {
    setShowTranslation({ ...showTranslation, [index]: !showTranslation[index] });
  };

  const toggleAnswer = (index) => {
    setShowAnswer({ ...showAnswer, [index]: !showAnswer[index] });
  };

  const calculateScore = () => {
    let totalQuestions = quizData.length;
    let correctAnswers = 0;

    quizData.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        correctAnswers++;
      }
    });

    setScore((correctAnswers / totalQuestions) * 100); // Score as a percentage
  };

  return (
    <div className="quiz-container">
      <h1>Spanish Quiz</h1>

      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <form>
          {quizData.map((question, index) => (
            <div key={index} className="question-container">
              <div className="question-with-translation">
                <h3>
                  {showTranslation[index] ? question.translation : question.question}
                </h3>
                
                <button
                  type="button"
                  className="translation-toggle-btn"
                  onClick={() => toggleTranslation(index)}
                >
                  {showTranslation[index] ? 'Hide Translation' : 'Show Translation'}
                </button>
              </div>

              <div className="answer-buttons">
                {Object.entries(question.possible_answers).map(([key, value]) => (
                  <label key={key}>
                    <input
                      type="radio"
                      name={`question_${index}`}
                      value={key}
                      onChange={() => handleAnswerChange(index, key)}
                      checked={answers[index] === key}
                    />
                    {value}
                  </label>
                ))}
              </div>

              <div className="answer-toggle-container">
                <button type="button" onClick={() => toggleAnswer(index)}>
                  {showAnswer[index] ? 'Hide Answer' : 'Show Answer'}
                </button>
                {showAnswer[index] && <div className="answer">{question.correct_answer}</div>}
              </div>
            </div>
          ))}

          <button type="button" onClick={calculateScore} className="score-button">
            Calculate Score
          </button>

          {score !== null && (
            <div className="score">
              <h3>Your Score: {score}%</h3>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default Quiz;
