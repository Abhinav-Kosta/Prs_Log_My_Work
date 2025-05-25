const mongoose = require("mongoose");
const initData = require("./demoData.js");
const User = require("../models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/faculty2";

// const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("DB connected successfully");
        init();
    })
    .catch((err) => {
        console.log(err);
    })

async function main(){
    // await mongoose.connect(dbUrl);
    await mongoose.connect(MONGO_URL);
}

const init = async () => {
    await User.deleteMany({});
    console.log("Old users removed.");
  
    for (let user of initData) {
      const { facultyId, username, role, password, department, school } = user;

      const newUserData = { facultyId, username, role };
      if (role !== "admin") {
        newUserData.school = school; // Add school for non-admin users
        if (role === "faculty") {
          newUserData.department = department; // Department only for faculty
        }
      }

      const newUser = new User(newUserData);

      try {
        await User.register(newUser, password);
        console.log(`${facultyId} created`);
      } catch (error) {
        console.error(`Error creating ${facultyId}:`, error);
      }
    }
  
    console.log("Users initialized successfully.");
    mongoose.connection.close();
};