const mongoose = require('mongoose');
const Bid = require('../models/bid');

addBid = (req, res) => {
    // let newBid = new Bid({
    //     paperType: 'Вексель',
    //     paperCost: 100000,
    //     persentByStorage: 1,
    //     minCostByStorage: 100,
    //     personId: '5aa7c73f7b5846209b061702'
    // });
    let newBid = new Bid(req.body);
    
    //Сохранить в базу.
    newBid.save((err, user) => {
        if(err) {
            res.status(422).send({error:err.message});
        } else { //Если нет ошибок, отправить ответ клиенту
            res.json({message: "Complited!"});
        }
    })
}

getBids = (req, res) => {
    let query = Bid.find({});
    
    query.exec((err, bids) => {
        if(err) res.send(err);

        res.json(bids);
    });
}

removeBids = (req, res) => {
    let query = Bid.remove({});
    
    query.exec();
    
    res.json({message: "Complited!"});
}

getBid = (bidId) => {
    return new Promise((resolve, reject) => {
        let query = Bid.find({_id: bidId});
        
        query.exec((err, bid) => {
            resolve(bid[0]);
        });
    });
}

module.exports = { addBid, getBids, removeBids, getBid };