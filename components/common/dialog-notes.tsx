import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";

export default function DialogNotes(
    {text,notesType} : {text: string,notesType: string}
){
    return (
          <DialogContent className="sm:max-w-106.25 max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>{notesType}</DialogTitle>
        <Separator />
        <DialogDescription className="text-white text-md">{text}</DialogDescription>
      </DialogHeader>
      
    </DialogContent>
    )
}