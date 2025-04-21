
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ThankYouModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-label="Loan Guidance Complete Dialog">
        <DialogHeader>
          <DialogTitle>We’ll Guide You</DialogTitle>
          <DialogDescription>
            Thanks for your interest! Our info-advisors will reach out and help you explore available loan options.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="default" aria-label="Back to Info" onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
