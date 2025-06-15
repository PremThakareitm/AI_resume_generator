import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GenerateResumeTailoredNew from "./pages/GenerateResumeTailoredNew";
import { Toaster } from "react-hot-toast";
import ResumeLandingPage from "./pages/ResumeLandingPage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<ResumeLandingPage />} />
        <Route
          path="generate-tailored-resume"
          element={<GenerateResumeTailoredNew />}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
