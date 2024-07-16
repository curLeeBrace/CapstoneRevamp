import { Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";
import {Button} from "@material-tailwind/react";

interface SimpleCardChildProps {
  content : React.ReactElement;
  open: boolean;
  setOpen: React.SetStateAction<any>;
}

const SimpleCardChild = ({content, open, setOpen }: SimpleCardChildProps) => {
  return (
    <>
      <Dialog open={open} handler={() => setOpen(!open)} size="lg" className="h-4/5 bg-white/90 max-h-screen">
        <DialogBody className="h-5/6 overflow-hidden">{content}</DialogBody>

        <DialogFooter className="bottom-0 absolute right-0">
          <Button variant="text" color="red" onClick={() => setOpen(!open)} className="mr-1">
            <span>Close</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default SimpleCardChild;
