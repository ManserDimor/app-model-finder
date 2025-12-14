import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const DemoModeBanner = () => {
  return (
    <Alert variant="destructive" className="rounded-none border-x-0 border-t-0 bg-amber-500/10 border-amber-500/50">
      <AlertTriangle className="h-4 w-4 text-amber-500" />
      <AlertDescription className="text-amber-600 dark:text-amber-400 text-sm">
        <strong>Demo Mode:</strong> This app uses simulated authentication for demonstration purposes only. 
        No real user accounts are created and data is stored locally in your browser.
      </AlertDescription>
    </Alert>
  );
};
