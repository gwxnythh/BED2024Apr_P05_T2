const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json"; // Output file for the spec
const routes = ["./app.js"]; // Path to your API route files

const doc = {
  info: {
    title: "Episteme",
    description: "Episteme is a virtual learning platform offering expert-led courses in various fields to empower individuals with the skills and knowledge needed for career advancement and personal development.",
  },
  host: "localhost:3000",
};

swaggerAutogen(outputFile, routes, doc);