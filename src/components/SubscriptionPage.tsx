import React from 'react';

interface SubscriptionPageProps {
  onBack: () => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ onBack }) => {
  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      credits: '100',
      features: [
        'AI Portfolio Builder',
        'Resume Generator',
        'Cover Letter Writer',
        'Basic Resume Optimizer',
        'Mock Interview (5 questions)',
        'Career Coaching',
        'Email Support'
      ],
      popular: false,
      buttonText: 'Current Plan',
      buttonStyle: 'bg-gray-500 hover:bg-gray-600',
      disabled: true
    },
    {
      name: 'Standard',
      price: '₹999',
      period: 'per month',
      credits: '1,000',
      features: [
        'Everything in Free',
        'Advanced Resume Optimizer',
        'Mock Interview (Unlimited)',
        'Priority Support',
        'Advanced Analytics',
        'Custom Templates',
        'Export to PDF/Word'
      ],
      popular: true,
      buttonText: 'Upgrade to Standard',
      buttonStyle: 'bg-blue-600 hover:bg-blue-700',
      disabled: false
    },
    {
      name: 'Premium',
      price: '₹2,499',
      period: 'per month',
      credits: 'Unlimited',
      features: [
        'Everything in Standard',
        'Unlimited Credits',
        'Priority AI Processing',
        'Advanced Career Insights',
        'Custom Branding',
        'API Access',
        'Dedicated Account Manager',
        '24/7 Phone Support'
      ],
      popular: false,
      buttonText: 'Upgrade to Premium',
      buttonStyle: 'bg-purple-600 hover:bg-purple-700',
      disabled: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock the full potential of PortfolioAI with our flexible subscription plans. 
              Start free and upgrade as you grow.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                  plan.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    </div>
                    <div className="text-lg text-gray-600 mb-4">
                      <span className="font-semibold">{plan.credits}</span> credits
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                      plan.disabled 
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : plan.buttonStyle
                    }`}
                    disabled={plan.disabled}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Frequently Asked Questions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-semibold text-gray-900 mb-2">What are credits?</h4>
                <p className="text-gray-600">
                  Credits are used for AI-powered features like portfolio generation, resume optimization, and mock interviews. Each action consumes a certain number of credits.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h4>
                <p className="text-gray-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and you'll be charged or credited accordingly.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h4>
                <p className="text-gray-600">
                  Our Free plan gives you 100 credits to try all features. No credit card required to get started!
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
                <p className="text-gray-600">
                  We accept all major credit cards, UPI, net banking, and digital wallets. All payments are processed securely.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center">
            <div className="bg-white p-8 rounded-lg shadow max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Need Help Choosing?
              </h3>
              <p className="text-gray-600 mb-6">
                Our team is here to help you find the perfect plan for your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
                  Contact Sales
                </button>
                <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-semibold">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionPage;
