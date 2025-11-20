import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Brain, Send } from "lucide-react";

interface AIAssistantProps {
  onPatientCreated: (patientId: string) => void;
}

export const AIAssistant = ({ onPatientCreated }: AIAssistantProps) => {
  const [patientId, setPatientId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!patientId.trim() || !prompt.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both patient ID and prompt",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("dorra-api", {
        body: {
          endpoint: "/v1/ai/emr",
          method: "POST",
          data: {
            patient: patientId,
            prompt: prompt,
          },
        },
      });

      if (error) throw error;

      setResponse(data);

      toast({
        title: "AI Successfully Created Record",
        description: `Created ${data.type || "record"} successfully`,
      });

      // Auto-fetch the created resource
      if (data.type === "appointment" && data.id) {
        fetchAppointment(data.id);
      } else if (data.type === "encounter" && data.id) {
        fetchEncounter(data.id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process AI request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointment = async (id: string) => {
    const { data } = await supabase.functions.invoke("dorra-api", {
      body: {
        endpoint: `/v1/appointments/${id}`,
        method: "GET",
      },
    });
    if (data) {
      toast({
        title: "Appointment Details",
        description: `${data.reason || "Appointment"} scheduled for ${data.date}`,
      });
    }
  };

  const fetchEncounter = async (id: string) => {
    const { data } = await supabase.functions.invoke("dorra-api", {
      body: {
        endpoint: `/v1/encounters/${id}`,
        method: "GET",
      },
    });
    if (data) {
      toast({
        title: "Encounter Created",
        description: data.chief_complaint || "Medical encounter created successfully",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Medical Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Patient ID</label>
          <Input
            placeholder="Enter patient ID..."
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Prompt</label>
          <Input
            placeholder="E.g., Create a new encounter for this patient. Complains of fever, cough for 2 days."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Process with AI
        </Button>

        {response && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">AI Response</h4>
            <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
