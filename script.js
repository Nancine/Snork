const output = document.getElementById("output");
const commandInput = document.getElementById("command");
const locationImage = document.getElementById("location-image");

// Game variables
let currentLocation = "forest";
let inventory = [];

const locations = {
  forest: {
    description:
      "You are in a quiet forest. \n Do you go north, south, west or east?",
    exits: {
      north: "lighthouse entrance",
      west: "narrow sea",
      east: "hill",
      south: "cave entrance",
    },
  },
  "lighthouse entrance": {
    description:
      "You stand before a tall, weathered lighthouse overlooking the sea. The air is crisp and salty. The door stands ajar, with a faint light streaming through the gap.",
    exits: {
      south: "forest",
      enter: "lighthouse",
    },
  },

  lighthouse: {
    description:
      "You stand inside a dimly lit room, with stairs leading up or down, the exit behind you",
    exits: {
      exit: "lighthouse entrance",
      up: "staircase",
      down: "downstairs room",
    },
  },

  staircase: {
    description: "The stairs seem endless. up or down?",
    exits: {
      up: "upstairs room",
      down: "lighthouse",
    },
  },

  "upstairs room": {
    description:
      "You stand ontop of the Lighthouse, the view stretching as far as the eye can see. \nA mysterious door stands idle in the middle, faint strange sounds emit from beyond it. \nUpon closer inspection, it has 3 seperate locks, the first 2 requiring keys, while the last needs a three-digit code.",
    exits: {
      exit: "staircase",
    },
  },

  "downstairs room": {
    description: "You enter a cellar, with a dark object lying before you.",
    exits: {
      exit: "lighthouse",
    },
    items: ["flashlight"],
  },

  "narrow sea": {
    description:
      "You are at the edge of a narrow sea. The water stretches far into the horizon, with no land in sight. To the west, you can see a beach, and to the east is the forest.",
    exits: {
      east: "forest",
      west: "beach",
    },
  },
  beach: {
    description:
      "You stand on a sandy beach. The waves crash gently against the shore. \nUpon closer inspection, you notice a shimmering key in the waters below.",
    exits: {
      east: "narrow sea",
    },
    items: ["gold key"],
  },
  hill: {
    description:
      "You are standing on a small hill. The view is breathtaking, with the forest stretching out below. In the north, a light shines across the distant dark. To the south, darkness far beyond the eye can see.",
    exits: {
      west: "forest",
    },
  },
  "cave entrance": {
    description:
      "You are at the entrance of a dark cave. A faint draft of cold air seeps out.",
    exits: {
      north: "forest",
      enter: "dark cave",
    },
  },
  "dark cave": {
    description:
      "You are deep inside the dark cave. It's pitch black, and you can't see much without a light source.",
    exits: {
      exit: "cave entrance",
    },
    items: ["silver key"],
  },
};

function showLocation() {
  let location = locations[currentLocation];

  // Update text description
  output.textContent = location.description;

  // Set the image based on the current location
  let imageName = currentLocation.replace(/\s+/g, "_"); // Replace spaces with underscores for the image name
  locationImage.src = `images/${imageName}.jpg`; // Assuming your images are stored in an 'images' folder
  
  // Display the image and make sure it's visible
  locationImage.style.display = "block";
  locationImage.style.width = "100%"; // Adjust the size as needed to fit the layout
  locationImage.style.maxWidth = "600px"; // Optional max-width to avoid overly large images
  locationImage.style.margin = "0 auto"; // Center the image
}

// Function to show location description and items
//function showLocation() {
//  let location = locations[currentLocation];
//  output.textContent = location.description;
//}

// Function to handle picking up items
// NB! I need to adjust so that it won't reveal what items is there until you type "take".
//Or alternatively, describe it in the description rather than keeping it a secret.
// Function for picking up items
function takeItem() {
  let location = locations[currentLocation];

  // Check location for items
  if (location.items && location.items.length > 0) {
    const item = location.items[0]; // Assume the first item is what the player is taking
    inventory.push(item); // Add the item to the player's inventory
    location.items = []; // Remove the item from the location
    output.textContent += `\nYou take the ${item}.`; // Reveal the item only after taking it
  } else {
    output.textContent += `\nThere is nothing to take here.`; // No items to take
  }
}

// Function for using items
function useItem(item) {
  if (inventory.includes(item)) {
    if (item === "flashlight" && currentLocation === "dark cave") {
      output.textContent += `\nYou use the flashlight to light up the cave. A silver key shimmers before you`;
    } else if (item === "flashlight" && currentLocation === "downstairs room") {
      output.textContent += `\nYou see a code on the wall, as follows: '4 directions, 3 locks, 1 memory still lost'.`;
    } else if (item === "key" && currentLocation === "upstairs room") {
      // Changed to 'beach'
      output.textContent += `\nYou use the key on the door.`;
    } else {
      output.textContent += `\nYou can't use the ${item} here.`;
    }
  } else {
    output.textContent += `\nYou don't have a ${item}.`;
  }
}

// Function to handle commands
function handleCommand(command) {
  // Converting input
  const inputWords = command.trim().toLowerCase().split(/\s+/);

  // Handle movement commands (north, south, east, west, etc.)
  const currentExits = locations[currentLocation].exits;
  for (let direction in currentExits) {
    if (inputWords.includes(direction)) {
      currentLocation = currentExits[direction];
      showLocation();
      return; // Exit after processing a valid direction
    }
  }

  // Taking items with "take"
  if (inputWords[0] === "take") {
    takeItem(); //
  }

  // Handle the jump command
  if (inputWords[0] === "jump") {
    output.textContent += `\nYou jump. Now what?`;
    return;
  }

  // Handle using items (if applicable)
  if (inputWords[0] === "use" && inputWords.length > 1) {
    const item = inputWords.slice(1).join(" "); // Combine remaining words into item name
    useItem(item);
    return;
  }

  // If no valid command
  output.textContent += `\nNothing happens.`;
}

commandInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const command = commandInput.value.toLowerCase();
    commandInput.value = ""; // Clear input
    handleCommand(command); // Process command
  }
});

// Start the game
showLocation();
