const contactService = require('../services/contact.service');

const CreateContact = async (req, res) => {
    const payload = req.body;
    const { _id } = req.user;

    const serviceResponse = await contactService.CreateContact({...payload, userId: _id});

    return res.status(serviceResponse.code).json(serviceResponse);
}

const UpdateContact = async (req, res) => {
    const payload = req.body;
    const { contactId } = req.params
    const { _id } = req.user;

    const serviceResponse = await contactService.UpdateContact({ ...payload, contactId, userId: _id });

    return res.status(serviceResponse.code).json(serviceResponse);
}

const GetContacts = async (req, res) => {
    const { _id } = req.user;

    const serviceResponse = await contactService.GetContacts({ userId: _id });

    return res.status(serviceResponse.code).json(serviceResponse);
}

const GetContact = async (req, res) => {
    const { contactId } = req.params

    const serviceResponse = await contactService.GetContact({ contactId, userId: _id });

    return res.status(serviceResponse.code).json(serviceResponse);
}

const DeleteContact = async (req, res) => {
    const { contactId } = req.params
    const { _id } = req.user;

    const serviceResponse = await contactService.DeleteContact({ contactId, userId: _id });

    return res.status(serviceResponse.code).json(serviceResponse);
}

module.exports = {
    CreateContact,
    UpdateContact,
    GetContacts,
    GetContact,
    DeleteContact,
}

