
import { Check, Shield, User, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Secure Voting",
    description: "End-to-end encryption ensures votes remain private and tamper-proof.",
    icon: Shield,
  },
  {
    title: "Easy Participation",
    description: "Simple interface for voters with no technical knowledge required.",
    icon: User,
  },
  {
    title: "Real-time Results",
    description: "Watch votes come in live with beautiful, interactive charts.",
    icon: Check,
  },
  {
    title: "Multiple Election Types",
    description: "Support for various voting methods including ranked choice and approval voting.",
    icon: Users,
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose ChoiceHub?</h2>
          <p className="text-muted-foreground text-lg">
            Our platform provides everything you need to run successful votes and elections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="card-hover">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
