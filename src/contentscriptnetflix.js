// Configuration options for mutation observers
var config = {
	childList: true,
	subtree: true
}

// Detects changes to jawBone element, which is changed when users click on title details
var titleObserver = new MutationObserver(function(mutations, observer) {
	// Return observed node
	var node = mutations.find(function(mutation) { 
		return mutation.target.hasAttribute("observed") 
	});
	
	if (node) {
		// Get target node
		node = node.target;

		// h3 element under 'jawBone' class holds title details; it appears when user clicks on a title
		var jawboneNode = node.querySelector(".jawBone > h3");

		if (jawboneNode) {
			// Get title name from img 'alt' attribute
			var titleNode = jawboneNode.querySelector(".title");
			var title = titleNode.querySelector("img").alt;
			
			// Get year from class year
			yearNode = node.querySelector(".year");
  			year = yearNode ? yearNode.textContent : null;

			// If title exists, get and add ratings
			if (title) {
				getRatings(title, year, function(ratings) {
					addRatings(node.querySelector(".meta"), ratings, title);
				});
			}
		}
	}
});

// Detect changes to bob-container, which is changed when users hover over title
var hoverTitleObserver = new MutationObserver(function(mutations, observer) {
	// Return observed node
	var node = mutations.find(function(mutation) { 
		return mutation.target.hasAttribute("observed") 
	});

	if (node) {
		// Get target node
		node = node.target;

		// Get title name from bob-title class
		var titleNode = node.querySelector(".bob-title");
		var title = titleNode.textContent;

		// Find contentNode to insert ratings into
		var contentNode = node.querySelector(".bob-metadata-wrapper");

		// Year doesn't show when users hover
		// This will cause conflicts for non-unique movie or show titles

		// If title exists, get and add ratings
		if (title) {
			getRatings(title, null, function(ratings) {
				addRatings(contentNode.querySelector(".meta"), ratings, title);
			});
		}
	}
});

// Observe changes when users either click on title details or hover over title element
function addDynamicRatings(node) {
	// Apply titleObserver to all changed jawBoneContent classes
	node.querySelectorAll(".jawBoneContent").forEach(function(node) {
		if (!node.hasAttribute("observed")) {
			node.setAttribute("observed", "true");
			titleObserver.observe(node, config);
		};
	});
	// Apply hoverTitleObserver to all changed bob-container classes
	node.querySelectorAll(".bob-container").forEach(function(node) {
		if (!node.hasAttribute("observed")) {
			node.setAttribute("observed", "true");
			hoverTitleObserver.observe(node, config);
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

// Add ratings when user lands on title page url or reloads active netflix browsing page
function addStaticRatings(node) {
	// Get jawBoneContainer
	var jawBoneContainer = node.querySelector(".jawBoneContainer > .jawBone");
	
	if (jawBoneContainer) {

		// Get title name from class that begins with title
		var titleNode = jawBoneContainer.querySelector(".title");
		if (titleNode) {
			// Grab title from img element 'alt' attribtue or text from img element
			if (img = titleNode.querySelector("img")) {
				title = img.alt;
			} else {
				title = titleNode.textContent;
			}
			
			// Get year from class year
			yearNode = jawBoneContainer.querySelector(".year");
			year = yearNode ? yearNode.textContent : null;
			
			// Get and add ratings
			getRatings(title, year, function(ratings) {
				addRatings(node.querySelector(".meta"), ratings, title);
			});
		}
	}
}

// Observe mainView class, which is loaded on every netflix browsing page
if (mainBody = document.querySelector(".mainView")) {
	mainObserver.observe(mainBody, config);
	addDynamicRatings(mainBody);
	addStaticRatings(mainBody);
}
