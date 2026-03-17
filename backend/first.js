// import express from "express";
// import 'dotenv/config';
// import { OAuth2Client } from 'google-auth-library';
// import { connection, collectionName } from "./dbconfig.js";
// import cors from "cors";
// import { ObjectId } from "mongodb";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import cookieParser from 'cookie-parser';

// const app = express();

// app.use(express.json());

// app.use(cors());



// // const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// // // --- Google Login Route ---
// // app.post('/google-login', async (req, res) => {
// //   const { token } = req.body;

// //   try {
// //     const ticket = await client.verifyIdToken({
// //       idToken: token,
// //       audience: process.env.GOOGLE_CLIENT_ID,
// //     });

// //     const payload = ticket.getPayload();
// //     const email = payload.email;
// //     const name = payload.name;

// //     const db = await connection();
// //     const usersCollection = db.collection("users");

// //     // Check if user exists
// //     let user = await usersCollection.findOne({ email });

// //     if (!user) {
// //       // Create new user if not exists
// //       const result = await usersCollection.insertOne({ name, email, password: "" });
// //       user = { _id: result.insertedId, name, email };
// //     }

// //     // Issue JWT
// //     const tokenJWT = jwt.sign(
// //       { email: user.email, userId: user._id },
// //       process.env.JWT_SECRET || "defaultsecret",
// //       { expiresIn: "5d" }
// //     );

// //     res.json({ success: true, name: user.name, email: user.email, token: tokenJWT });
// //   } catch (err) {
// //     console.error("Google login error:", err);
// //     res.status(401).json({ success: false, message: 'Invalid Google token' });
// //   }
// // });








// const client = new OAuth2Client("577348361922-tqsr025ee745amsbjbp7cjrn43omfs3o.apps.googleusercontent.com");

// app.post("/google-login", async (req, res) => {
//   try {
//     const { token } = req.body;

//     // Verify token with Google
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: "577348361922-tqsr025ee745amsbjbp7cjrn43omfs3o.apps.googleusercontent.com",
//     });

//     const payload = ticket.getPayload();
//     const { email, name, sub: googleId } = payload;

//     // Save user to DB if not exists
//     const db = await connection();
//     const usersCollection = db.collection("users");

//     let user = await usersCollection.findOne({ email });
//     if (!user) {
//       await usersCollection.insertOne({ name, email, googleId });
//     }

//     return res.json({ success: true, email, name });

//   } catch (err) {
//     console.error("Google login error:", err);
//     return res.status(500).json({ success: false, message: "Google login failed" });
//   }
// });



// //----login route---

// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Basic validation
//     if (!email || !password)
//       return res.status(400).json({ success: false, message: "Email and password required" });

//     const db = await connection();
//     const usersCollection = db.collection("users");

//     // Find user by email
//     const user = await usersCollection.findOne({ email });
//     if (!user)
//       return res.status(401).json({ success: false, message: "Invalid email or password" });

//     // Compare password with hashed password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(401).json({ success: false, message: "Invalid email or password" });

//     // Generate JWT token
//     const token = jwt.sign(
//       { email: user.email, userId: user._id },
//       process.env.JWT_SECRET || "defaultsecret",
//       { expiresIn: "5d" }
//     );

//     return res.status(200).json({ success: true, message: "Login successful", token });
//   } catch (err) {
//     console.error("Login error:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// });





















// // --- Signup route ---
// app.post("/signup", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     if (!email || !password)
//       return res.status(400).json({ success: false, message: "Email and password required" });

//     const db = await connection();
//     const usersCollection = db.collection("users");

//     const existingUser = await usersCollection.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ success: false, message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const result = await usersCollection.insertOne({ name, email, password: hashedPassword });

//     const token = jwt.sign({ email, userId: result.insertedId }, "gopal", { expiresIn: "5d" });

//     return res.status(201).json({ success: true, message: "Signup done", token });
//   } catch (err) {
//     console.error("Signup error:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// });



// // app.post("/add-Task", async (req, resp) => {
// //   const db = await connection();
// //   const collection = db.collection(collectionName);

// //   const result = await collection.insertOne(req.body);

// //   console.log(result);

// //   resp.send({
// //     message: "Task inserted",
// //     data: result,
// //   });
// // });

// app.post("/add-task", async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     if (!title || !description) {
//       return res.status(400).json({ success: false, message: "Title and description required" });
//     }

//     const db = await connection();
//     const collection = db.collection("tasks");

//     const result = await collection.insertOne({
//       title,
//       description,
//       createdAt: new Date(),
//     });

//     return res.status(201).json({ success: true, message: "Task added", data: result });
//   } catch (err) {
//     console.error("Add Task error:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// });


// app.get("/", async (req, resp) => {
//   const db = await connection();
//   const collection = db.collection(collectionName);

//   const result = await collection.find().toArray();

//   console.log(result);

//   resp.send({
//     message: "basic API",
//     success: true,
//     data: result,
//   });
// });
// app.delete("/deleteTask/:id", async (req, resp) => {
//   try {
//     const db = await connection();
//     const collection = db.collection(collectionName);
//     const id = req.params.id;

