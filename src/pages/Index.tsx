import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Activity, Search, Brain } from "lucide-react";
import { PatientDashboard } from "@/components/PatientDashboard";
import { AIAssistant } from "@/components/AIAssistant";
import { CreatePatientAI } from "@/components/CreatePatientAI";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [patientId, setPatientId] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!patientId.trim()) {
      toast({
        title: "Patient ID Required",
        description: "Please enter a patient ID to search",
        variant: "destructive",
      });
      return;
    }
    setSelectedPatientId(patientId);
  };

  return (
    <div className="min-h-screen bg-clinical-bg">
      {/* Header */}
      <header className="border-b border-clinical-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">SAFE Med</h1>
              <p className="text-sm text-muted-foreground">Electronic Medical Records Dashboard</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="lookup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="lookup" className="gap-2">
              <Search className="h-4 w-4" />
              Patient Lookup
            </TabsTrigger>
            <TabsTrigger value="ai-assistant" className="gap-2">
              <Brain className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="create-patient" className="gap-2">
              <Activity className="h-4 w-4" />
              Create Patient
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lookup" className="space-y-6">
            <div className="flex gap-3">
              <Input
                placeholder="Enter Patient ID..."
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="max-w-md"
              />
              <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>

            {selectedPatientId && <PatientDashboard patientId={selectedPatientId} />}
          </TabsContent>

          <TabsContent value="ai-assistant">
            <AIAssistant onPatientCreated={setSelectedPatientId} />
          </TabsContent>

          <TabsContent value="create-patient">
            <CreatePatientAI onPatientCreated={setSelectedPatientId} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
