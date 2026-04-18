import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Interview from './pages/Interview';
import ResumeAnalyser from './pages/ResumeAnalyser';
import ExamPrep from './pages/ExamPrep';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="interview" element={<Interview />} />
          <Route path="resume" element={<ResumeAnalyser />} />
          <Route path="exam" element={<ExamPrep />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
