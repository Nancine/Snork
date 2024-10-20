const output = document.getElementById("output");
const commandInput = document.getElementById("command");
const locationImage = document.getElementById("location-image");

// Game variables
let currentLocation = "forest";
let inventory = [];

const locations = {
  forest: {
    description:
      "You awaken in a quiet forest. Next to you lies a portrait, with three people but their faces blurred. They seem familiar. \nYou realize you can't remember who or where you are. \nDo you go north, south, west or east?",
    exits: {
      north: "lighthouse entrance",
      west: "narrow sea",
      east: "hill",
      south: "cave entrance",
    },
    items: ["portrait"],
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
      "You stand ontop of the Lighthouse, the view stretching as far as the eye can see. \nA mysterious door stands idle in the middle, faint strange sounds emit from beyond it. \nUpon closer inspection, it has 2 seperate locks, each requiring their own key.",
    exits: {
      exit: "staircase",
      enter: "dark room",
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
      "You are standing on a small hill. The view is breathtaking, with the forest stretching out below. \nIn the north, a light shines across the distant dark. To the south, darkness far beyond the eye can see.",
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
  "dark room": {
    description:
      "You enter the door and stumble through the dark, blindly. In the distance you can finally see a small light clipping through the door up ahead. Enter? \nYES/NO",
    exits: {
      Yes: "meadow",
      No: "upstairs room",
    },
  },
  meadow: {
    description:
      "You're blinded by sunlight, your vision blurred for a moment. \nYour vision clears, you stand in a large flowery meadow, with the gentle sunlight dancing on your skin. \nYou notice the faces in the portrait begin to clear...\n \nThat's right. I remember now.",
  },
};

function showLocation() {
  let location = locations[currentLocation];
  output.textContent = location.description;

  // Set the image based on the current location
  let imageName = currentLocation.replace(/\s+/g, "_");
  locationImage.src = `images/${imageName}.jpg`;

  locationImage.style.display = "block";
  locationImage.style.width = "100%";
  locationImage.style.maxWidth = "600px";
  locationImage.style.margin = "0 auto";
}

// Function to pick up items
function takeItem() {
  let location = locations[currentLocation];

  if (location.items && location.items.length > 0) {
    const item = location.items[0]; // Assuming there's one item in the location
    inventory.push(item); // Add the item to the player's inventory
    location.items = []; // Remove the item from the location
    output.textContent += `\nYou take the ${item}.`; // Show that the item was picked up
  } else {
    output.textContent += `\nThere is nothing to take here.`; // No items to pick up
  }
}

// Function to unlock the door with keys
function useItem(item) {
  if (inventory.includes(item)) {
    // Check if using the flashlight in the dark cave
    if (item === "flashlight" && currentLocation === "dark cave") {
      output.textContent += `\nYou use the flashlight to light up the cave. A silver key shimmers before you.`;
      // Once the flashlight is used, the silver key becomes visible
      locations["dark cave"].description = "With the flashlight on, you can see clearly in the cave. A silver key shimmers before you.";
      locations["dark cave"].items = ["silver key"]; // Silver key is now available in the cave

    } else if (item === "flashlight" && currentLocation === "downstairs room") {
      output.textContent += `\nYou use the flashlight and see a code on the wall: 'Find what it cost, and retrieve what was lost.'`;

    // Unlocking the silver padlock in the upstairs room
    } else if (item === "silver key" && currentLocation === "upstairs room" && !silverKeyUsed) {
      silverKeyUsed = true;
      output.textContent += `\nYou use the silver key to unlock the first padlock.`;

    // Unlocking the gold padlock in the upstairs room
    } else if (item === "gold key" && currentLocation === "upstairs room" && !goldKeyUsed) {
      goldKeyUsed = true;
      output.textContent += `\nYou use the gold key to unlock the second padlock.`;

    } else {
      output.textContent += `\nThe ${item} has already been used or can't be used here.`;
    }
  } else {
    output.textContent += `\nYou don't have a ${item}.`;
  }
}

// Function to enter the door + variables to track if the padlocks are unlocked
let silverKeyUsed = false;
let goldKeyUsed = false;

function enterDoor() {
  if (currentLocation === "upstairs room") {
    // Check if both padlocks are unlocked and if the player has the portrait
    if (silverKeyUsed && goldKeyUsed) {
      if (inventory.includes("portrait")) {
        currentLocation = "dark room"; // Allow entry to the dark room
        showLocation();
      } else {
        output.textContent += "\nStrange forces hold you back. There is something missing."; // Portrait is missing
      }
    } else {
      output.textContent += "\nThe door is still locked. You need to unlock both padlocks first."; // One or both padlocks are still locked
    }
  } else {
    output.textContent += "\nYou can't enter anything here."; // Prevent "enter" in other locations
  }
}


// Function to handle commands
function handleCommand(command) {
  const inputWords = command.trim().toLowerCase().split(/\s+/);

  // Handle yes/no input in the dark room
  if (currentLocation === "dark room") {
    if (inputWords[0] === "yes") {
      currentLocation = "meadow"; // Move to the meadow
      showLocation();
      return;
    } else if (inputWords[0] === "no") {
      currentLocation = "upstairs room"; // Return to upstairs room
      showLocation();
      return;
    } else {
      output.textContent += "\nPlease answer YES or NO.";
      return;
    }
  }

  if (inputWords[0] === "use" && inputWords.length > 1) {
    const item = inputWords.slice(1).join(" ");
    useItem(item);
    return;
  }

  if (inputWords[0] === "take") {
    takeItem();
    return;
  }

  if (inputWords[0] === "enter" && inputWords[1] === "door") {
    enterDoor();
    return;
  }

  // Handle movement commands (north, south, east, west, etc.)
  const currentExits = locations[currentLocation].exits;
  for (let direction in currentExits) {
    if (inputWords.includes(direction)) {
      if ((currentExits['enter']) === 'dark room') {
        enterDoor();
        return;
      }
      currentLocation = currentExits[direction];
      showLocation();
      return; // Exit after processing a valid direction
    }
  }

  output.textContent += `\nNothing happens.`;
}

// Event listener for player input
commandInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const command = commandInput.value.toLowerCase();
    commandInput.value = "";
    handleCommand(command);
  }
});

// Start the game
showLocation();
