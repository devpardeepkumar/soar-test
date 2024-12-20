module.exports = class User {
  constructor({
    utils,
    cache,
    config,
    mwsRepo,
    cortex,
    managers,
    validators,
    mongomodels,
  } = {}) {
    this.config = config;
    this.cortex = cortex;
    this.mwsRepo = mwsRepo;
    this.validators = validators;
    this.mongomodels = mongomodels;
    this.tokenManager = managers.token;
    this.usersCollection = this.mongomodels.User;
    this.httpExposed = ["createUser","checkingdevops"];
  }
  async createUser({ username, email, password,role,scopes=[] }) {
    const user = { username, email, password };
    let result = await this.validators.user.createUser(user);
    if (result) return result;
    const existingUser = await this.usersCollection.findOne({ username });
    if (existingUser) {
      return { error: "Username already in use" };
    }

    if (role === "admin") {
      scopes = ["admin"];
    } else if (role === "school-administrator") {
      scopes = [
        "school_read","school_write","class_read","class_write","student_read","student_write"
      ];
    }
    const newUser = await this.usersCollection.create({
      username,
      email,
      password,
      role,
      scopes
    });
    const longToken = this.tokenManager.genLongToken({
      userId: newUser._id,
      role:newUser.role,
      scopes:newUser.scopes,
      userKey: newUser.key,
    });
    return {
      user: newUser,
      longToken,
    };
  }
  async checkingdevops() {
    return {
      user: 'newUser',
      message:'testing API',
    };
  }
};




    // "pardeep": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzY1M2NjYjA3ZjJiZDUyMGMzN2MwZWYiLCJyb2xlIjoiYWRtaW4iLCJzY29wZXMiOlsiYWRtaW4iXSwiaWF0IjoxNzM0Njg3OTQ3LCJleHAiOjE4MjkzNjA3NDd9.WVtzjj5RqvRI5XzucYXRzljkH77Q0GOQPGX9De1u_18"
    // "abhishek": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzY1M2QzYTA3ZjJiZDUyMGMzN2MwZjIiLCJyb2xlIjoic2Nob29sLWFkbWluaXN0cmF0b3IiLCJzY29wZXMiOlsic2Nob29sX3JlYWQiLCJzY2hvb2xfd3JpdGUiLCJjbGFzc19yZWFkIiwiY2xhc3Nfd3JpdGUiLCJzdHVkZW50X3JlYWQiLCJzdHVkZW50X3dyaXRlIl0sImlhdCI6MTczNDY4ODA1OCwiZXhwIjoxODI5MzYwODU4fQ.8_mel6f7hTVZLMQwybUP0WyNfprLf0g56Dg25LTzEp8"
    //  "safvan":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzY1M2Q2MjA3ZjJiZDUyMGMzN2MwZjUiLCJyb2xlIjoic3RhZmYiLCJzY29wZXMiOltdLCJpYXQiOjE3MzQ2ODgwOTgsImV4cCI6MTgyOTM2MDg5OH0.VQEsaXZDl_bfVWcO2Mmgep3qRPulslW8MB4Uc6bxWyM"