import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Plus, Trash2, Lock, Calendar, Clock } from "lucide-react";
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
  const [endTime, setEndTime] = useState("23:59");
  const [options, setOptions] = useState([
    { id: 1, text: "" },
    { id: 2, text: "" },
  ]);
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
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
    
    // Check if end date and time are provided
    if (!endDate || !endTime) {
      toast({
        title: "End date and time required",
        description: "Please set when the poll will end.",
        variant: "destructive"
      });
      return false;
    }
    
    // Parse the selected date and time
    const currentDate = new Date();
    const selectedDateTime = new Date(`${endDate}T${endTime}`);
    
    // Check if date is valid
    if (isNaN(selectedDateTime.getTime())) {
      toast({
        title: "Invalid date or time",
        description: "Please enter a valid end date and time.",
        variant: "destructive"
      });
      return false;
    }
    
    // Check if date/time is in the future
    if (selectedDateTime <= currentDate) {
      toast({
        title: "Invalid end date/time",
        description: "The end date and time must be in the future.",
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

    // Check if password is provided for private polls
    if (isPrivate && !password.trim()) {
      toast({
        title: "Password required",
        description: "Please provide a password for your private poll.",
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
      
      // Combine date and time
      const fullEndDate = new Date(`${endDate}T${endTime}`);
      
      const pollId = await createPoll(
        pollTitle.trim(),
        pollDescription.trim(),
        optionTexts,
        fullEndDate.toISOString(),
        isMultipleChoice,
        isPrivate,
        isPrivate ? password : null
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

  // Get current date and time formatted for input min values
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  
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
                  <div className="flex items-center">
                    <div className="relative flex-grow">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        id="end-date"
                        type="date"
                        className="pl-10"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        min={today}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="end-time"
                      type="time"
                      className="pl-10"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="multiple-choice" 
                      checked={isMultipleChoice}
                      onCheckedChange={(checked) => setIsMultipleChoice(!!checked)} 
                    />
                    <Label htmlFor="multiple-choice">Allow multiple selections</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="private-poll" 
                      checked={isPrivate}
                      onCheckedChange={(checked) => setIsPrivate(!!checked)} 
                    />
                    <Label htmlFor="private-poll" className="flex items-center gap-1">
                      <Lock className="h-4 w-4" /> Make this poll private
                    </Label>
                  </div>
                  
                  {isPrivate && (
                    <div className="grid gap-2 pl-6">
                      <Label htmlFor="password">Poll Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Enter a password for access"
                        required={isPrivate}
                      />
                      <p className="text-sm text-muted-foreground">
                        Users will need this password to access your poll
                      </p>
                    </div>
                  )}
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
