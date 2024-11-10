import React, { useState, useEffect } from "react";
import QuestionItem from "./QuestionItem"; // Assuming you have a separate component for each question

function QuestionList() {
  const [questions, setQuestions] = useState([]); // State to hold the list of questions
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to handle errors

  // Fetch questions function
  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:4000/questions");
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      setQuestions(data); // Update state with the fetched questions
    } catch (err) {
      setError(err.message); // Set error message if the fetch fails
    } finally {
      setLoading(false); // Set loading to false once the fetch is done
    }
  };

  // Fetch questions when the component mounts
  useEffect(() => {
    fetchQuestions(); // Call the fetchQuestions function inside useEffect
  }, []); // Empty dependency array ensures it runs only once after the initial render

  const handleRetry = () => {
    setLoading(true); // Reset loading state
    setError(null); // Clear error
    fetchQuestions(); // Retry fetching questions
  };

  // Handle delete question
  const handleDelete = async (id) => {
    try {
      // Send DELETE request to remove the question
      const response = await fetch(`http://localhost:4000/questions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the question from the local state after successful deletion
        setQuestions(questions.filter((question) => question.id !== id));
      } else {
        throw new Error("Failed to delete question");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };

  // Handle update correct answer
  const handleUpdateCorrectAnswer = async (id, correctIndex) => {
    try {
      // Send PATCH request to update the correctIndex
      const response = await fetch(`http://localhost:4000/questions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correctIndex }),
      });

      if (response.ok) {
        // Update the question in local state after the patch
        setQuestions((prevQuestions) =>
          prevQuestions.map((question) =>
            question.id === id ? { ...question, correctIndex } : question
          )
        );
      } else {
        throw new Error("Failed to update question");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Display a loading message while data is being fetched
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={handleRetry}>Retry</button>
      </div>
    ); // Display error message with retry button if fetch fails
  }

  if (questions.length === 0) {
    return <div>No questions available</div>; // Display a message if the list is empty
  }

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>
        {questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            onDelete={handleDelete}
            onUpdateCorrectAnswer={handleUpdateCorrectAnswer}
          />
        ))}
      </ul>
    </section>
  );
}

export default QuestionList;