//     const result = await collection.deleteOne({ _id: new ObjectId(id) });
//     console.log(result);

//     if (result.deletedCount === 1) {
//       resp.send({ success: true, message: "Task deleted successfully" });
//     } else {
//       resp.status(404).send({ success: false, message: "Task not found" });
//     }
//   } catch (err) {
//     console.error(err);
//     resp.status(500).send({ success: false, message: "Delete failed" });
//   }
// });

// app.get("/task/:id", async (req, resp) => {
//   const db = await connection();
//   const collection = db.collection(collectionName);

//   const result = await collection.findOne({
//     _id: new ObjectId(req.params.id),
//   });

//   resp.send({
//     success: true,
//     data: result,
//   });
// });

// app.put("/updateTask/:id", async (req, resp) => {
//   try {
//     const db = await connection();
//     const collection = db.collection(collectionName);
//     const id = req.params.id;

//     console.log("Updating task ID:", id);
//     console.log("Update data:", req.body);

//     const result = await collection.updateOne(
//       { _id: new ObjectId(id) },
//       { $set: req.body }, // ← IMPORTANT
//     );

//     if (result.modifiedCount === 1) {
//       resp.send({ success: true, message: "Task updated successfully" });
//     } else {
//       resp
//         .status(404)
//         .send({ success: false, message: "Task not found or data unchanged" });
//     }
//   } catch (err) {
//     console.error("Update error:", err);
//     resp.status(500).send({ success: false, message: "Update failed" });
//   }
// });









// //  const saltRounds = 10;


// //  app.post("/signup", async (req, resp) => {
// //    const userData = req.body;

// //    if (userData.email && userData.password) {
// //          const db = await connection();
// //          const collection = db.collection("users");

// //          const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

// //          const newUser = {
// //            email: userData.email,
// //            password: hashedPassword,
// //          };

// //          const result = await collection.insertOne(newUser);

// //          if (result) {
// //            jwt.sign(  { email: newUser.email },"gopal", { expiresIn: "5d" }, (error, token) => {
// //                resp.send({
// //                  success: true,
// //                  message: "Signup Done",
// //                  token,
// //                });
// //              }
// //            );
// //          } else {
// //            resp.send({
// //              success: false,
// //              message: "Signup not successful",
// //                        });
// //     }
// //        }
// //      });







// // app.get("/login",(req,resp)=>{

// //  });

// app.listen(3232, () => {
//   console.log("Server running at http://localhost:3232");
// });






















































import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { OAuth2Client } from "google-auth-library";
import { connection } from "./dbconfig.js";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();

app.use(express.json());
const collectionName = "tasks";





app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://todo1-qtld-jotddhd13-gopal-arun-bhoples-projects.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
    
  })
);
const PORT = process.env.PORT || 3232;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



app.get("/health", (req, res) => res.send("Server is running!"));

/* ---------------- GOOGLE LOGIN ---------------- */

app.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;
    console.log("Starting Google Login..."); // New log

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    console.log("Token verified."); // New log

    const payload = ticket.getPayload();
    const { email, name } = payload;
    
    const db = await connection();
    console.log("DB connection established."); // New log

    const usersCollection = db.collection("users");
    let user = await usersCollection.findOne({ email });

    if (!user) {
      await usersCollection.insertOne({ name, email, createdAt: new Date() });
      console.log("New user created.");
    }

    const jwtToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "5d" });
    res.json({ success: true, email, name, token: jwtToken });

  } catch (error) {
    console.error("FULL ERROR TRACE:", error); // This is the most important line
    res.status(500).json({ success: false, message: error.message });
  }
});











// app.post("/google-login", async (req, res) => {
//   console.log("Request received at /google-login"); // Add this
//   try {
//     const { token } = req.body;
//     console.log("Token received:", token ? "Yes" : "No"); // Add this
    
//     // ... rest of your code

// // app.post("/google-login", async (req, res) => {
// //   try {
// //     const { token } = req.body;

//     if (!token) {
//       return res.status(400).json({ success: false, message: "Token missing" });
//     }

//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { email, name } = payload;

//     // Connect to DB
//     const db = await connection();
//     const usersCollection = db.collection("users");

//     let user = await usersCollection.findOne({ email });

//     if (!user) {
//       // Insert new user if they don't exist
//       await usersCollection.insertOne({ name, email, createdAt: new Date() });
//     }

//     // IMPORTANT: Generate a JWT so the frontend stays logged in
//     const jwtToken = jwt.sign(
//       { email },
//       process.env.JWT_SECRET,
//       { expiresIn: "5d" }
//     );

//     res.json({
//       success: true,
//       email,
//       name,
//       token: jwtToken, // Send this back to your Vite frontend
//     });

//   } catch (error) {
//     console.error("Detailed Google login error:", error); // Check your terminal for this!
//     res.status(500).json({
//       success: false,
//       message: "Google login failed: " + error.message,
//     });
//   }
// });






// app.post("/google-login", async (req, res) => {
//   try {
//     const { token } = req.body;

