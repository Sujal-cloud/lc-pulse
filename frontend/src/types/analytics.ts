export interface DailyStat {
    date:string;
    newProblems:number;
}


export interface MonthlyStat {
    month:string;
    newProblems:number;
}


export interface YearlyStat {
    year:number;
    newProblems:number;
}


export interface CumulativeStat {
    date:string;
    total:number;
}


export interface Velocity {
    month:string;
    newProblems:number;
    activeDays:number;
    velocity:number;
}