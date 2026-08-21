const express = require("express");

const prisma = require("../db/prisma");

const {
    getDailyNewProblems
} = require("../analytics/dailyStats");

const {
    getMonthlyStats
} = require("../analytics/monthlyStats");

const {
    getYearlyStats
} = require("../analytics/yearlyStats");

const {
    getCumulativeStats
} = require("../analytics/cumulativeStats");

const {
    getLearningVelocity
} = require("../analytics/velocity");


const router = express.Router();


async function getUser() {

    return prisma.user.findUnique({

        where: {
            leetcodeUsername: "sujal_codes"
        }

    });

}


// ----------------------------------------
// DAILY
// ----------------------------------------

router.get("/daily", async (req, res) => {

    try {

        const user = await getUser();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        const data =
            await getDailyNewProblems(user.id);


        res.json({
            success: true,
            data
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch daily statistics"
        });

    }

});


// ----------------------------------------
// MONTHLY
// ----------------------------------------

router.get("/monthly", async (req, res) => {

    try {

        const user = await getUser();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        const data =
            await getMonthlyStats(user.id);


        res.json({
            success: true,
            data
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch monthly statistics"
        });

    }

});


// ----------------------------------------
// YEARLY
// ----------------------------------------

router.get("/yearly", async (req, res) => {

    try {

        const user = await getUser();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        const data =
            await getYearlyStats(user.id);


        res.json({
            success: true,
            data
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch yearly statistics"
        });

    }

});


// ----------------------------------------
// CUMULATIVE
// ----------------------------------------

router.get("/cumulative", async (req, res) => {

    try {

        const user = await getUser();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        const data =
            await getCumulativeStats(user.id);


        res.json({
            success: true,
            data
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch cumulative statistics"
        });

    }

});


// ----------------------------------------
// VELOCITY
// ----------------------------------------

router.get("/velocity", async (req, res) => {

    try {

        const user = await getUser();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        const data =
            await getLearningVelocity(user.id);


        res.json({
            success: true,
            data
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch learning velocity"
        });

    }

});


module.exports = router;