const output = document.getElementById('output');
const commandInput = document.getElementById('command');

// Game variables
let currentLocation = 'forest';
const locations = {
    'cave entrance': {
        description: "You stand before a dark cave. \nEnter?",
        exits: {
            'yes': 'dark cave',
            'north': 'forest'

        }
    },
    'forest': {
        description: "You are in a quiet forest. Exits are: 'south', 'east'.",
        exits: {
            'south': 'cave entrance',
            'east': 'mountain'
        }
    },
    'mountain': {
        description: "You are on a tall mountain. Exits are: 'west'.",
        exits: {
            'west': 'forest'
        }
    },
    'dark cave': {
        description: "You stand inside a dark cave, unable to see \nGo back?",
        exits: {
            'yes': 'cave entrance'
        }
    }
};

// Function to show the location description
function showLocation() {
    output.textContent = locations[currentLocation].description;
}

// Function to handle commands
function handleCommand(command) {
    const currentExits = locations[currentLocation].exits;
    if (command in currentExits) {
        currentLocation = currentExits[command];
        showLocation();
    } else {
        output.textContent += `\nYou can't go that way.`;
    }
}

// Event listener for the input
commandInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const command = commandInput.value.toLowerCase();
        commandInput.value = '';  // Clear input
        handleCommand(command);   // Process command
    }
});

// Start the game
showLocation();
