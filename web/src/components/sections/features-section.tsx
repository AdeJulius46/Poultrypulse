"use client";

export function FeaturesSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">
            Advanced Features for Modern Farmers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the comprehensive suite of tools designed to revolutionize
            your poultry operation.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-between flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    AI-Powered Health Monitoring
                  </h3>
                  <p className="text-gray-600">
                    Advanced computer vision and machine learning algorithms
                    monitor each chicken's behavior, detecting illness 48-72
                    hours before visible symptoms appear.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Blockchain Supply Chain
                  </h3>
                  <p className="text-gray-600">
                    Immutable records track every chicken from hatch to harvest,
                    providing complete transparency and building consumer trust
                    through verified provenance.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Predictive Analytics
                  </h3>
                  <p className="text-gray-600">
                    AI analyzes historical data, weather patterns, and market
                    trends to optimize feed schedules, predict production
                    cycles, and maximize profitability.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image Placeholder */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md h-96 bg-gray-200 rounded-2xl flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">📷</span>
                </div>
                <p className="text-sm">Poultry Farm Image</p>
                <p className="text-xs text-gray-400 mt-1">
                  Placeholder for actual photo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
