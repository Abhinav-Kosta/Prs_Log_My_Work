module.exports = [
  {
    facultyId: "admin001",
    username: "admin001",
    role: "admin",
    password: "admin123"
    // No department needed
  },
  {
    facultyId: "hoi001",
    username: "hoi001",
    role: "hoi",
    department: "Computer Science",
    password: "hoi123"
  },
  {
    facultyId: "hoi002",
    username: "hoi002",
    role: "hoi",
    department: "Information Technology",
    password: "hoi123"
  },
  // 10 faculty
  ...Array.from({ length: 10 }, (_, i) => ({
    facultyId: `fac${(i + 1).toString().padStart(3, '0')}`,
    username: `fac${(i + 1).toString().padStart(3, '0')}`,
    role: "faculty",
    department: i < 5 ? "Computer Science" : "Information Technology", // or any distribution logic
    password: "faculty123"
  }))
];