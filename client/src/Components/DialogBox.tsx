import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
 


interface DialogBoxProps{
    open : boolean;
    setOpen : React.SetStateAction<any>
    message : string;
    submit : ()=>any;
    label : string;
    isLoading : boolean
}



function DialogBox({message, submit, open, setOpen, label, isLoading}:DialogBoxProps) {


  return (
    <>
      <Dialog open={open} handler={()=>setOpen(!open)}>
        <DialogHeader>{label}</DialogHeader>
        <DialogBody>
            {`${message}`}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={()=>setOpen(!open)}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button 
            loading = {isLoading}
            variant="gradient" 
            color="green" 
            onClick={()=>submit()}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default DialogBox