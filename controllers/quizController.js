const Quiz = require("../models/quiz");

const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.getAllQuizzes(); // Use the Quiz class
        res.json({ results: quizzes }); // Make sure to wrap results in an object with key 'results'
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving quizzes");
    }
};
  const getQuizById = async (req, res) => {
    const quizId = parseInt(req.params.id);
    try {
      const quiz = await Quiz.getQuizById(quizId); // Use the Quiz class
      if (!quiz) {
        return res.status(404).send("Quiz not found");
      }
      res.json(quiz);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving quiz");
    }
  };
  
  const createQuiz = async (req, res) => {
    const newQuizData = req.body; // Assuming the request body contains quiz data (question, answer, options)
    try {
      const createdQuiz = await Quiz.createQuiz(newQuizData); // Use the Quiz class
      res.status(201).json(createdQuiz);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating quiz");
    }
  };
  
  const updateQuiz = async (req, res) => {
    const quizId = parseInt(req.params.id);
    const newQuizData = req.body;
  
    try {
      const updatedQuiz = await Quiz.updateQuiz(quizId, newQuizData); // Use the Quiz class
      if (!updatedQuiz) {
        return res.status(404).send("Quiz not found");
      }
      res.json(updatedQuiz);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating quiz");
    }
  };
  
  const deleteQuiz = async (req, res) => {
    const { id } = req.params; // Assume the ID is provided as a URL parameter
  
    try {
      const result = await Quiz.deleteQuiz(id);
  
      if (result.success) {
        res.status(200).json({ message: result.message });
      } else {
        res.status(404).json({ message: result.message });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting quiz");
    }
  };
  
  module.exports = {
    getAllQuizzes,
    createQuiz,
    getQuizById,
    updateQuiz,
    deleteQuiz,
  };
  