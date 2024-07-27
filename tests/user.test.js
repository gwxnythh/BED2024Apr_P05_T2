const sql = require("mssql");
const User = require("../models/user");
const dbConfig = require("../dbConfig");

jest.mock("mssql");
jest.mock("../dbConfig");

describe("User class", () => {
  let pool;

  beforeAll(async () => {
    pool = {
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      query: jest.fn(),
    };
    sql.connect = jest.fn().mockResolvedValue(pool);
  });

  afterAll(async () => {
    await sql.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("save", () => {
    it("should save a new user and return the user with user_id", async () => {
      const mockUser = new User("testuser", "Test User", "test@example.com", "password123", "user");
      const mockResult = {
        recordset: [{ user_id: 1 }],
      };

      pool.query.mockResolvedValue(mockResult);

      const savedUser = await mockUser.save(pool);

      expect(pool.request).toHaveBeenCalled();
      expect(pool.input).toHaveBeenCalledWith("username", mockUser.username);
      expect(pool.input).toHaveBeenCalledWith("password", mockUser.password);
      expect(pool.input).toHaveBeenCalledWith("role", mockUser.role);
      expect(pool.input).toHaveBeenCalledWith("email", mockUser.email);
      expect(pool.input).toHaveBeenCalledWith("name", mockUser.name);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String));
      expect(savedUser.user_id).toBe(1);
    });

    it("should throw an error if save fails", async () => {
      const mockUser = new User("testuser", "Test User", "test@example.com", "password123", "user");

      pool.query.mockRejectedValue(new Error("Database error"));

      await expect(mockUser.save(pool)).rejects.toThrow("Database error");
    });
  });

  describe("getUserByUsername", () => {
    it("should return a user by username", async () => {
      const mockUser = {
        username: "testuser",
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "user",
      };
      const mockResult = {
        recordset: [mockUser],
      };

      pool.query.mockResolvedValue(mockResult);

      const user = await User.getUserByUsername(pool, "testuser");

      expect(pool.request).toHaveBeenCalled();
      expect(pool.input).toHaveBeenCalledWith("username", sql.VarChar, "testuser");
      expect(pool.query).toHaveBeenCalledWith(expect.any(String));
      expect(user).toEqual(expect.any(User));
      expect(user.username).toBe(mockUser.username);
    });

    it("should return null if user not found", async () => {
      const mockResult = {
        recordset: [],
      };

      pool.query.mockResolvedValue(mockResult);

      const user = await User.getUserByUsername(pool, "testuser");

      expect(user).toBeNull();
    });

    it("should throw an error if database query fails", async () => {
      pool.query.mockRejectedValue(new Error("Database error"));

      await expect(User.getUserByUsername(pool, "testuser")).rejects.toThrow("Database error");
    });
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const mockUsers = [
        { user_id: 1, username: "testuser1", name: "Test User 1", email: "test1@example.com", password: "password123", role: "user" },
        { user_id: 2, username: "testuser2", name: "Test User 2", email: "test2@example.com", password: "password123", role: "user" },
      ];
      const mockResult = {
        recordset: mockUsers,
      };

      pool.query.mockResolvedValue(mockResult);

      const users = await User.getAllUsers(pool);

      expect(pool.request).toHaveBeenCalled();
      expect(pool.query).toHaveBeenCalledWith(expect.any(String));
      expect(users.length).toBe(2);
      expect(users[0]).toEqual(expect.any(User));
      expect(users[1]).toEqual(expect.any(User));
    });

    it("should throw an error if database query fails", async () => {
      pool.query.mockRejectedValue(new Error("Database error"));

      await expect(User.getAllUsers(pool)).rejects.toThrow("Database error");
    });
  });

  describe("updateUser", () => {
    it("should update a user and return the updated user", async () => {
      const mockUser = new User("updateduser", "Updated User", "updated@example.com", "newpassword123", "admin");
      const mockResult = {
        recordset: [mockUser],
      };

      pool.query.mockResolvedValue(mockResult);

      // Mock getUserById
      User.getUserById = jest.fn().mockResolvedValue(mockUser);

      const updatedUser = await User.updateUser(pool, 1, {
        username: "updateduser",
        passwordHash: "newpassword123",
        role: "admin",
      });

      expect(pool.request).toHaveBeenCalled();
      expect(pool.input).toHaveBeenCalledWith("user_id", 1);
      expect(pool.input).toHaveBeenCalledWith("username", "updateduser");
      expect(pool.input).toHaveBeenCalledWith("passwordHash", "newpassword123");
      expect(pool.input).toHaveBeenCalledWith("role", "admin");
      expect(pool.query).toHaveBeenCalledWith(expect.any(String));
      expect(updatedUser).toEqual(expect.any(User));
    });

    it("should throw an error if update fails", async () => {
      const mockUser = new User("updateduser", "Updated User", "updated@example.com", "newpassword123", "admin");

      pool.query.mockRejectedValue(new Error("Database error"));

      await expect(User.updateUser(pool, 1, mockUser)).rejects.toThrow("Database error");
    });
  });

  describe("deleteUser", () => {
    it("should delete a user and return true if successful", async () => {
      const mockResult = {
        rowsAffected: [1],
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await User.deleteUser(pool, 1);

      expect(pool.request).toHaveBeenCalled();
      expect(pool.input).toHaveBeenCalledWith("user_id", 1);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String));
      expect(result).toBe(true);
    });

    it("should return false if no rows were affected", async () => {
      const mockResult = {
        rowsAffected: [0],
      };

      pool.query.mockResolvedValue(mockResult);

      const result = await User.deleteUser(pool, 1);

      expect(result).toBe(false);
    });

    it("should throw an error if delete fails", async () => {
      pool.query.mockRejectedValue(new Error("Database error"));

      await expect(User.deleteUser(pool, 1)).rejects.toThrow("Database error");
    });
  });

  describe("searchUsers", () => {
    it("should search for users and return matching users", async () => {
      const mockUsers = [
        { user_id: 1, username: "testuser1", name: "Test User 1", email: "test1@example.com", password: "password123", role: "user" },
        { user_id: 2, username: "testuser2", name: "Test User 2", email: "test2@example.com", password: "password123", role: "user" },
      ];
      const mockResult = {
        recordset: mockUsers,
      };

      pool.query.mockResolvedValue(mockResult);

      const users = await User.searchUsers(pool, "testuser");

      expect(pool.request).toHaveBeenCalled();
      expect(pool.query).toHaveBeenCalledWith(expect.any(String));
      expect(users.length).toBe(2);
      expect(users[0].username).toBe(mockUsers[0].username);
      expect(users[1].username).toBe(mockUsers[1].username);
    });

    it("should throw an error if search fails", async () => {
      pool.query.mockRejectedValue(new Error("Error searching users"));

      await expect(User.searchUsers(pool, "testuser")).rejects.toThrow("Error searching users");
    });
  });
});
