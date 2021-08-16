/**
 * Applies a mask for hex color codes on the given field
 */
function applyHexColorMask(field) {
	var maskFields = [
	                  fieldBuilder.literal("#"),
	                  fieldBuilder.input("0123456789aAbBcCdDeEfF", 6, 6, true)
	                  ];
	return new InputMask(maskFields, field);
}

/**
 * Gets the current position of the user
 */
function locate(onSuccess, onFailure) {
	if (navigator.geolocation) {
		navigator.geolocation
				.getCurrentPosition(
						function(position) {
							onSuccess(position);							
						},
						function(error) {
							onFailure(error);
						});
	} else {
		onFailure(null);
	}
}

var problemsLoadingInterval;
function startLoading() {
	document.getElementById('rootSpinner').style.display = '';
	if (!problemsLoadingInterval) {
    	problemsLoadingInterval = setTimeout(function() {
    		setProblemsLoadingVisible(true);
    	}, 15000);
	}
}
function stopLoading() {
    document.getElementById('rootSpinner').style.display = 'none';
	setProblemsLoadingVisible(false);
}

/**
 * Shows / hides the problems loading message
 */
function setProblemsLoadingVisible(visible) {
	document.getElementById('problemsLoading').style.display = visible ? '' : 'none';
	if (!visible) {
		clearInterval(problemsLoadingInterval);
		problemsLoadingInterval = null;
	}
}
