import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill } from "lucide-react";

interface MedicationsListProps {
  medications: any[];
}

export const MedicationsList = ({ medications }: MedicationsListProps) => {
  if (medications.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No medications found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {medications.map((medication, index) => (
        <Card key={medication.id || index}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                <span className="text-lg">{medication.medication}</span>
              </div>
              {medication.status && (
                <Badge
                  variant={
                    medication.status === "active"
                      ? "default"
                      : medication.status === "completed"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {medication.status}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {medication.dosage && (
              <div>
                <span className="text-sm text-muted-foreground">Dosage: </span>
                <span className="text-sm font-medium">{medication.dosage}</span>
              </div>
            )}

            {medication.frequency && (
              <div>
                <span className="text-sm text-muted-foreground">Frequency: </span>
                <span className="text-sm font-medium">{medication.frequency}</span>
              </div>
            )}

            {medication.start_date && (
              <div>
                <span className="text-sm text-muted-foreground">Start Date: </span>
                <span className="text-sm font-medium">{medication.start_date}</span>
              </div>
            )}

            {medication.end_date && (
              <div>
                <span className="text-sm text-muted-foreground">End Date: </span>
                <span className="text-sm font-medium">{medication.end_date}</span>
              </div>
            )}

            {medication.prescribing_physician && (
              <div>
                <span className="text-sm text-muted-foreground">Prescribed by: </span>
                <span className="text-sm font-medium">{medication.prescribing_physician}</span>
              </div>
            )}

            {medication.notes && (
              <div className="mt-3 p-3 bg-muted rounded-md">
                <p className="text-sm">{medication.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
