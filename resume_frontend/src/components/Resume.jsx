import React, { useRef } from "react";
import "daisyui/dist/full.css";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { useReactToPrint } from "react-to-print";

const Resume = ({ data }) => {
  const resumeRef = useRef(null);

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
            {getPersonalInfo("fullName", "Your Name")}{" "}
            <span className="font-normal">[{jobTitle}]</span>
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
            {getAchievements().map((ach, index) => (
              <div key={index} className="mb-3">
                <div className="grid grid-cols-4">
                  <div className="col-span-3">
                    <div className="font-bold">{ach.title}</div>
                  </div>
                  <div className="col-span-1 text-right">
                    <div className="italic">{ach.year}</div>
                  </div>
                </div>
                {ach.extraInformation && (
                  <p className="text-sm mt-1">{ach.extraInformation}</p>
                )}
              </div>
            ))}
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
        <button onClick={handleDownloadPdf} className="btn btn-primary">
          Download PDF
        </button>
        <button onClick={handlePrint} className="btn btn-secondary">
          Print Resume
        </button>
      </section>
    </>
  );
};

export default Resume;
