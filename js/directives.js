// DIRECTIVES

app.directive('searchResult', function() {
	return {
		restrict: 'AE',
		replace: true,
		templateUrl: '/js/directive_templates/searchResult.html'
	}
});