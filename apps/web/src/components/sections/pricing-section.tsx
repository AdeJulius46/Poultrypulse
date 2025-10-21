"use client";

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for small family farms",
      price: "5",
      currency: "$BAG",
      period: "/ chicken batch",
      features: [
        "Basic health monitoring",
        "Up to 100 chickens",
        "Email support",
        "Mobile app access"
      ],
      buttonText: "Create Account",
      buttonStyle: "bg-gray-200 text-gray-800 hover:bg-gray-300",
      recommended: false
    },
    {
      name: "Professional",
      description: "Perfect for growing operations",
      price: "15",
      currency: "$BAG",
      period: "/ chicken batch",
      features: [
        "Everything in Starter",
        "Advanced AI analytics",
        "Up to 500 chickens",
        "Priority support",
        "Blockchain tracking",
        "Custom reports"
      ],
      buttonText: "Create Account",
      buttonStyle: "bg-green-500 text-white hover:bg-green-600",
      recommended: true
    },
    {
      name: "Enterprise",
      description: "Perfect for large-scale farms",
      price: "30",
      currency: "$BAG",
      period: "/ chicken batch",
      features: [
        "Everything in Professional",
        "Unlimited chickens",
        "24/7 phone support",
        "Custom integrations",
        "Dedicated account manager",
        "API access"
      ],
      buttonText: "Create Account",
      buttonStyle: "bg-green-700 text-white hover:bg-green-800",
      recommended: false
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">
            Flexible Plans for Every Farm Size
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Pay only for what you use with our transparent per-chicken subscription model. 
            No hidden fees, no long-term contracts.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-8 shadow-lg ${
                plan.recommended 
                  ? 'border-2 border-green-500 shadow-xl transform scale-105' 
                  : 'border border-gray-200'
              }`}
            >
              {/* Recommended Badge */}
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Recommended
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {plan.description}
                </p>
              </div>

              {/* Pricing */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-2xl font-bold text-gray-900 ml-1">
                    {plan.currency}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  {plan.period}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <span className="text-gray-700 text-sm ml-3">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${plan.buttonStyle}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            All plans include 30-day free trial • Cancel anytime
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <span>Features</span>
            <span>Pricing</span>
            <span>Our Solution</span>
            <span>FAQs</span>
            <span>Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
