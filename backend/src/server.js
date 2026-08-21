require("dotenv").config();

const express = require("express");
const cors = require("cors");

const prisma = require("./db/prisma");

const statsRouter =
    require("./routes/stats");


const app = express();

const PORT =
    process.env.PORT || 5000;


// ----------------------------------------
// MIDDLEWARE
// ----------------------------------------

app.use(cors());

app.use(express.json());


// ----------------------------------------
// HEALTH CHECK
// ----------------------------------------

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        message: "LC Pulse API is running"
    });

});


// ----------------------------------------
// STATISTICS ROUTES
// ----------------------------------------

app.use(
    "/api/stats",
    statsRouter
);


// ----------------------------------------
// START SERVER
// ----------------------------------------

app.listen(PORT, () => {

    console.log(
        `🚀 LC Pulse API running on http://localhost:${PORT}`
    );

});


// ----------------------------------------
// GRACEFUL SHUTDOWN
// ----------------------------------------

process.on(
    "SIGINT",
    async () => {

        await prisma.$disconnect();

        process.exit(0);

    }
);