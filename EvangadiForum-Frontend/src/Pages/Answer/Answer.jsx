import React, { useEffect, useState } from "react";
import styles from "./Answer.module.css";
import { useParams, Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { FaUserCircle } from "react-icons/fa";
import { questionsAPI, answersAPI } from "../../Utility/axios";
import { useContext } from "react";
import { AuthContext } from "../../Components/Auth/Auth";



const AnswerPage = () => {
  const { questionId } = useParams();
  const { user } = useContext(AuthContext);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const qRes = await questionsAPI.getQuestionById(questionId);
        setQuestion(qRes.data.question);

        try {
          const aRes = await answersAPI.getAnswersByQuestionId(questionId);
          setAnswers(aRes.data.answers);
        } catch (ansErr) {
          if (ansErr.response?.status === 404) {
            setAnswers([]); // No answers
          } else {
            throw ansErr;
          }
        }

        setErrorMessage("");
      } catch (error) {
        const msg =
          error.response?.data?.message ||
          "An unexpected error occurred while fetching data.";
        setErrorMessage(msg);
        console.error("Error fetching data:", msg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [questionId]);

  const handlePostAnswer = async () => {
    if (!newAnswer.trim()) {
      setErrorMessage("Please provide answer!");
      return;
    }

    try {
      const res = await answersAPI.postAnswer({
        questionid: questionId,
        answer: newAnswer,
      });
      console.log("Backend response for new answer:", res.data);

      // Push the real answer returned by backend to the list
      setAnswers((prev) => [res.data, ...prev]);

      setNewAnswer("");
      setErrorMessage("");
      setSuccessMessage("✅ Your answer was posted successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      
    } catch (err) {
      const msg =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "An unexpected error occurred.";
      setErrorMessage(msg);
      console.error("Error posting answer:", msg);
    }
  };
  

  if (loading) {
    return (
      <div className={styles.loading}>
        <ClipLoader color="#007bff" size={50} />
        <p>Loading...</p>
      </div>
    );
  }

  return (
// rendering the component     
    <div className={styles.container}>
      {/* Question Section */}
      {question ? (
        <div className={styles.questionSection}>
          <h2 className={styles.sectionTitle}>QUESTION</h2>
          <h3 className={styles.title}>{question.title}</h3>
          <p className={styles.body}>{question.description}</p>
        </div>
      ) : (
        <p className={styles.error}>Question not found.</p>
      )}

      {/* Answers Section */}
      <div className={styles.answerSection}>
        <hr />
        <h3 className={styles.sectionTitle}>Answers From The Community</h3>
        <hr />
        {answers.length === 0 ? (
          <p>No answers yet.</p>
        ) : (
          answers.map((answer) => (
            <div key={answer.answerid} className={styles.answer}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <FaUserCircle size={65} className={styles.icon}  />
                <div>
                  <p>{answer.answer}</p>
                  <span className={styles.timestamp}>
                    {new Date(answer.createdate).toLocaleString()} —{" "}
                    {answer.username}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Post Answer Section */}
      <div className={styles.postAnswerSection}>
        <h3 className={styles.sectionTitle}>Answer The Top Question</h3>
              {/* Error Message */}
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}

      {/* Success Message */}
      {successMessage && (
      <div className={styles.successBox}>
      <p>{successMessage}</p>
      <div className={styles.navigationOptions}>
      <Link to="/home" className={styles.navButton}>
        Go to Question page
      </Link>

    </div>
  </div>
)}
        <textarea
          className={styles.textarea}
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Your answer ..."
        />
        <button onClick={handlePostAnswer} className={styles.postButton}>
          Post Answer
        </button>
      </div>
    </div>
  );
};


export default AnswerPage;