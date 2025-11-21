import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PatientProfile } from "./PatientProfile";
import { AppointmentsList } from "./AppointmentsList";
import { EncountersList } from "./EncountersList";
import { MedicationsList } from "./MedicationsList";
import { TestsList } from "./TestsList";
import { SafetyAlerts } from "./SafetyAlerts";
import { AlertTriangle } from "lucide-react";

interface PatientDashboardProps {
  patientId: string;
}

export const PatientDashboard = ({ patientId }: PatientDashboardProps) => {
  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [encounters, setEncounters] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [safetyAlerts, setSafetyAlerts] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPatientData();
  }, [patientId]);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      // Fetch patient data
      const { data: patientData, error: patientError } = await supabase.functions.invoke(
        "dorra-api",
        {
          body: {
            endpoint: `/v1/patients/${patientId}`,
            method: "GET",
          },
        }
      );

      if (patientError) throw patientError;
      setPatient(patientData);

      // Fetch appointments
      const { data: appointmentsData } = await supabase.functions.invoke("dorra-api", {
        body: {
          endpoint: `/v1/patients/${patientId}/appointments`,
          method: "GET",
        },
      });
      setAppointments(appointmentsData?.results || []);

      // Fetch encounters
      const { data: encountersData } = await supabase.functions.invoke("dorra-api", {
        body: {
          endpoint: `/v1/patients/${patientId}/encounters`,
          method: "GET",
        },
      });
      setEncounters(encountersData?.results || []);

      // Fetch medications
      const { data: medicationsData } = await supabase.functions.invoke("dorra-api", {
        body: {
          endpoint: `/v1/patients/${patientId}/medications`,
          method: "GET",
        },
      });
      setMedications(medicationsData?.results || []);

      // Fetch tests
      const { data: testsData } = await supabase.functions.invoke("dorra-api", {
        body: {
          endpoint: `/v1/patients/${patientId}/tests`,
          method: "GET",
        },
      });
      setTests(testsData?.results || []);

      // Calculate safety alerts
      calculateSafetyAlerts(patientData, medicationsData?.results || []);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch patient data. Please try again.";
      const isConfigError = errorMessage.includes("DORRA_API_KEY contains invalid characters") || 
                           errorMessage.includes("DORRA_API_KEY is not configured");
      toast({
        title: isConfigError ? "Configuration Error" : "Error",
        description: isConfigError 
          ? "Backend API key is misconfigured or missing. Please check your backend secrets." 
          : errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateSafetyAlerts = (patientData: any, medicationsData: any[]) => {
    const alerts: any[] = [];

    // Check allergy conflicts
    if (patientData?.allergies && medicationsData.length > 0) {
      const allergies = patientData.allergies.toLowerCase().split(",").map((a: string) => a.trim());
      medicationsData.forEach((med) => {
        const medName = med.medication?.toLowerCase() || "";
        allergies.forEach((allergy: string) => {
          if (medName.includes(allergy) || allergy.includes(medName)) {
            alerts.push({
              type: "severe",
              title: "Allergy Conflict",
              description: `Patient allergic to ${allergy}, prescribed ${med.medication}`,
              medication: med.medication,
            });
          }
        });
      });
    }

    // Check drug interactions
    const drugInteractions = [
      { drugs: ["aspirin", "amlodipine"], warning: "Possible blood pressure and bleeding risk." },
      { drugs: ["ibuprofen", "prednisolone"], warning: "High GI risk." },
      { drugs: ["metformin", "ciprofloxacin"], warning: "Blood sugar instability risk." },
    ];

    const medicationNames = medicationsData.map((m) => m.medication?.toLowerCase() || "");
    drugInteractions.forEach((interaction) => {
      const foundDrugs = interaction.drugs.filter((drug) =>
        medicationNames.some((med) => med.includes(drug))
      );
      if (foundDrugs.length === interaction.drugs.length) {
        alerts.push({
          type: "moderate",
          title: "Drug Interaction",
          description: interaction.warning,
          medications: foundDrugs,
        });
      }
    });

    setSafetyAlerts(alerts);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  if (!patient) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">Patient not found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {safetyAlerts.length > 0 && (
        <div className="bg-card border border-clinical-border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-alert-severe" />
            <h3 className="font-semibold text-lg">Safety Alerts ({safetyAlerts.length})</h3>
          </div>
          <SafetyAlerts alerts={safetyAlerts} />
        </div>
      )}

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appointments">
            Appointments
            {appointments.length > 0 && (
              <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                {appointments.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="encounters">
            Encounters
            {encounters.length > 0 && (
              <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                {encounters.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="medications">
            Medications
            {medications.length > 0 && (
              <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                {medications.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="tests">
            Tests
            {tests.length > 0 && (
              <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                {tests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="alerts">
            Alerts
            {safetyAlerts.length > 0 && (
              <span className="ml-1 text-xs bg-alert-severe text-white rounded-full px-2 py-0.5">
                {safetyAlerts.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <PatientProfile patient={patient} />
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentsList appointments={appointments} />
        </TabsContent>

        <TabsContent value="encounters">
          <EncountersList encounters={encounters} />
        </TabsContent>

        <TabsContent value="medications">
          <MedicationsList medications={medications} />
        </TabsContent>

        <TabsContent value="tests">
          <TestsList tests={tests} />
        </TabsContent>

        <TabsContent value="alerts">
          <SafetyAlerts alerts={safetyAlerts} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
