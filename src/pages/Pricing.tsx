
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    description: "For individuals and small groups",
    price: "$0",
    features: [
      "Up to 100 voters per poll",
      "Basic poll types",
      "Email support",
      "Results export (CSV)",
      "7-day poll duration",
    ],
    buttonText: "Get Started",
    buttonVariant: "outline",
    popular: false,
  },
  {
    name: "Pro",
    description: "For organizations and communities",
    price: "$29",
    features: [
      "Up to 1,000 voters per poll",
      "All voting methods",
      "Priority support",
      "Advanced analytics",
      "Custom branding",
      "30-day poll duration",
    ],
    buttonText: "Subscribe",
    buttonVariant: "default",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    price: "Contact us",
    features: [
      "Unlimited voters",
      "Custom integrations",
      "Dedicated account manager",
      "Service level agreement",
      "Advanced security features",
      "Unlimited poll duration",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="py-20 bg-muted/30">
          <div className="container text-center">
            <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that's right for your organization
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <Card key={plan.name} className={`card-hover ${plan.popular ? 'border-primary shadow-md' : ''}`}>
                  {plan.popular && (
                    <div className="bg-primary text-primary-foreground text-sm font-medium py-1 px-3 rounded-t-lg text-center">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price !== "Contact us" && <span className="text-muted-foreground">/month</span>}
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link to="/register" className="w-full">
                      <Button className="w-full" variant={plan.buttonVariant as any}>
                        {plan.buttonText}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Find answers to common questions about our platform and pricing.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div>
                <h3 className="text-xl font-semibold mb-2">Can I change plans later?</h3>
                <p className="text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">How secure is the platform?</h3>
                <p className="text-muted-foreground">
                  We use end-to-end encryption and follow industry best practices for security. Your data and votes are always protected.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards, PayPal, and for Enterprise plans, we can arrange invoicing.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Is there a free trial?</h3>
                <p className="text-muted-foreground">
                  Yes, you can try all Pro features free for 14 days with no credit card required.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
