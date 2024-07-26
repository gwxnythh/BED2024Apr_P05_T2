const sql = require("mssql");
const dbconfig = require("../dbConfig");

class Issue {
    constructor(id,message,email,name,date) {
        this.id = id;
        this.message = message;
        this.email = email;
        this.name = name;
        this.date = date;
    }

    static async getAllIssues(pool){
        const sqlQuery = `SELECT * FROM customerissues`; 
    
        const request = pool.request();
        const result = await request.query(sqlQuery);
    
        return result.recordset.map(
          (row) => new Issue(row.id, row.message, row.email, row.name, row.date)
        );
    }

    static async getNextId(pool) {    
        const sqlQuery = `SELECT TOP 1 id FROM customerissues ORDER BY id DESC`;
        
        const request = pool.request();
        const result = await request.query(sqlQuery);
    
        const lastId = result.recordset[0]?.id || 'M00'; // Default to 'M00' if no records found
        const numericPart = parseInt(lastId.slice(1), 10);
        const nextNumericPart = numericPart + 1;
        const nextId = `M${nextNumericPart.toString().padStart(2, '0')}`;
    
        return nextId;
      }

      static async createIssue(pool, newIssueData) {
        const request = pool.request();
    
        const sqlQuery = `
          INSERT INTO customerissues (id, message, email, name, date) 
          VALUES (@id, @message, @email, @name, @date);
        `;
    
        request.input("id", sql.VarChar, newIssueData.id);
        request.input("message", sql.VarChar, newIssueData.message);
        request.input("email", sql.VarChar, newIssueData.email);
        request.input("name", sql.VarChar, newIssueData.name);
        request.input("date", sql.DateTime, newIssueData.date);
    
        const result = await request.query(sqlQuery);
        return newIssueData.id;
      }

    static async deleteIssue(pool, id){
        const request = pool.request();
        const sqlQuery  = `DELETE FROM customerissues WHERE id = @id`;
        request.input("id", sql.VarChar, id); 
        const result = await request.query(sqlQuery);
        return result.rowsAffected > 0;
    }

}

module.exports =  Issue;
