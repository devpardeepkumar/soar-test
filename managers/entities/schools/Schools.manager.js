module.exports = class Schools {
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
    this.usersCollection = this.mongomodels.Schools;
    this.httpExposed = [
      "createSchool",
      "updateSchool",
      "deleteSchool",
      "getSchoolById",
      "getAllSchool",
    ];
  }

  async createSchool({
    __longToken,
    name,
    address,
    email,
    shortDesc,
    longDesc,
    website,
    phone,
  }) {
    const hasAccess =
      __longToken?.scopes?.includes("admin") ||
      __longToken?.scopes?.includes("school_write");
    if (!hasAccess) {
      return { errors: "Unauthorized: Insufficient permissions" };
    }
    const userId = __longToken?.userId;
    const req = {
      name,
      address,
      email,
      shortDesc,
      longDesc,
      website,
      phone,
      createdBy: userId,
    };
    let result = await this.validators.school.createSchool(req);
    if (result) return result;
    const existingEmail = await this.usersCollection.findOne({ email });
    if (existingEmail) {
      return { errors: "Email already exists." };
    }
    const newSchool = await this.usersCollection.create(req);
    return {
      message: "School is created successfully.",
      data: newSchool,
    };
  }

  async updateSchool({
    __longToken,
    id,
    name,
    address,
    email,
    shortDesc,
    longDesc,
    website,
    phone,
  }) {
    const hasAccess =
      __longToken?.scopes?.includes("admin") ||
      __longToken?.scopes?.includes("school_write");
    if (!hasAccess) {
      return { errors: "Unauthorized: Insufficient permissions" };
    }

    const userId = __longToken?.userId;
    const req = {
      id,
      name,
      address,
      email,
      shortDesc,
      longDesc,
      website,
      phone,
      updatedBy: userId,
    };
    let result = await this.validators.school.selectSchool(req);
    if (result) return result;
    if (name) {
      const existingName = await this.usersCollection.findOne({
        name,
        _id: { $ne: id },
      });
      if (existingName) {
        return { errors: "School name already exists." };
      }
    }
    if (email) {
      const existingEmail = await this.usersCollection.findOne({
        email,
        _id: { $ne: id },
      });
      if (existingEmail) {
        return { errors: "Email already exists." };
      }
    }
    const updatedSchool = await this.usersCollection.findByIdAndUpdate(
      { _id: id },
      req,
      { new: true }
    );
    if (!updatedSchool) {
      return { errors: "School not found" };
    }
    return {
      message: "School is updated successfully.",
      data: "updatedSchool",
    };
  }

  async getSchoolById({ __longToken, id }) {
    const hasAccess =
      __longToken?.scopes?.includes("admin") ||
      __longToken?.scopes?.includes("school_read");
    if (!hasAccess) {
      return { errors: "Unauthorized: Insufficient permissions" };
    }
    let result = await this.validators.school.selectSchool({ id });
    if (result) return result;

    const school = await this.usersCollection.findById(id);
    if (!school) {
      return { errors: "School not found" };
    }
    return {
      data: school,
    };
  }

  async deleteSchool({ __longToken, id }) {
    const hasAccess =
      __longToken?.scopes?.includes("admin") ||
      __longToken?.scopes?.includes("school_write");
    if (!hasAccess) {
      return { errors: "Unauthorized: Insufficient permissions" };
    }
    let result = await this.validators.school.selectSchool({ id });
    if (result) return result;
    const deletedSchool = await this.usersCollection.findByIdAndDelete(id);
    if (!deletedSchool) {
      return { errors: "School not found" };
    }
    return {
      message: "School is deleted successfully.",
      data: deletedSchool,
    };
  }

  async getAllSchool({ __longToken, page, limit, search }) {
    const hasAccess =
      __longToken?.scopes?.includes("admin") ||
      __longToken?.scopes?.includes("school_read");
    if (!hasAccess) {
      return { errors: "Unauthorized: Insufficient permissions" };
    }
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const searchCriteria = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { address: { $regex: search, $options: "i" } },
            { shortDesc: { $regex: search, $options: "i" } },
            { longDesc: { $regex: search, $options: "i" } },
            { website: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const totalSchools = await this.usersCollection.countDocuments(
      searchCriteria
    );
    const schools = await this.usersCollection
      .find(searchCriteria)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ createdAt: -1 });
    return {
      data: schools,
      pagination: {
        total: totalSchools,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalSchools / limitNumber),
      },
    };
  }
};
