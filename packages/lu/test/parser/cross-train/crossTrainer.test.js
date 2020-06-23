/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const assert = require('chai').assert
const crossTrainer = require('../../../src/parser/cross-train/crossTrainer')
const NEWLINE = require('os').EOL

describe('luis:cross training tests among lu and qna contents', () => {
  it('luis:cross training can get expected result when handling multi locales and duplications', async () => {
    let luContentArray = []
    let qnaContentArray = []

    luContentArray.push({
      content:
        `# dia1_trigger
        - book a hotel for me
        
        # dia2_trigger
        - book a flight for me
        - book a train ticket for me`,
      id: 'Main.lu'})

    qnaContentArray.push({
      content:
        `# ?user guide

        **Filters:**
        - aa=bb
        
        \`\`\`
            Here is the [user guide](http://contoso.com/userguide.pdf)
        \`\`\`
        
        # ?tell joke
        \`\`\`
            tell a funny joke
        \`\`\``,
      id: 'Main.qna'}
    )

    luContentArray.push({
      content:
        `# dia1_trigger
        - réserver un hôtel`,
      id: 'main.fr-fr.lu'}
    )

    qnaContentArray.push({
      content:
        `# ?guide de l'utilisateur

        **Filters:**
        - aa=bb
        
        \`\`\`
            Voici le [guide de l'utilisateur] (http://contoso.com/userguide.pdf)
        \`\`\``,
      id: 'main.fr-fr.qna'}
    )

    luContentArray.push({
      content:
        `> !# @app.name = my luis application
        
        # hotelLevel
        - I need a four star hotel
        
        # hotelLocation
        - can I book a hotel near Space Needle`,
      id: 'Dia1.lu'}
    )

    qnaContentArray.push({
      content:
        `> !# @qna.pair.source = xyz
        <a id = "1"></a>
        
        # ?tell Joke
        - tell me a joke
        
        \`\`\`
            ha ha ha
        \`\`\`
        
        # ?can I book a hotel near space needle
        \`\`\`
            of course you can
        \`\`\``,
      id: 'dia1.qna'}
    )

    luContentArray.push({
      content:
        `# hotelLevel
        - J'ai besoin d'un hôtel quatre étoiles
        
        # hotelLocation
        - puis-je réserver un hôtel près de l'aiguille spatiale`,
      id: 'dia1.fr-fr.lu'}
    )

    qnaContentArray.push({
      content:
        `# ?raconter la blague
        
        \`\`\`
            ha ha ha
        \`\`\``,
      id: 'dia1.fr-fr.qna'}
    )

    luContentArray.push({
      content:
        `# dia3_trigger
        - book a flight from {fromLocation = Seattle} to {toLocation = Beijing}
        
        # dia4_trigger
        - book a train ticket from Seattle to Portland`,
      id: 'Dia2.lu'}
    )

    qnaContentArray.push({
      content:
        `# ?sing song
        \`\`\`
            sure, I can sing song.
        \`\`\`
        
        # ?tell a joke
        \`\`\`
            ha ha ha
        \`\`\``,
     id: 'dia2.qna'}
    )

    luContentArray.push({
      content:
        `# flightDestination
        - book a flight to {toLocation = Beijing}
        
        # flightTime
        - which {flightTime} do you prefer`,
      id: 'dia3.lu'}
    )

    qnaContentArray.push({
      content: ``,
      id: 'dia3.qna'
    })

    luContentArray.push({
      content:
        `# railwayStation
        - which station will you leave from
        
        # railwayTime
        - when do you want to leave from Seattle train station`,
      id: 'dia4.lu'})

    let crossTrainConfig = {
      rootIds: [
        'main.lu',
        'main.fr-fr.lu'
      ],
      triggerRules: {
        'main.lu': {
          'dia1_trigger': 'dia1.lu',
          'dia2_trigger': 'dia2.lu'
        },
        'dia2.lu': {
          'dia3_trigger': 'dia3.lu',
          'dia4_trigger': 'dia4.lu'
        },
        'main.fr-fr.lu': {
          'dia1_trigger': 'dia1.fr-fr.lu'
        }
      },
      intentName: '_Interruption',
      verbose: true
    }

    const trainedResult = await crossTrainer.crossTrain(luContentArray, qnaContentArray, crossTrainConfig)
    const luResult = trainedResult.luResult
    const qnaResult = trainedResult.qnaResult

    let foundIndex = luResult.get('Main.lu').Sections.findIndex(s => s.Name === 'DeferToRecognizer_QnA_Main')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('Main.lu').Sections[foundIndex].Body, `- user guide${NEWLINE}- tell joke`)

    foundIndex = qnaResult.get('Main.qna').Sections.findIndex(s => s.Answer === 'intent=DeferToRecognizer_LUIS_Main')
    assert.isTrue(foundIndex > -1)
    assert.equal(qnaResult.get('Main.qna').Sections[foundIndex].FilterPairs[0].key, 'dialogName')
    assert.equal(qnaResult.get('Main.qna').Sections[foundIndex].FilterPairs[0].value, 'Main.dialog')
    assert.equal(qnaResult.get('Main.qna').Sections[foundIndex].Questions[0], 'book a hotel for me')
    assert.equal(qnaResult.get('Main.qna').Sections[foundIndex].Questions[2], 'book a train ticket for me')

    foundIndex = luResult.get('Dia1.lu').Sections.findIndex(s => s.ModelInfo === '> !# @app.name = my luis application')
    assert.isTrue(foundIndex > -1)

    foundIndex = luResult.get('Dia1.lu').Sections.findIndex(s => s.Name === '_Interruption')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('Dia1.lu').Sections[foundIndex].Body, `- book a flight for me${NEWLINE}- book a train ticket for me${NEWLINE}- user guide${NEWLINE}${NEWLINE}> Source: cross training. Please do not edit these directly!`)
    
    foundIndex = luResult.get('Dia1.lu').Sections.findIndex(s => s.Name === 'DeferToRecognizer_QnA_Dia1')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('Dia1.lu').Sections[foundIndex].Body, `- tell Joke${NEWLINE}- tell me a joke`)

    foundIndex = qnaResult.get('dia1.qna').Sections.findIndex(s => s.FilterPairs && s.FilterPairs[0].key === 'dialogName')
    assert.isTrue(foundIndex > -1)
    assert.equal(qnaResult.get('dia1.qna').Sections[foundIndex].FilterPairs[0].value, 'Dia1.dialog')

    foundIndex = qnaResult.get('dia1.qna').Sections.findIndex(s => s.Questions.join(', ') === 'I need a four star hotel, book a flight for me, book a train ticket for me, user guide')
    assert.isTrue(foundIndex > -1)

    foundIndex = luResult.get('Dia2.lu').Sections.findIndex(s => s.Name === '_Interruption')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('Dia2.lu').Sections[foundIndex].Name, '_Interruption')
    assert.equal(luResult.get('Dia2.lu').Sections[foundIndex].Body, `- book a hotel for me${NEWLINE}- user guide${NEWLINE}- tell joke${NEWLINE}${NEWLINE}> Source: cross training. Please do not edit these directly!`)
    
    foundIndex = luResult.get('Dia2.lu').Sections.findIndex(s => s.Name === 'DeferToRecognizer_QnA_Dia2')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('Dia2.lu').Sections[foundIndex].Body, `- sing song${NEWLINE}- tell a joke`)

    foundIndex = qnaResult.get('dia2.qna').Sections.findIndex(s => s.FilterPairs && s.FilterPairs[0].key === 'dialogName')
    assert.isTrue(foundIndex > -1)
    assert.equal(qnaResult.get('dia2.qna').Sections[foundIndex].FilterPairs[0].value, 'Dia2.dialog')

    foundIndex = qnaResult.get('dia2.qna').Sections.findIndex(s => s.Questions.join(', ') === 'book a flight from Seattle to Beijing, book a train ticket from Seattle to Portland, book a hotel for me, user guide, tell joke')
    assert.isTrue(foundIndex > -1)

    assert.equal(luResult.get('dia3.lu').Sections.length, 6)
    foundIndex = luResult.get('dia3.lu').Sections.findIndex(s => s.Name === '_Interruption')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('dia3.lu').Sections[foundIndex].Body, `- book a train ticket from Seattle to Portland${NEWLINE}- book a hotel for me${NEWLINE}- user guide${NEWLINE}- tell joke${NEWLINE}- sing song${NEWLINE}- tell a joke`)

    assert.equal(qnaResult.get('dia3.qna').Sections.length, 1)
    assert.equal(qnaResult.get('dia3.qna').Sections[0].Answer, 'intent=DeferToRecognizer_LUIS_dia3')

    assert.equal(luResult.get('dia4.lu').Sections.length, 6)
    foundIndex = luResult.get('dia4.lu').Sections.findIndex(s => s.Name === '_Interruption')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('dia4.lu').Sections[foundIndex].Body, `- book a flight from Seattle to Beijing${NEWLINE}- book a hotel for me${NEWLINE}- user guide${NEWLINE}- tell joke${NEWLINE}- sing song${NEWLINE}- tell a joke`)

    foundIndex = luResult.get('main.fr-fr.lu').Sections.findIndex(s => s.Name === 'DeferToRecognizer_QnA_main')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('main.fr-fr.lu').Sections[foundIndex].Body, `- guide de l'utilisateur`)

    foundIndex = qnaResult.get('main.fr-fr.qna').Sections.findIndex(s => s.Answer === 'intent=DeferToRecognizer_LUIS_main')
    assert.isTrue(foundIndex > -1)
    assert.equal(qnaResult.get('main.fr-fr.qna').Sections[foundIndex].FilterPairs[0].key, 'dialogName')
    assert.equal(qnaResult.get('main.fr-fr.qna').Sections[foundIndex].FilterPairs[0].value, 'main.dialog')
    assert.equal(qnaResult.get('main.fr-fr.qna').Sections[foundIndex].Questions.length, 1)
    assert.equal(qnaResult.get('main.fr-fr.qna').Sections[foundIndex].Questions[0], 'réserver un hôtel')

    foundIndex = luResult.get('dia1.fr-fr.lu').Sections.findIndex(s => s.Name === '_Interruption')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('dia1.fr-fr.lu').Sections[foundIndex].Body, `- guide de l'utilisateur${NEWLINE}${NEWLINE}> Source: cross training. Please do not edit these directly!`)
    
    foundIndex = luResult.get('dia1.fr-fr.lu').Sections.findIndex(s => s.Name === 'DeferToRecognizer_QnA_dia1')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('dia1.fr-fr.lu').Sections[foundIndex].Body, '- raconter la blague')

    foundIndex = qnaResult.get('dia1.fr-fr.qna').Sections.findIndex(s => s.Questions.join(', ') === 'J\'ai besoin d\'un hôtel quatre étoiles, puis-je réserver un hôtel près de l\'aiguille spatiale, guide de l\'utilisateur')
    assert.isTrue(foundIndex > -1)
  })

  it('luis:cross training can get expected result when nestedIntentSection is enabled', async () => {
    let luContentArray = []

    luContentArray.push({
      content:
        `> !# @enableSections = true
        > !# @enableMergeIntents = true
        
        # dia1_trigger
        ## bookFlight
        - book a flight for me
                    
        #dia2_trigger
        - book a hotel for me`,
      id:'./main/main.lu'}
    )

    luContentArray.push({
      content:
        `# FlightTime
        - which {flightTime} do you prefer`,
      id:'./dia1/dia1.lu'}
    )

    luContentArray.push({
      content:
        `# HotelLevel
        - which hotel star do you prefer`,
      id:'./dia2/dia2.lu'}
    )

    let crossTrainConfig = {
      rootIds: [
        './main/main.lu'
      ],
      triggerRules: {
        './main/main.lu': {
          'dia1_trigger': './dia1/dia1.lu',
          'dia2_trigger': './dia2/dia2.lu'
        }
      },
      intentName: '_Interruption',
      verbose: true
    }

    const trainedResult = await crossTrainer.crossTrain(luContentArray, [], crossTrainConfig)
    const luResult = trainedResult.luResult

    let foundIndex = luResult.get('./dia2/dia2.lu').Sections.findIndex(s => s.Name === '_Interruption')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('./dia2/dia2.lu').Sections[foundIndex].Body, `- book a flight for me`)
  })

  it('luis:cross training can get expected result when multiple dialog invocations occur in same trigger', async () => {
    let luContentArray = []

    luContentArray.push({
      content:
        `# dia1_trigger
        - I want to travel to Seattle
                    
        #dia2_trigger
        - book a hotel for me`,
      id: './main/main.lu'}
    )

    luContentArray.push({
      content:
        `# bookFlight
        - book a flight for me`,
      id: './dia1/dia1.lu'}
    )

    luContentArray.push({
      content:
        `# bookTrain
        - book a train ticket for me`,
      id: './dia2/dia2.lu'}
    )

    luContentArray.push({
      content:
        `# HotelLevel
        - I prefer 4 stars hotel`,
      id: './dia3/dia3.lu'}
    )

    let crossTrainConfig = {
      rootIds: [
        './main/main.lu'
      ],
      triggerRules: {
        './main/main.lu': {
          'dia1_trigger': ['./dia1/dia1.lu', './dia2/dia2.lu'],
          'dia2_trigger': './dia3/dia3.lu'
        }
      },
      intentName: '_Interruption',
      verbose: true
    }

    const trainedResult = await crossTrainer.crossTrain(luContentArray, [], crossTrainConfig)
    const luResult = trainedResult.luResult

    let foundIndex = luResult.get('./dia1/dia1.lu').Sections.findIndex(s => s.Name === '_Interruption')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('./dia1/dia1.lu').Sections[foundIndex].Body, `- book a hotel for me`)

    foundIndex = luResult.get('./dia2/dia2.lu').Sections.findIndex(s => s.Name === '_Interruption')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('./dia2/dia2.lu').Sections[foundIndex].Body, '- book a hotel for me')

    foundIndex = luResult.get('./dia3/dia3.lu').Sections.findIndex(s => s.Name === '_Interruption')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('./dia3/dia3.lu').Sections[foundIndex].Body, '- I want to travel to Seattle')
  })

  it('luis:cross training can get expected result when local intents exist', async () => {
    let luContentArray = []

    luContentArray.push({
      content:
        `# dia1_trigger
        - I want to travel to Seattle
                    
        # dia2_trigger
        - book a hotel for me
        
        # local_intent
        - help`,
      id: './main/main.lu'}
    )

    luContentArray.push({
      content:
        `# bookTicket
        - book a flight for me
        - book a train ticket for me`,
      id: './dia1/dia1.lu'}
    )

    luContentArray.push({
      content:
        `# hotelLevel
        - I prefer 4 stars hotel`,
      id: './dia2/dia2.lu'}
    )

    let crossTrainConfig = {
      rootIds: [
        './main/main.lu'
      ],
      triggerRules: {
        './main/main.lu': {
          'dia1_trigger': './dia1/dia1.lu',
          'dia2_trigger': './dia2/dia2.lu'
        }
      },
      intentName: '_Interruption',
      verbose: true
    }

    const trainedResult = await crossTrainer.crossTrain(luContentArray, [], crossTrainConfig)
    const luResult = trainedResult.luResult

    let foundIndex = luResult.get('./dia1/dia1.lu').Sections.findIndex(s => s.Name === '_Interruption')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('./dia1/dia1.lu').Sections[foundIndex].Body, `- book a hotel for me`)

    foundIndex = luResult.get('./dia2/dia2.lu').Sections.findIndex(s => s.Name === '_Interruption')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('./dia2/dia2.lu').Sections[foundIndex].Body, `- I want to travel to Seattle`)
  })

  it('luis:cross training can get expected result when trigger intent or dialog is empty', async () => {
    let luContentArray = []

    luContentArray.push({
      content:
        `# dia1_trigger
        - I want to travel to Seattle
                    
        # dia2_trigger
        - book a hotel for me
        
        # dia3_trigger
        - cancel`,
      id: './main/main.lu'}
    )

    luContentArray.push({
      content:
        `# bookTicket
        - book a flight for me
        - book a train ticket for me`,
      id: './dia1/dia1.lu'}
    )

    luContentArray.push({
      content:
        `# hotelLevel
        - I prefer 4 stars hotel`,
      id: './dia2/dia2.lu'}
    )

    luContentArray.push({
      content:
        `# help
        - can I help you`,
      id: './dia3/dia3.lu'}
    )

    let crossTrainConfig = {
      rootIds: [
        './main/main.lu'
      ],
      triggerRules: {
        './main/main.lu': {
          'dia1_trigger': './dia1/dia1.lu',
          'dia2_trigger': './dia2/dia2.lu',
          'dia3_trigger': '',
          '': './dia3/dia3.lu'
        }
      },
      intentName: '_Interruption',
      verbose: true
    }

    const trainedResult = await crossTrainer.crossTrain(luContentArray, [], crossTrainConfig)
    const luResult = trainedResult.luResult

    let foundIndex = luResult.get('./dia1/dia1.lu').Sections.findIndex(s => s.Name === '_Interruption')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('./dia1/dia1.lu').Sections[foundIndex].Body, `- book a hotel for me${NEWLINE}- cancel`)

    foundIndex = luResult.get('./dia2/dia2.lu').Sections.findIndex(s => s.Name === '_Interruption')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('./dia2/dia2.lu').Sections[foundIndex].Body, `- I want to travel to Seattle${NEWLINE}- cancel`)

    foundIndex = luResult.get('./dia3/dia3.lu').Sections.findIndex(s => s.Name === '_Interruption')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('./dia3/dia3.lu').Sections[foundIndex].Body, `- I want to travel to Seattle${NEWLINE}- book a hotel for me${NEWLINE}- cancel`)
  })

  it('luis:cross training can get expected result when multi trigger intents point to same lu file', async () => {
    let luContentArray = []

    luContentArray.push({
      content:
        `# dia1_trigger
        - I want to travel to Seattle
                    
        # dia2_trigger
        - book a hotel for me
        
        # dia3_trigger
        - cancel`,
      id: './main/main.lu'}
    )

    luContentArray.push({
      content:
        `# bookTicket
        - book a flight for me
        - book a train ticket for me
        
        # hotelLevel
        - I prefer 4 stars hotel`,
      id: './dia1/dia1.lu'}
    )

    luContentArray.push({
      content:
        `# cancelTask
        - cancel that task`,
      id: './dia2/dia2.lu'}
    )

    let crossTrainConfig = {
      rootIds: [
        './main/main.lu'
      ],
      triggerRules: {
        './main/main.lu': {
          'dia1_trigger': './dia1/dia1.lu',
          'dia2_trigger': './dia1/dia1.lu',
          'dia3_trigger': './dia2/dia2.lu',
          '': './dia2/dia2.lu'
        }
      },
      intentName: '_Interruption',
      verbose: true
    }

    const trainedResult = await crossTrainer.crossTrain(luContentArray, [], crossTrainConfig)
    const luResult = trainedResult.luResult

    let foundIndex = luResult.get('./dia1/dia1.lu').Sections.findIndex(s => s.Name === '_Interruption')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('./dia1/dia1.lu').Sections[foundIndex].Body, `- cancel`)

    foundIndex = luResult.get('./dia2/dia2.lu').Sections.findIndex(s => s.Name === '_Interruption')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('./dia2/dia2.lu').Sections[foundIndex].Body, `- I want to travel to Seattle${NEWLINE}- book a hotel for me`)
  })

  it('luis:cross training can get expected result when handling patterns', async () => {
    let luContentArray = []
    let qnaContentArray = []

    luContentArray.push({
      content:
        `# dia1_trigger
        - book a hotel for me
        - book a hotel for {@personName}
        - book a hotel for {name}
        
        # dia2_trigger
        - book a flight for me
        - book a train ticket for me
        - can you book a flight for {@ personName : userName}
        
        @ prebuilt personName`,
      id: 'main.lu'})

    qnaContentArray.push({
      content:
        `# ?user guide

        **Filters:**
        - aa=bb
        
        \`\`\`
            Here is the [user guide](http://contoso.com/userguide.pdf)
        \`\`\`
        
        # ?tell joke
        \`\`\`
            tell a funny joke
        \`\`\``,
      id: 'main.qna'}
    )

    luContentArray.push({
      content:
        `> !# @app.name = my luis application
        
        # hotelLevel
        - I need a four star hotel
        
        # hotelLocation
        - can I book a hotel near space needle`,
      id: 'dia1.lu'}
    )

    luContentArray.push({
      content:
        `# dia3_trigger
        - book a flight from {fromLocation = Seattle} to {toLocation = Beijing}
        
        # dia4_trigger
        - book a train ticket from Seattle to Portland`,
      id: 'dia2.lu'}
    )

    let crossTrainConfig = {
      rootIds: [
        'main.lu'
      ],
      triggerRules: {
        'main.lu': {
          'dia1_trigger': 'dia1.lu',
          'dia2_trigger': 'dia2.lu'
        }
      },
      intentName: '_Interruption',
      verbose: true
    }

    const trainedResult = await crossTrainer.crossTrain(luContentArray, qnaContentArray, crossTrainConfig)
    const luResult = trainedResult.luResult
    const qnaResult = trainedResult.qnaResult

    let foundIndex = luResult.get('main.lu').Sections.findIndex(s => s.Name === 'DeferToRecognizer_QnA_main')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('main.lu').Sections[foundIndex].Body, `- user guide${NEWLINE}- tell joke`)

    foundIndex = qnaResult.get('main.qna').Sections.findIndex(s => s.Answer === 'intent=DeferToRecognizer_LUIS_main')
    assert.isTrue(foundIndex > -1)
    assert.equal(qnaResult.get('main.qna').Sections[foundIndex].FilterPairs[0].key, 'dialogName')
    assert.equal(qnaResult.get('main.qna').Sections[foundIndex].FilterPairs[0].value, 'main.dialog')
    assert.equal(qnaResult.get('main.qna').Sections[foundIndex].Questions.length, 3)
    assert.equal(qnaResult.get('main.qna').Sections[foundIndex].Questions[0], 'book a hotel for me')
    assert.equal(qnaResult.get('main.qna').Sections[foundIndex].Questions[1], 'book a flight for me')
    assert.equal(qnaResult.get('main.qna').Sections[foundIndex].Questions[2], 'book a train ticket for me')


    foundIndex = luResult.get('dia1.lu').Sections.findIndex(s => s.Name === '_Interruption')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('dia1.lu').Sections[foundIndex].Body, `- book a flight for me${NEWLINE}- book a train ticket for me${NEWLINE}- user guide${NEWLINE}- tell joke`)

    foundIndex = luResult.get('dia2.lu').Sections.findIndex(s => s.Name === '_Interruption')
    assert.isTrue(foundIndex > -1)
    assert.equal(luResult.get('dia2.lu').Sections[foundIndex].Body, `- book a hotel for me${NEWLINE}- book a hotel for {@name}${NEWLINE}- user guide${NEWLINE}- tell joke`)
  })
})
