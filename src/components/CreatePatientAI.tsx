import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, Send } from "lucide-react";

interface CreatePatientAIProps {
  onPatientCreated: (patientId: string) => void;
}

export const CreatePatientAI = ({ onPatientCreated }: CreatePatientAIProps) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt to create a patient",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("dorra-api", {
        body: {
          endpoint: "/v1/ai/patient",
          method: "POST",
          data: {
            prompt: prompt,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Patient Created Successfully",
        description: `Patient ID: ${data.id}`,
      });

      onPatientCreated(data.id);
      setPrompt("");
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create patient";
      const isConfigError = errorMessage.includes("DORRA_API_KEY contains invalid characters");
      toast({
        title: isConfigError ? "Configuration Error" : "Error",
        description: isConfigError 
          ? "Backend API key is misconfigured. Please check your backend secrets." 
          : errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          Create Patient with AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Patient Information Prompt</label>
          <Input
            placeholder="E.g., Create a male patient named John Doe, 32 years old, with blood type O+"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Describe the patient details and let AI create the record
          </p>
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Create Patient
        </Button>
      </CardContent>
    </Card>
  );
};
