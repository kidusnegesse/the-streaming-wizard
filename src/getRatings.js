// Get rotten tomatoes from source key in OMDB data
function parseRottenTomatoes(rating) {
	return rating["Source"] == "Rotten Tomatoes";
}

// Get rotten tomatoes data
function getRottenTomatoes(response) {
	var ratingsData = response["Ratings"];
	if (ratingsData) {
		var rottenTomatoesRating = ratingsData.find(parseRottenTomatoes);
		if (rottenTomatoesRating) {
			return rottenTomatoesRating["Value"];
		}
	}
}

// Get Oscars, if any
function getOscars(response) {
	var awards = response["Awards"];
	if (awards) {
		if (awards.includes("Oscar") && awards.includes("Won")) {
			var oscarAmount = awards.substring(4, awards.indexOf("Oscar"));
			return oscarAmount;
		}
	}
}

// Get Golden Globes, if any
function getGoldenGlobes(response) {
	var awards = response["Awards"];
	if (awards) {
		if (awards.includes("Golden Globe") && awards.includes("Won")) {
			var goldenGlobesAmount = awards.substring(4, awards.indexOf("Golden Globe"));
			return goldenGlobesAmount;
		}
	}
}

// Private OMDB API key
const OMDB_API_URL = 'https://www.omdbapi.com/?';
const API_KEY = "XXXXXXXX";

// Build query using title and key
function queryBuilder(title, year) {
	var query = {
		"apikey": API_KEY
	};
	if (title) {
		query["t"] = title;
	}
	if (year) {
		query["y"] = year;
	}
	return query;
}

// Get ratings
// Callback function will be addRatings
function getRatings(title, year, callback) {
	// Query using jQuery.ajax
	$.ajax({
		url: OMDB_API_URL,
		dataType: 'json',
		data: queryBuilder(title, year),
		success: function(response) {
			if (!response.imdbRating && year) {
				return getRatings(title, null, callback);
			}
			var ratings = {
				imdb: response.imdbRating,
				imdbTitleID: response.imdbID,
				rottenTomatoes: getRottenTomatoes(response),
				metacritic: response.Metascore,
				oscars: getOscars(response),
				goldenGlobes: getGoldenGlobes(response)
			}
			callback(ratings, title);
		},
		error: function(jqXHR, status, errorThrown) {
			if (status == "timeout") {
				getRatings(title, null, callback);
			}
		},
		timeout: 3000
	});	
}
