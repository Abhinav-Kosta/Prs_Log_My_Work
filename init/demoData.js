module.exports = [
  {
    facultyId: "admin001",
    username: "admin001",
    role: "admin",
    password: "admin123"
  },
  {
    facultyId: "hoi001",
    username: "hoi001",
    role: "hoi",
    password: "hoi123"
  },
  {
    facultyId: "hoi002",
    username: "hoi002",
    role: "hoi",
    password: "hoi123"
  },
  // 10 faculty
  ...Array.from({ length: 10 }, (_, i) => ({
    facultyId: `fac${(i + 1).toString().padStart(3, '0')}`,
    username: `fac${(i + 1).toString().padStart(3, '0')}`,
    role: "faculty",
    password: "faculty123"
  }))
];