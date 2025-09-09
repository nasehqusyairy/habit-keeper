import { Home, ListChecks, Settings } from "lucide-react"
import { Button } from "./components/ui/button"
import { useState } from "react";
import HomePage from "./components/pages/home";
import HabitsPage from "./components/pages/habits";
import SettingsPage from "./components/pages/settings";

const navItems = [
  { name: "Home", icon: Home, component: HomePage },
  { name: "Habits", icon: ListChecks, component: HabitsPage },
  { name: "Settings", icon: Settings, component: SettingsPage },
]

function App() {
  const [currentPage, setCurrentPage] = useState(0);

  const PageComponent = navItems[currentPage].component;

  return (
    <main className="bg-secondary w-full">
      <div className="bg-background mx-auto w-full md:w-6/12 lg:w-4/12 min-h-screen">
        <PageComponent />
        <footer className="h-20">
          <div className="bottom-0 fixed p-4 border-t w-full md:w-6/12 lg:w-4/12">
            <div className="flex justify-evenly items-center h-10">
              {navItems.map((item, index) => (
                <div key={index} className="flex flex-col items-center w-4/12">
                  <Button size={"icon"} variant={currentPage === index ? "default" : "ghost"} onClick={() => setCurrentPage(index)}>
                    <item.icon />
                  </Button>
                  <span className="text-foreground text-xs">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}

export default App
