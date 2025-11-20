import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Phone, Mail, MapPin, AlertCircle } from "lucide-react";

interface PatientProfileProps {
  patient: any;
}

export const PatientProfile = ({ patient }: PatientProfileProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Patient Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {patient.first_name} {patient.last_name}
              </h3>
              <p className="text-sm text-muted-foreground">Patient ID: {patient.id}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Date of Birth:</span>
                <span className="font-medium">{patient.date_of_birth}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Gender:</span>
                <span className="font-medium capitalize">{patient.gender}</span>
              </div>

              {patient.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{patient.phone}</span>
                </div>
              )}

              {patient.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{patient.email}</span>
                </div>
              )}

              {patient.address && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Address:</span>
                  <span className="font-medium">{patient.address}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {patient.allergies && (
              <div className="p-4 bg-alert-severe/10 border border-alert-severe/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-alert-severe" />
                  <h4 className="font-semibold text-alert-severe">Allergies</h4>
                </div>
                <p className="text-sm">{patient.allergies}</p>
              </div>
            )}

            {patient.blood_type && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Blood Type</h4>
                <Badge variant="outline" className="text-base">
                  {patient.blood_type}
                </Badge>
              </div>
            )}

            {patient.emergency_contact && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Emergency Contact</h4>
                <p className="text-sm">{patient.emergency_contact}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
