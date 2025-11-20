import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar } from "lucide-react";

interface EncountersListProps {
  encounters: any[];
}

export const EncountersList = ({ encounters }: EncountersListProps) => {
  if (encounters.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No encounters found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {encounters.map((encounter) => (
        <Card key={encounter.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span className="text-lg">{encounter.chief_complaint || "Medical Encounter"}</span>
              </div>
              <Badge variant="outline">{encounter.encounter_type || "Visit"}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{encounter.date}</span>
            </div>

            {encounter.diagnosis && (
              <div>
                <h4 className="text-sm font-semibold mb-1">Diagnosis</h4>
                <p className="text-sm bg-muted p-3 rounded-md">{encounter.diagnosis}</p>
              </div>
            )}

            {encounter.treatment && (
              <div>
                <h4 className="text-sm font-semibold mb-1">Treatment</h4>
                <p className="text-sm bg-muted p-3 rounded-md">{encounter.treatment}</p>
              </div>
            )}

            {encounter.notes && (
              <div>
                <h4 className="text-sm font-semibold mb-1">Notes</h4>
                <p className="text-sm bg-muted p-3 rounded-md">{encounter.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
