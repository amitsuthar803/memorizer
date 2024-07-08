"use strict";

// Function to toggle theme
const toggleTheme = function () {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";

  // Update theme attribute on <html> tag
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  // Update theme attribute on <body> tag if it's available
  if (document.body) {
    document.body.setAttribute("data-theme", newTheme);
  }

  // Update theme on other elements with data-theme attribute
  updateElementsTheme(newTheme);
};

// Function to update elements with data-theme attribute
const updateElementsTheme = function (theme) {
  // Update header elements
  const header = document.querySelector("header[data-sidebar]");
  if (header) {
    header.setAttribute("data-theme", theme);
  }

  // Update other elements as needed
  const otherElements = document.querySelectorAll("[data-theme]");
  otherElements.forEach((element) => {
    element.setAttribute("data-theme", theme);
  });
};

// Event listener for DOMContentLoaded to ensure the DOM is fully loaded
window.addEventListener("DOMContentLoaded", function () {
  // Retrieve stored theme or detect system theme
  const storedTheme = localStorage.getItem("theme");
  const systemThemeIsDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const initialTheme = storedTheme ?? (systemThemeIsDark ? "dark" : "light");

  // Set initial theme on <html> and <body> tags if available
  if (document.documentElement) {
    document.documentElement.setAttribute("data-theme", initialTheme);
  }

  if (document.body) {
    document.body.setAttribute("data-theme", initialTheme);
  }

  // Update elements with initial theme
  updateElementsTheme(initialTheme);

  // Event listener for theme button click
  const themeBtn = document.querySelector("[data-theme-btn]");
  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
  } else {
    console.error("Theme button not found.");
  }
});
