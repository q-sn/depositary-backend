const mongoose = require('mongoose');
const Person = require('../models/person');


addPerson = (req, res) => {
    // let newPerson = new Person({
    //         companyName: 'Google',
    //         legalAddress: '127081, г. Москва,  улица Чермянская, дом 3, строение 2, помещение 3',
    //         mailAddress: '127566, г. Москва, а/я 8',
    //         phoneNumber: '+7-952-217-35-78',
    //         inn: 7715805253,
    //         paymentAccount: 40702810638050013199,
    //         bik: 044525225
    //     });

    
    let newPerson = new Person(req.body);

    //Сохранить в базу.
    newPerson.save((err, user) => {
        if(err) {
            res.status(422).send({error:err.message});
        } else { //Если нет ошибок, отправить ответ клиенту
            res.json({message: "Complited!"});
        }
    })
}

getPersons = (req, res) => {
    let query = Person.find({});
    
    query.exec((err, persons) => {
        if(err) res.send(err);

        res.json(persons);
    });
}

getPerson = (personId) => {
    return new Promise((resolve, reject) => {
        let query = Person.find({_id: personId});
        
        query.exec((err, person) => {
            resolve(person[0]);
        });
    });
}

getPersonsById = (req, res) => {
    
    Person.findById(req.params.id, (err, person) => {
        if(err) res.send(err);
        //Если нет ошибок, отправить ответ клиенту
        res.json(person);
    });
}

removePersons = (req, res) => {
    let query = Person.remove({});
    
    query.exec();
    
    res.json({message: "Complited!"});
}

module.exports = { addPerson, getPersons, getPersonsById, removePersons, getPerson };