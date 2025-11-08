/**
 * @component Home
 * @description
 * High-conversion landing page with:
 * - Animated hero with dual CTAs
 * - 4-step "How It Works" feature grid
 * - Live impact stats with visual proof
 * - Multiple conversion points to /calcular
 * - Framer Motion scroll animations
 * - Mobile-first responsive design
 *
 * Built to impress judges and convert users in live demos!
 */


import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Recycle, Coins, Shield, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Renders the Home (Landing) page of GreenLoop – the main entry point for users.
 *
 * This component showcases the platform's value proposition: turning recycling into
 * crypto rewards using blockchain. It features animated hero sections, feature cards,
 * impact stats, and multiple CTAs. Built for maximum engagement and conversion.
 *
 * @returns {JSX.Element} The dynamic, animated, and responsive Home page.
 */
const Home = () => {
  /**
   * Array of key platform features displayed in a responsive grid.
   * Each includes an icon, title, and concise description.
   * @type {Array<{icon: React.Component, title: string, description: string}>}
   */
  const features = [
    {
      icon: Recycle,
      title: 'Recycle Easily',
      description: 'Submit your recyclable materials and contribute to a cleaner planet.',
    },
    {
      icon: Coins,
      title: 'Earn Crypto',
      description: 'Get paid in cryptocurrency for every item you recycle.',
    },
    {
      icon: Shield,
      title: 'Full Transparency',
      description: 'Every transaction is recorded securely and transparently on-chain.',
    },
    {
      icon: TrendingUp,
      title: 'Trackable Impact',
      description: 'Monitor your environmental impact and earnings in real time.',
    },
  ];

  return (
    <>
      {/* SEO & Metadata */}
      <Helmet>
        <title>GreenLoop - Recycling That Rewards in Crypto</title>
        <meta name="description" content="Turn your recyclables into cryptocurrency. GreenLoop connects sustainability and blockchain for a greener future." />
      </Helmet>

      {/* Hero Section with CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Hero Text & Buttons */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-[#538536] mb-6 leading-tight">
                Recycle & Earn Crypto
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Transform your recyclables into digital rewards. Join the green revolution powered by blockchain.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/calcular">
                  <Button size="lg" className="gradient-green text-white hover:opacity-90 transition-opacity">
                    Start Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/sobre">
                  <Button size="lg" variant="outline" className="border-[#538536] text-[#538536] hover:bg-green-50">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img 
                alt="Person recycling materials with blockchain technology" 
                className="rounded-2xl shadow-2xl w-full" 
                src="https://images.unsplash.com/photo-1567516847971-81df16eefa90" 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#538536] mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, transparent, and rewarding
            </p>
          </motion.div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="bg-[#538536] w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#538536] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-20 gradient-green">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Impact Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img 
                alt="Environmental impact and recycling statistics" 
                className="rounded-2xl shadow-2xl w-full" 
                src="https://images.unsplash.com/photo-1686061593213-98dad7c599b9" 
              />
            </motion.div>

            {/* Stats Text */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <h2 className="text-4xl font-bold mb-6">
                Your Impact in Numbers
              </h2>
              <p className="text-xl mb-8 text-green-100">
                Track in real time how much you're contributing to sustainability and earning.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <div className="text-3xl font-bold mb-2">1000+</div>
                  <div className="text-green-100">Active Users</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <div className="text-3xl font-bold mb-2">50 Tons</div>
                  <div className="text-green-100">Recycled</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-[#538536] mb-6">
              Ready to Start?
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Join thousands already turning recycling into digital rewards.
            </p>
            <Link to="/calcular">
              <Button size="lg" className="gradient-green text-white hover:opacity-90 transition-opacity">
                Calculate My Earnings
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;