const ContactModel = require("../models/contacts.model");

const CreateContact = async ({
  userId,
  firstName,
  lastName,
  phoneNumber,
  countryCode = "+234",
}) => {
  const alreadyExists = await ContactModel.findOne({
    countryCode,
    phoneNumber,
    userId,
  });

  if (alreadyExists) {
    return {
      code: 409,
      success: false,
      message: "Contact already exist",
    };
  }

  const contact = await ContactModel.create({
    firstName,
    lastName,
    phoneNumber,
    countryCode,
    userId,
  });

  return {
    code: 201,
    success: true,
    message: "contact created successfully",
    data: {
      contact,
    },
  };
};

const UpdateContact = async ({
  userId,
  contactId,
  firstName,
  lastName,
  phoneNumber,
  countryCode = "+234",
}) => {
  const contact = await ContactModel.findOne({ _id: contactId, userId });

  if (!contact) {
    return {
      code: 404,
      message: "contact not found",
      success: false,
    };
  }

  if (firstName) {
    contact.firstName = firstName;
  }

  if (lastName) {
    contact.lastName = lastName;
  }

  if (phoneNumber) {
    contact.phoneNumber = phoneNumber;
  }

  if (countryCode) {
    contact.countryCode = countryCode;
  }

  contact.updatedAt = new Date();

  await contact.save();

  return {
    code: 200,
    message: "contact updated successfully",
    success: true,
    data: {
      contact,
    },
  };
};

const GetContact = async ({ userId, contactId }) => {
  const contact = await ContactModel.findOne({ _id: contactId, userId });

  if (!contact) {
    return {
      code: 404,
      message: "contact not found",
      success: false,
    };
  }

  if (contact.userId !== userId) {
    return {
      code: 403,
      message: "forbidden",
      success: false,
    };
  }

  return {
    code: 200,
    message: "contact retrieved successfully",
    success: true,
    data: {
      contact,
    },
  };
};

const GetContacts = async ({ userId, page, search }) => {

  let query = {
    userId,
  };

  if (search) {
    query = {
      ...query,
      $or: [
        { firstName : { $regex: search, $options: "i" }},
        { lastName : { $regex: search, $options: "i" }},
        { phoneNumber : { $regex: search, $options: "i" }},
      ],
    };
  }

  const contacts = await ContactModel.find(query)
    .sort({ updatedAt: -1 })
    .paginate({page: page || 1});


  return {
    code: 200,
    message: "contact retrieved successfully",
    success: true,
    data: {
      contacts: contacts.docs,
      meta: {
        totalDocs: contacts.totalDocs,
        offset: contacts.offset,
        limit: contacts.limit,
        totalPages: contacts.totalPages,
        page: contacts.page,
        pagingCounter: contacts.pagingCounter,
        hasPrevPage: contacts.hasPrevPage,
        hasNextPage: contacts.hasNextPage,
        prevPage: contacts.prevPage,
        nextPage: contacts.nextPage,
      },
    },
  };
};

const DeleteContact = async ({ userId, contactId }) => {
  const contact = await ContactModel.findOne({ _id: contactId, userId });

  if (!contact) {
    return {
      code: 404,
      message: "contact not found",
      success: false,
    };
  }

  if (contact.userId !== userId) {
    return {
      code: 403,
      message: "forbidden",
      success: false,
    };
  }

  await ContactModel.deleteOne({ _id: contactId, userId });

  return {
    code: 200,
    message: "contact deleted successfully",
    success: true,
    data: null,
  };
};

module.exports = {
  CreateContact,
  UpdateContact,
  DeleteContact,
  GetContact,
  GetContacts,
};
