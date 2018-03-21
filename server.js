const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('config');
const port = 8080;

const bid = require('./app/routes/bid');
const person = require('./app/routes/person');
const custody = require('./app/routes/custody');

const docx = require('docx');

const styles = new docx.Styles();
styles.createParagraphStyle('Heading1', 'Heading 1')
    .basedOn("Normal")
    .next("Normal")
    .quickFormat()
    .size(28)
    .bold()
    .italics()
    .spacing({after: 120});

styles.createParagraphStyle('Heading2', 'Heading 2')
    .basedOn("Normal")
    .next("Normal")
    .quickFormat()
    .size(27)
    .bold()
    .underline('double', 'FF0000')
    .spacing({line: 276});


console.log('mongodb://'+ process.env.IP +':28017/');
//настройки базы
const options = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
};

// соединение с базой
mongoose.connect(config.DBHost, options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//не показывать логи в тестовом окружении
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //morgan для вывода логов в консоль
    app.use(morgan('combined')); //'combined' выводит логи в стиле apache
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// error handing
app.use((err, req, res, next) => {
    res.status(422).send({error: err.message});
});


app.route("/bid/")
    .get(bid.getBids)
    .post(bid.addBid)

app.route("/person/")
    .get(person.getPersons)
    .post(person.addPerson);
    
// app.route("/person/:id")
//     .get(person.getPesons);    
    
app.route("/custody/")
    .get(custody.getCustodys)
    .post(custody.addCustody);
    
 
app.route("/bid/remove/")
    .get(bid.removeBids);
    
app.route("/person/remove/")
    .get(person.removePersons);
    
app.route("/custody/remove/")
    .get(custody.removeCustodys);
    
app.get('/word/:bidId', (req, res) => {
    bid.getBid(req.params.bidId).then(bid => {
        person.getPerson(bid.personId).then(person => {
            /*
            { addedAt: 2018-03-19T11:59:37.122Z,
              _id: 5aafa6291425e0080c16e9f2,
              paperType: 'акция',
              paperCost: 100000,
              persentByStorage: 1,
              minCostByStorage: 100,
              personId: '5aafa5cd1425e0080c16e9f0',
              custodyId: '5aafa5f81425e0080c16e9f1' }
            { addedAt: 2018-03-19T11:58:05.854Z,
              _id: 5aafa5cd1425e0080c16e9f0,
              companyName: 'К',
              legalAddress: 'авпавпва',
              mailAddress: 'Донская',
              phoneNumber: '4324324234',
              inn: 3424324,
              paymentAccount: 43423,
              bik: 555555555 }
            */
            
            var doc = new docx.Document();
 
            doc.createParagraph('ДОГОВОР ХРАНЕНИЯ ЦЕННЫХ БУМАГ И ДРУГИХ ДОКУМЕНТОВ ДЛЯ КОМПАНИИ ' + person.companyName).heading1().center();
            doc.createParagraph('');
            doc.createParagraph('1. ПРЕДМЕТ ДОГОВОРА').heading2().center();
            doc.createParagraph('');
            doc.createParagraph('1.1. Хранитель берет на хранение ' + bid.paperType + ', передаваемые Поклажателем и являющиеся с момента подписания договора объектом хранения');
            doc.createParagraph('2.2. Стоимость объекта хранения определяется Поклажателем и равна ' + bid.paperCost + ' рублей.');
            doc.createParagraph('');
            doc.createParagraph('2. ПОРЯДОК ОФОРМЛЕНИЯ ХРАНЕНИЯ').heading2().center();
            doc.createParagraph('');
            doc.createParagraph('2.1. Объект хранения передается на хранение на основании акта передачи на хранение (см. Приложение №1, являющееся неотъемлемой частью настоящего договора).');
            doc.createParagraph('2.2. Объект хранения снимается с хранения на основании акта снятия с хранения (см. Приложение №2, являющееся неотъемлемой частью договора).');
            doc.createParagraph('2.3. Срок хранения равен количеству целых календарных месяцев со дня подписания акта передачи на хранение, до момента выдачи, определяемой датой подписания акта снятия с хранения, но не менее одного месяца.'); 
            doc.createParagraph('');
            doc.createParagraph('3. СТОИМОСТЬ ХРАНЕНИЯ').heading2().center(); 
            doc.createParagraph('');
            doc.createParagraph('3.1. Поклажедатель выплачивает Хранителю плату за хранение в размере ' + bid.persentByStorage + '% от стоимости хранения за один месяц хранения.');
            doc.createParagraph('3.2. Плата за хранение не может быть меньше ' + bid.minCostByStorage + ' рублей за один месяц.'); 
            doc.createParagraph('');
            doc.createParagraph('4. ОТВЕТСТВЕННОСТЬ ХРАНИТЕЛЯ').heading2().center();  
            doc.createParagraph('');
            doc.createParagraph('Хранитель обязуется:');
            doc.createParagraph('4.1. Соблюдать коммерческую тайну о содержании объекта хранения.');
            doc.createParagraph('4.2. Нести полную материальную ответственность за сохранность объекта хранения.');
            doc.createParagraph('4.3. Возмещать Поклажедателю ущерб от утери или потери качества объекта хранения.');
            doc.createParagraph('');
            doc.createParagraph('5. СРОКИ И УСЛОВИЯ ДЕЙСТВИЯ ДОГОВОРА').heading2().center();  
            doc.createParagraph('');
            doc.createParagraph('5.1. Срок действия настоящего договора устанавливается с момента передачи Поклажедателем объекта хранения Хранителю, оформленного актом передачи на хранение (см. Приложение №1), до момента возвращения Хранителем объекта хранения Поклажедателю, оформленного актом снятия с хранения (см. Приложение №2).');
            doc.createParagraph('');
            doc.createParagraph('6. ЮРИДИЧЕСКИЙ АДРЕС И БАНКОВСКИЕ РЕКВЕЗИТЫ СТОРОН').heading2().center(); 
            doc.createParagraph('');
            doc.createParagraph('ХРАНИТЕЛЬ');
            doc.createParagraph('')
            doc.createParagraph('Юридический адрес: БАНК');
            doc.createParagraph('Почтовый адрес: АДРЕС213213');
            doc.createParagraph('Телефон: 312312321');
            doc.createParagraph('ИНН: 1312321312');
            doc.createParagraph('Расчетный счет: 123123123');
            doc.createParagraph('БИК: 3123123');            
            doc.createParagraph('');
            doc.createParagraph('ПОКЛАЖАТЕЛЬ');
            doc.createParagraph('');
            doc.createParagraph('Юридический адрес: ' + person.legalAddress);
            doc.createParagraph('Почтовый адрес: ' + person.mailAddress);
            doc.createParagraph('Телефон: ' + person.phoneNumber);
            doc.createParagraph('ИНН: ' + person.inn);
            doc.createParagraph('Расчетный счет: ' + person.paymentAccount);
            doc.createParagraph('БИК: ' + person.bik);
            doc.createParagraph('');
            doc.createParagraph('Подпись: ');
            
             
            var exporter = new docx.LocalPacker(doc);
             
            var exporter = new docx.ExpressPacker(doc, res);
             
            exporter.pack(req.params.bidId);
        });
    });
});

app.listen(port);
console.log("Listening on port " + port);

module.exports = app; // для тестирования