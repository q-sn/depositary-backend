const mongoose = require('mongoose');
const Custody = require('../models/custody');

addCustody = (req, res) => {
    // let newCustody = new Custody({
    //     paperName: 'Вексель',
    //     registrationNumber: 123,
    //     quantity: 100,
    //     bidId: '5aa7c8b18370d42291e546c8'
    // });
    
    let newCustody = new Custody(req.body);
    
    //Сохранить в базу.
    newCustody.save((err, user) => {
        if(err) {
            res.status(422).send({error:err.message});
        } else { //Если нет ошибок, отправить ответ клиенту
            res.json({message: "Complited!"});
        }
    })
}

getCustodys = (req, res) => {
    let query = Custody.find({});
    
    query.exec((err, custodys) => {
        if(err) res.send(err);

        res.json(custodys);
    });
}

removeCustodys = (req, res) => {
    let query = Custody.remove({});
    
    query.exec();
    
    res.json({message: "Complited!"});
}

module.exports = { addCustody, getCustodys, removeCustodys };