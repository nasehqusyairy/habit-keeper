import type { Habit } from "@/models/habit";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

type MainDisplayMode = "single" | "overall";

type OverallStreak = {
    count: number;
    lastDone?: string;
};

export type Settings = {
    mainDisplayMode: MainDisplayMode;
    theme: 'light' | 'dark';
}

type HabitContextType = {
    habits: Habit[];
    overallStreak: OverallStreak;
    mainTargetId: string | undefined;
    mainDisplayMode: MainDisplayMode;
    theme: 'light' | 'dark';
    addHabit: (habit: Habit) => void;
    updateHabit: (habit: Habit) => void;
    setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
    setOverallStreak: React.Dispatch<React.SetStateAction<OverallStreak>>;
    setMainTargetId: (id: string | undefined) => void;
    setMainDisplayMode: (mode: MainDisplayMode) => void;
    doneToday: (habitId: string) => void;
    removeHabit: (habitId: string) => void;
    updateSettings: (settings: Settings) => void;
};

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [overallStreak, setOverallStreak] = useState<OverallStreak>({ count: 0 });
    const [mainTargetId, setMainTargetId] = useState<string>();
    const [mainDisplayMode, setMainDisplayMode] = useState<MainDisplayMode>("single");
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [isInitialized, setIsInitialized] = useState(false);

    // load from localStorage on init
    useEffect(() => {
        const data = localStorage.getItem("habit_state");

        if (data) {
            const parsed = JSON.parse(data);
            setHabits(parsed.habits || []);
            setOverallStreak(parsed.overallStreak || 0);
            setMainTargetId(parsed.mainTargetId || null);
            setMainDisplayMode(parsed.mainDisplayMode || "single");
            setTheme(parsed.theme || 'light');
        }
        setIsInitialized(true);
    }, []);

    // save to localStorage when state changes
    useEffect(() => {
        if (isInitialized) {
            const state = { habits, overallStreak, mainTargetId, mainDisplayMode, theme };

            // apply theme to document
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }

            localStorage.setItem("habit_state", JSON.stringify(state));
        }
    }, [habits, overallStreak, mainTargetId, mainDisplayMode, theme]);

    useEffect(() => {
        if (isInitialized) {
            checkOverallStreak();
        }
    }, [habits]);

    const addHabit = (habit: Habit) => {
        setHabits((prev) => [...prev, habit]);
    };

    const updateHabit = (habit: Habit) => {
        setHabits((prev) => prev.map((h) => (h.id === habit.id ? habit : h)));
    };

    const doneToday = (habitId: string) => {
        // cari habit yang sesuai
        const habit = habits.find((h) => h.id === habitId);
        if (!habit) return;

        // jika lastDone adalah hari ini, jangan update
        const today = new Date().toISOString().split('T')[0];
        if (habit.lastDone?.startsWith(today)) {
            toast.error("Habit already marked as done today!");
            return;
        }

        const updatedHabit = {
            ...habit,
            streak: habit.streak + 1,
            lastDone: new Date().toISOString(),
        };
        updateHabit(updatedHabit);
    }

    const removeHabit = (habitId: string) => {
        setHabits((prev) => prev.filter((h) => h.id !== habitId));
    }

    const checkOverallStreak = () => {
        // jika lastDone salah satu habit bukan kemarin atau hari ini, reset overallStreak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const todayStr = new Date().toISOString().split('T')[0];

        const isOverallStreakMaintained = habits.every((habit) => {
            if (!habit.lastDone) return false;
            const lastDoneDate = habit.lastDone.split('T')[0];
            return lastDoneDate === todayStr || lastDoneDate === yesterdayStr;
        });

        if (habits.length === 0 || !isOverallStreakMaintained) {
            setOverallStreak({ count: 0 });
            return;
        }


        // jika semua habit lastDone adalah hari ini, increment overallStreak
        const isAllDoneToday = habits.every((habit) => {
            if (!habit.lastDone) return false;
            const lastDoneDate = habit.lastDone.split('T')[0];
            return lastDoneDate === todayStr;
        });

        if (isAllDoneToday && habits.length > 0 && overallStreak.lastDone !== todayStr) {
            setOverallStreak((prev) => ({ count: prev.count + 1, lastDone: todayStr }));
        }
    }

    const updateSettings = (settings: Settings) => {
        setMainDisplayMode(settings.mainDisplayMode);
        setTheme(settings.theme);
    }

    return (
        <HabitContext.Provider
            value={{
                theme,
                habits,
                overallStreak,
                mainTargetId,
                mainDisplayMode,
                addHabit,
                updateHabit,
                setHabits,
                setOverallStreak,
                setMainTargetId,
                setMainDisplayMode,
                doneToday,
                removeHabit,
                updateSettings
            }}
        >
            {children}
        </HabitContext.Provider>
    );
};

export const useHabits = () => {
    const context = useContext(HabitContext);
    if (!context) {
        throw new Error("useHabits must be used within HabitProvider");
    }
    return context;
};
