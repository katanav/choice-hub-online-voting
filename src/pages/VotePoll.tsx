
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check } from "lucide-react";

// Mock data for poll
const mockPollData = {
  id: "1",
  title: "Team Lunch Location",
  description: "Where should we go for our monthly team lunch?",
  isMultipleChoice: false,
  endDate: "May 15, 2025",
  options: [
    { id: 1, text: "Italian Restaurant", votes: 5 },
    { id: 2, text: "Sushi Bar", votes: 8 },
    { id: 3, text: "Mexican Grill", votes: 4 },
    { id: 4, text: "Vegetarian Cafe", votes: 7 },
  ]
};

// Mock data for another poll
const mockPollData2 = {
  id: "2",
  title: "New Project Name",
  description: "Help us choose a name for our upcoming project",
  isMultipleChoice: true,
  endDate: "May 20, 2025",
  options: [
    { id: 1, text: "Phoenix", votes: 3 },
    { id: 2, text: "Horizon", votes: 10 },
    { id: 3, text: "Nebula", votes: 5 },
    { id: 4, text: "Quantum", votes: 0 },
  ]
};

const VotePoll = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  
  // In a real app, we would fetch the poll data based on pollId
  const pollData = pollId === "2" ? mockPollData2 : mockPollData;
  
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  
  const handleSingleSelection = (value: string) => {
    setSelectedOption(value);
  };
  
  const handleMultiSelection = (optionId: number) => {
    setSelectedOptions(prevSelected => 
      prevSelected.includes(optionId)
        ? prevSelected.filter(id => id !== optionId)
        : [...prevSelected, optionId]
    );
  };
  
  const handleVoteSubmit = () => {
    // In a real app, this would submit the vote to a database
    if (pollData.isMultipleChoice) {
      console.log("Voted for options:", selectedOptions);
    } else {
      console.log("Voted for option:", selectedOption);
    }
    
    // Show results after voting
    setHasVoted(true);
  };
  
  const totalVotes = pollData.options.reduce((sum, option) => sum + option.votes, 0);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-20">
        <div className="container max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{pollData.title}</CardTitle>
              <CardDescription>{pollData.description}</CardDescription>
              <p className="text-sm text-muted-foreground">Voting ends on {pollData.endDate}</p>
            </CardHeader>
            <CardContent>
              {!hasVoted ? (
                <>
                  {pollData.isMultipleChoice ? (
                    <div className="space-y-4">
                      {pollData.options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`option-${option.id}`}
                            checked={selectedOptions.includes(option.id)}
                            onCheckedChange={() => handleMultiSelection(option.id)}
                          />
                          <Label htmlFor={`option-${option.id}`}>{option.text}</Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <RadioGroup value={selectedOption} onValueChange={handleSingleSelection} className="space-y-4">
                      {pollData.options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
                          <Label htmlFor={`option-${option.id}`}>{option.text}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                  <div className="mt-8 flex justify-end space-x-4">
                    <Button variant="outline" onClick={() => navigate("/dashboard")}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleVoteSubmit}
                      disabled={pollData.isMultipleChoice ? selectedOptions.length === 0 : !selectedOption}
                    >
                      Submit Vote
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="bg-muted/50 p-4 rounded-md text-center mb-4">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <Check className="h-5 w-5" />
                      <p className="font-medium">Your vote has been recorded</p>
                    </div>
                  </div>
                
                  <div className="space-y-4">
                    {pollData.options.map((option) => {
                      const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                      return (
                        <div key={option.id} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span>{option.text}</span>
                            <span className="font-medium">{percentage}%</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground">{option.votes} votes</p>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button onClick={() => navigate("/dashboard")}>
                      Back to Dashboard
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VotePoll;
