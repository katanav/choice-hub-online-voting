
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="py-20 hero-gradient text-white">
      <div className="container text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Ready to transform your voting process?</h2>
        <p className="text-lg opacity-90 mb-8">
          Join thousands of organizations who trust ChoiceHub for their elections, polls, and surveys.
        </p>
        <Link to="/register">
          <Button size="lg" variant="outline" className="bg-white text-vote-blue hover:bg-gray-100">
            Get Started for Free
          </Button>
        </Link>
      </div>
    </section>
  );
}
