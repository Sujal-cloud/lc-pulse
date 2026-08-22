import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  createDailyLookup,
  generateMonthDays,
  getIntensity,
  getStartOffset,
  getMonthLabel
} from "../utils/calendar";


function LearningCalendar(){

  const [dailyData,setDailyData] = useState<any[]>([]);

  const [selectedYear] = useState(2026);
  const [selectedMonth] = useState(7);


  const dailyLookup = createDailyLookup(dailyData);


  const days = generateMonthDays(
    selectedYear,
    selectedMonth
  );


  const offset = getStartOffset(
    selectedYear,
    selectedMonth
  );


  const monthName = getMonthLabel(
    selectedYear,
    selectedMonth
  );


  useEffect(()=>{

    api.get("/stats/daily")
      .then((res)=>{
        setDailyData(res.data.data);
      });

  },[]);



  return (

    <div className="
      rounded-3xl
      border
      border-gray-800
      bg-white/5
      backdrop-blur-xl
      p-6
    ">


      {/* Header */}

      <div>

        <h2 className="
          text-2xl
          font-semibold
        ">
          📅 Learning Calendar
        </h2>


        <p className="
          text-gray-400
          mt-2
        ">
          Explore your consistent learning days and problem-solving activity.
        </p>

      </div>




      {/* Navigation */}

      <div className="
        flex
        items-center
        justify-between
        mt-6
      ">


        <button
          className="
            px-4
            py-2
            rounded-xl
            border
            border-gray-700
            text-gray-400
            hover:text-white
            hover:bg-white/5
            transition
          "
        >
          ← Previous
        </button>



        <h3 className="
          text-2xl
          font-semibold
        ">
          {monthName}
        </h3>



        <button
          className="
            px-4
            py-2
            rounded-xl
            border
            border-gray-700
            text-gray-400
            hover:text-white
            hover:bg-white/5
            transition
          "
        >
          Next →
        </button>


      </div>





      {/* Week Labels */}

      <div className="
        w-full
        grid
        grid-cols-7
        mt-6
        text-sm
        text-gray-500
      ">


        {
          [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun"
          ]
          .map(day=>(

            <div
              key={day}
              className="
                text-center
                font-medium
              "
            >
              {day}
            </div>

          ))
        }


      </div>






      {/* Calendar Grid */}

      <div className="
        max-w-6xl
        mx-auto
        grid
        grid-cols-7
        gap-3
        mt-4
      ">


        {
          Array.from({
            length: offset
          })
          .map((_,i)=>(

            <div
              key={`empty-${i}`}
              className="h-16"
            />

          ))
        }





        {
          days.map(day=>{

            const solved =
              dailyLookup[day] || 0;


            const date =
              Number(day.split("-")[2]);



            return (

              <div

                key={day}

                className={`

                  h-16

                  rounded-xl

                  border

                  p-2.5

                  cursor-pointer

                  transition-all

                  hover:-translate-y-1

                  hover:shadow-xl

                  ${getIntensity(solved)}

                `}


                title={`${day}: ${solved} problems solved`}

              >



                <div className="
                  flex
                  justify-between
                  items-start
                ">


                  <span className="
                    text-xs
                    font-semibold
                    text-white
                  ">
                    {date}
                  </span>



                  <span className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-white/70
                  "/>


                </div>





                {
                  solved > 0 && (

                    <div className="
                      mt-3
                      text-[11px]
                      text-white/60
                    ">

                      {solved} solved

                    </div>

                  )
                }


              </div>

            );

          })
        }


      </div>






      {/* Legend */}

      <div className="
        mt-6
        flex
        justify-center
        items-center
        gap-3
        text-sm
        text-gray-400
      ">


        <span>
          Less Activity
        </span>



        {
          [
            "bg-slate-800",
            "bg-emerald-950",
            "bg-emerald-700",
            "bg-emerald-400"
          ]
          .map(color=>(

            <div
              key={color}
              className={`
                h-4
                w-4
                rounded-md
                ${color}
              `}
            />

          ))
        }



        <span>
          More Activity
        </span>


      </div>


    </div>

  );

}


export default LearningCalendar;