var app = angular.module('codeFriends');

app.service('githubService', function($http, $q){

	this.getFollowing = function() {
		var deferred = $q.defer();
		$http.get('http://localhost:9998/auth/github/following')
		.then(function(response){
			deferred.resolve(response.data);
		});
		return deferred.promise;
	}
});