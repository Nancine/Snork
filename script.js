const output = document.getElementById('output');
const commandInput = document.getElementById('command');

// Game variables
let currentLocation = 'forest';
let inventory = [];

const locations = {
    'forest': {
        description: "You are in a quiet forest.",
        exits: {
            'north': 'lighthouse',
            'west': 'narrow sea',
            'east': 'hill',
            'south': 'cave entrance'
        }
    },
    'lighthouse': {
        description: "You stand before a tall, weathered lighthouse overlooking the sea. The air is crisp and salty. Exits are: 'south'.",
        exits: {
            'south': 'forest'
        }
    },
    'narrow sea': {
        description: "You are at the edge of a narrow sea. The water stretches far into the horizon, with no land in sight. To the west, you can see a beach, and to the east is the forest.",
        exits: {
            'east': 'forest',
            'west': 'beach'
        }
    },
    'beach': {
        description: "You stand on a sandy beach. The waves crash gently against the shore. Below the waters, you notice something shiny. Exits are: 'east' to the narrow sea.",
        exits: {
            'east': 'narrow sea'
        },
        items: ['key']  // The shiny key is here
    },
    'hill': {
        description: "You are standing on a small hill. The view is breathtaking, with the forest stretching out below. Exits are: 'west'.",
        exits: {
            'west': 'forest'
        }
    },
    'cave entrance': {
        description: "You are at the entrance of a dark cave. A faint draft of cold air seeps out. Exits are: 'north' to the forest, and 'south' into the cave.",
        exits: {
            'north': 'forest',
            'south': 'dark cave'
        }
    },
    'dark cave': {
        description: "You are deep inside the dark cave. It's pitch black, and you can't see much without a light source. Exits are: 'north' back to the cave entrance.",
        exits: {
            'north': 'cave entrance'
        }
    }
};


// Function to show the location description and available items
function showLocation() {
    let location = locations[currentLocation];
    output.textContent = location.description;

    if (location.items && location.items.length > 0) {  // Check if location has items
        output.textContent += `\nItems here: ${location.items.join(', ')}.`;
    }
}

// Function to handle picking up items
function takeItem(item) {
    let location = locations[currentLocation];
    
    if (location.items && location.items.includes(item)) {  // Check for items
        inventory.push(item);  // Add the item to the player's inventory
        location.items = location.items.filter(i => i !== item);  // Remove item from the location
        output.textContent += `\nYou took the ${item}.`;
    } else {
        output.textContent += `\nThere is no ${item} here.`;
    }
}


// Function to handle using items
function useItem(item) {
    if (inventory.includes(item)) {
        if (item === 'flashlight' && currentLocation === 'dark cave') {
            output.textContent += `\nYou use the flashlight to light up the cave.`;
        } else if (item === 'key' && currentLocation === 'beach') {  // Changed to 'beach'
            output.textContent += `\nYou use the key to unlock something in the water.`;
        } else {
            output.textContent += `\nYou can't use the ${item} here.`;
        }
    } else {
        output.textContent += `\nYou don't have a ${item}.`;
    }
}


// Function to handle commands
function handleCommand(command) {
    // Convert input to lowercase, trim spaces, and split by spaces
    const inputWords = command.trim().toLowerCase().split(/\s+/);

    // Check for movement commands (north, south, etc.)
    const currentExits = locations[currentLocation].exits;
    for (let direction in currentExits) {
        if (inputWords.includes(direction)) {
            currentLocation = currentExits[direction];
            showLocation();
            return; // Exit after processing a valid direction
        }
    }

    // Check if the command starts with "take" for picking up items
    if (inputWords[0] === 'take' && inputWords.length > 1) {
        const item = inputWords.slice(1).join(' ');  // Combine remaining words into item name
        takeItem(item);
        return;
    }

    // Check if the command starts with "use" for using items
    if (inputWords[0] === 'use' && inputWords.length > 1) {
        const item = inputWords.slice(1).join(' ');  // Combine remaining words into item name
        useItem(item);
        return;
    }

    // If no valid command is recognized
    output.textContent += `\nNothing happens.`;
    //output.textContent += `\nYou jump. Now what?`;
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
