import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Calendar } from "lucide-react";

interface TestsListProps {
  tests: any[];
}

export const TestsList = ({ tests }: TestsListProps) => {
  if (tests.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No tests found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tests.map((test, index) => (
        <Card key={test.id || index}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                <span className="text-lg">{test.test_name || "Laboratory Test"}</span>
              </div>
              {test.status && (
                <Badge
                  variant={
                    test.status === "completed"
                      ? "default"
                      : test.status === "pending"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {test.status}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {test.date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{test.date}</span>
              </div>
            )}

            {test.result && (
              <div>
                <h4 className="text-sm font-semibold mb-1">Result</h4>
                <p className="text-sm bg-muted p-3 rounded-md">{test.result}</p>
              </div>
            )}

            {test.reference_range && (
              <div>
                <span className="text-sm text-muted-foreground">Reference Range: </span>
                <span className="text-sm font-medium">{test.reference_range}</span>
              </div>
            )}

            {test.performed_by && (
              <div>
                <span className="text-sm text-muted-foreground">Performed by: </span>
                <span className="text-sm font-medium">{test.performed_by}</span>
              </div>
            )}

            {test.notes && (
              <div className="mt-3 p-3 bg-muted rounded-md">
                <p className="text-sm">{test.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
