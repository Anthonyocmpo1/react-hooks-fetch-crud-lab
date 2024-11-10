import React from "react";

function QuestionItem({ question, onDelete, onUpdateCorrectAnswer }) {
  const { id, prompt, answers, correctIndex } = question;

  const options = answers.map((answer, index) => (
    <option key={index} value={index}>
      {answer}
    </option>
  ));

  const handleDelete = () => {
    onDelete(id); // Call the onDelete function passed from parent with the question id
  };

  const handleCorrectAnswerChange = (event) => {
    const newCorrectIndex = parseInt(event.target.value, 10); // Get the new correctIndex value from the dropdown
    onUpdateCorrectAnswer(id, newCorrectIndex); // Call the onUpdateCorrectAnswer function passed from parent
  };

  return (
    <li>
      <h4>Question {id}</h4>
      <h5>Prompt: {prompt}</h5>
      <label>
        Correct Answer:
        <select value={correctIndex} onChange={handleCorrectAnswerChange}>
          {options}
        </select>
      </label>
      <button onClick={handleDelete}>Delete Question</button>
    </li>
  );
}

export default QuestionItem;
