
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Shield, User, Users, Vote } from "lucide-react";
import CTASection from "@/components/CTASection";
import { Link } from "react-router-dom";

const featuresData = [
  {
    title: "Poll Creation",
    description: "Create custom polls with multiple question types, add images, and set voting rules.",
    icon: Vote,
  },
  {
    title: "Voter Authentication",
    description: "Verify voter identity with email verification, access codes, or SSO integration.",
    icon: User,
  },
  {
    title: "Real-time Results",
    description: "Watch results update live as votes come in with interactive charts and graphs.",
    icon: Check,
  },
  {
    title: "Advanced Analytics",
    description: "Dive deep into voting patterns with demographic breakdowns and response analysis.",
    icon: Users,
  },
  {
    title: "Enterprise Security",
    description: "End-to-end encryption, audit logs, and compliance with global privacy regulations.",
    icon: Shield,
  },
  {
    title: "Integrations",
    description: "Connect with tools like Slack, Microsoft Teams, Google Workspace, and more.",
    icon: Check,
  },
];

const Features = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="py-20 bg-muted/30">
          <div className="container text-center">
            <h1 className="text-4xl font-bold mb-4">Platform Features</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create, manage, and analyze your votes and elections.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {featuresData.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex flex-shrink-0 items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Powerful Voting System</h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-1" />
                    <span>
                      <strong className="font-medium">Multiple voting methods</strong> – Support for first-past-the-post,
                      ranked choice, approval, and weighted voting
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-1" />
                    <span>
                      <strong className="font-medium">Customizable ballot design</strong> – Brand your ballots with
                      your organization's logo and colors
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-1" />
                    <span>
                      <strong className="font-medium">Conditional logic</strong> – Create dynamic polls that adapt based
                      on previous answers
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-1" />
                    <span>
                      <strong className="font-medium">Mobile-friendly interface</strong> – Perfect voting experience on
                      any device
                    </span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link to="/register">
                    <Button>Get Started</Button>
                  </Link>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-6 h-80 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&h=400"
                  alt="Platform dashboard"
                  className="rounded-md shadow-lg max-h-full"
                />
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Features;
