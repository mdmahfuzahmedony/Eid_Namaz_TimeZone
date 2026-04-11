"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // ডিফোল্ট ইমেজ
  const [bgImage, setBgImage] = useState("/hero-bg.jpg");

  // লোড করার সময় লোকাল স্টোরেজ থেকে থিম চেক করা
  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme-bg");
    if (savedTheme) setBgImage(savedTheme);
  }, []);

  // থিম সেভ করা
  const changeTheme = (imgUrl: string) => {
    setBgImage(imgUrl);
    localStorage.setItem("app-theme-bg", imgUrl);
  };

  return (
    <ThemeContext.Provider value={{ bgImage, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);