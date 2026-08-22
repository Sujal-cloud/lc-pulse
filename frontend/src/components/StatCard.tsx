interface StatCardProps {
  title: string;
  value: string | number;
}


function StatCard({ title, value }: StatCardProps) {

  return (

    <div className="
      rounded-2xl
      border
      border-gray-800
      bg-white/5
      backdrop-blur-md
      p-5
      hover:border-gray-600
      transition
    ">


      <h2 className="
        text-gray-400
        text-sm
      ">
        {title}
      </h2>


      <p className="
        text-2xl
        font-bold
        mt-2
      ">
        {value}
      </p>


    </div>

  );
}


export default StatCard;