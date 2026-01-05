import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const ErrorAlert = ({ error, defaultMessage = "An error occurred", title = "Error" }) => {
  // If error is already an errorInfo object, use it directly
  const errorInfo = error.message && error.toastMessage ? error : 
    typeof error === 'object' && error !== null ? 
      { message: error.message || defaultMessage, toastMessage: error.message || defaultMessage } : 
      { message: error || defaultMessage, toastMessage: error || defaultMessage };

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {errorInfo.message}
      </AlertDescription>
    </Alert>
  );
};