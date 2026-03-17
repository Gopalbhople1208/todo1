

// // //  import { MongoClient } from "mongodb";

// // //  const url = "mongodb://localhost:27017";
 

// // //  const dbName = "node";

// // //  export const collectionName = "tasks";

// // //  const client = new MongoClient(url);

// // //  export const connection = async () => {
// // //    const connect = await client.connect();
// // //    console.log("MongoDB connected successfully");
// // //    return connect.db(dbName);
// // //  };





// // // import { MongoClient } from "mongodb";

// // // // ✅ Works locally AND on Vercel
// // // const url = process.env.MONGODB_URI || "mongodb://localhost:27017";
// // // const dbName = "node";

// // // export const collectionName = "tasks";

// // // const client = new MongoClient(url);

// // // export const connection = async () => {
// // //   await client.connect();
// // //   console.log("MongoDB connected successfully");
// // //   return client.db(dbName);
// // // };




// //  import { MongoClient } from "mongodb";

// //  const url = "mongodb://localhost:27017";
 

// //  const dbName = "node";

// //  export const collectionName = "tasks";

// //  const client = new MongoClient(url);

// //  export const connection = async () => {
// //    const connect = await client.connect();
// //    console.log("MongoDB connected successfully");
// //    return connect.db(dbName);
// //  };




// import { MongoClient } from "mongodb";
// import dotenv from "dotenv";

// dotenv.config();

// const url = process.env.MONGO_URI;
// const dbName = process.env.DB_NAME;

// export const collectionName = "tasks";   // ✅ ADD THIS

// let client;

// export const connection = async () => {
//   if (!client) {
//     client = new MongoClient(url);
//     await client.connect();
//     console.log("MongoDB connected successfully");
//   }
//   return client.db(dbName);
// };


// import { MongoClient } from "mongodb";
// import dotenv from "dotenv";


// dotenv.config();

// const url = process.env.MONGO_URI;
// const dbName = process.env.DB_NAME;



// export const collectionName = "tasks";   // ✅ add this line

// let client;

// export const connection = async () => {
//   if (!client) {
//     client = new MongoClient(url);
//     await client.connect();
//     console.log("MongoDB connected successfully");
//   }
//   return client.db(dbName);
// };




//  import { MongoClient } from "mongodb";
//  import dotenv from "dotenv";

//  dotenv.config();

//  const url = process.env.MONGO_URL; 
//  const dbName = process.env.DB_NAME || "node";

//  let client;

//  export const connection = async () => {
//    try {
//      // This check ensures we don't open a new connection every single time
//      if (!client || !client.topology || !client.topology.isConnected()) {
//        client = new MongoClient(url);
//        await client.connect();
//        console.log("🚀 Connected to MongoDB Atlas");
//      }
//      return client.db(dbName);
//    } catch (err) {
//      console.error("❌ DATABASE CONNECTION ERROR:", err);
//      throw err; 
//    }
//  };

// import { MongoClient } from "mongodb";
// import dotenv from "dotenv";

// dotenv.config();

// const url = process.env.MONGO_URL; 
// const dbName = process.env.DB_NAME || "node";

// // 1. Declare the client at the top level
// const client = new MongoClient(url);

// export const connection = async () => {
//   try {
//     // 2. Now 'client' is accessible here
//     if (!client.topology || !client.topology.isConnected()) {
//       await client.connect();
//       console.log("🚀 Connected to MongoDB Atlas");
//     }
//     return client.db(dbName);
//   } catch (err) {
//     console.error("❌ DATABASE CONNECTION ERROR:", err.message);
//     throw err; 
//   }
// };



import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient, ObjectId } from 'mongodb';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

let db;
let useInMemory = false;

export async function connection() {
  // If already determined to use in-memory, return it
  if (useInMemory) {
    return getInMemoryDB();
  }

  // If db is already connected, return it
  if (db) return db;
  
  // Try to connect only once at startup
  if (!global.mongoConnectionAttempted) {
    global.mongoConnectionAttempted = true;
    try {
      const client = new MongoClient(process.env.MONGO_URL || "mongodb://127.0.0.1:27017", {
        serverSelectionTimeoutMS: 2000,
        connectTimeoutMS: 2000,
      });
      await client.connect();
      db = client.db(process.env.DB_NAME || "node");
      console.log("✅ Connected to MongoDB successfully");
      return db;
    } catch (err) {
      console.log("⚠️  MongoDB unavailable. Using in-memory database for development.\n   To use MongoDB, ensure MongoDB is running locally or check your connection string.");
      useInMemory = true;
      return getInMemoryDB();
    }
  }
  
  return useInMemory ? getInMemoryDB() : db;
}

// In-memory mock database for development
const memoryDB = {
  users: [],
  tasks: [],
};

function getInMemoryDB() {
  return {
    collection: (name) => {
      if (name === 'users') {
        return getUsersCollection();
      } else if (name === 'tasks') {
        return getTasksCollection();
      }
    }
  };
}

function getUsersCollection() {
  return {
    findOne: async (query) => {
      return memoryDB.users.find(u => {
        for (let key in query) {
          if (u[key] !== query[key]) return false;
        }
        return true;
      }) || null;
    },
    insertOne: async (data) => {
      const doc = { _id: new ObjectId(), ...data };
      memoryDB.users.push(doc);
      return { insertedId: doc._id };
    }
  };
}

function getTasksCollection() {
  return {
    find: () => ({
      toArray: async () => memoryDB.tasks
    }),
    findOne: async (query) => {
      return memoryDB.tasks.find(t => {
        for (let key in query) {
          if (key === '_id') {
            const queryId = query[key].toString ? query[key].toString() : String(query[key]);
            const tId = t._id.toString ? t._id.toString() : String(t._id);
            if (tId !== queryId) return false;
          } else if (t[key] !== query[key]) return false;
        }
        return true;
      }) || null;
    },
    insertOne: async (data) => {
      const doc = { _id: new ObjectId(), ...data };
      memoryDB.tasks.push(doc);
      return { insertedId: doc._id };
    },
    deleteOne: async (query) => {
      const queryId = query._id.toString ? query._id.toString() : String(query._id);
      const index = memoryDB.tasks.findIndex(t => {
        const tId = t._id.toString ? t._id.toString() : String(t._id);
        return tId === queryId;
      });
      if (index !== -1) {
        memoryDB.tasks.splice(index, 1);
        return { deletedCount: 1 };
      }
      return { deletedCount: 0 };
    },
    updateOne: async (query, update) => {
      const queryId = query._id.toString ? query._id.toString() : String(query._id);
      const task = memoryDB.tasks.find(t => {
        const tId = t._id.toString ? t._id.toString() : String(t._id);
        return tId === queryId;
      });
      if (task) {
        Object.assign(task, update.$set || update);
        return { modifiedCount: 1 };
      }
      return { modifiedCount: 0 };
    }
  };
}

export default connection;