//     if (!token) {
//       return res.status(400).json({
//         success: false,
//         message: "Token missing",
//       });
//     }

//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { email, name } = payload;

//     const db = await connection();
//     const usersCollection = db.collection("users");

//     let user = await usersCollection.findOne({ email });

//     if (!user) {
//       await usersCollection.insertOne({ name, email });
//     }

//     res.json({
//       success: true,
//       email,
//       name,
//     });

//   } catch (error) {
//     console.error("Google login error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Google login failed",
//     });
//   }
// });










// app.post("/google-login", async (req, res) => {
//   try {
//     const { token } = req.body;

//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { email, name, sub: googleId } = payload;

//     const db = await connection();
//     const usersCollection = db.collection("users");

//     let user = await usersCollection.findOne({ email });

//     if (!user) {
//       await usersCollection.insertOne({ name, email, googleId });
//     }

//     const jwtToken = jwt.sign(
//       { email },
//       process.env.JWT_SECRET,
//       { expiresIn: "5d" }
//     );

//     res.json({
//       success: true,
//       name,
//       email,
//       token: jwtToken,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: "Google login failed",
//     });
//   }
// });





/* ---------------- LOGIN ---------------- */

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const db = await connection();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "5d" }
    );

    res.json({
      success: true,
      token,
    });
  }  catch (err) {
  console.error(err);
  // Change this line so you can see the error in Inspect -> Network tab
  res.status(500).json({ success: false, error: err.message }); 
}
});





/* ---------------- SIGNUP ---------------- */




app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const db = await connection();
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
    });

    res.json({
      success: true,
      message: "Signup successful",
      userId: result.insertedId,
    });

  } catch (err) {
  console.error(err);
  // Change this line so you can see the error in Inspect -> Network tab
  res.status(500).json({ success: false, error: err.message }); 
}
});






// app.post("/signup", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const db = await connection();
//     const usersCollection = db.collection("users");

//     const exist = await usersCollection.findOne({ email });

//     if (exist) {
//       return res.json({
//         success: false,
//         message: "User already exists",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const result = await usersCollection.insertOne({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     const token = jwt.sign(
//       { email, id: result.insertedId },
//       process.env.JWT_SECRET,
//       { expiresIn: "5d" }
//     );

//     res.json({
//       success: true,
//       token,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false });
//   }
// });





/* ---------------- ADD TASK ---------------- */



app.post("/add-task", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Title required" });

    const db = await connection();
    const result = await db.collection(collectionName).insertOne({
      title,
      description,
      createdAt: new Date()
    });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// app.post("/add-task", async (req, res) => {
//   try {
//     const { title, description } = req.body;

//     if (!title || !description) {
//       return res.status(400).json({
//         success: false,
//         message: "Title and description required"
//       });
//     }


//     const db = await connection();
//     const collection = db.collection(collectionName);

//    // const collection = db.collection("tasks");

//     const result = await collection.insertOne({
//       title,
//       description,
//       createdAt: new Date()
//     });

//     res.json({
//       success: true,
//       message: "Task added",
//       data: result
//     });

//   } catch (error) {
//     console.error("Add Task error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server error"
//     });
//   }
// });




// app.post("/add-task", async (req, res) => {
//   try {
//     const db = await connection();
//     const collection = db.collection(collectionName);

//     const { title, description } = req.body;

//     const result = await collection.insertOne({
//       title,
//       description,
//       createdAt: new Date(),
//     });

//     res.json({
//       success: true,
//       data: result,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false });
//   }
// });





/* ---------------- GET TASK LIST ---------------- */

app.get("/", async (req, res) => {
  try {
    const db = await connection();
    const tasks = await db.collection(collectionName).find().toArray();
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});




// app.get("/", async (req, res) => {
//   try {
//     const db = await connection();
//     const collection = db.collection(collectionName);

//     const tasks = await collection.find().toArray();

//     res.json({
//       success: true,
//       data: tasks,
//     });
//   } catch (err) {
//     console.error(err);
//   }
// });





/* ---------------- DELETE TASK ---------------- */
app.delete("/deleteTask/:id", async (req, res) => {
  try {
    const db = await connection();
    const result = await db.collection(collectionName).deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});




// app.delete("/deleteTask/:id", async (req, res) => {
//   try {
//     const db = await connection();
//     const collection = db.collection(collectionName);

//     const result = await collection.deleteOne({
//       _id: new ObjectId(req.params.id),
//     });

//     res.json({
//       success: true,
//       result,
//     });
//   } catch (err) {
//     console.error(err);
//   }
// });





/* ---------------- GET SINGLE TASK ---------------- */

app.get("/task/:id", async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);

    const task = await collection.findOne({
      _id: new ObjectId(req.params.id),
    });

    res.json({
      success: true,
      data: task,
    });
  } catch (err) {
    console.error(err);
  }
});





/* ---------------- UPDATE TASK ---------------- */

app.put("/updateTask/:id", async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);

    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );

    res.json({
      success: true,
      result,
    });
  } catch (err) {
    console.error(err);
  }
});





/* ---------------- SERVER ---------------- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});