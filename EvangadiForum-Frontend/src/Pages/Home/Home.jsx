import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Components/Auth/Auth";
import { useNavigate } from "react-router-dom";
import { questionsAPI } from "../../Utility/axios";
import QuestionList from "../../Components/QuestionList/QuestionList";
import { Button, Spinner } from "react-bootstrap";
import styles from "./Home.module.css";

const Home = () => {
  
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [displayCount, setDisplayCount] = useState(4);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (allQuestions.length > 0) {
      setQuestions(allQuestions.slice(0, displayCount));
    }
  }, [displayCount, allQuestions]);

  
  const fetchQuestions = async () => {
    try {
      const response = await questionsAPI.getAllQuestions();
      console.log("API response:", response.data);

      if (response.status === 200 && response.data.questions) {
        setAllQuestions(response.data.questions);
        setQuestions(response.data.questions.slice(0, displayCount));
        setError("");
      } else {
        setError("Failed to fetch questions");
      }
    } catch (err) {
      setError("Failed to fetch questions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = () => {

    navigate("/askQuestion");
  };

  const seeMore = () => {
    setDisplayCount((count) => count + 10);
  };

  const seeLess = () => {
    setDisplayCount(4);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  return (
    <div className={styles.homeContainer}>
      <div className={styles.homeContent}>
        <div className={styles.topSection}>
          <Button className={styles.askQuestionBtn} onClick={handleAskQuestion}>
            Ask Question
          </Button>
          <div className={styles.welcomeMessage}>
            <h3>Welcome, {user?.username || "User"}!</h3>
          </div>
        </div>


        <div className={styles.questionsSection}>
          <h2 className={styles.questionsTitle}>Questions</h2>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <div className={styles.questionsList}>
            {questions.length === 0 ? (
              <div className={styles.noQuestions}>
                <p>No questions available</p>
              </div>
            ) : (
              questions.map((q) => (
                <QuestionList
                  key={q.questionid || q.id}
                  username={q.username}
                  title={q.title}
                  userId={q.userid}
                  questionId={q.questionid}
                />
              ))
            )}
          </div>


          {/* Show buttons for see more / see less only if needed */}
          <div className={styles.see_more_container}>
            {displayCount < allQuestions.length && (
              <Button
                className={styles.see_more_button}
                onClick={seeMore}
                variant="secondary"
              >
                See More
              </Button>
            )}
            {displayCount > 4 && (
              <Button
                className={styles.see_less_button}
                onClick={seeLess}
                variant="secondary"
              >
                See Less
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
