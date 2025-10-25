// frontend/src/pages/HomePage.jsx
// Modern Landing page with hero section, vehicle selection, and features

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Calendar, Shield, Clock } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  // Removed unused activeStep state and its effect

  const features = [
    {
      icon: Car,
      title: 'Wide Selection',
      description: 'Choose from a variety of premium bikes and cars to suit your needs',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Simple and intuitive booking process that takes just minutes',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Shield,
      title: 'Secure & Safe',
      description: 'All vehicles are thoroughly verified and regularly maintained',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: Clock,
      title: 'Flexible Rentals',
      description: 'Rent by the hour, day, week, or month - your choice',
      color: 'from-purple-500 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Rent Your Perfect Vehicle
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            From bikes to cars, find the perfect ride for your journey.
            Book in minutes with our easy-to-use platform.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/booking')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-lg"
            >
              Start Booking
            </button>
            <button
              onClick={() => navigate('/my-bookings')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition border-2 border-blue-600"
            >
              My Bookings
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Vehicles Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Customer Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Hit the Road?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Book your vehicle now and enjoy a seamless rental experience
          </p>
          <button
            onClick={() => navigate('/booking')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}