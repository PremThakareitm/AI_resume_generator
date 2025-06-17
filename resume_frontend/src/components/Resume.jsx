import React, { useRef, useState } from "react";
import "daisyui/dist/full.css";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { useReactToPrint } from "react-to-print";
import { sendResumeToWhatsApp } from "../api/ResumeService";

const Resume = ({ data }) => {
  const resumeRef = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Helper function to safely access data regardless of structure
  const resumeData = data?.data || data || {};

  // Helper to safely get personal information
  const getPersonalInfo = (field, defaultValue = "") => {
    return resumeData?.personalInformation?.[field] || defaultValue;
  };

  // Helper to safely get skills
  const getSkills = () => {
    return resumeData?.skills || [];
  };

  // Helper to safely get experiences
  const getExperiences = () => {
    return resumeData?.experience || [];
  };

  // Helper to safely get education
  const getEducation = () => {
    return resumeData?.education || [];
  };

  // Helper to safely get certifications
  const getCertifications = () => {
    return resumeData?.certifications || [];
  };

  // Helper to safely get projects
  const getProjects = () => {
    return resumeData?.projects || [];
  };

  // Helper to safely get achievements
  const getAchievements = () => {
    return resumeData?.achievements || [];
  };

  // Helper to safely get summary
  const getSummary = () => {
    return resumeData?.summary || "";
  };

  // Helper to safely get languages
  const getLanguages = () => {
    return resumeData?.languages || [];
  };

  const handleDownloadPdf = () => {
    const resumeData = data?.data || data;
    const fullName = resumeData?.personalInformation?.fullName || "Resume";

    toPng(resumeRef.current, { quality: 1.0 })
      .then((dataUrl) => {
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(dataUrl, "PNG", 10, 10, 190, 0);
        pdf.save(`${fullName}.pdf`);
      })
      .catch((err) => {
        console.error("Error generating PDF", err);
      });
  };

  const handlePrint = useReactToPrint({
    content: () => resumeRef.current,
    documentTitle: `${getPersonalInfo("fullName", "Resume")}_Resume`,
  });

  const handleWhatsAppClick = () => {
    setShowWhatsAppModal(true);
  };

  const handleSendToWhatsApp = async () => {
    // Validate phone number format (should start with + and have at least 8 digits)
    const phoneRegex = /^\+[0-9]{8,}$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      setStatusMessage(
        "Please enter a valid phone number with country code (e.g., +14155552671)"
      );
      return;
    }

    setIsLoading(true);
    setStatusMessage("Sending your resume to WhatsApp...");

    try {
      console.log("Starting WhatsApp send process...");
      // Create a formatted version of the resume data for WhatsApp
      const resumeText = formatResumeForWhatsApp();
      console.log("Formatted resume text length:", resumeText.length);
      console.log("Phone number:", phoneNumber);

      // Log detailed info before making the request
      console.log("Sending request to API...");
      const response = await sendResumeToWhatsApp(phoneNumber, resumeText);
      console.log("API Response:", response);

      if (response.success) {
        console.log("WhatsApp message sent successfully!");

        // Check if we're in demo mode
        const isDemoMode = response.isDemoMode === true;

        if (isDemoMode) {
          setStatusMessage(
            "Demo mode: WhatsApp integration configured successfully! 🎉\n" +
              "To receive actual messages, please set up Twilio credentials in the backend."
          );
        } else {
          setStatusMessage("Resume sent successfully to your WhatsApp! 🎉");
        }

        // Use a longer timeout to give the user more time to read the success message
        setTimeout(() => {
          setShowWhatsAppModal(false);
          setStatusMessage("");
          setPhoneNumber("");
        }, 5000);
      } else {
        console.log("WhatsApp send failed:", response);
        setStatusMessage(
          "Failed to send: " +
            (response.message ||
              "Unknown error. Check your phone number and try again.")
        );
      }
    } catch (error) {
      console.error("Error sending resume to WhatsApp:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        response: error.response
          ? {
              status: error.response.status,
              data: error.response.data,
            }
          : "No response",
      });

      // More detailed error message
      if (error.message && error.message.includes("Network Error")) {
        setStatusMessage(
          "Network error. Please check your internet connection and try again."
        );
      } else {
        setStatusMessage(
          "Error sending resume. Please check your phone number format and try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Format resume data for WhatsApp text message
  const formatResumeForWhatsApp = () => {
    const fullName = getPersonalInfo("fullName", "");
    let text = `*${fullName}*\n`;

    if (getPersonalInfo("email"))
      text += `Email: ${getPersonalInfo("email")}\n`;
    if (getPersonalInfo("phoneNumber"))
      text += `Phone: ${getPersonalInfo("phoneNumber")}\n`;
    if (getPersonalInfo("location"))
      text += `Location: ${getPersonalInfo("location")}\n\n`;

    if (getSummary()) {
      text += `*SUMMARY*\n${getSummary()}\n\n`;
    }

    if (getExperiences().length > 0) {
      text += `*EXPERIENCE*\n`;
      getExperiences().forEach((exp) => {
        text += `${exp.company} - ${exp.jobTitle} (${exp.duration})\n`;
        if (Array.isArray(exp.responsibilities)) {
          exp.responsibilities.forEach((resp, i) => {
            text += `- ${resp}\n`;
          });
        } else {
          text += `- ${exp.responsibility || exp.responsibilities}\n`;
        }
        text += "\n";
      });
    }

    if (getEducation().length > 0) {
      text += `*EDUCATION*\n`;
      getEducation().forEach((edu) => {
        text += `${edu.degree} - ${edu.institution} (${edu.year})\n`;
      });
      text += "\n";
    }

    if (getSkills().length > 0) {
      text += `*SKILLS*\n${getSkills().join(", ")}\n\n`;
    }

    return text;
  };

  // Get the job title directly from the first experience entry or use a default
  const jobTitle = getExperiences()[0]?.jobTitle || "Professional";

  return (
    <>
      <div
        ref={resumeRef}
        className="max-w-4xl mx-auto p-8 bg-white text-black border border-gray-200"
        style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.4" }}
      >
        {/* Header Section - Minimalist design with job title next to name */}
        <div className="mb-5 pb-2 border-b border-gray-300">
          <h1 className="text-2xl font-bold text-center">
            {getPersonalInfo("fullName", "Your Name")}
          </h1>

          <div className="flex justify-center flex-wrap text-sm mt-2">
            {getPersonalInfo("location") && (
              <span>{getPersonalInfo("location")}</span>
            )}
            {getPersonalInfo("phoneNumber") && (
              <>
                {getPersonalInfo("location") && <span className="mx-1">|</span>}
                <span>{getPersonalInfo("phoneNumber")}</span>
              </>
            )}
            {getPersonalInfo("email") && (
              <>
                {(getPersonalInfo("location") ||
                  getPersonalInfo("phoneNumber")) && (
                  <span className="mx-1">|</span>
                )}
                <a
                  href={`mailto:${getPersonalInfo("email")}`}
                  className="text-blue-600 hover:underline"
                >
                  {getPersonalInfo("email")}
                </a>
              </>
            )}
            {getPersonalInfo("linkedIn") && (
              <>
                <span className="mx-1">|</span>
                <a
                  href={
                    getPersonalInfo("linkedIn").startsWith("http")
                      ? getPersonalInfo("linkedIn")
                      : `https://${getPersonalInfo("linkedIn")}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  LinkedIn
                </a>
              </>
            )}
            {getPersonalInfo("portfolio") && (
              <>
                <span className="mx-1">|</span>
                <a
                  href={
                    getPersonalInfo("portfolio").startsWith("http")
                      ? getPersonalInfo("portfolio")
                      : `https://${getPersonalInfo("portfolio")}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {getPersonalInfo("portfolio").includes("github")
                    ? "GitHub"
                    : "Portfolio"}
                </a>
              </>
            )}
          </div>
        </div>

        {/* SUMMARY - Only show if available */}
        {getSummary() && (
          <div className="mb-4">
            <h2 className="text-base font-bold uppercase mb-2">Summary</h2>
            <p className="text-sm">{getSummary()}</p>
          </div>
        )}

        {/* WORK EXPERIENCE - Bold uppercase header */}
        {getExperiences().length > 0 && (
          <div className="mb-4">
            <h2 className="text-base font-bold uppercase mb-2">
              Work Experience
            </h2>

            {getExperiences().map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="grid grid-cols-4">
                  <div className="col-span-2">
                    <div className="font-bold">{exp.company}</div>
                    <div className="italic">{exp.jobTitle}</div>
                  </div>
                  <div className="col-span-2 text-right">
                    <div>{exp.location}</div>
                    <div className="italic">{exp.duration}</div>
                  </div>
                </div>
                <ul className="list-disc ml-5 mt-2">
                  {Array.isArray(exp.responsibilities) ? (
                    exp.responsibilities.map((resp, i) => (
                      <li key={i} className="text-sm mb-1">
                        {resp}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm">
                      {exp.responsibility || exp.responsibilities}
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* PROJECTS - Only show if available */}
        {getProjects().length > 0 && (
          <div className="mb-4">
            <h2 className="text-base font-bold uppercase mb-2">Projects</h2>
            {getProjects().map((project, index) => (
              <div key={index} className="mb-3">
                <div className="font-bold">
                  {project.title}
                  {project.link && (
                    <a
                      href={
                        project.link.startsWith("http")
                          ? project.link
                          : `https://${project.link}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline ml-2"
                    >
                      [Link]
                    </a>
                  )}
                </div>
                <p className="text-sm mt-1">{project.description}</p>
                {project.technologiesUsed &&
                  project.technologiesUsed.length > 0 && (
                    <p className="text-sm italic mt-1">
                      Technologies: {project.technologiesUsed.join(", ")}
                    </p>
                  )}
              </div>
            ))}
          </div>
        )}

        {/* LEADERSHIP EXPERIENCE - Only show if available */}
        {getAchievements().length > 0 && (
          <div className="mb-4">
            <h2 className="text-base font-bold uppercase mb-2">
              Leadership & Achievements
            </h2>
            <ul className="list-disc pl-5">
              {getAchievements().map((ach, index) => (
                <li key={index} className="mb-2">
                  {ach.achievement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* EDUCATION */}
        {getEducation().length > 0 && (
          <div className="mb-4">
            <h2 className="text-base font-bold uppercase mb-2">Education</h2>

            {getEducation().map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="grid grid-cols-4">
                  <div className="col-span-2">
                    <div className="font-bold">{edu.university}</div>
                    <div className="italic">{edu.degree}</div>
                    {edu.gpa && <div className="text-sm">GPA: {edu.gpa}</div>}
                  </div>
                  <div className="col-span-2 text-right">
                    {edu.location && <div>{edu.location}</div>}
                    <div>{edu.graduationYear}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SKILLS */}
        {getSkills().length > 0 && (
          <div className="mb-4">
            <h2 className="text-base font-bold uppercase mb-2">Skills</h2>

            <div className="text-sm">
              {getSkills()
                .map((skill) => skill.title)
                .join(" | ")}
            </div>
          </div>
        )}

        {/* Certifications - Only show if available */}
        {getCertifications().length > 0 && (
          <div className="mb-4">
            <h2 className="text-base font-bold uppercase mb-2">
              Certifications
            </h2>
            <ul className="list-disc ml-5">
              {getCertifications().map((cert, index) => (
                <li key={index} className="text-sm">
                  <span className="font-medium">{cert.title}</span>
                  {cert.issuingOrganization && (
                    <> - {cert.issuingOrganization}</>
                  )}
                  {cert.year && <>, {cert.year}</>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages - Only show if available */}
        {getLanguages().length > 0 && (
          <div className="mb-4">
            <h2 className="text-base font-bold uppercase mb-2">Languages</h2>
            <div className="text-sm">
              {getLanguages().map((lang, index) => (
                <span key={index}>
                  {lang.language} ({lang.proficiency})
                  {index < getLanguages().length - 1 ? " | " : ""}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <section className="flex justify-center mt-6 gap-4">
        <button
          onClick={handleDownloadPdf}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download PDF
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print Resume
        </button>
        <button
          onClick={handleWhatsAppClick}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="white"
            className="mr-2"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          Send to WhatsApp
        </button>
      </section>

      {/* WhatsApp Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
            <div className="flex items-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#25D366"
                className="mr-3"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <h3 className="text-xl font-bold">Send Resume to WhatsApp</h3>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your WhatsApp number:
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1234567890"
                className="w-full border border-gray-300 rounded-md p-3 transition-all focus:border-green-500 focus:ring focus:ring-green-200 focus:outline-none"
                disabled={isLoading}
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">
                Format: +[country code][number] (e.g., +14155552671)
              </p>
            </div>
            {statusMessage && (
              <div
                className={`mb-5 p-3 rounded-md ${
                  statusMessage.includes("success")
                    ? "bg-green-50"
                    : "bg-red-50"
                }`}
              >
                <p
                  className={`text-sm ${
                    statusMessage.includes("success")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {statusMessage.includes("success") ? (
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {statusMessage}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      {statusMessage}
                    </span>
                  )}
                </p>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all focus:outline-none focus:ring focus:ring-gray-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSendToWhatsApp}
                className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-all focus:outline-none focus:ring focus:ring-green-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    Sending...
                  </span>
                ) : (
                  "Send to WhatsApp"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Resume;
