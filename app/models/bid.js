const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BidSchema = new Schema(
    {
        paperType: { type: String, required: true },
        paperCost: { type: Number, required: true },
        persentByStorage: { type: Number, required: true },
        minCostByStorage: { type: Number, required: true },
        personId: { type: String, required: true },
        custodyId: { type: String },
        addedAt: { type: Date, default: Date.now },
    },
    {
        versionKey: false
    }
);

// установить параметр addedAt равным текущему времени
BidSchema.pre('save', next => {
    let now = new Date();
    if(!this.addedAt) {
        this.addedAt = now;
    }
    next();
});

//Экспорт модели для последующего использования.
module.exports = mongoose.model('bid', BidSchema);