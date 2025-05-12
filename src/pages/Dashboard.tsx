
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, Plus, User, Users, Vote } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

// Mock data for the dashboard
const activePolls = [
  { id: 1, title: "Team Lunch Location", votes: 24, totalVoters: 30, endDate: "May 15, 2025" },
  { id: 2, title: "New Project Name", votes: 18, totalVoters: 40, endDate: "May 20, 2025" }
];

const completedPolls = [
  { id: 3, title: "Annual Budget Approval", votes: 15, totalVoters: 15, endDate: "May 1, 2025" }
];

const PollCard = ({ poll, isActive = true }) => (
  <Card className="card-hover">
    <CardHeader>
      <CardTitle>{poll.title}</CardTitle>
      <CardDescription>
        {isActive ? `Ends on ${poll.endDate}` : `Completed on ${poll.endDate}`}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {poll.votes} out of {poll.totalVoters} votes
          </span>
          <span className="text-sm font-medium">
            {Math.round((poll.votes / poll.totalVoters) * 100)}%
          </span>
        </div>
        <Progress value={(poll.votes / poll.totalVoters) * 100} />
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{poll.totalVoters} participants</span>
          </div>
          <Button variant={isActive ? "default" : "outline"} size="sm">
            {isActive ? "Manage Poll" : "View Results"}
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
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
                  <User className="h-5 w-5 text-vote-teal" /> Total Voters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">45</p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-xl font-semibold mb-4">Active Polls</h2>
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

          <h2 className="text-xl font-semibold mb-4">Completed Polls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedPolls.map(poll => (
              <PollCard key={poll.id} poll={poll} isActive={false} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
