const Issue = require("../models/customerissue");

const getAllIssues = async (req, res) => {
    try {
      const issues = await Issue.getAllIssues();
      res.json(issues);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving issues");
    }
  };

  const createIssue = async (req, res) => {
    const { message, email, name } = req.body;
    
    // Set the date to the current date
    const date = new Date();
  
    try {
      // Get the next ID
      const nextId = await Issue.getNextId();
  
      const newIssue = { id: nextId, message, email, name, date };
  
      const createdIssue = await Issue.createIssue(newIssue);
      res.status(201).json(createdIssue);
    } catch (error) {
      console.error("Error during issue creation:", error.message);
      res.status(500).send("Error creating Issue");
    }
  };

const deleteIssue = async (req, res) => {
  const issueId = req.params.id;

  try{
    const success = await Issue.deleteIssue(issueId)
    if(!success){
      return res.status(404).send("Issue not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting issue");
  }
};

  module.exports = {
    getAllIssues,
    createIssue,
    deleteIssue
  };