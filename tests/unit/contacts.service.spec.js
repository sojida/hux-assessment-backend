const { connect } = require("../database");
// const AuthService = require('../../services/auth.service');
const ContactService = require("../../services/contact.service");
const UserModel = require("../../models/users.model");
const ContactModel = require("../../models/contacts.model");

describe("Contact Service Test", () => {
  let connection;
  // before hook
  beforeAll(async () => {
    connection = await connect();
  });

  afterEach(async () => {
    await connection.cleanup();
  });

  // after hook
  afterAll(async () => {
    await connection.disconnect();
  });

  it("should not create user, duplicate", async () => {
    const user = await UserModel.create({
      name: "test",
      email: "test@example.com",
      password: "123456",
    });

    await ContactModel.create({
      firstName: "test",
      lastName: "user",
      phoneNumber: "90922345",
      countryCode: "+234",
      userId: user._id,
    });

    const response = await ContactService.CreateContact({
      firstName: "test",
      lastName: "user",
      phoneNumber: "90922345",
      countryCode: "+234",
      userId: user._id,
    });

    expect(response.code).toEqual(409);
    expect(response.success).toEqual(false);
    expect(response.message).toEqual("Contact already exist");
  });

  it("should create contact", async () => {
    const user = await UserModel.create({
      name: "test",
      email: "test@example.com",
      password: "123456",
    });

    await ContactModel.create({
      firstName: "test",
      lastName: "user",
      phoneNumber: "90922345234",
      countryCode: "+234",
      userId: user._id,
    });

    const response = await ContactService.CreateContact({
      firstName: "test",
      lastName: "user",
      phoneNumber: "90922345",
      countryCode: "+234",
      userId: user._id,
    });

    expect(response.code).toEqual(201);
    expect(response.success).toEqual(true);
    expect(response.message).toEqual("contact created successfully");
    expect(response.data).toHaveProperty("contact");
  });

  it("should get contacts", async () => {
    const user = await UserModel.create({
      name: "test",
      email: "test@example.com",
      password: "123456",
    });

    await ContactModel.create({
      firstName: "test",
      lastName: "user",
      phoneNumber: "90922345234",
      countryCode: "+234",
      userId: user._id,
    });

    await ContactModel.create({
      firstName: "test2",
      lastName: "user",
      phoneNumber: "9092234",
      countryCode: "+234",
      userId: user._id,
    });

    const response = await ContactService.GetContacts({ userId: user._id });

    expect(response.code).toEqual(200);
    expect(response.success).toEqual(true);
    expect(response.message).toEqual("contacts retrieved successfully");
    expect(response.data).toHaveProperty("contacts");
    expect(response.data).toHaveProperty("meta");
    expect(response.data.contacts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          firstName: "test",
          lastName: "user",
          phoneNumber: "90922345234",
          countryCode: "+234",
          userId: user._id,
        }),
        expect.objectContaining({
          firstName: "test2",
          lastName: "user",
          phoneNumber: "9092234",
          countryCode: "+234",
          userId: user._id,
        }),
      ])
    );
  });

  it("should get contact", async () => {
    const user = await UserModel.create({
      name: "test",
      email: "test@example.com",
      password: "123456",
    });

    await ContactModel.create({
      firstName: "test",
      lastName: "user",
      phoneNumber: "90922345234",
      countryCode: "+234",
      userId: user._id,
    });

    const contact = await ContactModel.create({
      firstName: "test2",
      lastName: "user",
      phoneNumber: "9092234",
      countryCode: "+234",
      userId: user._id,
    });

    const response = await ContactService.GetContact({
      userId: user._id,
      contactId: contact._id,
    });

    expect(response.code).toEqual(200);
    expect(response.success).toEqual(true);
    expect(response.message).toEqual("contact retrieved successfully");
    expect(response.data).toHaveProperty("contact");
    expect(response.data.contact).toEqual(
      expect.objectContaining({
        firstName: "test2",
        lastName: "user",
        phoneNumber: "9092234",
        countryCode: "+234",
        userId: user._id,
      })
    );
  });

  it("should not get contact", async () => {
    const user = await UserModel.create({
      name: "test",
      email: "test@example.com",
      password: "123456",
    });

    await ContactModel.create({
      firstName: "test",
      lastName: "user",
      phoneNumber: "90922345234",
      countryCode: "+234",
      userId: user._id,
    });

    await ContactModel.create({
      firstName: "test2",
      lastName: "user",
      phoneNumber: "9092234",
      countryCode: "+234",
      userId: user._id,
    });

    const response = await ContactService.GetContact({
      userId: user._id,
      contactId: 'invalid_id',
    });

    expect(response.code).toEqual(404);
    expect(response.success).toEqual(false);
    expect(response.message).toEqual("contact not found");
  });

  it("should not update contact", async () => {
    const user = await UserModel.create({
      name: "test",
      email: "test@example.com",
      password: "123456",
    });

    await ContactModel.create({
      firstName: "test",
      lastName: "user",
      phoneNumber: "90922345234",
      countryCode: "+234",
      userId: user._id,
    });

    await ContactModel.create({
      firstName: "test2",
      lastName: "user",
      phoneNumber: "9092234",
      countryCode: "+234",
      userId: user._id,
    });

    const response = await ContactService.UpdateContact({
      userId: user._id,
      contactId: 'invalid_id',
    });

    expect(response.code).toEqual(404);
    expect(response.success).toEqual(false);
    expect(response.message).toEqual("contact not found");
  });

  it("should update contact", async () => {
    const user = await UserModel.create({
      name: "test",
      email: "test@example.com",
      password: "123456",
    });

    await ContactModel.create({
      firstName: "test",
      lastName: "user",
      phoneNumber: "90922345234",
      countryCode: "+234",
      userId: user._id,
    });

    const contact = await ContactModel.create({
      firstName: "test2",
      lastName: "user",
      phoneNumber: "9092234",
      countryCode: "+234",
      userId: user._id,
    });

    const response = await ContactService.UpdateContact({
      userId: user._id,
      contactId: contact._id,
      firstName: 'new-test',
      lastName: 'new-user',
      phoneNumber: '09012345'
    });

    expect(response.code).toEqual(200);
    expect(response.success).toEqual(true);
    expect(response.message).toEqual("contact updated successfully");
    expect(response.data).toHaveProperty("contact");

    const newContact = await ContactModel.findOne({ _id: contact._id })
    expect(newContact.firstName ).toEqual('new-test');
    expect(newContact.lastName ).toEqual('new-user');
    expect(newContact.phoneNumber ).toEqual('09012345');
  });

  it("should not delete contact", async () => {
    const user = await UserModel.create({
      name: "test",
      email: "test@example.com",
      password: "123456",
    });

    await ContactModel.create({
      firstName: "test",
      lastName: "user",
      phoneNumber: "90922345234",
      countryCode: "+234",
      userId: user._id,
    });

    await ContactModel.create({
      firstName: "test2",
      lastName: "user",
      phoneNumber: "9092234",
      countryCode: "+234",
      userId: user._id,
    });

    const response = await ContactService.DeleteContact({
      userId: user._id,
      contactId: 'invalid_id',
    });

    expect(response.code).toEqual(404);
    expect(response.success).toEqual(false);
    expect(response.message).toEqual("contact not found");
  });

  it("should delete contact", async () => {
    const user = await UserModel.create({
      name: "test",
      email: "test@example.com",
      password: "123456",
    });

    await ContactModel.create({
      firstName: "test",
      lastName: "user",
      phoneNumber: "90922345234",
      countryCode: "+234",
      userId: user._id,
    });

    const contact = await ContactModel.create({
      firstName: "test2",
      lastName: "user",
      phoneNumber: "9092234",
      countryCode: "+234",
      userId: user._id,
    });

    const response = await ContactService.DeleteContact({
      userId: user._id,
      contactId: contact._id,
    });

    expect(response.code).toEqual(200);
    expect(response.success).toEqual(true);
    expect(response.message).toEqual("contact deleted successfully");

    const deletedContact = await ContactModel.findOne({ _id: contact._id });

    expect(deletedContact).toEqual(null);
  });
});
