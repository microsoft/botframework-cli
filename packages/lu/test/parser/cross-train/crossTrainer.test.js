/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const assert = require('chai').assert
const crossTrainer = require('../../../src/parser/cross-train/crossTrainer')
const content = require('../../../src/parser/lu/lu')
const luOptions = require('../../../src/parser/lu/luOptions')
const NEWLINE = require('os').EOL

describe('luis:cross training tests among lu and qna contents', () => {
  it('luis:cross training can get expected result when handling multi locales and duplications', () => {
    let luContentArray = []
    let qnaContentArray = []

    luContentArray.push(new content(
      `# dia1_trigger
      - book a hotel for me
      
      # dia2_trigger
      - book a flight for me
      - book a train ticket for me`,
      new luOptions('./main/main.lu'))
    )

    qnaContentArray.push(new content(
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
      new luOptions('./main/main.qna'))
    )

    luContentArray.push(new content(
      `# dia1_trigger
      - réserver un hôtel`,
      new luOptions('./main/main.fr-fr.lu'))
    )

    qnaContentArray.push(new content(
      `# ?guide de l'utilisateur

      **Filters:**
      - aa=bb
      
      \`\`\`
          Voici le [guide de l'utilisateur] (http://contoso.com/userguide.pdf)
      \`\`\``,
      new luOptions('./main/main.fr-fr.qna'))
    )

    luContentArray.push(new content(
      `> !# @app.name = my luis application
      
      # hotelLevel
      - I need a four star hotel
      
      # hotelLocation
      - can I book a hotel near space needle`,
      new luOptions('./dia1/dia1.lu'))
    )

    qnaContentArray.push(new content(
      `> !# @app.desc = description of my luis application
      
      > !# @qna.pair.source = xyz
      <a id = "1"></a>
      
      # ?tell joke
      - tell me a joke
      
      \`\`\`
          ha ha ha
      \`\`\`
      **Prompts:**
      - [flight booking](#?-book-flight) \`context-only\`
      
      # ?can I book a hotel near space needle
      \`\`\`
          of course you can
      \`\`\``,
      new luOptions('./dia1/dia1.qna'))
    )

    luContentArray.push(new content(
      `# hotelLevel
      - J'ai besoin d'un hôtel quatre étoiles
      
      # hotelLocation
      - puis-je réserver un hôtel près de l'aiguille spatiale`,
      new luOptions('./dia1/dia1.fr-fr.lu'))
    )

    qnaContentArray.push(new content(
      `# ?raconter la blague
      
      \`\`\`
          ha ha ha
      \`\`\``,
      new luOptions('./dia1/dia1.fr-fr.qna'))
    )

    luContentArray.push(new content(
      `# dia3_trigger
      - book a flight from {fromLocation = Seattle} to {toLocation = Beijing}
      
      # dia4_trigger
      - book a train ticket from Seattle to Portland`,
      new luOptions('./dia2/dia2.lu'))
    )

    qnaContentArray.push(new content(
      `# ?sing song
      \`\`\`
          sure, I can sing song.
      \`\`\`
      
      # ?tell a joke
      \`\`\`
          ha ha ha
      \`\`\``,
      new luOptions('./dia2/dia2.qna'))
    )

    luContentArray.push(new content(
      `# flightDestination
      - book a flight to {toLocation = Beijing}
      
      # flightTime
      - which {flightTime} do you prefer`,
      new luOptions('./dia3/dia3.lu'))
    )

    qnaContentArray.push(new content(
      ``,
      new luOptions('./dia3/dia3.qna'))
    )

    luContentArray.push(new content(
      `# railwayStation
      - which station will you leave from
      
      # railwayTime
      - when do you want to leave from Seattle train station`,
      new luOptions('./dia4/dia4.lu'))
    )

    let crossTrainConfig = {
      rootIds: [
        './main/main.lu',
        './main/main.fr-fr.lu'
      ],
      triggerRules: {
        './main/main.lu': {
          './dia1/dia1.lu': 'dia1_trigger',
          './dia2/dia2.lu': 'dia2_trigger'
        },
        './dia2/dia2.lu': {
          './dia3/dia3.lu': 'dia3_trigger',
          './dia4/dia4.lu': 'dia4_trigger'
        },
        './main/main.fr-fr.lu': {
          './dia1/dia1.fr-fr.lu': 'dia1_trigger'
        }
      },
      intentName: '_Interruption',
      verbose: true
    }

    const trainedResult = crossTrainer.crossTrain(luContentArray, qnaContentArray, JSON.stringify(crossTrainConfig))
    const luResult = trainedResult.luResult
    const qnaResult = trainedResult.qnaResult

    assert.equal(luResult.get('./main/main.lu').Sections[2].Name, 'DeferToRecognizer_QnA_main')
    assert.equal(luResult.get('./main/main.lu').Sections[2].Body, `- user guide${NEWLINE}- tell joke`)

    assert.equal(qnaResult.get('./main/main.qna').Sections[2].Answer, 'intent=DeferToRecognizer_LUIS_main')
    assert.equal(qnaResult.get('./main/main.qna').Sections[2].FilterPairs[0].key, 'dialogName')
    assert.equal(qnaResult.get('./main/main.qna').Sections[2].FilterPairs[0].value, 'main')
    assert.equal(qnaResult.get('./main/main.qna').Sections[2].Questions[0], 'book a hotel for me')
    assert.equal(qnaResult.get('./main/main.qna').Sections[2].Questions[2], 'book a train ticket for me')

    assert.equal(luResult.get('./dia1/dia1.lu').Sections[0].ModelInfo, '> !# @app.name = my luis application')
    assert.equal(luResult.get('./dia1/dia1.lu').Sections[3].Name, '_Interruption')
    assert.equal(luResult.get('./dia1/dia1.lu').Sections[3].Body, `- book a flight for me${NEWLINE}- book a train ticket for me${NEWLINE}- user guide`)
    assert.equal(luResult.get('./dia1/dia1.lu').Sections[4].Name, 'DeferToRecognizer_QnA_dia1')
    assert.equal(luResult.get('./dia1/dia1.lu').Sections[4].Body, `- tell joke${NEWLINE}- tell me a joke`)

    assert.equal(qnaResult.get('./dia1/dia1.qna').Sections[0].ModelInfo, '> !# @app.desc = description of my luis application')
    assert.equal(qnaResult.get('./dia1/dia1.qna').Sections[1].FilterPairs[0].key, 'dialogName')
    assert.equal(qnaResult.get('./dia1/dia1.qna').Sections[1].FilterPairs[0].value, 'dia1')
    assert.equal(qnaResult.get('./dia1/dia1.qna').Sections[1].promptsText[0], '[flight booking](#?-book-flight) `context-only`')
    assert.equal(qnaResult.get('./dia1/dia1.qna').Sections[3].Questions.join(', '), 'I need a four star hotel, book a flight for me, book a train ticket for me, user guide')

    assert.equal(luResult.get('./dia2/dia2.lu').Sections[2].Name, '_Interruption')
    assert.equal(luResult.get('./dia2/dia2.lu').Sections[2].Body, `- book a hotel for me${NEWLINE}- user guide${NEWLINE}- tell joke`)
    assert.equal(luResult.get('./dia2/dia2.lu').Sections[3].Name, 'DeferToRecognizer_QnA_dia2')
    assert.equal(luResult.get('./dia2/dia2.lu').Sections[3].Body, `- sing song${NEWLINE}- tell a joke`)

    assert.equal(qnaResult.get('./dia2/dia2.qna').Sections[0].FilterPairs[0].key, 'dialogName')
    assert.equal(qnaResult.get('./dia2/dia2.qna').Sections[0].FilterPairs[0].value, 'dia2')
    assert.equal(qnaResult.get('./dia2/dia2.qna').Sections[2].Questions.join(', '), 'book a flight from Seattle to Beijing, book a train ticket from Seattle to Portland, book a hotel for me, user guide, tell joke')

    assert.equal(luResult.get('./dia3/dia3.lu').Sections.length, 3)
    assert.equal(luResult.get('./dia3/dia3.lu').Sections[2].Name, '_Interruption')
    assert.equal(luResult.get('./dia3/dia3.lu').Sections[2].Body, `- book a train ticket from Seattle to Portland${NEWLINE}- book a hotel for me${NEWLINE}- user guide${NEWLINE}- tell joke${NEWLINE}- sing song${NEWLINE}- tell a joke`)

    assert.equal(qnaResult.get('./dia3/dia3.qna').Sections.length, 0)

    assert.equal(luResult.get('./dia4/dia4.lu').Sections.length, 3)
    assert.equal(luResult.get('./dia4/dia4.lu').Sections[2].Name, '_Interruption')
    assert.equal(luResult.get('./dia4/dia4.lu').Sections[2].Body, `- book a flight from Seattle to Beijing${NEWLINE}- book a hotel for me${NEWLINE}- user guide${NEWLINE}- tell joke${NEWLINE}- sing song${NEWLINE}- tell a joke`)

    assert.equal(luResult.get('./main/main.fr-fr.lu').Sections[1].Name, 'DeferToRecognizer_QnA_main')
    assert.equal(luResult.get('./main/main.fr-fr.lu').Sections[1].Body, `- guide de l'utilisateur`)

    assert.equal(qnaResult.get('./main/main.fr-fr.qna').Sections[1].Answer, 'intent=DeferToRecognizer_LUIS_main')
    assert.equal(qnaResult.get('./main/main.fr-fr.qna').Sections[1].FilterPairs[0].key, 'dialogName')
    assert.equal(qnaResult.get('./main/main.fr-fr.qna').Sections[1].FilterPairs[0].value, 'main')
    assert.equal(qnaResult.get('./main/main.fr-fr.qna').Sections[1].Questions.length, 1)
    assert.equal(qnaResult.get('./main/main.fr-fr.qna').Sections[1].Questions[0], 'réserver un hôtel')


    assert.equal(luResult.get('./dia1/dia1.fr-fr.lu').Sections[2].Name, '_Interruption')
    assert.equal(luResult.get('./dia1/dia1.fr-fr.lu').Sections[2].Body, `- guide de l'utilisateur`)
    assert.equal(luResult.get('./dia1/dia1.fr-fr.lu').Sections[3].Name, 'DeferToRecognizer_QnA_dia1')
    assert.equal(luResult.get('./dia1/dia1.fr-fr.lu').Sections[3].Body, `- raconter la blague`)

    assert.equal(qnaResult.get('./dia1/dia1.fr-fr.qna').Sections[1].Questions.join(', '), 'J\'ai besoin d\'un hôtel quatre étoiles, puis-je réserver un hôtel près de l\'aiguille spatiale, guide de l\'utilisateur')
  })


  it('luis:cross training can get expected result when nestedIntentSection is enabled', () => {
    let luContentArray = []

    luContentArray.push(new content(
      `> !# @enableSections = true
      > !# @enableMergeIntents = true
      
      # dia1_trigger
      ## bookFlight
      - book a flight for me
                  
      #dia2_trigger
      - book a hotel for me`,
      new luOptions('./main/main.lu'))
    )

    luContentArray.push(new content(
      `# FlightTime
      - which {flightTime} do you prefer`,
      new luOptions('./dia1/dia1.lu'))
    )

    luContentArray.push(new content(
      `# HotelLevel
      - which hotel star do you prefer`,
      new luOptions('./dia2/dia2.lu'))
    )

    let crossTrainConfig = {
      rootIds: [
        './main/main.lu'
      ],
      triggerRules: {
        './main/main.lu': {
          './dia1/dia1.lu': 'dia1_trigger',
          './dia2/dia2.lu': 'dia2_trigger'
        }
      },
      intentName: '_Interruption',
      verbose: true
    }

    const trainedResult = crossTrainer.crossTrain(luContentArray, [], JSON.stringify(crossTrainConfig))
    const luResult = trainedResult.luResult

    assert.equal(luResult.get('./dia2/dia2.lu').Sections[1].Name, '_Interruption')
    assert.equal(luResult.get('./dia2/dia2.lu').Sections[1].Body, `- book a flight for me`)
  })

  it('luis:cross training can get expected result when multiple dialog invocations occur in same trigger', () => {
    let luContentArray = []

    luContentArray.push(new content(
      `# dia1_trigger
      - I want to travel to Seattle
                  
      #dia2_trigger
      - book a hotel for me`,
      new luOptions('./main/main.lu'))
    )

    luContentArray.push(new content(
      `# bookFlight
      - book a flight for me`,
      new luOptions('./dia1/dia1.lu'))
    )

    luContentArray.push(new content(
      `# bookTrain
      - book a train ticket for me`,
      new luOptions('./dia2/dia2.lu'))
    )

    luContentArray.push(new content(
      `# HotelLevel
      - I prefer 4 stars hotel`,
      new luOptions('./dia3/dia3.lu'))
    )

    let crossTrainConfig = {
      rootIds: [
        './main/main.lu'
      ],
      triggerRules: {
        './main/main.lu': {
          './dia1/dia1.lu': 'dia1_trigger',
          './dia2/dia2.lu': 'dia1_trigger',
          './dia3/dia3.lu': 'dia2_trigger'
        }
      },
      intentName: '_Interruption',
      verbose: true
    }

    const trainedResult = crossTrainer.crossTrain(luContentArray, [], JSON.stringify(crossTrainConfig))
    const luResult = trainedResult.luResult

    assert.equal(luResult.get('./dia1/dia1.lu').Sections[1].Name, '_Interruption')
    assert.equal(luResult.get('./dia1/dia1.lu').Sections[1].Body, `- book a hotel for me`)

    assert.equal(luResult.get('./dia2/dia2.lu').Sections[1].Name, '_Interruption')
    assert.equal(luResult.get('./dia2/dia2.lu').Sections[1].Body, `- book a hotel for me`)

    assert.equal(luResult.get('./dia3/dia3.lu').Sections[1].Name, '_Interruption')
    assert.equal(luResult.get('./dia3/dia3.lu').Sections[1].Body, `- I want to travel to Seattle`)
  })
})
