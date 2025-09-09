export type Habit = {
    id: string;
    title: string;
    streak: number;
    lastDone?: string; // ISO date string
}