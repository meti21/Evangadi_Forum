import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../../Utility/axios";
import { FaArrowRight } from "react-icons/fa";
import styles from "./Question.module.css";

function QuestionPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    setLoading(true);
    try {
      await axiosInstance.post("/api/question", {
        title,
        description,
        tag,
      });

      setSuccess("Question posted successfully!");
      
      // setSuccess(res.message);
      setTitle("");
      setDescription("");
      setTag("");

      setTimeout(()=> {
        navigate("/home")
      },1500)
      
    } catch (err) {
      console.error("Error posting question:", err);
      setError(
        err.response?.data?.message ||
          "Failed to post question. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.questionContainer}>
      <h1 className={styles.title}>Steps to write a good question</h1>
      <ul className={styles.stepsList}>
        <li>
          <FaArrowRight className={styles.listIcon} />
          Summarize your problem in a one-line title
        </li>
        <li>
          <FaArrowRight className={styles.listIcon} />
          Describe your problem in more detail
        </li>
        <li>
          <FaArrowRight className={styles.listIcon} />
          Explain what you tried and what you expected to happen
        </li>
        <li>
          <FaArrowRight className={styles.listIcon} />
          Review your question and post it to the site
        </li>
      </ul>

      <h1 className={styles.title}>Ask a Question</h1>

      {/* Error & Success Messages */}
      {error && <div className={styles.errorBox}>{error}</div>}
      {success && (
        <div className={styles.successBox}>
          <p>{success}</p>
        </div>
      )}

      {/* Question Form */}
      <form onSubmit={handleSubmit} className={styles.postQuestionForm}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.questionTitleInput}
          required
        />
        <textarea
          placeholder="Question Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.questionDetailsTextarea}
          required
        />
        <input
          type="text"
          placeholder="Tag (optional)"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className={styles.tagInput}
        />
        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Submitting..." : "Post Your Question"}
        </button>
      </form>
    </div>
  );
}

export default QuestionPage;
