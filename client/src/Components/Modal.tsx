import React, { ReactNode } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

interface ModalProps {
    buttonText: any;
    title: string;
    children: ReactNode;
  }
  
 
export function Modal({
    buttonText,
    title,
    children,
  }: ModalProps) {
  const [open, setOpen] = React.useState(false);
 
  const handleOpen = () => setOpen(!open);
 
  return (
    <>
      <Button size="sm" onClick={handleOpen} variant="gradient">
        {buttonText}
      </Button>

      <Dialog size="sm" open={open} handler={handleOpen} className=" mb-48">
        <DialogHeader>{title}</DialogHeader>
        <DialogBody >
        {children}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleOpen}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
    
  );
}