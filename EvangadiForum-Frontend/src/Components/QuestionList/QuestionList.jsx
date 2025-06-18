import { Link } from "react-router-dom";
import styles from "./QuestionList.module.css";
import { FaUserCircle, FaAngleRight } from "react-icons/fa";
import PropTypes from "prop-types";


const QuestionList = ({ username, title, questionId }) => {
  return (
    <div className={styles.questionsContainer}>
      <hr />
      <div className={styles.askQuestion}>
        <div className={styles.askUserInfo}>
          <div className={styles.askUser}>
            <Link to={`/question/${questionId}`}>
              <FaUserCircle className={styles.icon} size={65} />
            </Link>
            <span className={styles.username}>{username}</span>
          </div>
          <div className={styles.askQuestionText}>
            <p>{title}</p>
          </div>
        </div>
        <div className={styles.askArrow}>

          <Link to={`/question/${questionId}`}>
            <FaAngleRight className={styles.icon} size={25} />
          </Link>
        </div>
      </div>
      <hr />
    </div>
  );
};


QuestionList.propTypes = {
  username: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  questionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};


export default QuestionList;
