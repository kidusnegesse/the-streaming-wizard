// Create html for IMDB element
function imdbBlock() {
	var span = document.createElement("SPAN");
	span.className = "imdbRating";
	return span;
}

// Include link to IMDB title using convenient title ID from OMDB API
function imdbLink(titleID) {
	var link = document.createElement("A");
	link.href = "https://www.imdb.com/title/" + titleID;
	link.target = "_blank";
	return link;
}

// Create IMDB logo element
function imdbLogo(id) {
	var span = imdbBlock();
	var link = imdbLink(id);
	var image = document.createElement("IMG");
	image.src = chrome.extension.getURL("images/imdb.png");
	image.className = "imdbLogo";
	link.appendChild(image);
	span.appendChild(link);
	return span;
}

// Create IMDB rating element
function imdbRating(titleID, rating) {
	rating = rating.replace("N/A", "");
	var span = imdbBlock();
	var link = imdbLink(titleID);
	var rating = document.createTextNode("  "+ rating + "  ");
	link.appendChild(rating);
	span.appendChild(link);
	return span;
}

// Create html for Rotten Tomatoes element
function rottenTomatoesBlock() {
	var span = document.createElement("SPAN");
	span.className = "rottenTomatoesRating";
	return span;
}

// Create link to title page on the Rotten Tomatoes website
function rottenTomatotesLink(title) {
	var formattedTitle;

	// Replace all spaces, colons, commas, and periods with underscores to format for the rotten tomatoes link
	if (title.includes(" ") || title.includes(":") || title.includes(",") || title.includes(".")) {
		formattedTitle = title.replace(/[\s:,.]+/g, '_');
	} else {
		formattedTitle = title;
	}
	var link = document.createElement("A");
	link.href = "https://www.rottentomatoes.com/m/" + encodeURIComponent(formattedTitle);;
	link.target = "_blank";
	return link;
}

// Create Rotten tomatoes rating element for "rotten" movies with a critic rating between 0% and 60%
function rottenTomatoesRottenLogo(title) {
	var span = rottenTomatoesBlock();
	var link = rottenTomatotesLink(title); 
	var image = document.createElement("IMG");
	image.src = chrome.extension.getURL("images/rtRotten.png");
	image.className = "rottenTomatoesRottenLogo";
	link.appendChild(image)
	span.appendChild(link);
	return span;
}

// Create Rotten tomatoes rating element for "fresh" movies with a critic rating between 60% and 75%
function rottenTomatoesFreshLogo(title) {
	var span = rottenTomatoesBlock();
	var link = rottenTomatotesLink(title); 
	var image = document.createElement("IMG");
	image.src = chrome.extension.getURL("images/rtFresh.png");
	image.className = "rottenTomatoesFreshLogo";
	link.appendChild(image)
	span.appendChild(link);
	return span;
}

// Create Rotten tomatoes rating element for "certified fresh" movies with a critic rating between 75% and 100%
function rottenTomatoesCertifiedFreshLogo(title) {
	var span = rottenTomatoesBlock();
	var link = rottenTomatotesLink(title); 
	var image = document.createElement("IMG");
	image.src = chrome.extension.getURL("images/rtCertifiedFresh.png");
	image.className = "rottenTomatoesCertifiedFreshLogo";
	link.appendChild(image)
	span.appendChild(link);
	return span;
}

// Create Rotten Tomatoes rating element
function rottenTomatoesRating(rating, title) {
	var span = rottenTomatoesBlock();
	var link = rottenTomatotesLink(title); 
	var rating = document.createTextNode("  "+ rating + "  ");
	link.appendChild(rating)
	span.appendChild(link);
	return span;
}

// Create html for Metacritic element
function metacriticBlock() {
	var span = document.createElement("SPAN");
	span.className = "metacriticRating";
	return span;
}

// Create Metacritic logo element
function metacriticLogo() {
	var span = metacriticBlock();
	var image = document.createElement("IMG");
	image.src = chrome.extension.getURL("images/metacritic.png");
	image.className = "metacriticLogo";
	span.appendChild(image);
	return span;
}

// Create Metacritic rating element
function metacriticRating(rating) {
	var span = metacriticBlock();
	var rating = document.createTextNode("  "+ rating + "  ");
	span.appendChild(rating);
	return span;
}

// Create html for Oscars element
function oscarsBlock() {
	var span = document.createElement("SPAN");
	span.className = "oscars";
	return span;
}

