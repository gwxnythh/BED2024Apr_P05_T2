const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Quiz {
  constructor(id, question, answer, options = []) {
    this.id = id;
    this.question = question;
    this.answer = answer;
    this.options = options;
  }

  static async getAllQuizzes() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM questions`; // Replace with your actual table name

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new Quiz(row.id, row.question, row.answer, row.options ? row.options.split(',') : [])
    ); // Convert rows to Quiz objects
  }

  static async getQuizById(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM questions WHERE id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", sql.Int, id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new Quiz(
          result.recordset[0].id,
          result.recordset[0].question,
          result.recordset[0].answer,
          result.recordset[0].options ? result.recordset[0].options.split(',') : []
        )
      : null; // Handle quiz not found
  }

  static async createQuiz(newQuizData) {
    const connection = await sql.connect(dbConfig);

    try {
      const sqlQuery = `INSERT INTO questions (id, question, answer, options) 
                        OUTPUT INSERTED.* VALUES (@id, @question, @answer, @options)`;

      const request = connection.request();
      request.input("id", sql.Int, newQuizData.id);
      request.input("question", sql.VarChar, newQuizData.question);
      request.input("answer", sql.VarChar, newQuizData.answer);
      request.input("options", sql.VarChar, newQuizData.options.join(','));

      const result = await request.query(sqlQuery);

      connection.close();

      return result.recordset[0]
        ? new Quiz(
            result.recordset[0].id,
            result.recordset[0].question,
            result.recordset[0].answer,
            result.recordset[0].options ? result.recordset[0].options.split(',') : []
          )
        : null;
    } catch (error) {
      connection.close();
      if (error.number === 2627) { // SQL Server error number for unique constraint violation
        throw new Error('A quiz with the given ID already exists.');
      }
      throw error;
    }
  }
  static async updateQuiz(id, newQuizData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE questions SET question = @question, answer = @answer, options = @options 
                      OUTPUT INSERTED.* WHERE id = @id`;

    const request = connection.request();
    request.input("id", sql.Int, id);
    request.input("question", sql.VarChar, newQuizData.question);
    request.input("answer", sql.VarChar, newQuizData.answer);
    request.input("options", sql.VarChar, newQuizData.options.join(','));

    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new Quiz(
          result.recordset[0].id,
          result.recordset[0].question,
          result.recordset[0].answer,
          result.recordset[0].options ? result.recordset[0].options.split(',') : []
        )
      : null; // Handle quiz update failure
  }

  static async deleteQuiz(id) {
    const connection = await sql.connect(dbConfig);
  
    const sqlQuery = `DELETE FROM questions OUTPUT DELETED.* WHERE id = @id`;
  
    const request = connection.request();
    request.input("id", sql.Int, id);
    const result = await request.query(sqlQuery);
  
    connection.close();
  
    if (result.recordset.length > 0) {
      return { success: true, message: `Quiz ${id} has been deleted.` };
    } else {
      return { success: false, message: `Quiz ${id} not found.` };
    }
  }
  }

module.exports = Quiz;
