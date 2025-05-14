
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, Lock, Plus, Search, User, Users, Vote, Calendar, X, Filter } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { usePolls } from "@/hooks/usePolls";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

const PollCard = ({ poll, isActive = true }) => {
  const totalVotes = poll.options.reduce((sum, option) => sum + (option.votes || 0), 0);
  const totalVoters = totalVotes; // In this implementation, each voter counts as one vote
  const isPastEndDate = new Date(poll.end_date) < new Date();
  
  // Determine if poll is active based on end date
  const pollIsActive = isActive && !isPastEndDate;
  
  // Format the end date to show both date and time
  const formattedEndDate = format(new Date(poll.end_date), "MMM d, yyyy 'at' h:mm a");
  
  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {poll.is_private && <Lock className="h-4 w-4 text-amber-500" />}
          {poll.title}
        </CardTitle>
        <CardDescription>
          {pollIsActive 
            ? `Ends on ${formattedEndDate}`
            : `Completed on ${formattedEndDate}`
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
  
  // Date filtering states
  const [filterType, setFilterType] = useState<"none" | "day" | "month" | "year">("none");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isFilterActive, setIsFilterActive] = useState(false);
  
  // Get current date for reference
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  
  // Generate years (starting from current year - 5 to current year + 5)
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  
  // Generate months
  const months = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" }
  ];
  
  // Generate days based on selected month and year
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const days = selectedYear && selectedMonth !== null
    ? Array.from(
        { length: getDaysInMonth(selectedYear, selectedMonth) },
        (_, i) => ({ value: i + 1, label: String(i + 1) })
      )
    : [];
  
  // Apply filters
  const applyFilters = () => {
    setIsFilterActive(true);
  };
  
  const clearFilters = () => {
    setFilterType("none");
    setSelectedYear(null);
    setSelectedMonth(null);
    setSelectedDay(null);
    setIsFilterActive(false);
  };
  
  // Filter polls by date and search term
  const filterPolls = (polls) => {
    // First filter by search query
    let filteredPolls = polls.filter(poll => 
      poll.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Then apply date filters if active
    if (isFilterActive && filterType !== "none") {
      filteredPolls = filteredPolls.filter(poll => {
        const pollDate = new Date(poll.end_date);
        const pollYear = pollDate.getFullYear();
        const pollMonth = pollDate.getMonth();
        const pollDay = pollDate.getDate();
        
        if (filterType === "year" && selectedYear !== null) {
          return pollYear === selectedYear;
        }
        
        if (filterType === "month" && selectedYear !== null && selectedMonth !== null) {
          return pollYear === selectedYear && pollMonth === selectedMonth;
        }
        
        if (filterType === "day" && selectedYear !== null && selectedMonth !== null && selectedDay !== null) {
          return pollYear === selectedYear && pollMonth === selectedMonth && pollDay === selectedDay;
        }
        
        return true;
      });
    }
    
    return filteredPolls;
  };
  
  // Filter and sort polls
  const filteredPolls = filterPolls(polls);
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
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search polls..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>{isFilterActive ? "Filters Applied" : "Filter by Date"}</span>
                    {isFilterActive && (
                      <span className="ml-1 rounded-full bg-primary w-2 h-2"></span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Filter by Date</h4>
                    
                    <div className="space-y-2">
                      <Label>Filter Type</Label>
                      <Select
                        value={filterType}
                        onValueChange={(value) => setFilterType(value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select filter type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Date Filter</SelectItem>
                          <SelectItem value="year">Year Only</SelectItem>
                          <SelectItem value="month">Month and Year</SelectItem>
                          <SelectItem value="day">Day, Month and Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {filterType !== "none" && (
                      <div className="space-y-2">
                        <Label>Year</Label>
                        <Select
                          value={selectedYear?.toString() || ""}
                          onValueChange={(value) => {
                            setSelectedYear(parseInt(value));
                            // Reset month and day when year changes
                            setSelectedMonth(null);
                            setSelectedDay(null);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map(year => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {(filterType === "month" || filterType === "day") && selectedYear && (
                      <div className="space-y-2">
                        <Label>Month</Label>
                        <Select
                          value={selectedMonth?.toString() || ""}
                          onValueChange={(value) => {
                            setSelectedMonth(parseInt(value));
                            // Reset day when month changes
                            setSelectedDay(null);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map(month => (
                              <SelectItem key={month.value} value={month.value.toString()}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {filterType === "day" && selectedYear && selectedMonth !== null && (
                      <div className="space-y-2">
                        <Label>Day</Label>
                        <Select
                          value={selectedDay?.toString() || ""}
                          onValueChange={(value) => setSelectedDay(parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent>
                            {days.map(day => (
                              <SelectItem key={day.value} value={day.value.toString()}>
                                {day.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="flex justify-between pt-2">
                      <Button variant="outline" size="sm" onClick={clearFilters}>
                        <X className="h-4 w-4 mr-2" /> Clear
                      </Button>
                      <Button size="sm" onClick={applyFilters}>
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
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
