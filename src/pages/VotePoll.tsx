
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, Loader2, Lock } from "lucide-react";
import { usePolls } from "@/hooks/usePolls";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

const PasswordForm = ({ onVerify }) => {
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onVerify(password);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-20">
        <div className="container max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-amber-500" /> Private Poll
              </CardTitle>
              <CardDescription>
                This poll is password-protected. Enter the password to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter poll password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Verifying..." : "Access Poll"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const VotePoll = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const { polls, loading, submitVote, hasVoted, checkPollPassword } = usePolls();
  const { user } = useAuth();
  
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingVoteStatus, setCheckingVoteStatus] = useState(true);
  const [accessGranted, setAccessGranted] = useState(false);
  
  const poll = polls.find(p => p.id === pollId);
  const isPastEndDate = poll ? new Date(poll.end_date) < new Date() : false;
  const isPrivate = poll?.is_private || false;
  
  useEffect(() => {
    const checkVoteStatus = async () => {
      if (pollId && user) {
        const voted = await hasVoted(pollId);
        setShowResults(voted || isPastEndDate);
        setCheckingVoteStatus(false);
      } else if (!user) {
        setCheckingVoteStatus(false);
      }
    };
    
    // Check if poll is private and set access status
    if (poll) {
      if (!isPrivate) {
        setAccessGranted(true);
      }
      checkVoteStatus();
    }
  }, [pollId, user, isPastEndDate, poll, isPrivate]);
  
  const handlePasswordVerification = async (password) => {
    if (!pollId) return;
    
    const isCorrect = await checkPollPassword(pollId, password);
    if (isCorrect) {
      setAccessGranted(true);
      toast({
        title: "Access granted",
        description: "Password verified successfully.",
      });
    } else {
      toast({
        title: "Incorrect password",
        description: "The password you entered is incorrect. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSingleSelection = (value: string) => {
    setSelectedOption(value);
  };
  
  const handleMultiSelection = (optionId: string) => {
    setSelectedOptions(prevSelected => 
      prevSelected.includes(optionId)
        ? prevSelected.filter(id => id !== optionId)
        : [...prevSelected, optionId]
    );
  };
  
  const handleVoteSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    if (!poll) return;
    
    setIsSubmitting(true);
    try {
      const optionIds = poll.is_multiple_choice 
        ? selectedOptions 
        : [selectedOption];
        
      const success = await submitVote(poll.id, optionIds);
      if (success) {
        setShowResults(true);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading || checkingVoteStatus) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-20">
          <div className="container max-w-3xl flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!poll) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-20">
          <div className="container max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle>Poll Not Found</CardTitle>
                <CardDescription>The poll you're looking for doesn't exist or has been removed.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/dashboard")}>
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Show password form if the poll is private and access is not granted yet
  if (isPrivate && !accessGranted) {
    return <PasswordForm onVerify={handlePasswordVerification} />;
  }
  
  const totalVotes = poll.options.reduce((sum, option) => sum + (option.votes || 0), 0);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-20">
        <div className="container max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                {isPrivate && <Lock className="h-5 w-5 text-amber-500" />}
                {poll.title}
              </CardTitle>
              {poll.description && <CardDescription>{poll.description}</CardDescription>}
              <p className="text-sm text-muted-foreground">
                {isPastEndDate 
                  ? `Ended on ${new Date(poll.end_date).toLocaleDateString()}` 
                  : `Voting ends on ${new Date(poll.end_date).toLocaleDateString()}`
                }
              </p>
            </CardHeader>
            <CardContent>
              {!showResults ? (
                <>
                  {poll.is_multiple_choice ? (
                    <div className="space-y-4">
                      {poll.options.map((option) => (
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
                      {poll.options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={`option-${option.id}`} />
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
                      disabled={
                        isSubmitting || 
                        (poll.is_multiple_choice ? selectedOptions.length === 0 : !selectedOption) ||
                        isPastEndDate
                      }
                    >
                      {isSubmitting ? "Submitting..." : "Submit Vote"}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  {user && !isPastEndDate && (
                    <div className="bg-muted/50 p-4 rounded-md text-center mb-4">
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <Check className="h-5 w-5" />
                        <p className="font-medium">Your vote has been recorded</p>
                      </div>
                    </div>
                  )}
                
                  <div className="space-y-4">
                    {poll.options.map((option) => {
                      const votes = option.votes || 0;
                      const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
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
                          <p className="text-xs text-muted-foreground">{votes} vote{votes !== 1 ? 's' : ''}</p>
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
