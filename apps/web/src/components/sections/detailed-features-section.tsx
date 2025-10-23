"use client";

export function DetailedFeaturesSection() {
  const features = [
    {
      badge: "Health Management",
      badgeColor: "bg-green-600",
      title: "AI-Powered Health Monitoring",
      description: "Our AI system analyzes thousands of behavioral patterns, movement data, and environmental factors to detect potential health issues before they become visible to the human eye.",
      keyPoints: [
        {
          title: "Behavioral Analysis",
          description: "AI monitors eating patterns, movement, and social interactions to identify early warning signs of illness or stress."
        },
        {
          title: "Predictive Alerts",
          description: "Receive warnings 48-72 hours before symptoms appear, giving you time to take preventive action and protect your entire flock."
        },
        {
          title: "Treatment Recommendations",
          description: "AI suggests optimal treatment protocols and medication schedules based on the specific health patterns detected."
        }
      ],
      image: {
        type: "health-data",
        content: "Health Data Visualization"
      }
    },
    {
      badge: "Supply Chain",
      badgeColor: "bg-green-600",
      title: "Blockchain Transparency",
      description: "Blockchain technology creates an unbreakable chain of custody from farm to fork, building consumer trust and ensuring compliance with regulations.",
      keyPoints: [
        {
          title: "Immutable Records",
          description: "Every transaction and event is permanently recorded on the blockchain, creating a tamper-proof audit trail."
        },
        {
          title: "Consumer Verification",
          description: "QR codes allow consumers to trace products back to source, building trust and transparency."
        },
        {
          title: "Compliance Automation",
          description: "Automatic generation of regulatory reports and certifications saves time and ensures accuracy."
        }
      ],
      image: {
        type: "blockchain",
        content: "Blockchain Visualization"
      }
    },
    {
      badge: "$2.3 Billion Lost",
      badgeColor: "bg-red-600",
      title: "Predictive Analytics & Optimization",
      description: "Advanced machine learning algorithms analyze your farm's data to predict optimal feeding schedules, production cycles, and market timing for maximum profitability.",
      keyPoints: [
        {
          title: "Production Forecasting",
          description: "Predict egg production and optimal harvest timing to maximize yield and minimize waste."
        },
        {
          title: "Feed Optimization",
          description: "AI calculates optimal nutrition plans to reduce costs and improve health outcomes."
        },
        {
          title: "Market Intelligence",
          description: "Track market trends and optimize selling strategies for maximum profit margins."
        }
      ],
      image: {
        type: "analytics",
        content: "Analytics Dashboard"
      }
    }
  ];

  const renderImage = (image: any) => {
    if (image.type === "health-data") {
      return (
        <div className="w-full max-w-md space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-green-600">80%</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">24 Healthy Chickens</h3>
              <p className="text-sm text-gray-600">Flock condition is stable and safe, with chickens active and feeding normally.</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-red-600">6.7%</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2 Chickens at Risk</h3>
              <p className="text-sm text-gray-600">Potential stress factors detected, monitor flock closely for health issues.</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-md">
        <div className="bg-gray-200 rounded-2xl h-80 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">
                {image.type === "blockchain" ? "🔗" : "📊"}
              </span>
            </div>
            <p className="text-sm">{image.content}</p>
            <p className="text-xs text-gray-400 mt-1">
              {image.type === "blockchain" ? "Supply chain tracking interface" : "Predictive insights and optimization"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-16">
        {features.map((feature, index) => {
          const isEven = index % 2 === 0;
          const contentOrder = isEven ? "order-1" : "order-2";
          const imageOrder = isEven ? "order-2" : "order-1";
          const contentJustify = isEven ? "lg:justify-start" : "lg:justify-end";
          const imageJustify = isEven ? "lg:justify-end" : "lg:justify-start";

          return (
            <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className={`space-y-6 ${contentOrder}`}>
                <div className="inline-block">
                  <span className={`${feature.badgeColor} text-white px-6 py-2 rounded-full font-medium`}>
                    {feature.badge}
                  </span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {feature.title}
                </h2>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="space-y-4">
                  {feature.keyPoints.map((point, pointIndex) => (
                    <p key={pointIndex} className="text-gray-700">
                      <strong>{point.title}:</strong> {point.description}
                    </p>
                  ))}
                </div>
              </div>
              
              {/* Image */}
              <div className={`flex justify-center ${imageJustify} ${imageOrder}`}>
                {renderImage(feature.image)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
