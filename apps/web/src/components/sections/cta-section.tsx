"use client";

export function CTASection() {
  return (
    <section className="py-16 px-4 bg-green-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Poultry Operation?
        </h2>
        <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
          Join thousands of farmers who are already using PoultryPulse to increase 
          productivity, reduce costs, and ensure the health of their flocks.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors duration-200">
            Start Free Trial
          </button>
          <button className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-lg font-medium transition-colors duration-200">
            Schedule Demo
          </button>
        </div>
      </div>
    </section>
  );
}
