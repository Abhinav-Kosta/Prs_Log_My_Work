module.exports = [
  {
    facultyId: "admin001",
    username: "admin001",
    role: "admin",
    password: "admin123"
    // No school or department needed for admin
  },
  {
    facultyId: "hoi001",
    username: "hoi001",
    role: "hoi",
    school: "ASET",
    department: "Computer Science", // Optional for HOI but included for example
    password: "hoi123"
  },
  {
    facultyId: "hoi002",
    username: "hoi002",
    role: "hoi",
    school: "ALS",
    password: "hoi123"
  },
  // Faculty members
  ...Array.from({ length: 10 }, (_, i) => {
    const school = "ASET";
    const department = i < 5 ? "Computer Science" : "Information Technology";
    
    return {
      facultyId: `fac${(i + 1).toString().padStart(3, '0')}`,
      username: `fac${(i + 1).toString().padStart(3, '0')}`,
      role: "faculty",
      school: school,
      department: department,
      password: "faculty123"
    };
  }),

  // ALS Faculty members
  ...Array.from({ length: 10 }, (_, i) => {
      const school = "ALS";
      const department = i < 5 ? "Civil Law" : "Criminal Law"; // Example ALS departments
      
      return {
          facultyId: `als${(i + 1).toString().padStart(3, '0')}`, // als prefix for ALS faculty
          username: `als${(i + 1).toString().padStart(3, '0')}`,
          role: "faculty",
          school: school,
          department: department,
          password: "faculty123"
      };
  })
];