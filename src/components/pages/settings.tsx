import { formToObj } from "@/lib/form";
import { useHabits, type Settings } from "../providers/habit";
import { Button } from "../ui/button";
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";

export default () => {

    const { mainDisplayMode, updateSettings, theme } = useHabits();

    const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const newSettings = formToObj<Settings>(new FormData(form));
        updateSettings(newSettings);
        toast.success("Settings updated!");
    }

    return (
        <div className="p-4">
            <form onSubmit={handleOnSubmit}>
                <div className="mb-4">
                    <Label htmlFor="theme" className="block mb-2 text-foreground">Theme</Label>
                    <Select name="theme" defaultValue={theme}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="mb-4">
                    <Label htmlFor="mainDisplayMode" className="block mb-2 text-foreground">Main Display Mode</Label>
                    <Select name="mainDisplayMode" defaultValue={mainDisplayMode}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Main Display Mode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="overall">Overall</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button>Save</Button>
            </form>
        </div>
    )
}
