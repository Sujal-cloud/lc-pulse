export function createDailyLookup(data: any[]) {

  const lookup: Record<string, number> = {};

  data.forEach((item) => {
    lookup[item.date] = item.newProblems;
  });

  return lookup;
}


export function generateMonthDays(year: number, month: number) {

  const days: string[] = [];

  const totalDays = new Date(
    year,
    month + 1,
    0
  ).getDate();


  for (let i = 1; i <= totalDays; i++) {

    const date = new Date(
      year,
      month,
      i
    );


    const formatted =
      `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;


    days.push(formatted);
  }


  return days;
}



export function getIntensity(value:number){

  if(value === 0){
  return "bg-slate-800/70 border-gray-700";
  }

  if(value <= 2){
    return "bg-emerald-950 border border-emerald-900";
  }

  if(value <= 5){
    return "bg-emerald-700 border border-emerald-600";
  }

  return "bg-emerald-400 border border-emerald-300";
}



export function getStartOffset(year:number, month:number){

  const firstDay = new Date(
    year,
    month,
    1
  );


  const day = firstDay.getDay();


  // convert Sunday based index to Monday based index
  return day === 0 ? 6 : day - 1;
}



export function getMonthLabel(
  year:number,
  month:number
){

  return new Date(
    year,
    month
  ).toLocaleDateString(
    "en-US",
    {
      month:"long",
      year:"numeric"
    }
  );

}