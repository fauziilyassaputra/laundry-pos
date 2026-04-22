import { DarkModeToggle } from "@/components/common/darkmode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="">
      <Button className="bg-amber-800 dark:bg-yellow-500">welcome</Button>
      <DarkModeToggle />
      <p className="font-sans">lorem ipsum damet</p>
    </div>
  );
}
