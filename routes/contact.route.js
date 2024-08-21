const express = require('express');
const contactsController = require('../controllers/contacts.controller');
const contactMiddleware = require('../middlewares/contact.middleware');
const { BearerTokenAuth } = require('../middlewares/global.middlewares');

const router = express.Router()

router.post('/', BearerTokenAuth, contactMiddleware.ValidateCreateContact, contactsController.CreateContact)
router.patch('/:contactId', BearerTokenAuth, contactMiddleware.ValidateUpdateContact, contactsController.UpdateContact)
router.get('/:contactId', BearerTokenAuth, contactsController.GetContact)
router.get('/', BearerTokenAuth, contactsController.GetContacts)
router.delete('/:contactId', BearerTokenAuth, contactsController.DeleteContact)

module.exports = router;