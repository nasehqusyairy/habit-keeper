import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { EllipsisVertical, Plus, Star } from "lucide-react"
import { useHabits } from "../providers/habit"
import { useState } from "react"
import type { Habit } from "@/models/habit"
import { formToObj } from "@/lib/form"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { toast } from "sonner"
import { Badge } from "../ui/badge"
export default () => {

    const {
        habits,
        addHabit,
        updateHabit,
        setMainTargetId,
        mainTargetId,
        doneToday,
        removeHabit,
        overallStreak
    } = useHabits();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>();

    const handleOnEdit = (habit: Habit) => {
        setSelectedHabit(habit);
        setIsDialogOpen(true);
    }

    const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formel = e.currentTarget;
        const newHabit = formToObj<Habit>(new FormData(formel));
        if (selectedHabit) {
            // update existing habit
            updateHabit({ ...selectedHabit, ...newHabit });
        } else {
            // add new habit
            addHabit({ ...newHabit, id: crypto.randomUUID(), streak: 0 });
        }
        toast.success(`Habit ${selectedHabit ? 'updated' : 'added'}!`);
        setSelectedHabit(undefined);
        setIsDialogOpen(false);
        formel.reset();
    }

    // letakkan habit yang mainTargetId di paling atas
    const sortedHabits = [...habits].sort((a, b) => {
        if (a.id === mainTargetId) return -1;
        if (b.id === mainTargetId) return 1;
        return 0;
    });

    return (
        <div className="p-4">
            <div className="flex justify-between items-center">
                <Badge variant={"outline"}>
                    Overall Streak: {overallStreak.count}
                </Badge>
                <Button onClick={() => setIsDialogOpen(true)}><Plus /> New</Button>
            </div>
            <Dialog open={isDialogOpen}>
                <DialogContent showCloseButton={false}>
                    <DialogTitle>{selectedHabit ? 'Edit' : 'New'} Habit</DialogTitle>
                    <form onSubmit={handleOnSubmit}>
                        <div className="mb-4">
                            <Label className="mb-2">Title</Label>
                            <Input name="title" defaultValue={selectedHabit ? selectedHabit.title : ''} required />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant={"outline"} onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <ul className="mt-4">

                {sortedHabits.map(habit => (
                    <li key={habit.id} className="py-4 not-last:border-b">
                        <div className="flex items-center gap-4">
                            <Button variant={"link"} size="icon" onClick={() => setMainTargetId(habit.id)}>
                                <Star className={"text-primary" + (mainTargetId === habit.id ? " fill-current" : "")} />
                            </Button>
                            <div className="flex-auto">
                                <div className="truncate capitalize">{habit.title}</div>
                                <div className="text-muted-foreground dark:text-foreground text-sm">{habit.streak} day streak</div>
                            </div>
                            <DropdownMenu modal>
                                <DropdownMenuTrigger asChild>
                                    <Button variant={"ghost"} size="icon">
                                        <EllipsisVertical />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => doneToday(habit.id)}>Mark as done</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleOnEdit(habit)}>Edit</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => removeHabit(habit.id)} className="text-destructive">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </li>
                ))}

            </ul>
        </div>
    )
}
