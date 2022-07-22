const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
// const settingsBill = require('./settingsbill');
const settingsBill = require('./settingsbill');
const moment = require('moment');
// const settingsbill = require('./settingsbill');

const app = express();

const settingsbill = settingsBill();

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
  console.log(settingsbill.getSettings())
  res.render('index', {
    setting: settingsbill.getSettings(),
    totals: settingsbill.totals(),
    colour: settingsbill.colourChange()
   
  })
  
});

app.post('/settings', function (req, res) {
console.log(req.body.smsCost)
  settingsbill.setSettings({
    callCost: req.body.callCost,
    smsCost: req.body.smsCost,
    warningLevel: req.body.warningLevel,
    criticalLevel: req.body.criticalLevel
  });

  res.redirect('/');
})

app.post('/action', function (req, res) {
  settingsbill.recordAction(req.body.actionType)
  res.redirect('/');
})

app.get('/actions', function (req, res) {
  let billy = settingsbill.actions()

for(let key of billy){
  key.timestring = moment(key.timestamp,'MMMM Do YYYY, h:mm:ss').fromNow()
}

res.render('actions', {actions: billy }); 

})

app.get('/actions/:actionType', function (req, res) {
  const actionType = req.params.actionType;
  res.render('actions', {actions: settingsbill.actionsFor(actionType)});
})

const PORT = process.env.PORT || 3011;

app.listen(PORT, function () {
  console.log("App started at port", PORT)
})