import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import ProgressChart from "../components/ProgressChart";
import LearningCalendar from "../components/LearningCalendar";

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

    <div className="
      min-h-screen
      bg-gradient-to-br
      from-black
      via-gray-950
      to-black
      text-white
    ">

      <Navbar />


      <main className="
        px-6
        py-8
        max-w-[1600px]
        mx-auto
      ">



        {/* Hero */}

        <section>

          <h1 className="
            text-3xl
            font-bold
          ">
            Your Learning Journey
          </h1>


          <p className="
            text-gray-400
            mt-2
            text-sm
          ">
            Understand your real LeetCode growth beyond submission counts.
          </p>


        </section>





        {/* Stats */}

        <section className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-5
          mt-8
        ">


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





        {/* Progress */}

        <section className="
          mt-8
        ">

          <ProgressChart />

        </section>





        {/* Calendar */}

        <section className="
          mt-6
        ">

          <LearningCalendar />

        </section>



      </main>


    </div>

  );

}


export default Dashboard;