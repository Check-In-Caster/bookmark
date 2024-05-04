import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useEffect, useState } from "react";

interface DrawerDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}

const DrawerDialog: React.FC<DrawerDialogProps> = ({
  open,
  setOpen,
  children,
}) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 448);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[440px] p-0" hideClose>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>{children}</DrawerContent>
    </Drawer>
  );
};

export default DrawerDialog;
