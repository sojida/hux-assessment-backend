const supertest = require('supertest');
const app = require('../../main');
const { connect } = require("../database");
const ContactService = require("../../services/contact.service");
const AuthService = require('../../services/auth.service');
const UserModel = require("../../models/users.model");
const ContactModel = require("../../models/contacts.model");

describe("Contact Service Test", () => {
  let connection;
  let token;
  let user;
  // before hook
  beforeAll(async () => {
    connection = await connect();
  });

  beforeEach(async () => {
    await UserModel.create({
        name: "jon doe",
        email: "jondow@example.com",
        password: "123456",
      });

    const response = await AuthService.LoginUser({
        password: "123456",
        email: "jondow@example.com",
    })

    user = response.data.user
    token = response.data.token;
  })

  afterEach(async () => {
    await connection.cleanup();
  });

  // after hook
  afterAll(async () => {
    await connection.disconnect();
  });

  it("should not create contact, duplicate", async () => {

    await ContactModel.create({
      firstName: "test",
      lastName: "user",
      phoneNumber: "90922345",
      countryCode: "+234",
      userId: user._id,
    });

    const response = await supertest(app)
        .post('/api/v1/contacts')
        .set('content-type', 'application/json')
        .send({
            firstName: "test",
            lastName: "user",
            phoneNumber: "90922345",
            countryCode: "+234",
        }).set('Authorization', `Bearer ${token}`)


    expect(response.body.code).toEqual(409);
    expect(response.body.success).toEqual(false);
    expect(response.body.message).toEqual("Contact already exist");
  });

  it("should create contact", async () => {

    await ContactModel.create({
      firstName: "test",
      lastName: "user",
      phoneNumber: "90922345234",
      countryCode: "+234",
      userId: user._id,
    });

    const response = await supertest(app)
    .post('/api/v1/contacts')
    .set('content-type', 'application/json')
    .send({
        firstName: "test",
        lastName: "user",
        phoneNumber: "90922345",
        countryCode: "+234",
    }).set('Authorization', `Bearer ${token}`)

    expect(response.body.code).toEqual(201);
    expect(response.body.success).toEqual(true);
    expect(response.body.message).toEqual("contact created successfully");
    expect(response.body.data).toHaveProperty("contact");
  });

  it("should get contacts", async () => {
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

    const response = await supertest(app)
    .get('/api/v1/contacts')
    .set('content-type', 'application/json')
    .set('Authorization', `Bearer ${token}`)


    expect(response.body.code).toEqual(200);
    expect(response.body.success).toEqual(true);
    expect(response.body.message).toEqual("contacts retrieved successfully");
    expect(response.body.data).toHaveProperty("contacts");
    expect(response.body.data).toHaveProperty("meta");
    expect(response.body.data.contacts).toEqual(
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

    const response = await supertest(app)
    .get(`/api/v1/contacts/${contact._id}`)
    .set('content-type', 'application/json')
    .set('Authorization', `Bearer ${token}`)

    expect(response.body.code).toEqual(200);
    expect(response.body.success).toEqual(true);
    expect(response.body.message).toEqual("contact retrieved successfully");
    expect(response.body.data).toHaveProperty("contact");
    expect(response.body.data.contact).toEqual(
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

    const response = await supertest(app)
    .patch(`/api/v1/contacts/invalid_contact`)
    .set('content-type', 'application/json')
    .set('Authorization', `Bearer ${token}`)

    expect(response.body.code).toEqual(404);
    expect(response.body.success).toEqual(false);
    expect(response.body.message).toEqual("contact not found");
  });

  it("should not update contact", async () => {
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

    const response = await supertest(app)
    .patch(`/api/v1/contacts/invalid_contact`)
    .set('content-type', 'application/json')
    .set('Authorization', `Bearer ${token}`)

    expect(response.body.code).toEqual(404);
    expect(response.body.success).toEqual(false);
    expect(response.body.message).toEqual("contact not found");
  });

  it("should update contact", async () => {
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

    const response = await supertest(app)
    .patch(`/api/v1/contacts/${contact._id}`)
    .set('content-type', 'application/json')
    .set('Authorization', `Bearer ${token}`).send({
        firstName: 'new-test',
        lastName: 'new-user',
        phoneNumber: '09012345'
    })

    expect(response.body.code).toEqual(200);
    expect(response.body.success).toEqual(true);
    expect(response.body.message).toEqual("contact updated successfully");
    expect(response.body.data).toHaveProperty("contact");

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

    const response = await supertest(app)
    .delete(`/api/v1/contacts/${contact._id}`)
    .set('content-type', 'application/json')
    .set('Authorization', `Bearer ${token}`)

    expect(response.body.code).toEqual(200);
    expect(response.body.success).toEqual(true);
    expect(response.body.message).toEqual("contact deleted successfully");

    const deletedContact = await ContactModel.findOne({ _id: contact._id });

    expect(deletedContact).toEqual(null);
  });
});
