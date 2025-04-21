
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function LoanAdvisorModal({ open, onClose, onThankYou }: { open: boolean, onClose: () => void, onThankYou: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-label="Loan Info Advisor Dialog">
        <DialogHeader>
          <DialogTitle>Talk to a Loan Info Advisor</DialogTitle>
          <DialogDescription>
            We do not provide loans directly. Our advisors will guide you to trusted financial institutions and resources.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" aria-label="Return" onClick={onClose}>Back</Button>
          <Button variant="default" aria-label="Proceed" onClick={() => onThankYou()}>Get Guidance</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
