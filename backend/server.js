const express = require("express");
const sql = require("mssql/msnodesqlv8");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(express.json());

// SQL Server configuration
const dbConfig = {
    connectionString:
        "Driver={ODBC Driver 18 for SQL Server};" +
        "Server=FAHEEZ-HIPPOLITAK,51000;" +
        "Database=InventoryHub;" +
        "Trusted_Connection=yes;" +
        "TrustServerCertificate=yes;"
};

// Connect to SQL Server
sql.connect(dbConfig)
    .then(() => {
        console.log("Connected to SQL Server");
    })
    .catch(error => {
        console.error("Database connection failed:", error);
    });

// Registration route
app.post("/api/users", async (req, res) => {
    try {
        const Username = req.body.Username || req.body.username;
        const Password = req.body.Password || req.body.password;

        if (!Username || !Password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        const pool = await sql.connect(dbConfig);

        const existingUser = await pool.request()
            .input("Username", sql.NVarChar(50), Username)
            .query("SELECT UserID FROM dbo.Users WHERE Username = @Username");

        if (existingUser.recordset.length > 0) {
            return res.status(409).json({
                message: "Username already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        const result = await pool.request()
            .input("Username", sql.NVarChar(50), Username)
            .input("Password", sql.NVarChar(255), hashedPassword)
            .query(`
                INSERT INTO dbo.Users (Username, Password)
                OUTPUT INSERTED.UserID, INSERTED.Username
                VALUES (@Username, @Password)
            `);

        res.status(201).json(result.recordset[0]);

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: "Server error during registration"
        });
    }
});

// Update username
app.put("/api/users/:id", async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const newUsername = req.body.Username || req.body.username;

        if (!newUsername) {
            return res.status(400).json({
                message: "Username is required."
            });
        }

        const pool = await sql.connect(dbConfig);

        const existingUser = await pool.request()
            .input("Username", sql.NVarChar(50), newUsername)
            .input("UserID", sql.Int, userId)
            .query(`
                SELECT UserID
                FROM dbo.Users
                WHERE Username = @Username
                AND UserID <> @UserID
            `);

        if (existingUser.recordset.length > 0) {
            return res.status(409).json({
                message: "Username already exists."
            });
        }

        const result = await pool.request()
            .input("UserID", sql.Int, userId)
            .input("Username", sql.NVarChar(50), newUsername)
            .query(`
                UPDATE dbo.Users
                SET Username = @Username
                WHERE UserID = @UserID
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.json({
            message: "Username updated successfully."
        });

    } catch (error) {
        console.error("Username update error:", error);

        res.status(500).json({
            message: "Unable to update username.",
            error: error.message
        });
    }
});

// Delete user account and associated products
app.delete("/api/users/:id", async (req, res) => {
    const transaction = new sql.Transaction();

    try {
        const userId = Number(req.params.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                message: "Invalid user ID."
            });
        }

        await transaction.begin();

        // Delete the user's products first
        await transaction.request()
            .input("UserID", sql.Int, userId)
            .query(`
                DELETE FROM dbo.Products
                WHERE UserID = @UserID
            `);

        // Then delete the user account
        const result = await transaction.request()
            .input("UserID", sql.Int, userId)
            .query(`
                DELETE FROM dbo.Users
                WHERE UserID = @UserID
            `);

        if (result.rowsAffected[0] === 0) {
            await transaction.rollback();

            return res.status(404).json({
                message: "User account not found."
            });
        }

        await transaction.commit();

        res.json({
            message: "Account deleted successfully."
        });

    } catch (error) {
        if (transaction._aborted !== true) {
            try {
                await transaction.rollback();
            } catch (rollbackError) {
                console.error("Rollback error:", rollbackError);
            }
        }

        console.error("Account deletion error:", error);

        res.status(500).json({
            message: "Unable to delete account.",
            error: error.message
        });
    }
});

// Login route
app.post("/api/login", async (req, res) => {
    try {
        const username = req.body.username || req.body.Username;
        const password = req.body.password || req.body.Password;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        const pool = await sql.connect(dbConfig);

        const result = await pool.request()
            .input("Username", sql.NVarChar(50), username)
            .query("SELECT UserID, Username, Password FROM dbo.Users WHERE Username = @Username");

        if (result.recordset.length === 0) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const user = result.recordset[0];

        const passwordMatch = await bcrypt.compare(password, user.Password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        res.json({
            UserID: user.UserID,
            Username: user.Username
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error during login"
        });
    }
});

// Update user password
app.put("/api/users/:id/password", async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Please enter your current and new passwords."
            });
        }

        const pool = await sql.connect(dbConfig);

        const userResult = await pool.request()
            .input("UserID", sql.Int, userId)
            .query(`
                SELECT Password
                FROM dbo.Users
                WHERE UserID = @UserID
            `);

        if (userResult.recordset.length === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            userResult.recordset[0].Password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Current password is incorrect."
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.request()
            .input("UserID", sql.Int, userId)
            .input("Password", sql.NVarChar(255), hashedPassword)
            .query(`
                UPDATE dbo.Users
                SET Password = @Password
                WHERE UserID = @UserID
            `);

        res.json({
            message: "Password updated successfully."
        });

    } catch (error) {
        console.error("Password update error:", error);

        res.status(500).json({
            message: "Unable to update password.",
            error: error.message
        });
    }
});

// Forgot password - reset using username
app.post("/api/forgot-password", async (req, res) => {
    try {
        const { username, newPassword } = req.body;

        if (!username || !newPassword) {
            return res.status(400).json({
                message: "Username and new password are required."
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters."
            });
        }

        const pool = await sql.connect(dbConfig);

        const userResult = await pool.request()
            .input("Username", sql.NVarChar(50), username.trim())
            .query(`
                SELECT UserID
                FROM dbo.Users
                WHERE Username = @Username
            `);

        if (userResult.recordset.length === 0) {
            return res.status(404).json({
                message: "Username not found."
            });
        }

        const userId = userResult.recordset[0].UserID;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.request()
            .input("UserID", sql.Int, userId)
            .input("Password", sql.NVarChar(255), hashedPassword)
            .query(`
                UPDATE dbo.Users
                SET Password = @Password
                WHERE UserID = @UserID
            `);

        res.json({
            message: "Password reset successfully."
        });

    } catch (error) {
        console.error("Forgot password error:", error);

        res.status(500).json({
            message: "Unable to reset password.",
            error: error.message
        });
    }
});

// Get all products
app.get("/api/products", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);

        const result = await pool.request().query(`
            SELECT *
            FROM dbo.Products
            ORDER BY ProductID ASC
        `);

        res.json(result.recordset);

    } catch (error) {
        console.error("Get products error:", error);

        res.status(500).json({
            message: "Unable to retrieve products"
        });
    }
});

// Add a new product
app.post("/api/products", async (req, res) => {
    try {
        const {
            UserID,
            Name,
            Code,
            Category,
            Quantity,
            Price,
            Status,
            ImageUrl
        } = req.body;

        if (!UserID || !Name || !Code) {
            return res.status(400).json({
                message: "User ID, product name and product code are required"
            });
        }

        const pool = await sql.connect(dbConfig);

        const result = await pool.request()
            .input("UserID", sql.Int, UserID)
            .input("Name", sql.NVarChar(255), Name)
            .input("Code", sql.NVarChar(100), Code)
            .input("Category", sql.NVarChar(100), Category)
            .input("Quantity", sql.Int, Quantity)
            .input("Price", sql.Decimal(10, 2), Price)
            .input("Status", sql.NVarChar(50), Status)
            .input("ImageUrl", sql.NVarChar(sql.MAX), ImageUrl || "")
            .query(`
                INSERT INTO dbo.Products
                (UserID, Name, Code, Category, Quantity, Price, Status, ImageUrl)
                OUTPUT INSERTED.*
                VALUES
                (@UserID, @Name, @Code, @Category, @Quantity, @Price, @Status, @ImageUrl)
            `);

        res.status(201).json(result.recordset[0]);

    } catch (error) {
        console.error("Add product error:", error);

        res.status(500).json({
            message: "Unable to add product",
            error: error.message
        });
    }
});

// Update an existing product
app.put("/api/products/:id", async (req, res) => {
    try {
        const productId = Number(req.params.id);

        const {
            Name,
            Code,
            Category,
            Quantity,
            Price,
            Status,
            ImageUrl
        } = req.body;

        const pool = await sql.connect(dbConfig);

        const result = await pool.request()
            .input("ProductID", sql.Int, productId)
            .input("Name", sql.NVarChar(255), Name)
            .input("Code", sql.NVarChar(100), Code)
            .input("Category", sql.NVarChar(100), Category)
            .input("Quantity", sql.Int, Quantity)
            .input("Price", sql.Decimal(10, 2), Price)
            .input("Status", sql.NVarChar(50), Status)
            .input("ImageUrl", sql.NVarChar(sql.MAX), ImageUrl || "")
            .query(`
                UPDATE dbo.Products
                SET
                    Name = @Name,
                    Code = @Code,
                    Category = @Category,
                    Quantity = @Quantity,
                    Price = @Price,
                    Status = @Status,
                    ImageUrl = @ImageUrl
                WHERE ProductID = @ProductID;

                SELECT * FROM dbo.Products
                WHERE ProductID = @ProductID;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        console.error("Update product error:", error);

        res.status(500).json({
            message: "Unable to update product",
            error: error.message
        });
    }
});

// Delete an existing product
app.delete("/api/products/:id", async (req, res) => {
    try {
        const productId = Number(req.params.id);

        const pool = await sql.connect(dbConfig);

        const result = await pool.request()
            .input("ProductID", sql.Int, productId)
            .query(`
                DELETE FROM dbo.Products
                WHERE ProductID = @ProductID
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error("Delete product error:", error);

        res.status(500).json({
            message: "Unable to delete product",
            error: error.message
        });
    }
});

// Test route
app.get("/", (req, res) => {
    res.send("InventoryHub SQL API Running");
});

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});