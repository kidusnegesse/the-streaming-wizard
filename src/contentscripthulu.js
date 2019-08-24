// Configuration options for mutation observers
var config = {
	attributes: true,
	childList: true,
	subtree: true
}

// Detects changes to masthead element, which is changed when users click on title details
var mastheadObserver = new MutationObserver(function(mutations, observer) {
	// Return observed node
	var node = mutations.find(function(mutation) { 
		return mutation.target.hasAttribute("observed") 
	});

	if (node) {
		// Get target node
		node = node.target;
		
		// masthead element under 'jawBone' class holds title details; it appears when user clicks on a title
		var mastheadNode = node.querySelector(".Masthead__context");

		if (mastheadNode) {
			// Get title name from Mastead__title class
            var title = mastheadNode.querySelector(".Masthead__title").textContent;
			
			// Find metaData class to add ratings to
			var metaData = mastheadNode.querySelector(".Masthead__metadata-container > .Masthead__metadata");
			
			// Get year from the 4th element of class Masthead__meta 
			var yearNode = metaData.querySelectorAll(".Masthead__meta")[3];
			var year = yearNode.textContent;
			
			// If title exists, get and add ratings
			if (title) {
				getRatings(title, year, function(ratings) {
					addRatings(metaData, ratings, title);
				});
			}
		}
	}
});

// Detects changes to hub-container, which is changed when users hover over title
var hubObserver = new MutationObserver(function(mutations, observer) {
	// Return observed node
	var node = mutations.find(function(mutation) { 
		return mutation.target.hasAttribute("observed") 
	});

	if (node) {
		// Get target node
		node = node.target;
		
		// Get title name from GenericTileContent__title class
        var titleNode = node.querySelector(".GenericTileContent__title");
		var title = titleNode.textContent;

		// Find contentNode to insert ratings into
		var contentNode = node.querySelector(".GenericTileContent__details-item");

		// Get year from the 4th element of class GenericTileContent__meta 
		var year = contentNode.querySelectorAll(".GenericTileContent__meta")[3].textContent;

		// If title exists, get and add ratings
		if (title) {
			getRatings(title, year, function(ratings) {
				addRatings(contentNode, ratings, title);
			});
		}
	}
});

// Observe changes when users either click on title details or hover over title element
function addDynamicRatings(node) {
	// Apply titleObserver to all changed nodes under __next clasa	
	if (!node.hasAttribute("observed")) {
		node.setAttribute("observed", "true");
		mastheadObserver.observe(node, config);
	};
	// Apply hubObserver to all changed GenericTileContent__details classes	
	node.querySelectorAll(".GenericTileContent__details").forEach(function (node) {
		if (!node.hasAttribute("observed")) {
			node.setAttribute("observed", "true");
			hubObserver.observe(node, config);
		};
	});
}

// Detect nodes added to mainBody and execute addDynamicRatings
var mainObserver = new MutationObserver(function(mutations, observer) {
	mutations.forEach(function(mutation) {
		if (mutation.addedNodes) {
			mutation.addedNodes.forEach(function(node) {
				if (node.nodeType === 1) {
					addDynamicRatings(node);
				}
			});
		}
	});
});

// Add ratings when user lands on title page url or reloads active hulu browsing page
function addStaticRatings(node) {
	// Get Masthead__context
	var mastheadNode = node.querySelector(".Masthead__context");

	if (mastheadNode) {
		// Get title name from class Masthead__title
		var title = mastheadNode.querySelector(".Masthead__title").textContent;

		// Find metaData to insert ratings into
		var metaData = mastheadNode.querySelector(".Masthead__metadata-container > .Masthead__metadata");

		// Get year from the 4th element of class Masthead__meta 
		var year = metaData.querySelectorAll(".Masthead__meta")[3].textContent;
		
		// If title exists, get and add ratings
		if (title) {
			getRatings(title, year, function(ratings) {
				addRatings(metaData, ratings, title);
			});
		}
	}
}

// Observe __next class, which is loaded on every hulu browsing page
if (mainBody = document.querySelector("#__next")) {
	mainObserver.observe(mainBody, config);
	addDynamicRatings(mainBody);
	addStaticRatings(mainBody);
};