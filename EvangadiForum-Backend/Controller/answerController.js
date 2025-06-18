const dbConnection = require("../Db/dbConfig");
const { StatusCodes } = require("http-status-codes");

async function getAnswersByQuestionId(req, res) {
  const { questionid } = req.params;

  if (!questionid || isNaN(questionid)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Invalid question ID.",
    });
  }

  try {
    const [answers] = await dbConnection.query(
      `
      SELECT a.answerid, a.answer, u.username, a.createdate
      FROM answers a
      JOIN users u ON a.userid = u.userid
      WHERE a.questionid = ?
      ORDER BY a.createdate DESC
      `,
      [questionid]
    );

    if (answers.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "The requested answer could not be found."
      });
    }

    return res.status(StatusCodes.OK).json({ answers });

  } catch (error) {
    console.error("DB error:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred."
    });
  }
}
async function postAnswer(req, res) {
  const { answer, questionid } = req.body;
  const userid = req.user.userid;

  // 1. Input validation
  if (!answer || !questionid || !userid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide answer!" });
  }

  try {
    // 2. Insert answer into DB
    const [insertResult] = await dbConnection.query(
      "INSERT INTO answers (userid, questionid, answer) VALUES (?, ?, ?)",
      [userid, questionid, answer]
    );

    const insertedId = insertResult.insertId;

    // 3. Fetch the inserted answer including username
    const [rows] = await dbConnection.query(
      `SELECT a.answerid, a.answer, a.createdate, u.username
       FROM answers a
       JOIN users u ON a.userid = u.userid
       WHERE a.answerid = ?`,
      [insertedId]
    );

    if (rows.length === 0) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Failed to retrieve newly created answer." });
    }

    // 4. Return the full answer object
    return res.status(StatusCodes.CREATED).json(rows[0]);
  } catch (error) {
    console.error("Error posting answer:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
}


module.exports = { postAnswer, getAnswersByQuestionId };
