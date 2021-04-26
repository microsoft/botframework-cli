import {expect, test} from '@oclif/test'
const sinon = require('sinon')
const path = require('path')
const uuidv1 = require('uuid/v1')
const nock = require('nock')
const fs = require('fs-extra')

const compareFiles = async function (file1: string, file2: string) {
  let result = await fs.readFile(path.join(__dirname, file1))
  let fixtureFile = await fs.readFile(path.join(__dirname, file2))
  result = result.toString().replace(/\r\n/g, '\n')
  fixtureFile = fixtureFile.toString().replace(/\r\n/g, '\n')
  expect(fixtureFile).to.deep.equal(result)
  return result === fixtureFile
}

describe('luis:test cli parameters test', () => {
  test
  .stdout()
  .command(['luis:test', '--help'])
  .exit(1)
  .it('should print the help contents when --help is passed as an argument', ctx => {
    expect(ctx.stdout).to.contain('Test a .lu file or LUIS application JSON model against a published LUIS model')
  })
})

describe('luis:test cli entity test', () => {
  before(async function(){
    await fs.ensureDir(path.join(__dirname, './../../../results/'))
  })

  after(async function(){
    await fs.remove(path.join(__dirname, './../../../results/'))
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .post(uri => uri.includes('apps'))
  .reply(200, {
    "query":"accept the event","prediction":{"topIntent":"AcceptEventEntry","intents":{"AcceptEventEntry":{"score":0.9916137},"None":{"score":0.0212100614},"FindCalendarEntry":{"score":0.0007991798},"CreateCalendarEntry":{"score":0.0007625492}},"entities":{}}
  })
  )
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .post(uri => uri.includes('apps'))
  .reply(200, {
    "query":"accept the event on feb.18 in beijing.","prediction":{"topIntent":"AcceptEventEntry","intents":{"AcceptEventEntry":{"score":0.9646782},"FindCalendarEntry":{"score":0.0154326865},"CreateCalendarEntry":{"score":0.0135070309},"None":{"score":0.005432111}},"entities":{"FromDate":["feb.18"],"Location":["beijing"],"$instance":{"FromDate":[{"type":"FromDate","text":"feb.18","startIndex":20,"length":6,"score":0.9591509,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"Location":[{"type":"Location","text":"beijing","startIndex":30,"length":7,"score":0.9749351,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}}
  })
  )
  .stdout()
  .command(['luis:test', '-i', `${path.join(__dirname, './../../fixtures/testcases/lutest/input/SimpleEntity.lu')}`, '-o', `${path.join(__dirname, './../../../results/SimpleEntity.lu')}`, '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--appId', uuidv1(), '--subscriptionKey', uuidv1(), '--force'])
  .it('test basic simple entity', async ctx => {
    expect(await compareFiles('./../../../results/SimpleEntity.lu', './../../fixtures/testcases/lutest/output/SimpleEntity.lu')).to.be.true
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .post(uri => uri.includes('apps'))
  .reply(200, {
    "query":"accept my meeting at tomorrow 10am","prediction":{"topIntent":"AcceptEventEntry","intents":{"AcceptEventEntry":{"score":0.9554455},"FindCalendarEntry":{"score":0.0266499873},"CreateCalendarEntry":{"score":0.008758012},"None":{"score":0.001980644}},"entities":{"FromDateTime":[{"FromDate":["tomorrow"],"FromTime":["10am"],"$instance":{"FromDate":[{"type":"FromDate","text":"tomorrow","startIndex":21,"length":8,"score":0.9908509,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"FromTime":[{"type":"FromTime","text":"10am","startIndex":30,"length":4,"score":0.96344924,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}],"PossessivePronoun":[["FirstPerson"]],"$instance":{"FromDateTime":[{"type":"FromDateTime","text":"tomorrow 10am","startIndex":21,"length":13,"score":0.9757744,"modelTypeId":4,"modelType":"Composite Entity Extractor","recognitionSources":["model"]}],"PossessivePronoun":[{"type":"PossessivePronoun","text":"my","startIndex":7,"length":2,"modelTypeId":5,"modelType":"List Entity Extractor","recognitionSources":["model"]}]}}}
  })
  )
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .post(uri => uri.includes('apps'))
  .reply(200, {
    "query":"accept the meeting at 7pm today","prediction":{"topIntent":"AcceptEventEntry","intents":{"AcceptEventEntry":{"score":0.963261545},"FindCalendarEntry":{"score":0.0145724509},"CreateCalendarEntry":{"score":0.0105748242},"None":{"score":0.00341928354}},"entities":{"FromDateTime":[{"FromTime":["7pm"],"FromDate":["today"],"$instance":{"FromTime":[{"type":"FromTime","text":"7pm","startIndex":22,"length":3,"score":0.99611336,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"FromDate":[{"type":"FromDate","text":"today","startIndex":26,"length":5,"score":0.9730472,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}],"$instance":{"FromDateTime":[{"type":"FromDateTime","text":"7pm today","startIndex":22,"length":9,"score":0.970544636,"modelTypeId":4,"modelType":"Composite Entity Extractor","recognitionSources":["model"]}]}}}
  })
  )
  .stdout()
  .command(['luis:test', '-i', `${path.join(__dirname, './../../fixtures/testcases/lutest/input/CompositeEntity.lu')}`, '-o', `${path.join(__dirname, './../../../results/CompositeEntity.lu')}`, '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--appId', uuidv1(), '--subscriptionKey', uuidv1(), '--force'])
  .it('test compositeEntity', async ctx => {
    expect(await compareFiles('./../../../results/CompositeEntity.lu', './../../fixtures/testcases/lutest/output/CompositeEntity.lu')).to.be.true
  })

  test
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .post(uri => uri.includes('apps'))
  .reply(200, {
    "query":"accept all meetings for christmas party next week.","prediction":{"topIntent":"AcceptEventEntry","intents":{"AcceptEventEntry":{"score":0.948831439},"FindCalendarEntry":{"score":0.0371829346},"None":{"score":0.00728923827},"CreateCalendarEntry":{"score":0.007234955}},"entities":{"Subject":["christmas party"],"FromDate":["next week"],"ordinalV2": [{"offset": 1, "relativeTo": "current"}], "$instance":{"Subject":[{"type":"Subject","text":"christmas party","startIndex":24,"length":15,"score":0.9657892,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"FromDate":[{"type":"FromDate","text":"next week","startIndex":40,"length":9,"score":0.966946542,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}}
  })
  )
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .post(uri => uri.includes('apps'))
  .reply(200, {
    "query":"accept an appointment","prediction":{"topIntent":"AcceptEventEntry","intents":{"AcceptEventEntry":{"score":0.9806283},"CreateCalendarEntry":{"score":0.0107671674},"None":{"score":0.008749297},"FindCalendarEntry":{"score":0.00100262067}},"entities":{}}
  })
  )
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .post(uri => uri.includes('apps'))
  .reply(200, {
    "query":"accept my meeting at tomorrow 10am","prediction":{"topIntent":"AcceptEventEntry","intents":{"AcceptEventEntry":{"score":0.9551928},"FindCalendarEntry":{"score":0.0262713879},"CreateCalendarEntry":{"score":0.00927224848},"None":{"score":0.00191493623}},"entities":{"FromDateTime":[{"FromDate":["tomorrow"],"FromTime":["10am"],"$instance":{"FromDate":[{"type":"FromDate","text":"tomorrow","startIndex":21,"length":8,"score":0.9902214,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"FromTime":[{"type":"FromTime","text":"10am","startIndex":30,"length":4,"score":0.9724725,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}],"PossessivePronoun":[["FirstPerson"]],"$instance":{"FromDateTime":[{"type":"FromDateTime","text":"tomorrow 10am","startIndex":21,"length":13,"score":0.9746748,"modelTypeId":4,"modelType":"Composite Entity Extractor","recognitionSources":["model"]}],"PossessivePronoun":[{"type":"PossessivePronoun","text":"my","startIndex":7,"length":2,"modelTypeId":5,"modelType":"List Entity Extractor","recognitionSources":["model"]}]}}}
  })
  )
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .post(uri => uri.includes('apps'))
  .reply(200, {
    "query":"book a meeting with huanx@abc.com","prediction":{"topIntent":"CreateCalendarEntry","intents":{"CreateCalendarEntry":{"score":0.999999762},"FindCalendarEntry":{"score":8.77192235e-7},"None":{"score":4.94949234e-7},"AcceptEventEntry":{"score":3.24675227e-7}},"entities":{"Email":["huanx@abc.com"],"$instance":{"Email":[{"type":"Email","text":"huanx@abc.com","startIndex":20,"length":13,"modelTypeId":8,"modelType":"Regex Entity Extractor","recognitionSources":["model"]}]}}}
  })
  )
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .post(uri => uri.includes('apps'))
  .reply(200, {
    "query":"create a meeting at 6 o'clock","prediction":{"topIntent":"CreateCalendarEntry","intents":{"CreateCalendarEntry":{"score":0.9999998},"FindCalendarEntry":{"score":0.0000013437832},"AcceptEventEntry":{"score":3.24675227e-7},"None":{"score":4.9e-10}},"entities":{}}
  })
  )
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .post(uri => uri.includes('apps'))
  .reply(200, {
    "query":"create a meeting for tomorrow 6pm with lucy chen","prediction":{"topIntent":"CreateCalendarEntry","intents":{"CreateCalendarEntry":{"score":0.9999998},"FindCalendarEntry":{"score":1.108032E-06},"AcceptEventEntry":{"score":3.24675227E-07},"None":{"score":4.9E-10}},"entities":{"FromDate":["tomorrow"],"FromTime":["6pm"],"personName":["lucy chen"],"$instance":{"FromDate":[{"type":"FromDate","text":"tomorrow","startIndex":21,"length":8,"score":0.9780653,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"FromTime":[{"type":"FromTime","text":"6pm","startIndex":30,"length":3,"score":0.983653,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"personName":[{"type":"builtin.personName","text":"lucy chen","startIndex":39,"length":9,"modelTypeId":2,"modelType":"Prebuilt Entity Extractor","recognitionSources":["model"]}]}}}
  })
  )
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .post(uri => uri.includes('apps'))
  .reply(200, {
    "query":"create a meeting from 9pm to tomorrow 6am","prediction":{"topIntent":"CreateCalendarEntry","intents":{"CreateCalendarEntry":{"score":0.9999998},"FindCalendarEntry":{"score":6.511119e-7},"None":{"score":4.94949234e-7},"AcceptEventEntry":{"score":3.24675227e-7}},"entities":{"FromTime":["9pm"],"FromDate":["tomorrow"],"ToTime":["6am"],"$instance":{"FromTime":[{"type":"FromTime","text":"9pm","startIndex":22,"length":3,"score":0.9885789,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"FromDate":[{"type":"FromDate","text":"tomorrow","startIndex":29,"length":8,"score":0.9875441,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"ToTime":[{"type":"ToTime","text":"6am","startIndex":38,"length":3,"score":0.952425957,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}}
  })
  )
  .nock('https://westus.api.cognitive.microsoft.com', api => api
  .post(uri => uri.includes('apps'))
  .reply(200, {
    "query":"create a meeting with tom34@outlook.com","prediction":{"topIntent":"CreateCalendarEntry","intents":{"CreateCalendarEntry":{"score":0.99999994},"AcceptEventEntry":{"score":3.24675227e-7},"FindCalendarEntry":{"score":2.126528e-7},"None":{"score":4.9e-10}},"entities":{"OutLook":["tom34@outlook.com"],"$instance":{"OutLook":[{"role":"OutLook","type":"Email","text":"tom34@outlook.com","startIndex":22,"length":17,"modelTypeId":8,"modelType":"Regex Entity Extractor","recognitionSources":["model"]}]}}}
  })
  )
  .stdout()
  .command(['luis:test', '-i', `${path.join(__dirname, './../../fixtures/testcases/lutest/input/AllEntity.lu')}`, '-o', `${path.join(__dirname, './../../../results/AllEntity.lu')}`, '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--appId', uuidv1(), '--subscriptionKey', uuidv1(), '--force'])
  .it('test all kinds of entites', async ctx => {
    expect(await compareFiles('./../../../results/AllEntity.lu', './../../fixtures/testcases/lutest/output/AllEntity.lu')).to.be.true
  })
})

describe('luis:test cli role test', () => {
  before(async function(){
    await fs.ensureDir(path.join(__dirname, './../../../results/'))
  })

  after(async function(){
    await fs.remove(path.join(__dirname, './../../../results/'))
  })

  beforeEach(function () {
    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"accept dinner","prediction":{"topIntent":"AcceptEventEntry","intents":{"AcceptEventEntry":{"score":0.9898117},"None":{"score":0.0353774056},"FindCalendarEntry":{"score":0.000545575167},"CreateCalendarEntry":{"score":0.0003405154}},"entities":{"Meals":["dinner"],"$instance":{"Meals":[{"role":"Meals","type":"Subject","text":"dinner","startIndex":7,"length":6,"score":0.965874732,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}}
    })

    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"accept my meeting with lucy","prediction":{"topIntent":"AcceptEventEntry","intents":{"AcceptEventEntry":{"score":0.959497333},"FindCalendarEntry":{"score":0.0164357983},"CreateCalendarEntry":{"score":0.00772569841},"None":{"score":0.00273590558}},"entities":{"PossessivePronoun":[["FirstPerson"]],"Female":["lucy"],"$instance":{"PossessivePronoun":[{"type":"PossessivePronoun","text":"my","startIndex":7,"length":2,"modelTypeId":5,"modelType":"List Entity Extractor","recognitionSources":["model"]}],"Female":[{"role":"Female","type":"builtin.personName","text":"lucy","startIndex":23,"length":4,"modelTypeId":2,"modelType":"Prebuilt Entity Extractor","recognitionSources":["model"]}]}}}
    })

    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"accept my next meeting","prediction":{"topIntent":"AcceptEventEntry","intents":{"AcceptEventEntry":{"score":0.981132746},"FindCalendarEntry":{"score":0.0337465219},"None":{"score":0.00202137441},"CreateCalendarEntry":{"score":0.00107820414}},"entities":{"PossessivePronoun":[["FirstPerson"]],"Next":["next"],"$instance":{"PossessivePronoun":[{"type":"PossessivePronoun","text":"my","startIndex":7,"length":2,"modelTypeId":5,"modelType":"List Entity Extractor","recognitionSources":["model"]}],"Next":[{"role":"Next","type":"OrderReference","text":"next","startIndex":10,"length":4,"score":0.960370064,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}}
    })

    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"accept the appointment sent by lucas","prediction":{"topIntent":"AcceptEventEntry","intents":{"AcceptEventEntry":{"score":0.9642574},"CreateCalendarEntry":{"score":0.01123041},"FindCalendarEntry":{"score":0.0105271041},"None":{"score":0.006968327}},"entities":{"Male":["lucas"],"$instance":{"Male":[{"role":"Male","type":"builtin.personName","text":"lucas","startIndex":31,"length":5,"modelTypeId":2,"modelType":"Prebuilt Entity Extractor","recognitionSources":["model"]}]}}}
    })

    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"create a meeting with tom34@outlook.com","prediction":{"topIntent":"CreateCalendarEntry","intents":{"CreateCalendarEntry":{"score":0.99999994},"AcceptEventEntry":{"score":3.24675227e-7},"FindCalendarEntry":{"score":2.126528e-7},"None":{"score":4.9e-10}},"entities":{"OutLook":["tom34@outlook.com"],"$instance":{"OutLook":[{"role":"OutLook","type":"Email","text":"tom34@outlook.com","startIndex":22,"length":17,"modelTypeId":8,"modelType":"Regex Entity Extractor","recognitionSources":["model"]}]}}}
    })
  })

  test
  .stdout()
  .command(['luis:test', '-i', `${path.join(__dirname, './../../fixtures/testcases/lutest/input/EntityRole.lu')}`, '-o', `${path.join(__dirname, './../../../results/EntityRole.lu')}`, '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--appId', uuidv1(), '--subscriptionKey', uuidv1(), '--force'])
  .it('test role of entities', async ctx => {
    expect(await compareFiles('./../../../results/EntityRole.lu', './../../fixtures/testcases/lutest/output/EntityRole.lu')).to.be.true
  })
})

describe('luis:test cli Hierarchical entity test', () => {
  before(async function(){
    await fs.ensureDir(path.join(__dirname, './../../../results/'))
  })

  after(async function(){
    await fs.remove(path.join(__dirname, './../../../results/'))
  })

  beforeEach(function () {
    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"a cheese pizza medium with some pineapple and chicken","prediction":{"topIntent":"ModifyOrder","intents":{"ModifyOrder":{"score":0.99580574},"Confirmation":{"score":0.00186229812},"None":{"score":0.00162512017},"Greetings":{"score":0.000724736834},"CancelOrder":{"score":0.000642891857}},"entities":{"Order":[{"FullPizzaWithModifiers":[{"Size":[["Medium"]],"ToppingModifiers":[{"Topping":[["Pineapple"],["Chicken"]],"Modifier":[["Add"]],"$instance":{"Topping":[{"type":"ToppingList","text":"pineapple","startIndex":32,"length":9,"score":0.9875975,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]},{"type":"ToppingList","text":"chicken","startIndex":46,"length":7,"score":0.980701268,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"Modifier":[{"type":"ModifierList","text":"with some","startIndex":22,"length":9,"score":0.9883631,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}],"$instance":{"Size":[{"type":"SizeList","text":"medium","startIndex":15,"length":6,"score":0.995061457,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"ToppingModifiers":[{"type":"ToppingModifiers","text":"with some pineapple and chicken","startIndex":22,"length":31,"score":0.979116261,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}],"$instance":{"FullPizzaWithModifiers":[{"type":"FullPizzaWithModifiers","text":"a cheese pizza medium with some pineapple and chicken","startIndex":0,"length":53,"score":0.984604061,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}],"ToppingList":[["Cheese"]],"$instance":{"Order":[{"type":"Order","text":"a cheese pizza medium with some pineapple and chicken","startIndex":0,"length":53,"score":0.9980534,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"ToppingList":[{"type":"ToppingList","text":"cheese","startIndex":2,"length":6,"modelTypeId":5,"modelType":"List Entity Extractor","recognitionSources":["model"]}]}}}
    })

    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"add 5 party size marinera pizzas and i will pick them up at 6pm","prediction":{"topIntent":"ModifyOrder","intents":{"ModifyOrder":{"score":0.9951326},"CancelOrder":{"score":0.0024766007},"None":{"score":0.00161436747},"Confirmation":{"score":0.00160195876},"Greetings":{"score":0.000279883767}},"entities":{"Order":[{"FullPizzaWithModifiers":[{"PizzaType":["marinera pizzas"],"Size":[["Party Size"]],"Quantity":[5],"$instance":{"PizzaType":[{"type":"PizzaType","text":"marinera pizzas","startIndex":17,"length":15,"score":0.992267847,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"Size":[{"type":"SizeList","text":"party size","startIndex":6,"length":10,"score":0.9800147,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"Quantity":[{"type":"builtin.number","text":"5","startIndex":4,"length":1,"score":0.9950878,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}],"$instance":{"FullPizzaWithModifiers":[{"type":"FullPizzaWithModifiers","text":"5 party size marinera pizzas","startIndex":4,"length":28,"score":0.9762401,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}],"ModifierList":[["Add"]],"$instance":{"Order":[{"type":"Order","text":"add 5 party size marinera pizzas and i will pick them up at 6pm","startIndex":0,"length":63,"score":0.9433738,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"ModifierList":[{"type":"ModifierList","text":"add","startIndex":0,"length":3,"modelTypeId":5,"modelType":"List Entity Extractor","recognitionSources":["model"]}]}}}
    })

    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"can i get 3 pepperoni pizzas and a four cheese pizza with a large house salad and a large fries","prediction":{"topIntent":"ModifyOrder","intents":{"ModifyOrder":{"score":0.999949932},"None":{"score":0.000797458},"CancelOrder":{"score":0.000371012837},"Confirmation":{"score":0.000123555365},"Greetings":{"score":0.00005131555}},"entities":{"Order":[{"FullPizzaWithModifiers":[{"PizzaType":["pepperoni pizzas"],"Quantity":[3],"$instance":{"PizzaType":[{"type":"PizzaType","text":"pepperoni pizzas","startIndex":12,"length":16,"score":0.99253273,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"Quantity":[{"type":"builtin.number","text":"3","startIndex":10,"length":1,"score":0.9941294,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}},{"PizzaType":["four cheese pizza"],"$instance":{"PizzaType":[{"type":"PizzaType","text":"four cheese pizza","startIndex":35,"length":17,"score":0.9262008,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}],"SideOrder":[{"SideProduct":["a large house salad","a large fries"],"$instance":{"SideProduct":[{"type":"SideProduct","text":"a large house salad","startIndex":58,"length":19,"score":0.949831665,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]},{"type":"SideProduct","text":"a large fries","startIndex":82,"length":13,"score":0.958258033,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}],"$instance":{"FullPizzaWithModifiers":[{"type":"FullPizzaWithModifiers","text":"3 pepperoni pizzas","startIndex":10,"length":18,"score":0.9982099,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]},{"type":"FullPizzaWithModifiers","text":"a four cheese pizza","startIndex":33,"length":19,"score":0.9491937,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"SideOrder":[{"type":"SideOrder","text":"with a large house salad and a large fries","startIndex":53,"length":42,"score":0.9409128,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}],"ToppingList":[["Pepperoni"],["Cheese"]],"number":[4],"ModifierList":[["Add"]],"SizeList":[["Large"],["Large"]],"$instance":{"Order":[{"type":"Order","text":"3 pepperoni pizzas and a four cheese pizza with a large house salad and a large fries","startIndex":10,"length":85,"score":0.996587336,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"ToppingList":[{"type":"ToppingList","text":"pepperoni","startIndex":12,"length":9,"modelTypeId":5,"modelType":"List Entity Extractor","recognitionSources":["model"]},{"type":"ToppingList","text":"cheese","startIndex":40,"length":6,"modelTypeId":5,"modelType":"List Entity Extractor","recognitionSources":["model"]}],"number":[{"type":"builtin.number","text":"four","startIndex":35,"length":4,"modelTypeId":2,"modelType":"Prebuilt Entity Extractor","recognitionSources":["model"]}],"ModifierList":[{"type":"ModifierList","text":"with","startIndex":53,"length":4,"modelTypeId":5,"modelType":"List Entity Extractor","recognitionSources":["model"]}],"SizeList":[{"type":"SizeList","text":"large","startIndex":60,"length":5,"modelTypeId":5,"modelType":"List Entity Extractor","recognitionSources":["model"]},{"type":"SizeList","text":"large","startIndex":84,"length":5,"modelTypeId":5,"modelType":"List Entity Extractor","recognitionSources":["model"]}]}}}
    })
    
  })

  test
  .stdout()
  .command(['luis:test', '-i', `${path.join(__dirname, './../../fixtures/testcases/lutest/input/HierarchicalEntity.lu')}`, '-o', `${path.join(__dirname, './../../../results/HierarchicalEntity.lu')}`, '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--appId', uuidv1(), '--subscriptionKey', uuidv1(), '--force'])
  .it('test hierarchical entity', async ctx => {
    expect(await compareFiles('./../../../results/HierarchicalEntity.lu', './../../fixtures/testcases/lutest/output/HierarchicalEntity.lu')).to.be.true
  })

  test
  .stdout()
  .command(['luis:test', '-i', `${path.join(__dirname, './../../fixtures/testcases/lutest/input/HierarchicalEntity.json')}`, '-o', `${path.join(__dirname, './../../../results/HierarchicalEntity.lu')}`, '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--appId', uuidv1(), '--subscriptionKey', uuidv1(), '--force'])
  .it('test hierarchical entity in json format', async ctx => {
    expect(await compareFiles('./../../../results/HierarchicalEntity.lu', './../../fixtures/testcases/lutest/output/HierarchicalEntity.lu')).to.be.true
  })
})

describe('luis:test normal test', () => {
  before(async function(){
    await fs.ensureDir(path.join(__dirname, './../../../results/'))
  })

  after(async function(){
    await fs.remove(path.join(__dirname, './../../../results/'))
  })

  beforeEach(function () {
    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"accept all meetings for christmas party next week.","prediction":{"topIntent":"AcceptEventEntry","intents":{"AcceptEventEntry":{"score":0.948831439},"FindCalendarEntry":{"score":0.0371829346},"None":{"score":0.00728923827},"CreateCalendarEntry":{"score":0.007234955}},"entities":{"Subject":["christmas party"],"FromDate":["next week"],"$instance":{"Subject":[{"type":"Subject","text":"christmas party","startIndex":24,"length":15,"score":0.9657892,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"FromDate":[{"type":"FromDate","text":"next week","startIndex":40,"length":9,"score":0.966946542,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}}
    })
    
    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"accept an appointment","prediction":{"topIntent":"AcceptEventEntry","intents":{"AcceptEventEntry":{"score":0.9806283},"CreateCalendarEntry":{"score":0.0107671674},"None":{"score":0.008749297},"FindCalendarEntry":{"score":0.00100262067}},"entities":{}}
    })

    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"accept dinner","prediction":{"topIntent":"AcceptEventEntry","intents":{"AcceptEventEntry":{"score":0.9898117},"None":{"score":0.0353774056},"FindCalendarEntry":{"score":0.000545575167},"CreateCalendarEntry":{"score":0.0003405154}},"entities":{"Meals":["dinner"],"$instance":{"Meals":[{"role":"Meals","type":"Subject","text":"dinner","startIndex":7,"length":6,"score":0.965874732,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}}
    })

    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"accept my meeting at tomorrow 10am","prediction":{"topIntent":"AcceptEventEntry","intents":{"AcceptEventEntry":{"score":0.9551928},"FindCalendarEntry":{"score":0.0262713879},"CreateCalendarEntry":{"score":0.00927224848},"None":{"score":0.00191493623}},"entities":{"FromDateTime":[{"FromDate":["tomorrow"],"FromTime":["10am"],"$instance":{"FromDate":[{"type":"FromDate","text":"tomorrow","startIndex":21,"length":8,"score":0.9902214,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"FromTime":[{"type":"FromTime","text":"10am","startIndex":30,"length":4,"score":0.9724725,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}],"PossessivePronoun":[["FirstPerson"]],"$instance":{"FromDateTime":[{"type":"FromDateTime","text":"tomorrow 10am","startIndex":21,"length":13,"score":0.9746748,"modelTypeId":4,"modelType":"Composite Entity Extractor","recognitionSources":["model"]}],"PossessivePronoun":[{"type":"PossessivePronoun","text":"my","startIndex":7,"length":2,"modelTypeId":5,"modelType":"List Entity Extractor","recognitionSources":["model"]}]}}}
    })

    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"accept my meeting with lucy","prediction":{"topIntent":"AcceptEventEntry","intents":{"AcceptEventEntry":{"score":0.959497333},"FindCalendarEntry":{"score":0.0164357983},"CreateCalendarEntry":{"score":0.00772569841},"None":{"score":0.00273590558}},"entities":{"PossessivePronoun":[["FirstPerson"]],"Female":["lucy"],"$instance":{"PossessivePronoun":[{"type":"PossessivePronoun","text":"my","startIndex":7,"length":2,"modelTypeId":5,"modelType":"List Entity Extractor","recognitionSources":["model"]}],"Female":[{"role":"Female","type":"builtin.personName","text":"lucy","startIndex":23,"length":4,"modelTypeId":2,"modelType":"Prebuilt Entity Extractor","recognitionSources":["model"]}]}}}
    })

    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"accept my next meeting","prediction":{"topIntent":"AcceptEventEntry","intents":{"AcceptEventEntry":{"score":0.981132746},"FindCalendarEntry":{"score":0.0337465219},"None":{"score":0.00202137441},"CreateCalendarEntry":{"score":0.00107820414}},"entities":{"PossessivePronoun":[["FirstPerson"]],"Next":["next"],"$instance":{"PossessivePronoun":[{"type":"PossessivePronoun","text":"my","startIndex":7,"length":2,"modelTypeId":5,"modelType":"List Entity Extractor","recognitionSources":["model"]}],"Next":[{"role":"Next","type":"OrderReference","text":"next","startIndex":10,"length":4,"score":0.960370064,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}}
    })

    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"book a meeting with huanx@abc.com","prediction":{"topIntent":"CreateCalendarEntry","intents":{"CreateCalendarEntry":{"score":0.999999762},"FindCalendarEntry":{"score":8.77192235e-7},"None":{"score":4.94949234e-7},"AcceptEventEntry":{"score":3.24675227e-7}},"entities":{"Email":["huanx@abc.com"],"$instance":{"Email":[{"type":"Email","text":"huanx@abc.com","startIndex":20,"length":13,"modelTypeId":8,"modelType":"Regex Entity Extractor","recognitionSources":["model"]}]}}}
    })

    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"create a calendar appointment at 3:30 tomorrow for half an hour","prediction":{"topIntent":"CreateCalendarEntry","intents":{"CreateCalendarEntry":{"score":0.993257463},"FindCalendarEntry":{"score":0.0207973123},"AcceptEventEntry":{"score":0.00752841},"None":{"score":0.00258025876}},"entities":{"FromTime":["3:30"],"FromDate":["tomorrow"],"Duration":["half an hour"],"$instance":{"FromTime":[{"type":"FromTime","text":"3:30","startIndex":33,"length":4,"score":0.9714409,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"FromDate":[{"type":"FromDate","text":"tomorrow","startIndex":38,"length":8,"score":0.9876196,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"Duration":[{"type":"Duration","text":"half an hour","startIndex":51,"length":12,"score":0.9637342,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}}
    })

    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"create a event with eden roth at 4pm today for 30 mins","prediction":{"topIntent":"CreateCalendarEntry","intents":{"CreateCalendarEntry":{"score":0.9999999},"None":{"score":4.94949234e-7},"FindCalendarEntry":{"score":4.29645354e-7},"AcceptEventEntry":{"score":3.24675227e-7}},"entities":{"FromTime":["4pm"],"FromDate":["today"],"Duration":["30 mins"],"$instance":{"FromTime":[{"type":"FromTime","text":"4pm","startIndex":33,"length":3,"score":0.9858761,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"FromDate":[{"type":"FromDate","text":"today","startIndex":37,"length":5,"score":0.9848769,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"Duration":[{"type":"Duration","text":"30 mins","startIndex":47,"length":7,"score":0.978632748,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}}
    })

    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"create a meeting at 6 o'clock","prediction":{"topIntent":"CreateCalendarEntry","intents":{"CreateCalendarEntry":{"score":0.9999998},"FindCalendarEntry":{"score":0.0000013437832},"AcceptEventEntry":{"score":3.24675227e-7},"None":{"score":4.9e-10}},"entities":{}}
    })

    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"create an appointment with doctor lu from 8:30 am to 10:00 am tomorrow morning","prediction":{"topIntent":"CreateCalendarEntry","intents":{"CreateCalendarEntry":{"score":0.99999994},"FindCalendarEntry":{"score":6.511119e-7},"AcceptEventEntry":{"score":3.24675227e-7},"None":{"score":4.9e-10}},"entities":{"personName":["doctor lu"],"FromTime":["8:30 am","morning"],"ToTime":["10:00 am"],"FromDate":["tomorrow"],"$instance":{"personName":[{"type":"builtin.personName","text":"doctor lu","startIndex":27,"length":9,"modelTypeId":2,"modelType":"Prebuilt Entity Extractor","recognitionSources":["model"]}],"FromTime":[{"type":"FromTime","text":"8:30 am","startIndex":42,"length":7,"score":0.968376338,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]},{"type":"FromTime","text":"morning","startIndex":71,"length":7,"score":0.9562449,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"ToTime":[{"type":"ToTime","text":"10:00 am","startIndex":53,"length":8,"score":0.9576419,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"FromDate":[{"type":"FromDate","text":"tomorrow","startIndex":62,"length":8,"score":0.986595631,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}}
    })

    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"create appointment for 30 minutes","prediction":{"topIntent":"CreateCalendarEntry","intents":{"CreateCalendarEntry":{"score":0.972337842},"None":{"score":0.0147473346},"AcceptEventEntry":{"score":0.005768245},"FindCalendarEntry":{"score":0.004693006}},"entities":{"Duration":["30 minutes"],"$instance":{"Duration":[{"type":"Duration","text":"30 minutes","startIndex":23,"length":10,"score":0.9802576,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}}
    })

    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"find a meeting subject daily meeting","prediction":{"topIntent":"FindCalendarEntry","intents":{"FindCalendarEntry":{"score":0.951522648},"CreateCalendarEntry":{"score":0.0267035775},"AcceptEventEntry":{"score":0.009956521},"None":{"score":0.00728210947}},"entities":{"Subject":["daily meeting"],"$instance":{"Subject":[{"type":"Subject","text":"daily meeting","startIndex":23,"length":13,"score":0.9644481,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}}
    })

    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"find a meeting with subject weekly report","prediction":{"topIntent":"FindCalendarEntry","intents":{"FindCalendarEntry":{"score":0.959091961},"CreateCalendarEntry":{"score":0.024054775},"None":{"score":0.009452751},"AcceptEventEntry":{"score":0.008683719}},"entities":{"Subject":["weekly report"],"$instance":{"Subject":[{"type":"Subject","text":"weekly report","startIndex":28,"length":13,"score":0.963532269,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}]}}}
    })

    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"1","prediction":{"topIntent":"None","intents":{"None":{"score":0.962541759},"FindCalendarEntry":{"score":0.0138276508},"AcceptEventEntry":{"score":0.005194204},"CreateCalendarEntry":{"score":0.00211010128}},"entities":{}}
    })

    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"i want them all","prediction":{"topIntent":"None","intents":{"None":{"score":0.9742338},"FindCalendarEntry":{"score":0.012520914},"AcceptEventEntry":{"score":0.00728971139},"CreateCalendarEntry":{"score":0.006515513}},"entities":{}}
    })

    nock('https://westus.api.cognitive.microsoft.com')
    .post(uri => uri.includes('apps'))
    .reply(200, {
      "query":"the third one","prediction":{"topIntent":"None","intents":{"None":{"score":0.9528941},"FindCalendarEntry":{"score":0.0206986461},"AcceptEventEntry":{"score":0.007648055},"CreateCalendarEntry":{"score":0.006207045}},"entities":{"PositionReference":["third"],"ordinal":[3],"$instance":{"PositionReference":[{"type":"PositionReference","text":"third","startIndex":4,"length":5,"score":0.9843544,"modelTypeId":1,"modelType":"Entity Extractor","recognitionSources":["model"]}],"ordinal":[{"type":"builtin.ordinal","text":"third","startIndex":4,"length":5,"modelTypeId":2,"modelType":"Prebuilt Entity Extractor","recognitionSources":["model"]}]}}}
    })
  })

  test
  .stdout()
  .command(['luis:test', '-i', `${path.join(__dirname, './../../fixtures/testcases/lutest/input/TestFile.lu')}`, '-o', `${path.join(__dirname, './../../../results/TestFile.lu')}`, '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--appId', uuidv1(), '--subscriptionKey', uuidv1(), '--force'])
  .it('test a noraml file in which all utterances pass', async ctx => {
    expect(await compareFiles('./../../../results/TestFile.lu', './../../fixtures/testcases/lutest/output/TestFile.lu')).to.be.true
  })

  test
  .stdout()
  .command(['luis:test', '-i', `${path.join(__dirname, './../../fixtures/testcases/lutest/input/TestFile.json')}`, '-o', `${path.join(__dirname, './../../../results/TestFile.lu')}`, '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--appId', uuidv1(), '--subscriptionKey', uuidv1(), '--force'])
  .it('test a noraml file in json format in which all utterances pass', async ctx => {
    expect(await compareFiles('./../../../results/TestFile.lu', './../../fixtures/testcases/lutest/output/TestFile.lu')).to.be.true
  })

  test
  .stdout()
  .command(['luis:test', '-i', `${path.join(__dirname, './../../fixtures/testcases/lutest/input/TestFile1.lu')}`, '-o', `${path.join(__dirname, './../../../results/TestFile1.lu')}`, '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--appId', uuidv1(), '--subscriptionKey', uuidv1(), '--force'])
  .it('test a noraml file in which some utterances do not pass because of incorrect intent prediction', async ctx => {
    expect(await compareFiles('./../../../results/TestFile1.lu', './../../fixtures/testcases/lutest/output/TestFile1.lu')).to.be.true
  })
  

  test
  .stdout()
  .command(['luis:test', '-i', `${path.join(__dirname, './../../fixtures/testcases/lutest/input/TestFile2.lu')}`, '-o', `${path.join(__dirname, './../../../results/TestFile2.lu')}`, '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--appId', uuidv1(), '--subscriptionKey', uuidv1(), '--force'])
  .it('test a noraml file in which some utterances do not pass because of incorrect entity prediction', async ctx => {
    expect(await compareFiles('./../../../results/TestFile2.lu', './../../fixtures/testcases/lutest/output/TestFile2.lu')).to.be.true
  })

  test
  .stdout()
  .command(['luis:test', '-i', `${path.join(__dirname, './../../fixtures/testcases/lutest/input/TestFile2.lu')}`, '-o', `${path.join(__dirname, './../../../results/TestFile2_intentOnly.lu')}`, '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--appId', uuidv1(), '--subscriptionKey', uuidv1(), '--force', '--intentOnly'])
  .it('test a noraml file for intentOnly', async ctx => {
    expect(await compareFiles('./../../../results/TestFile2_intentOnly.lu', './../../fixtures/testcases/lutest/output/TestFile2_intentOnly.lu')).to.be.true
  })

  test
  .stdout()
  .command(['luis:test', '-i', `${path.join(__dirname, './../../fixtures/testcases/lutest/input/TestFile2.lu')}`, '-o', `${path.join(__dirname, './../../../results/TestFile2_3intent.lu')}`, '--endpoint', 'https://westus.api.cognitive.microsoft.com', '--appId', uuidv1(), '--subscriptionKey', uuidv1(), '--force', '--allowIntentsCount', '3'])
  .it('test a noraml file with top3 intent in the predicted result for each utterance', async ctx => {
    expect(await compareFiles('./../../../results/TestFile2_3intent.lu', './../../fixtures/testcases/lutest/output/TestFile2_3intent.lu')).to.be.true
  })
})
