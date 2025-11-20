import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, AlertCircle } from "lucide-react";

interface SafetyAlertsProps {
  alerts: any[];
}

export const SafetyAlerts = ({ alerts }: SafetyAlertsProps) => {
  if (alerts.length === 0) {
    return (
      <Alert className="bg-success/10 border-success">
        <AlertCircle className="h-4 w-4 text-success" />
        <AlertTitle className="text-success">No Safety Alerts</AlertTitle>
        <AlertDescription>All medications are safe for this patient.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => (
        <Alert
          key={index}
          className={
            alert.type === "severe"
              ? "bg-alert-severe/10 border-alert-severe"
              : "bg-alert-moderate/10 border-alert-moderate"
          }
        >
          <AlertTriangle
            className={`h-4 w-4 ${
              alert.type === "severe" ? "text-alert-severe" : "text-alert-moderate"
            }`}
          />
          <AlertTitle
            className={alert.type === "severe" ? "text-alert-severe" : "text-alert-moderate"}
          >
            {alert.title}
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="font-medium">{alert.description}</p>
            {alert.medication && (
              <p className="mt-1 text-sm">Medication: {alert.medication}</p>
            )}
            {alert.medications && (
              <p className="mt-1 text-sm">
                Medications: {alert.medications.join(", ")}
              </p>
            )}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};
