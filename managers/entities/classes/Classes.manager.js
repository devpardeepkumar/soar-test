module.exports = class Classrooms {
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
    this.usersCollection = this.mongomodels.Classes;
    this.httpExposed = [
      "createClass",
      "updateClass",
      "getClassById",
      "deleteClass",
      "getAllClassess",
    ];
  }

  async createClass({ __longToken, schoolid, capacity, resources, name }) {
    const hasAccess =
      __longToken?.scopes.includes("admin") ||
      __longToken?.scopes.includes("class_write");
    if (!hasAccess) {
      return { errors: "Unauthorized: Insufficient permissions" };
    }

    const userId = __longToken?.userId;
    const req = { schoolid, capacity, resources, name, createdBy: userId };
    let result = await this.validators.class.createClass(req);
    if (result) return result;
    const existingClassroom = await this.usersCollection.findOne({
      name,
    });
    if (existingClassroom) {
      return { errors: "Classroom name already exists" };
    }
    const newClass = await this.usersCollection.create(req);
    return {
      message: "Classrooms is created successfully.",
      data: newClass,
    };
  }

  async updateClass({ __longToken, id, capacity, resources, name }) {
    const hasAccess =
      __longToken?.scopes.includes("admin") ||
      __longToken?.scopes.includes("class_write");
    if (!hasAccess) {
      return { errors: "Unauthorized: Insufficient permissions" };
    }

    const userId = __longToken?.userId;
    const req = { id, name, capacity, resources, name, updatedBy: userId };
    let result = await this.validators.class.selectClass(req);
    if (result) return result;

    const classroom = await this.usersCollection.findOne({ _id: id });
    if (!classroom) {
      return { errors: "Classroom not found" };
    }
    if (name) {
      const existingName = await this.usersCollection.findOne({
        $and: [
          { name },
          { schoolid: classroom.schoolid },
          { _id: { $ne: id } },
        ],
      });
      if (existingName) {
        return { errors: "Name already exists." };
      }
    }
    const updatedClass = await this.usersCollection.findByIdAndUpdate(id, req, {
      new: true,
      runValidators: true,
    });
    if (!updatedClass) {
      return { errors: "Class not found" };
    }
    return {
      message: "Class is updated successfully.",
      data: updatedClass,
    };
  }

  async getClassById({ __longToken, id }) {
    const hasAccess =
      __longToken?.scopes.includes("admin") ||
      __longToken?.scopes.includes("class_read");
    if (!hasAccess) {
      return { errors: "Unauthorized: Insufficient permissions" };
    }
    let result = await this.validators.class.selectClass({ id });
    if (result) return result;
    const classrooms = await this.usersCollection.findById(id);
    if (!classrooms) {
      return { errors: "Class not found" };
    }
    return {
      data: classrooms,
    };
  }

  async deleteClass({ __longToken, id }) {
    const hasAccess =
      __longToken?.scopes.includes("admin") ||
      __longToken?.scopes.includes("class_write");
    if (!hasAccess) {
      return { errors: "Unauthorized: Insufficient permissions" };
    }
    let result = await this.validators.class.selectClass({ id });
    if (result) return result;
    const deletedclassrooms = await this.usersCollection.findByIdAndDelete(id);
    if (!deletedclassrooms) {
      return { errors: "Class not found" };
    }
    return {
      message: "Class is deleted successfully.",
      data: deletedclassrooms,
    };
  }

  async getAllClassess({ __longToken, page, limit, search, schoolid }) {
    const hasAccess =
      __longToken?.scopes.includes("admin") ||
      __longToken?.scopes.includes("class_read");
    if (!hasAccess) {
      return { errors: "Unauthorized: Insufficient permissions" };
    }
  
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const searchCriteria = {
      ...(schoolid && { schoolid }),
      ...(search && { name: { $regex: search, $options: "i" } }),
    };
    const totalClass = await this.usersCollection.countDocuments(
      searchCriteria
    );
    const classess = await this.usersCollection
      .find(searchCriteria)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ createdAt: -1 });
    return {
      data: classess,
      pagination: {
        total: totalClass,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalClass / limitNumber),
      },
    };
  }
};