// Create Oscars logo element
function oscarsLogo() {
	var span = oscarsBlock();
	var image = document.createElement("IMG");
	image.src = chrome.extension.getURL("images/oscar.png");
	image.className = "oscarsLogo";
	span.appendChild(image);
	return span;
}

// Create Oscars number element
function oscarsNumber(rating) {
	var span = oscarsBlock();
	var rating = document.createTextNode(rating);
	span.appendChild(rating);
	return span;
}

// Create html for Golden Globe element
function goldenGlobeBlock() {
	var span = document.createElement("SPAN");
	span.className = "goldenGlobe";
	return span;
}

// Create Golden Globe logo element
function goldenGlobeLogo() {
	var span = goldenGlobeBlock();
	var image = document.createElement("IMG");
	image.src = chrome.extension.getURL("images/goldenglobe.png");
	image.className = "goldenGlobeLogo";
	span.appendChild(image);
	return span;
}

// Create Golden Globe number element
function goldenGlobeNumber(rating) {
	var span = goldenGlobeBlock();
	var rating = document.createTextNode(rating);
	span.appendChild(rating);
	return span;
}

function addRatings(node, ratings, title) {

	// Get ratings data when addRatings is called as a callback function from getRatings
	var imdbRatingData = ratings["imdb"];
	var imdbTitleID = ratings["imdbTitleID"];
	var rottenTomatoesRatingData = ratings["rottenTomatoes"];
	var metacriticData = ratings["metacritic"];
	var oscars = ratings["oscars"];
	var goldenGlobes = ratings["goldenGlobes"];
	var movieTitle = title;

	if (node) {

		// Check IMDB data if element hasn't yet been added
		if (!node.querySelector(".imdbRating")) {

			// Add IMDB rating if it exists
			if ((imdbRatingData && imdbRatingData != 'N/A')) {
				node.appendChild(imdbLogo(imdbTitleID));
				node.appendChild(imdbRating(imdbTitleID, imdbRatingData));
			} 
			// If rating is 'N/A' but link exists, add it anyway
			else if (imdbTitleID) {
				node.appendChild(imdbLogo(imdbTitleID));
			}
		}

		// Add Rotten Tomatoes rating if it exists and hasn't yet been added
		if (rottenTomatoesRatingData && !node.querySelector(".rottenTomatoesRating")) {
			
			// Convert Rotten Tomatoes rating to integer
			rottenTomatoesRatingDataInt = parseInt(rottenTomatoesRatingData.substr(0, rottenTomatoesRatingData.indexOf('%')), 10); 

			// If between 0% and 60%, it's rotten
			if (rottenTomatoesRatingDataInt < 60) {
				node.appendChild(rottenTomatoesRottenLogo(movieTitle));
				node.appendChild(rottenTomatoesRating(rottenTomatoesRatingData, movieTitle));
			} 
			// If between 60% and 75%, it's fresh
			else if (rottenTomatoesRatingDataInt >= 60 && rottenTomatoesRatingDataInt < 75) {
				node.appendChild(rottenTomatoesFreshLogo(movieTitle));
				node.appendChild(rottenTomatoesRating(rottenTomatoesRatingData, movieTitle));
			} 
			// If above 75%, it's certified fresh (not always but OMDB doesn't show whether it's certified fresh)
			else if (rottenTomatoesRatingDataInt >= 75) {
				node.appendChild(rottenTomatoesCertifiedFreshLogo(movieTitle));
				node.appendChild(rottenTomatoesRating(rottenTomatoesRatingData, movieTitle));
			}
		}

		// Add Metacritic rating if it exists, isn't 'N/A' (OMDB sometimes returns N/A Metacritic scores), and hasn't yet been added
		if (metacriticData && metacriticData != "N/A" && !node.querySelector(".metacriticRating")) {
			node.appendChild(metacriticLogo());
			node.appendChild(metacriticRating(metacriticData));
		}

		// Add Oscars if movie or series has won at least won Oscar and it hasn't yet been added
		if (oscars && !node.querySelector(".oscars")){
			node.appendChild(oscarsLogo());
			node.appendChild(oscarsNumber(oscars));
		}

		// Add Golden Globes if movie or series has won at least won Golden Globe and it hasn't yet been added
		if (goldenGlobes && !node.querySelector(".goldenGlobe")){
			node.appendChild(goldenGlobeLogo());
			node.appendChild(goldenGlobeNumber(goldenGlobes));
		}
	}
}