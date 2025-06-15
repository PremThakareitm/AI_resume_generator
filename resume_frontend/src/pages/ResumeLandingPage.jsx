import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBrain,
  FaRobot,
  FaArrowRight,
  FaGraduationCap,
  FaBriefcase,
  FaRegFileAlt,
} from "react-icons/fa";
import aiHandwritingImg from "../assets/ai-handwriting.png";

const ResumeLandingPage = () => {
  const [showChatBot, setShowChatBot] = useState(false);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showChatBot) {
        setShowChatBot(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showChatBot]);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Header Section */}
      <header className="bg-white shadow-sm fixed w-full top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg mr-2">
              <FaBrain className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold text-gray-800 hidden sm:inline-block">
              AI Resume Builder
            </span>
            <span className="text-xl font-bold text-gray-800 sm:hidden">
              AI Resume
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              FAQ
            </a>
          </div>

          <button
            onClick={() => setShowChatBot(true)}
            className="btn btn-primary flex items-center gap-2 rounded-full px-4 py-2 shadow-md transition-transform hover:scale-105"
          >
            <FaRobot className="text-lg" />
            <span className="hidden sm:inline">Build Resume</span>
            <span className="sm:hidden">Start</span>
          </button>
        </div>
      </header>

      {/* Add padding to account for fixed header */}
      <div className="pt-16"></div>

      {/* Hero Section */}
      <section className="py-20 bg-white overflow-hidden relative">
        {/* Background dots pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="absolute w-full h-full"
            style={{
              backgroundImage: "radial-gradient(#4F46E5 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-6 animate-pulse">
                AI-Powered Resume Builder
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 mb-6 leading-tight">
                Create Your{" "}
                <span className="text-blue-600">Professional Resume</span> in
                Minutes
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our AI-powered resume builder crafts tailored resumes for your
                dream job. Just provide your basic info and the job description.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowChatBot(true)}
                  className="btn btn-primary btn-lg flex items-center justify-center gap-2 px-8 py-3 rounded-full text-lg font-medium transition-transform hover:scale-105"
                >
                  Get Started <FaArrowRight />
                </button>
                <a
                  href="#how-it-works"
                  className="btn btn-ghost btn-lg text-blue-600 flex items-center justify-center gap-2"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-1 bg-blue-500 rounded-lg blur-md opacity-30 animate-pulse"></div>
                <img
                  src={aiHandwritingImg}
                  alt="AI Resume Writer"
                  className="relative max-w-full h-auto rounded-lg shadow-xl transform transition-all duration-500 hover:scale-105"
                  style={{ maxHeight: "500px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              Simple Process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered resume builder makes the process simple and fast.
              Three easy steps to your perfect job application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg transform transition duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <FaRegFileAlt className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">
                Paste Job Description
              </h3>
              <p className="text-gray-600 text-center">
                Simply paste the job description you're applying for into our AI
                assistant. Our system analyzes key requirements.
              </p>
              <div className="mt-6 border-t border-gray-100 pt-4 text-center">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Step 1
                </span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg transform transition duration-300 hover:-translate-y-2 hover:shadow-xl md:mt-4">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <FaGraduationCap className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">
                Add Basic Info
              </h3>
              <p className="text-gray-600 text-center">
                Provide just your name, email, and phone number - our AI handles
                everything else, creating a complete profile.
              </p>
              <div className="mt-6 border-t border-gray-100 pt-4 text-center">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Step 2
                </span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg transform transition duration-300 hover:-translate-y-2 hover:shadow-xl md:mt-8">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <FaBriefcase className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">
                Get Your Resume
              </h3>
              <p className="text-gray-600 text-center">
                Download your professionally formatted resume tailored
                specifically for the job, ready for submission.
              </p>
              <div className="mt-6 border-t border-gray-100 pt-4 text-center">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Step 3
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              Success Stories
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Our Users Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of job seekers who have successfully landed
              interviews with our AI-generated resumes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-gray-50 p-8 rounded-xl shadow-md relative">
              <div className="absolute top-0 left-0 transform -translate-x-3 -translate-y-3">
                <svg
                  className="h-12 w-12 text-blue-400 opacity-20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" />
                </svg>
              </div>
              <p className="italic text-gray-700 mb-6 text-lg">
                "This AI resume builder saved me hours of work! I got a job
                interview within days of submitting my tailored resume. The AI
                understood exactly what to highlight based on the job posting."
              </p>
              <div className="flex items-center">
                <img
                  src="https://randomuser.me/api/portraits/women/45.jpg"
                  alt="Sarah Johnson"
                  className="w-12 h-12 rounded-full mr-4 border-2 border-blue-400"
                />
                <div>
                  <p className="font-bold text-gray-800">Sarah Johnson</p>
                  <p className="text-sm text-blue-600">Software Developer</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow-md relative md:mt-10">
              <div className="absolute top-0 left-0 transform -translate-x-3 -translate-y-3">
                <svg
                  className="h-12 w-12 text-blue-400 opacity-20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" />
                </svg>
              </div>
              <p className="italic text-gray-700 mb-6 text-lg">
                "I was amazed at how accurately the AI understood the job
                requirements and tailored my resume. Within a week of applying,
                I received three callback interviews!"
              </p>
              <div className="flex items-center">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Michael Chen"
                  className="w-12 h-12 rounded-full mr-4 border-2 border-blue-400"
                />
                <div>
                  <p className="font-bold text-gray-800">Michael Chen</p>
                  <p className="text-sm text-blue-600">Marketing Specialist</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={() => setShowChatBot(true)}
              className="btn btn-outline btn-primary btn-lg px-8 rounded-full"
            >
              Try It Yourself
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute w-full h-full"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white leading-tight">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-xl mb-10 text-blue-100 max-w-3xl mx-auto">
              Create a professionally tailored resume in minutes with our
              AI-powered tool. Stand out from other applicants with a resume
              perfectly matched to job requirements.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setShowChatBot(true)}
                className="btn btn-lg bg-white text-blue-700 hover:bg-blue-50 rounded-full px-10 py-4 font-bold text-lg shadow-lg transition-transform hover:scale-105"
              >
                Build My Resume Now
              </button>
            </div>

            <div className="mt-10">
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center text-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>100% Free</span>
                </div>
                <div className="flex items-center text-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>No Sign-Up Required</span>
                </div>
                <div className="flex items-center text-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>PDF Download</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <FaBrain className="text-blue-400 text-2xl mr-2" />
                <span className="text-xl font-bold">AI Resume Builder</span>
              </div>
              <p className="text-gray-400 mb-4">
                AI-powered resume builder that creates tailored resumes for your
                dream job in minutes.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Job-Tailored Resumes
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    PDF Download
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    ATS-Friendly Format
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Instant Generation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Resume Tips
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Interview Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Career Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Feedback
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 AI Resume Builder. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 text-sm hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 text-sm hover:text-blue-400 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 text-sm hover:text-blue-400 transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Resume Bot Widget */}
      {showChatBot && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => {
            // Close modal when clicking on overlay
            if (e.target === e.currentTarget) {
              setShowChatBot(false);
            }
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-5/6 flex flex-col animate-fadeIn"
            style={{ animation: "fadeIn 0.3s ease-in-out" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-2xl">
              <div className="flex items-center">
                <FaRobot className="text-white text-xl mr-2" />
                <h3 className="text-lg font-bold" id="modal-title">
                  AI Resume Builder
                </h3>
              </div>
              <button
                onClick={() => setShowChatBot(false)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full w-8 h-8 flex items-center justify-center transition-all"
                aria-label="Close resume builder"
              >
                <span className="text-xl font-bold">×</span>
              </button>
            </div>
            <div className="flex-grow overflow-hidden">
              <div className="w-full h-full relative">
                <iframe
                  src="/generate-tailored-resume"
                  className="w-full h-full border-0"
                  title="Resume Generator"
                  id="resumeGeneratorFrame"
                  onError={(e) => {
                    console.error("Iframe failed to load", e);
                    // Fallback content if iframe fails to load
                    e.target.style.display = "none";
                    e.target.parentNode.innerHTML += `
                      <div class="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-white p-6">
                        <h3 class="text-xl font-bold mb-3">Resume Generator Unavailable</h3>
                        <p class="text-center mb-4">The resume generator couldn't be loaded. Please try again or visit the page directly.</p>
                        <a href="/generate-tailored-resume" target="_blank" 
                           class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300">
                          Open Resume Generator
                        </a>
                      </div>
                    `;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeLandingPage;
