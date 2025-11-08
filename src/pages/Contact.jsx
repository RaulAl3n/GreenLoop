/**
 * @component Contact
 * @description
 * Interactive contact page with:
 * - Real-time form validation
 * - localStorage persistence (demo-ready)
 * - Toast notifications (success/error)
 * - Animated layout with Framer Motion
 * - Responsive 2-column design
 * - Contact info, hours, and map
 *
 * Perfect for live demos — users can submit messages and see them saved instantly!
 */


import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

/**
 * Renders the "Contact Us" page of the GreenLoop platform.
 *
 * This component provides a fully functional contact form with client-side
 * validation and localStorage persistence for demo purposes. It displays
 * contact information, business hours, and a location image. Animations are
 * powered by Framer Motion, and toast notifications give user feedback.
 *
 * @returns {JSX.Element} The interactive and animated Contact page.
 */
const Contact = () => {
  const { toast } = useToast();

  /**
   * Local state for the contact form fields.
   * @type {Object}
   * @property {string} name - User's full name
   * @property {string} email - User's email address
   * @property {string} subject - Optional message subject
   * @property {string} message - Main message content
   */
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  /**
   * Handles input changes and updates form state immutably.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - Input change event
   */
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * Handles form submission with validation and localStorage storage.
   * Shows success/error toasts and resets form on success.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Prepare submission with timestamp
    const submission = {
      ...formData,
      timestamp: new Date().toISOString(),
    };

    // Persist to localStorage (for demo/hackathon purposes)
    const savedContacts = JSON.parse(localStorage.getItem('greenloop_contacts') || '[]');
    savedContacts.push(submission);
    localStorage.setItem('greenloop_contacts', JSON.stringify(savedContacts));

    // Success feedback
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out! We'll get back to you soon.",
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  /**
   * Array of contact information items with icons and optional links.
   * @type {Array<{icon: React.Component, title: string, content: string, link: string|null}>}
   */
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'contato@greenloop.com',
      link: 'mailto:contato@greenloop.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+55 (11) 9999-9999',
      link: 'tel:+5511999999999',
    },
    {
      icon: MapPin,
      title: 'Address',
      content: 'São Paulo, Brazil',
      link: null,
    },
  ];

  return (
    <>
      {/* SEO Optimization */}
      <Helmet>
        <title>Contact - Get in Touch | GreenLoop</title>
        <meta name="description" content="Contact GreenLoop. We're here to answer your questions about recycling and crypto rewards." />
      </Helmet>

      {/* Main Contact Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-[#538536] mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Have questions or suggestions? We’re here to help!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h2 className="text-3xl font-bold text-[#538536] mb-6">
                  Send us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      Name *
                    </Label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#538536] focus:outline-none transition-colors"
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Email *
                    </Label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#538536] focus:outline-none transition-colors"
                      placeholder="you@email.com"
                      required
                    />
                  </div>

                  {/* Subject Field */}
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-gray-700 font-medium">
                      Subject
                    </Label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#538536] focus:outline-none transition-colors"
                      placeholder="What would you like to talk about?"
                    />
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-700 font-medium">
                      Message *
                    </Label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#538536] focus:outline-none transition-colors resize-none"
                      placeholder="Write your message here..."
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gradient-green text-white hover:opacity-90 transition-opacity"
                  >
                    Send Message
                    <Send className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info & Map */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Contact Details */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-[#538536] mb-6">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="bg-gradient-to-br from-[#538536] to-[#6ba84a] p-3 rounded-lg flex-shrink-0">
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">{info.title}</h4>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-gray-600 hover:text-[#538536] transition-colors"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-gray-600">{info.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-[#538536] mb-4">
                  Business Hours
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium">Monday - Friday:</span>
                    <span>9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Saturday:</span>
                    <span>9:00 - 13:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>

              {/* Location Image */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <img 
                  alt="GreenLoop location map in São Paulo" 
                  className="w-full h-64 object-cover" 
                  src="https://images.unsplash.com/photo-1693471019113-d2837cc9a2cc" 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;