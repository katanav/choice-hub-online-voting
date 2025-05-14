
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 opacity-10"></div>
      <div className="container relative pt-32 pb-20 text-center">
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-vote-blue to-vote-teal">
              ELECTRAVOTE
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create polls in minutes and get instant results. Perfect for team decisions, event planning, or quick surveys.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-vote-blue to-vote-teal hover:opacity-90">
                Create Your First Poll
              </Button>
            </Link>
            <Link to="/features">
              <Button size="lg" variant="outline">
                How It Works
              </Button>
            </Link>
          </div>
          <div className="mt-16">
            <img 
              src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&h=600" 
              alt="People voting at ballot boxes" 
              className="rounded-lg shadow-2xl border"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
