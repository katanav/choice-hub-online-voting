
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePolls } from "@/hooks/usePolls";
import { toast } from "@/components/ui/use-toast";

const CreatePoll = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPoll } = usePolls();
  
  const [pollTitle, setPollTitle] = useState("");
  const [pollDescription, setPollDescription] = useState("");
  const [endDate, setEndDate] = useState("");
  const [options, setOptions] = useState([
    { id: 1, text: "" },
    { id: 2, text: "" },
  ]);
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionChange = (id: number, value: string) => {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, text: value } : option
      )
    );
  };

  const addOption = () => {
    const newId = options.length > 0 ? Math.max(...options.map(o => o.id)) + 1 : 1;
    setOptions([...options, { id: newId, text: "" }]);
  };

  const removeOption = (id: number) => {
    if (options.length > 2) {
      setOptions(options.filter((option) => option.id !== id));
    }
  };

  const validateForm = () => {
    // Check if title is provided
    if (!pollTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a poll title.",
        variant: "destructive"
      });
      return false;
    }
    
    // Check if end date is provided and is in the future
    if (!endDate) {
      toast({
        title: "End date required",
        description: "Please set when the poll will end.",
        variant: "destructive"
      });
      return false;
    }
    
    const selectedDate = new Date(endDate);
    const now = new Date();
    if (selectedDate <= now) {
      toast({
        title: "Invalid end date",
        description: "The end date must be in the future.",
        variant: "destructive"
      });
      return false;
    }
    
    // Check if at least two options are provided
    const validOptions = options.filter(option => option.text.trim() !== "");
    if (validOptions.length < 2) {
      toast({
        title: "Options required",
        description: "Please provide at least two options.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a poll.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const optionTexts = options
        .filter(option => option.text.trim() !== "")
        .map(option => option.text.trim());
      
      const pollId = await createPoll(
        pollTitle.trim(),
        pollDescription.trim(),
        optionTexts,
        endDate,
        isMultipleChoice
      );
      
      if (pollId) {
        toast({
          title: "Poll created",
          description: "Your poll has been created successfully.",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error creating poll:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-20">
        <div className="container max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Create a New Poll</h1>
          
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Poll Details</CardTitle>
                <CardDescription>Basic information about your poll</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Poll Title</Label>
                  <Input 
                    id="title" 
                    value={pollTitle} 
                    onChange={(e) => setPollTitle(e.target.value)} 
                    placeholder="What's your poll about?"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input 
                    id="description" 
                    value={pollDescription} 
                    onChange={(e) => setPollDescription(e.target.value)} 
                    placeholder="Add some context to your poll"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input 
                    id="end-date" 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    required
                    min={new Date().toISOString().split('T')[0]} // Today as min date
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="multiple-choice" 
                    checked={isMultipleChoice}
                    onCheckedChange={(checked) => setIsMultipleChoice(!!checked)} 
                  />
                  <Label htmlFor="multiple-choice">Allow multiple selections</Label>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Poll Options</CardTitle>
                <CardDescription>Add at least two options for voters to choose from</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {options.map((option) => (
                  <div key={option.id} className="flex gap-3 items-center">
                    <Input
                      value={option.text}
                      onChange={(e) => handleOptionChange(option.id, e.target.value)}
                      placeholder={`Option ${option.id}`}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(option.id)}
                      disabled={options.length <= 2}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addOption}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Option
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/dashboard")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Poll..." : "Create Poll"}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreatePoll;
