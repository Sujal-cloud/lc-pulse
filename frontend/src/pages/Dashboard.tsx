import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import ProgressChart from "../components/ProgressChart";

function Dashboard() {

  const [problemsSolved, setProblemsSolved] = useState("--");
  const [problemsThisMonth, setProblemsThisMonth] = useState("--");
  const [learningVelocity, setLearningVelocity] = useState("--");


  useEffect(() => {

    api.get("/stats/cumulative")
      .then((res) => {
        const data = res.data.data;

        if (data.length > 0) {
          setProblemsSolved(
            data[data.length - 1].totalSolved
          );
        }
      });


    api.get("/stats/monthly")
      .then((res) => {
        const data = res.data.data;

        if (data.length > 0) {
          setProblemsThisMonth(
            data[data.length - 1].newProblems
          );
        }
      });


    api.get("/stats/velocity")
      .then((res) => {
        const data = res.data.data;

        if (data.length > 0) {
          setLearningVelocity(
            data[data.length - 1].velocity
          );
        }
      });


  }, []);


  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white">

      <Navbar />


      <main className="px-8 py-10">


        <section>

          <h1 className="text-4xl font-bold">
            Your Learning Journey
          </h1>

          <p className="text-gray-400 mt-2">
            Understand your real LeetCode growth beyond submission counts.
          </p>

        </section>



        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">


          <StatCard
            title="Problems Solved"
            value={problemsSolved}
          />


          <StatCard
            title="Problems This Month"
            value={problemsThisMonth}
          />


          <StatCard
            title="Learning Velocity"
            value={learningVelocity}
          />


        </section>




        <section className="mt-10">
            <ProgressChart />
        </section>




        <section className="mt-6">

          <div className="rounded-2xl border border-gray-800 bg-white/5 backdrop-blur-md p-8">

            <h2 className="text-xl font-semibold">
              Learning Calendar
            </h2>

            <p className="text-gray-400 mt-2">
              Explore your consistent learning days and problem-solving activity.
            </p>

            <p className="text-gray-500 text-sm mt-4">
              Click a day to discover solved problems.
            </p>

          </div>

        </section>


      </main>

    </div>

  );
}

export default Dashboard;