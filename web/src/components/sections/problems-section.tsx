"use client";

export function ProblemsSection() {
  const problems = [
    {
      icon: "⚠️",
      title: "Low Productivity",
      description: "Late detection of health issues causes widespread infections, devastating entire flocks.",
      highlight: "$2.3B lost globally",
      highlightColor: "bg-red-100 text-red-800"
    },
    {
      icon: "🦠",
      title: "Disease Outbreaks", 
      description: "Late detection of health issues causes widespread infections, devastating entire flocks.",
      highlight: "72 hours too late",
      highlightColor: "bg-orange-100 text-orange-800"
    },
    {
      icon: "🔗",
      title: "Supply Chain Opacity",
      description: "Consumers demand transparency, but traditional systems lack traceability and verification.",
      highlight: "87% want transparency",
      highlightColor: "bg-yellow-100 text-yellow-800"
    },
    {
      icon: "💰",
      title: "Rising Costs",
      description: "Feed costs, labor, and compliance requirements continue to squeeze profit margins",
      highlight: "30% cost increase",
      highlightColor: "bg-purple-100 text-purple-800"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">
            AI + Blockchain = Smart Farming Revolution
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our integrated platform combines artificial intelligence and blockchain technology to solve every major challenge in modern poultry farming.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* Icon */}
              <div className="text-3xl mb-4">
                {problem.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {problem.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 mb-4 leading-relaxed">
                {problem.description}
              </p>
              
              {/* Highlight */}
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${problem.highlightColor}`}>
                {problem.highlight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
