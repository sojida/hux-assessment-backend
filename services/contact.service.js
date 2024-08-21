const ContactModel = require('../models/contacts.model');

const CreateContact = async ({ userId, firstName, lastName, phoneNumber, countryCode = '+234' }) => {

    const alreadyExists = await ContactModel.findOne({ country_code: countryCode, phone_number: phoneNumber, user_id: userId });

    console.log(alreadyExists)

    if (alreadyExists) {
        return {
            code: 409,
            success: false,
            message: 'Contact already exist'
        }
    }

    const contact = await ContactModel.create({
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        country_code: countryCode, 
        user_id: userId
    })


    return {
        code: 201,
        success: false,
        message: 'contact created successfully',
        data: {
            contact
        }
    }
}


const UpdateContact = async ({ userId, contactId, firstName, lastName, phoneNumber, countryCode = '+234' }) => {

    const contact = await ContactModel.findOne({ _id: contactId, user_id: userId });

    if (!contact) {
        return {
            code: 404,
            message: 'contact not found',
            success: false,
        }
    }

    if (firstName) {
        contact.first_name = firstName
    }

    if (lastName) {
        contact.last_name = lastName
    }

    if (phoneNumber) {
        contact.phone_number = phoneNumber
    }

    if (countryCode) {
        contact.country_code = countryCode
    }

    await contact.save()

    return {
        code: 200,
        message: 'contact updated successfully',
        success: true,
        data: {
            contact
        }
    }
}

const GetContact = async ({ userId, contactId }) => {
    const contact = await ContactModel.findOne({ _id: contactId, user_id: userId });

    if (!contact) {
        return {
            code: 404,
            message: 'contact not found',
            success: false,
        }
    }

    if (contact.user_id !== userId) {
        return {
            code: 403,
            message: 'forbidden',
            success: false,
        }
    }

    return {
        code: 200,
        message: 'contact retrieved successfully',
        success: true,
        data: {
            contact
        }
    }

}

const GetContacts = async ({ userId, firstName, lastName, phoneNumber }) => {

    const query = {
        user_id: userId
    }

    if (firstName) {
        query.first_name = { $regex: firstName, $options: 'i' }
    }

    if (lastName) {
        query.last_name = { $regex: lastName, $options: 'i' }
    }

    if (phoneNumber) {
        query.phone_number = { $regex: phoneNumber, $options: 'i' }
    }

    console.log(query)
    const contacts = await ContactModel.find(query);

    return {
        code: 200,
        message: 'contact retrieved successfully',
        success: true,
        data: {
            contacts
        }
    }
}

const DeleteContact = async ({ userId, contactId }) => {
    const contact = await ContactModel.findOne({ _id: contactId, user_id: userId });

    if (!contact) {
        return {
            code: 404,
            message: 'contact not found',
            success: false,
        }
    }

    if (contact.user_id !== userId) {
        return {
            code: 403,
            message: 'forbidden',
            success: false,
        }
    }

    await ContactModel.deleteOne({ _id: contactId, user_id: userId })

    return {
        code: 200,
        message: 'contact deleted successfully',
        success: true,
        data: null
    }
}

module.exports = {
    CreateContact,
    UpdateContact,
    DeleteContact,
    GetContact,
    GetContacts,
}