const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonSchema = new Schema(
    {
        companyName: { type: String, required: true },
        legalAddress: { type: String, required: true },
        mailAddress: { type: String },
        phoneNumber: { type: String, required: true },
        inn: { type: Number, required: true },
        paymentAccount: { type: Number, required: true },
        bik: { type: Number, required: true },
        addedAt: { type: Date, default: Date.now },
    },
    {
        versionKey: false
    }
);

// установить параметр addedAt равным текущему времени
PersonSchema.pre('save', next => {
    let now = new Date();
    if(!this.addedAt) {
        this.addedAt = now;
    }
    next();
});

//Экспорт модели для последующего использования.
module.exports = mongoose.model('person', PersonSchema);