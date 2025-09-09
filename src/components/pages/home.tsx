import { useHabits } from "../providers/habit";

export default () => {
    const { overallStreak, habits, mainDisplayMode, mainTargetId } = useHabits();
    const streaks = mainDisplayMode === "overall" ? overallStreak.count : (habits.find(h => h.id === mainTargetId)?.streak || 0);
    return (
        <div className="flex flex-col justify-end items-center gap-4 p-2 w-full h-[65vh]">
            {streaks === 0 ? (
                <>
                    <div className="relative font-bold text-9xl text-center">
                        <div className="top-1/2 left-1/2 absolute bg-blue-500/50 shadow-2xl shadow-blue-500 blur-lg rounded-full size-30 translate-x-[-50%] translate-y-[-50%]"></div>
                        <div className="z-10 relative">❄️</div>
                    </div>
                    <div className="text-muted-foreground dark:text-foreground text-3xl text-center">
                        STREAKS ARE STOPPED
                    </div>
                </>
            ) : (
                <>
                    <div className="relative font-bold text-9xl text-center animate-bounce">
                        <div className="top-1/2 left-1/2 absolute bg-yellow-500/50 shadow-2xl shadow-yellow-500 blur-lg rounded-full size-30 translate-x-[-50%] translate-y-[-50%]"></div>
                        <div className="z-10 relative">🔥</div>
                    </div>
                    <div className="font-bold text-primary text-9xl">
                        {streaks}
                    </div>
                    <div className="dark:text-foreground text-5xl text-center">
                        DAY STREAKS!!!
                    </div>
                </>
            )}
        </div>
    )
}