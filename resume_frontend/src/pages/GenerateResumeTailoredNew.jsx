import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { FaBrain, FaPaperPlane, FaUpload, FaFile } from "react-icons/fa";
import Resume from "../components/Resume";
import {
  generateTailoredResume,
  checkBackendHealth,
} from "../api/ResumeService";

const GenerateResumeTailoredNew = () => {
  const [loading, setLoading] = useState(false);
  const [userDescription, setUserDescription] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [data, setData] = useState(null);
  const [showResume, setShowResume] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileInputRef = useRef(null);

  // Check if the component is running inside an iframe
  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch (e) {
      setIsInIframe(true);
    }
  }, []);
  
  // Handle file upload for job description
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if the file is a text file
    if (file.type !== 'text/plain') {
      toast.error('Please upload a text (.txt) file');
      return;
    }
    
    // Check file size (max 1MB)
    if (file.size > 1024 * 1024) {
      toast.error('File too large. Please upload a file smaller than 1MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const fileContent = event.target.result;
        setJobDescription(fileContent);
        setUploadedFileName(file.name);
        toast.success(`Successfully uploaded: ${file.name}`);
      } catch (error) {
        toast.error('Error reading file: ' + error.message);
      }
    };
    
    reader.onerror = () => {
      toast.error('Error reading file');
    };
    
    reader.readAsText(file);
  };

  const generateTailoredResumeHandler = async () => {
    if (!userDescription.trim()) {
      toast.error("Please provide your profile information");
      return;
    }

    if (!jobDescription.trim()) {
      toast.error("Please provide the job description");
      return;
    }

    setLoading(true);
    try {
      // Check backend health first
      const healthStatus = await checkBackendHealth();
      console.log("Backend health status:", healthStatus);

      if (!healthStatus.isHealthy) {
        toast.error(`Backend error: ${healthStatus.message}`);
        throw new Error(
          `Backend health check failed: ${healthStatus.message || "Service not available"}`
        );
      }

      const responseData = await generateTailoredResume(
        userDescription,
        jobDescription
      );

      setData(responseData);
      setShowResume(true);
      toast.success("Resume generated successfully!");
    } catch (error) {
      let errorMessage = "Failed to generate resume. Please try again.";

      if (error.response?.status === 500) {
        errorMessage =
          "Server error occurred. Please ensure Ollama is running and try again.";
      } else if (
        error.code === "ECONNREFUSED" ||
        error.message?.includes("Network Error")
      ) {
        errorMessage =
          "Cannot connect to the server. Please check if the backend is running.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
      console.error("Error generating resume:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        isInIframe ? "" : "min-h-screen"
      } bg-gradient-to-br from-gray-900 to-gray-800 py-6 px-4 sm:px-6 lg:px-8`}
    >
      {!showResume ? (
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6">
          <div className="flex items-center mb-4">
            <FaBrain
              className={`${
                isInIframe ? "text-3xl" : "text-4xl"
              } text-blue-500 mr-3`}
            />
            <h1
              className={`${
                isInIframe ? "text-2xl" : "text-3xl"
              } font-bold text-white`}
            >
              AI Resume Generator
            </h1>
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Your Basic Information (Only Name, Email & Phone Needed!)
            </label>
            <div className="text-xs text-gray-400 mb-2">
              <p>
                Just provide your basic contact details - our AI will create
                your complete resume with all necessary sections based on the
                job description.
              </p>
              <p className="mt-1">
                <strong>All you need is:</strong> Your name, email, and phone
                number. We'll handle everything else!
              </p>
            </div>
            <div className="mb-2">
              <button
                className="text-xs text-blue-400 hover:text-blue-300"
                onClick={() =>
                  setUserDescription(`Name: John Doe
Email: johndoe@example.com
Phone: (123) 456-7890`)
                }
              >
                Load Minimal Sample Data
              </button>
            </div>
            <textarea
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              rows={isInIframe ? "3" : "4"}
              placeholder="Name: Your Name
Email: your.email@example.com
Phone: (123) 456-7890"
              value={userDescription}
              onChange={(e) => setUserDescription(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Job Description (Your Complete Resume Will Be Created From This!)
            </label>
            <div className="text-xs text-gray-400 mb-2">
              <p>
                Paste the complete job description - we'll create a
                professionally formatted resume with all standard sections:
              </p>
              <ul className="list-disc ml-5 mt-1 space-y-0.5">
                <li>Professional Summary</li>
                <li>Skills (Technical & Soft)</li>
                <li>Work Experience</li>
                <li>Projects</li>
                <li>Education</li>
                <li>Certifications</li>
                <li>Achievements</li>
                <li>Languages (if applicable)</li>
              </ul>
            </div>
            <div className="mb-2 flex flex-wrap gap-3">
              <button
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                onClick={() =>
                  setJobDescription(`Senior Frontend Developer

We are looking for an experienced Senior Frontend Developer to join our dynamic team. In this role, you will be responsible for building high-quality user interfaces and interactive web applications using modern JavaScript frameworks, particularly React.

Responsibilities:
- Develop and maintain responsive, cross-browser compatible web applications
- Write clean, efficient, and reusable code
- Implement UI designs with pixel-perfect precision
- Optimize applications for maximum speed and scalability
- Collaborate with backend developers to integrate frontend code with server-side logic
- Participate in code reviews and mentor junior developers

Requirements:
- 5+ years of experience in frontend development
- Advanced knowledge of JavaScript, HTML, and CSS
- 3+ years of experience with React
- Experience with state management solutions (Redux, MobX, etc.)
- Familiarity with modern frontend build tools (Webpack, Babel, etc.)
- Understanding of RESTful APIs and HTTP protocols
- Experience with testing frameworks (Jest, Cypress, etc.)
- Strong problem-solving skills and attention to detail

Nice to have:
- Experience with TypeScript
- Knowledge of server-side rendering
- Experience with Next.js or similar frameworks
- Understanding of CI/CD processes
- Knowledge of containerization technologies (Docker)

We offer a competitive salary, remote work options, health benefits, and a collaborative work environment focused on continuous learning and professional growth.`)
                }
              >
                Load Sample Job Description
              </button>
              
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <FaUpload className="text-xs" /> Upload Job Description (.txt)
                </button>
              </div>
              
              {uploadedFileName && (
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <FaFile className="text-xs" /> {uploadedFileName}
                  <button
                    onClick={() => {
                      setUploadedFileName("");
                      setJobDescription("");
                    }}
                    className="ml-2 text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            
            <textarea
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              rows={isInIframe ? "8" : "10"}
              placeholder="Paste the job description here or upload a .txt file..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-center">
            <button
              className={`px-6 py-3 flex items-center space-x-2 ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white rounded-lg transition duration-300`}
              onClick={generateTailoredResumeHandler}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  <span>Generate My Complete Professional Resume</span>
                </>
              )}
            </button>
          </div>

          {!isInIframe && (
            <div className="mt-6 text-gray-400 text-sm">
              <p className="mb-2">Tips for best results:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Just provide your basic contact information - name, email, and
                  phone
                </li>
                <li>
                  Paste the <strong>complete</strong> job description or upload a .txt file
                  containing all requirements and responsibilities
                </li>
                <li>
                  The more detailed the job description, the more tailored your
                  resume will be
                </li>
                <li>
                  Your resume will include all standard sections automatically
                  formatted in a modern layout
                </li>
                <li>
                  Review and download your AI-generated resume - ready to apply!
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Your Tailored Resume
              </h2>
              <p className="text-gray-300 text-sm mt-1">
                Your resume is ready! Use the buttons below the resume to
                download it as a PDF or print it directly.
              </p>
            </div>
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
              onClick={() => setShowResume(false)}
            >
              Back to Editor
            </button>
          </div>
          {data && <Resume data={data} />}
        </div>
      )}
    </div>
  );
};

export default GenerateResumeTailoredNew;
