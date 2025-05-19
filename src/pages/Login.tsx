
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  // Count failed login attempts to implement rate limiting
  const [failedAttempts, setFailedAttempts] = useState(0);
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_TIME = 60000; // 1 minute in milliseconds
  const [lockedUntil, setLockedUntil] = useState<Date | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if account is locked
    if (lockedUntil && new Date() < lockedUntil) {
      const timeLeft = Math.ceil((lockedUntil.getTime() - new Date().getTime()) / 1000);
      toast({
        title: "Account temporarily locked",
        description: `Too many failed login attempts. Please try again in ${timeLeft} seconds.`,
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await signIn(email, password);
      // Reset failed attempts on successful login
      setFailedAttempts(0);
    } catch (error) {
      console.error("Login error:", error);
      
      // Increment failed attempts
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      
      // Lock account after too many failed attempts
      if (newAttempts >= MAX_ATTEMPTS) {
        const lockTime = new Date(Date.now() + LOCKOUT_TIME);
        setLockedUntil(lockTime);
        toast({
          title: "Account temporarily locked",
          description: "Too many failed login attempts. Please try again in 1 minute.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-20">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>
              Enter your email and password to sign in to your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              {lockedUntil && new Date() < lockedUntil && (
                <div className="text-sm text-destructive">
                  Account locked. Please try again later.
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading || (lockedUntil && new Date() < lockedUntil)}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
