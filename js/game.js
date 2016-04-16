
// Declare global vars to keep track of game state
var gameState;
var codeArr = [];


window.onload = function WindowLoad(event) {

	// Check for an existing game
	var gameStateJSON = window.localStorage.getItem("monstermindGameState"); 
	if (gameStateJSON) { 

		// Populate game state from localStorage
		gameState = JSON.parse(gameStateJSON);
		codeArr = gameState['codeArr'];
		
		if (gameState['codeNotBroken'] == 0) {
			
			// Game was won on user's previous guess, so start a new game
			newGame();	
		}
	}
	else {
	
		// Game is NEW
		newGame();
	}
}

function newGame() {
		
	// Pick random secret 4-digit code comprised of letters A - F
	// NOTE: I gave up on trying to make the codes numeric as JSON.parse apparently casts everything as a char
	//		so then indexOf() fails to behave properly (e.g., 2 != 2 and the like)
	for (var i = 0; i < 4; i++) {
		
		// NOTE: Pick a number between 65 and 70 (inclusive) and then convert that ASCII value into a character
		codeArr[i] = String.fromCharCode(Math.floor((Math.random() * 6) + 65));
	}

	// Initialize game state
	gameState = { "codeArr": codeArr, "codeNotBroken": 1, "guessCount": 0 };

	// Put game state into localStorage
	localStorage.setItem('monstermindGameState', JSON.stringify(gameState));
		
	// Blank out game board and welcome player to game
	var textOut = document.getElementById("id_txaOutputWindow");
	textOut.value = "";
	textOut.value += "Welcome to Monstermind.  You have 10 guesses to get the code right.  The code is 4 characters long and consists of letters 'A' through 'F'.  You will get a black marker for each letter that you guess correctly and a white marker for each letter that is contained in the code but in the wrong position.  Feel free to make your first guess!\n\n";
    
	// Blank out player's guesses from text input fields (if they exist from a previous game)
	document.getElementById("id_txtGuessPosn0").value = "";
	document.getElementById("id_txtGuessPosn1").value = "";
	document.getElementById("id_txtGuessPosn2").value = "";
	document.getElementById("id_txtGuessPosn3").value = "";
}

function processGuess(guessArr) {
	
	var blackMarkerCount = 0;
	var whiteMarkerCount = 0;
	var i;
	
	var searchArr = [];
	
	for (i = 0; i < 4; i++) {
		if (guessArr[i] == codeArr[i]) {
			
			// Character chosen in this position matches code, so increment black marker count
			blackMarkerCount++;
		}
		else {
		
			// Character chosen in this position does NOT match code, so add this position's code to the search array for 
			//	white marker candidates
			searchArr[i] = codeArr[i];
		}
	}
	if (blackMarkerCount != 4) {
		
		// Player has NOT guessed the code correctly
		for (i = 0; i < 4; i++) {
			if (searchArr[i]) {
				
				// Look for character match, but in wrong position, and ONLY in positions where the guess did NOT match
				//	the code up in the black marker search section of code
				var matchFoundIndex = searchArr.indexOf(guessArr[i]);
				if (matchFoundIndex !== -1) {
										
					// Character match found in wrong location AND wrong location has NOT already been matched with the
					//	correct character (i.e. a black marker) so this gets a white marker
					whiteMarkerCount++;
					
					// Mangle search array value just used so it is not available to use in subsequent searches (which
					//	would lead to false white markers)
					searchArr[matchFoundIndex] = 'x';
				}
			}
		}
	}
	return { "blackMarkerCount": blackMarkerCount, "whiteMarkerCount": whiteMarkerCount };
}

function inputErrors(guessArr) {

	var errorMessage = "";
	
	for (var i = 0; i < 4; i++) {
		if ((guessArr[i].charCodeAt() < 65 ) || (guessArr[i].charCodeAt() > 70 )) {
			
			// Invalid input
			errorMessage += "'" + guessArr[i] + "', ";			
		}
	}
	if (errorMessage.length) {
		errorMessage = errorMessage.substring(0, errorMessage.length - 2);
	}
	return errorMessage;
	
}

function parse() {

	var errorMessage;

	// Increment guess # by 1
	gameState['guessCount'] = Number(gameState['guessCount']) + 1;
 
	if ((gameState['guessCount'] == 11) || (gameState['codeNotBroken'] == 0)) {
	
		// Player hit Submit Guess button instead of reloading page - start new game for them!
		newGame();
		return;
	}

	// Assign variable for writing to game board
	var textOut = document.getElementById("id_txaOutputWindow");

	// Retrieve player's guesses from text input fields and force them to uppercase
	var guessArr = [ document.getElementById("id_txtGuessPosn0").value.toUpperCase()
		, document.getElementById("id_txtGuessPosn1").value.toUpperCase()
		, document.getElementById("id_txtGuessPosn2").value.toUpperCase()
		, document.getElementById("id_txtGuessPosn3").value.toUpperCase()
	];

	// Validate input
	if ((errorMessage = inputErrors(guessArr)).length > 0) {
		textOut.value += "Sorry but the following input is invalid: " + errorMessage + "\n\n";
		
		// Don't count invalid input as a guess
		gameState['guessCount'] = Number(gameState['guessCount']) - 1;
		return;
	}
	
	// Process guesses
	var newStateArray = processGuess(guessArr);
  
	// Render results of current guess to game board
	textOut.value += "Guess #" + gameState['guessCount'] + ": " 
    	+ guessArr[0] 
    	+ guessArr[1] 
    	+ guessArr[2] 
    	+ guessArr[3] 
    	+ "\nblack count: " + newStateArray['blackMarkerCount'] 
    	+ ", white count: " + newStateArray['whiteMarkerCount'] 
    	+ "\n\n";
    
    if (newStateArray['blackMarkerCount'] == 4) {
    	
    	// Player has guessed the code correctly!
    	gameState['codeNotBroken'] = 0;
    	textOut.value += "You WIN!!\n\nReload the page to play again";
    }
    else if (gameState['guessCount'] == 10) {
    	
    	// Player has exhausted all of their guesses, reveal code
    	gameState['codeNotBroken'] = 0;
    	textOut.value += "Sorry, your 10 guesses are up!\n\nThe correct code was: "
    		+ codeArr[0] 
    		+ codeArr[1]
    		+ codeArr[2] 
    		+ codeArr[3] 
    		+ "\n\nReload the page to play again";
    }
    	    
    // Write the updated game state to localStorage so that, on page reload, the game knows to restart
    localStorage.setItem('monstermindGameState', JSON.stringify(gameState));
}
