
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, Lock, Plus, Search, User, Users, Vote } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { usePolls } from "@/hooks/usePolls";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const PollCard = ({ poll, isActive = true }) => {
  const totalVotes = poll.options.reduce((sum, option) => sum + (option.votes || 0), 0);
  const totalVoters = totalVotes; // In this implementation, each voter counts as one vote
  const isPastEndDate = new Date(poll.end_date) < new Date();
  
  // Determine if poll is active based on end date
  const pollIsActive = isActive && !isPastEndDate;
  
  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {poll.is_private && <Lock className="h-4 w-4 text-amber-500" />}
          {poll.title}
        </CardTitle>
        <CardDescription>
          {pollIsActive 
            ? `Ends on ${new Date(poll.end_date).toLocaleDateString()}`
            : `Completed on ${new Date(poll.end_date).toLocaleDateString()}`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
            </span>
            <span className="text-sm font-medium">
              {totalVoters > 0 ? Math.round((totalVotes / totalVoters) * 100) : 0}%
            </span>
          </div>
          <Progress value={totalVoters > 0 ? (totalVotes / totalVoters) * 100 : 0} />
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{poll.options.length} options</span>
            </div>
            <Link to={`/vote/${poll.id}`}>
              <Button variant={pollIsActive ? "default" : "outline"} size="sm">
                {pollIsActive ? "Vote Now" : "View Results"}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { polls, loading } = usePolls();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter active and completed polls
  const currentDate = new Date();
  const filteredPolls = polls.filter(poll => 
    poll.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const activePolls = filteredPolls.filter(poll => new Date(poll.end_date) > currentDate);
  const completedPolls = filteredPolls.filter(poll => new Date(poll.end_date) <= currentDate);
  
  // Filter user's polls
  const userPolls = user ? filteredPolls.filter(poll => poll.created_by === user.id) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-20">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Your Dashboard</h1>
            <Link to="/create-poll">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create New Poll
              </Button>
            </Link>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search polls..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <p>Loading polls...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Vote className="h-5 w-5 text-primary" /> Active Polls
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{activePolls.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" /> Completed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{completedPolls.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-vote-teal" /> Your Polls
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{userPolls.length}</p>
                  </CardContent>
                </Card>
              </div>

              <h2 className="text-xl font-semibold mb-4">Active Polls</h2>
              {activePolls.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {activePolls.map(poll => (
                    <PollCard key={poll.id} poll={poll} />
                  ))}
                  <Card className="border-dashed flex flex-col items-center justify-center p-8 card-hover">
                    <Plus className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Create a new poll</p>
                    <Link to="/create-poll" className="mt-4">
                      <Button variant="outline">Get Started</Button>
                    </Link>
                  </Card>
                </div>
              ) : (
                <div className="bg-muted/50 rounded-lg p-8 text-center mb-8">
                  <p className="text-muted-foreground mb-4">No active polls found</p>
                  <Link to="/create-poll">
                    <Button>Create your first poll</Button>
                  </Link>
                </div>
              )}

              <h2 className="text-xl font-semibold mb-4">Completed Polls</h2>
              {completedPolls.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedPolls.map(poll => (
                    <PollCard key={poll.id} poll={poll} isActive={false} />
                  ))}
                </div>
              ) : (
                <div className="bg-muted/50 rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">No completed polls yet</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
