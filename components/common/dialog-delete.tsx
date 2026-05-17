import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function DialogDelete({
  open,
  title,
  isLoading,
  onSubmit,
  onOpenChange,
}: {
  open: boolean;
  title: string;
  isLoading: boolean;
  onSubmit: () => void;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogTrigger asChild>
        <Button>{title}</Button>
      </DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {title}</DialogTitle>
          <DialogDescription>
            Apakah kamu yakin ingin menghapus {title} ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={onSubmit} variant="destructive" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
