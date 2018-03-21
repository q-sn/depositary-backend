const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const BidSchema = require('./bid');

// let ObjectId = Schema.ObjectId;

const CustodySchema = new Schema(
    {
        paperName: { type: String, required: true },
        registrationNumber: { type: Number, required: true },
        quantity: { type: Number, required: true },
        personId: { type: String, required: true },
        addedAt: { type: Date, default: Date.now },
    },
    {
        versionKey: false
    }
);

// установить параметр addedAt равным текущему времени
CustodySchema.pre('save', next => {
    let now = new Date();
    if(!this.addedAt) {
        this.addedAt = now;
    }
    next();
});

//Экспорт модели для последующего использования.
module.exports = mongoose.model('custody', CustodySchema);