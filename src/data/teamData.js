// Team and Association Data Configuration
// Update this file with your actual team information and association details

export const teamMembers = [
  {
    id: 1,
    name: "Waqas Behzad",
    role: "Business Strategy specialist ",
    linkedinUrl: "https://www.linkedin.com/in/waqas-behzad-83b927216?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", // Replace with actual LinkedIn URL
    photoUrl: "./ScaleIoT-webpage/Picture1.png", // Repository-specific path
    showPhoto: true, // Set to false if no photo should be displayed
    expertiseTags: ["Business Strategy", "Tech", "Management"],
  },
  {
    id: 2,
    name: "Asiyil Khalid",
    role: "Systems Engineer",
    linkedinUrl: "https://www.linkedin.com/in/asiyil-alaswad-811842348?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", // Replace with actual LinkedIn URL
    photoUrl: "./ScaleIoT-webpage/Picture2.png", // Repository-specific path
    showPhoto: true, // Important: set to false for members without photos
    expertiseTags: ["IoT Systems", "App Development", "Network Architecture"],
  }
  // Add more team members as needed
  // Copy the structure above and update the information
];

export const associations = [
  {
    name: "UHUB",
    siteUrl: "https://uhub.ae", // Replace with actual website URL
    logoSvg: "./ScaleIoT-webpage/uhub.webp", // Repository-specific path
    alt: "UHUB Innovation Hub logo" // Accessible alt text
  },
  {
    name: "UDST",
    siteUrl: "https://udst.edu.qa", // Replace with actual website URL
    logoSvg: "./ScaleIoT-webpage/uni.png", // Repository-specific path
    alt: "University of Doha for Science and Technology logo" // Accessible alt text
  }
  // Add more associations as needed
  // Copy the structure above and update the information
];

// Content Configuration
export const contentConfig = {
  sectionEyebrow: "About the Team",
  mainHeading: "The People Behind ScaleIoT",
  subheading: "A hands-on team of engineers, designers, and operators, backed by trusted associations.",
  associationsHeading: "Associations",
  associationsDisclaimer: "Logos shown to indicate institutional associations; no legal partnership is implied.",
  linkedinText: "View Profile",
  bioToggleText: {
    showMore: "Show more",
    showLess: "Show less"
  }
};

// Notes for Implementation:
// 1. Replace all placeholder URLs with actual LinkedIn profiles
// 2. Add actual team photos to /public/team/ directory
// 3. Add actual association logos to /public/logos/ directory
// 4. Update team member information with real data
// 5. Verify all LinkedIn URLs are valid and accessible
// 6. Ensure photos are high-quality and properly sized (recommended: 600x600px minimum)
// 7. Use SVG logos when possible for crisp display at all sizes
