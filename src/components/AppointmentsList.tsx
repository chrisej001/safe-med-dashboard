import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";

interface AppointmentsListProps {
  appointments: any[];
}

export const AppointmentsList = ({ appointments }: AppointmentsListProps) => {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No appointments found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg">{appointment.reason || "Appointment"}</span>
              <Badge
                variant={
                  appointment.status === "scheduled"
                    ? "default"
                    : appointment.status === "completed"
                    ? "secondary"
                    : "outline"
                }
              >
                {appointment.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{appointment.date}</span>
            </div>

            {appointment.time && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium">{appointment.time}</span>
              </div>
            )}

            {appointment.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">{appointment.location}</span>
              </div>
            )}

            {appointment.notes && (
              <div className="mt-3 p-3 bg-muted rounded-md">
                <p className="text-sm">{appointment.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
