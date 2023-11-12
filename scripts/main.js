// Register settings for FFG-style dice types
const ffgDiceTypes = ['ability', 'difficulty', 'boost']; // Add more FFG dice types as needed

ffgDiceTypes.forEach(diceType => {
    game.settings.register('FFG-Dice', diceType, {
        name: `Outcomes for ${diceType} dice`,
        hint: `Set the possible outcomes for ${diceType} dice, separated by commas`,
        scope: 'world',
        config: true,
        type: String,
        default: getDefaultOutcomes(diceType), // Provide default values based on dice type
        onChange: value => {
            // Handle the change in dice outcomes
            console.log(`New outcomes for ${diceType} dice: ${value}`);
        }
    });
});

function getDefaultOutcomes(diceType) {
    switch (diceType) {
        case 'ability':
            return 'Success,Success,Success + Advantage,Advantage,Advantage,Blank';
        case 'difficulty':
            return 'Failure,Failure,Threat,Threat,Threat,Blank';
        case 'boost':
            return 'Success,Advantage,Success + Advantage,Blank,Blank,Blank';
        default:
            return '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('roll-ability-multiple').addEventListener('click', function() {
        rollMultipleDice('ability');
    });

    document.getElementById('roll-difficulty-multiple').addEventListener('click', function() {
        rollMultipleDice('difficulty');
    });

    document.getElementById('roll-boost-multiple').addEventListener('click', function() {
        rollMultipleDice('boost');
    });

    // Add similar event listeners for other dice types
});

function rollMultipleDice(dieType) {
    let numDice = parseInt(document.getElementById(`num-${dieType}`).value);
    let results = [];
    for (let i = 0; i < numDice; i++) {
        results.push(rollDie(dieType));
    }

    let counts = results.reduce((acc, result) => {
        acc[result] = (acc[result] || 0) + 1;
        return acc;
    }, {});

    let formattedResults = Object.entries(counts).map(([result, count]) => `${count} ${result}`).join(', ');

    displayResult(`Rolled ${numDice} ${dieType} dice: ${formattedResults}`);
}

function rollDie(dieType) {
    let result;
    switch (dieType) {
        case 'ability':
            result = rollAbilityDie();
            break;
        case 'difficulty':
            result = rollDifficultyDie();
            break;
        case 'boost':
            result = rollBoostDie();
            break;
        // Add cases for other dice types
    }
    return result;
}

function rollAbilityDie() {
    const outcomes = game.settings.get('FFG-Dice', 'ability').split(',');
    return selectRandomOutcome(outcomes);
}

function rollDifficultyDie() {
    const outcomes = game.settings.get('FFG-Dice', 'difficulty').split(',');
    return selectRandomOutcome(outcomes);
}

function rollBoostDie() {
    const outcomes = game.settings.get('FFG-Dice', 'boost').split(',');
    return selectRandomOutcome(outcomes);
}

function selectRandomOutcome(outcomes) {
    const randomIndex = Math.floor(Math.random() * outcomes.length);
    return outcomes[randomIndex];
}

function displayResult(result) {
    let resultsDiv = document.getElementById('dice-results');
    resultsDiv.innerHTML = result;
}

function postToChat(dieType, result) {
    let chatData = {
        user: game.user._id,
        speaker: ChatMessage.getSpeaker(),
        content: `Rolled ${dieType} dice: ${result}`,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        // Add any additional required properties
    };

    ChatMessage.create(chatData, {});
}