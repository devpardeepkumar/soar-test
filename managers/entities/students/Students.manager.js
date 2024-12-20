module.exports = class Students {
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
    this.usersCollection = this.mongomodels.Students;
    this.httpExposed = [
      "createStudents",
      "updateStudent",
      "getStudentById",
      "deleteStudent",
      "getAllStudents",
    ];
  }

  async createStudents({
    __longToken,
    schoolid,
    name,
    lastname,
    email,
    dateofbirth,
    gender,
    enrollmentdate,
    classid,
  }) {
    const hasAccess =
      __longToken?.scopes.includes("admin") ||
      __longToken?.scopes.includes("student_write");
    if (!hasAccess) {
      return { errors: "Unauthorized: Insufficient permissions" };
    }

    const userId = __longToken?.userId;
    const req = {
      schoolid,
      name,
      lastname,
      email,
      dateofbirth,
      gender,
      enrollmentdate,
      classid,
      createdBy: userId,
    };
    let result = await this.validators.student.createStudents(req);
    if (result) return result;
    const existingStudent = await this.usersCollection.findOne({
      $and: [{ email }, { schoolid }],
    });
    if (existingStudent) {
      return { errors: "Email already exists" };
    }
    const newStd = await this.usersCollection.create(req);
    return {
      message: "Student is created successfully.",
      data: newStd,
    };
  }

  async updateStudent({
    __longToken,
    id,
    schoolid,
    name,
    lastname,
    email,
    dateofbirth,
    gender,
    enrollmentdate,
    classid,
  }) {
    const hasAccess =
      __longToken?.scopes.includes("admin") ||
      __longToken?.scopes.includes("student_write");
    if (!hasAccess) {
      return { errors: "Unauthorized: Insufficient permissions" };
    }

    const userId = __longToken?.userId;
    const req = {
      id,
      schoolid,
      name,
      lastname,
      email,
      dateofbirth,
      gender,
      enrollmentdate,
      classid,
      updatedBy: userId,
    };
    let result = await this.validators.student.selectStudents(req);
    if (result) return result;

    const std = await this.usersCollection.findOne({ _id: id });
    if (!std) {
      return { errors: "Student not found" };
    }
    if (email) {
      const existingName = await this.usersCollection.findOne({
        $and: [{ email }, { schoolid: std.schoolid }, { _id: { $ne: id } }],
      });
      if (existingName) {
        return { errors: "Name already exists." };
      }
    }
    const updatedStd = await this.usersCollection.findByIdAndUpdate(id, req, {
      new: true,
      runValidators: true,
    });
    if (!updatedStd) {
      return { errors: "Student not found" };
    }
    return {
      message: "Student is updated successfully.",
      data: updatedStd,
    };
  }

  async getStudentById({ __longToken, id }) {
    const hasAccess =
      __longToken?.scopes.includes("admin") ||
      __longToken?.scopes.includes("student_read");
    if (!hasAccess) {
      return { errors: "Unauthorized: Insufficient permissions" };
    }
    let result = await this.validators.student.selectStudents({ id });
    if (result) return result;
    const std = await this.usersCollection.findById(id);
    if (!std) {
      return { errors: "Student not found" };
    }
    return {
      data: std,
    };
  }

  async deleteStudent({ __longToken, id }) {
    const hasAccess =
      __longToken?.scopes.includes("admin") ||
      __longToken?.scopes.includes("student_write");
    if (!hasAccess) {
      return { errors: "Unauthorized: Insufficient permissions" };
    }
    let result = await this.validators.student.selectStudents({ id });
    if (result) return result;

    const deletedstudent = await this.usersCollection.findByIdAndDelete(id);
    if (!deletedstudent) {
      return { errors: "Student not found" };
    }
    return {
      message: "Student is deleted successfully.",
      data: deletedstudent,
    };
  }

  async getAllStudents({
    __longToken,
    page,
    limit,
    search,
    classid,
    schoolid,
  }) {
    const hasAccess =
      __longToken?.scopes.includes("admin") ||
      __longToken?.scopes.includes("student_read");
    if (!hasAccess) {
      return { errors: "Unauthorized: Insufficient permissions" };
    }
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const searchCriteria = {
      ...(schoolid && { schoolid }),
      ...(classid && { classid }),
      ...(search && {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      }),
    };
    const totalstd = await this.usersCollection.countDocuments(searchCriteria);
    const stds = await this.usersCollection
      .find(searchCriteria)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ createdAt: -1 });
    return {
      data: stds,
      pagination: {
        total: totalstd,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalstd / limitNumber),
      },
    };
  }
};
