const { connectDB } = require('../db');

const insertFormData = async (data) => {
  const db = await connectDB();
  const collection = db.collection('form_data');

  const doc = {
    formType: data.formType,
    companyName: data.companyName,
    companyAddress: data.companyAddress,
    clientName: data.clientName,
    email: data.email,
    designation: data.designation,
    contact: data.contact,
    clientType: data.clientType || null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await collection.insertOne(doc);
  return result;
};

module.exports = {
  insertFormData
};
