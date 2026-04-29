import express from "express";
import dotenv from "dotenv";
import { registerRoutes } from "./routes";
import cors from "cors";
import http from "http";
dotenv.config();

//You can create a server just with Node.js — but it’s more manual:

// const server = http.createServer((req, res) => {
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end("Hello from Node.js!");
// });

// server.listen(3000, () => console.log("Node server running on port 3000"));

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,  // For cookies/sessions if needed
  allowedHeaders: ['Content-Type', 'Authorization', 'ip'],  // ✅ Explicitly allow these
  
  preflightContinue: false,
}));
app.use(express.json());

//------ Register all Routes ------

registerRoutes(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;


