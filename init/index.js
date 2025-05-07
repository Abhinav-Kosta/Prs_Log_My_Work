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
      const { facultyId, username ,role, password } = user;
      const newUser = new User({ facultyId, username, role });

      try {
        await User.register(newUser, password); // Make sure to call register with the `facultyId`
        console.log(`${facultyId} created`);
      } catch (error) {
        console.error(`Error creating ${facultyId}:`, error);
      } // hashes password properly
    }
  
    console.log("Users initialized successfully.");
    mongoose.connection.close();
  };