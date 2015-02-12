var app = angular.module('codeFriends', ['ngRoute']);

app.config(function($routeProvider, $httpProvider){

	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.interceptors.push('myHttpInterceptor');
	

	$httpProvider.when('/', {
			templateUrl: 'templates/login.html'
		})
		.when('/home', {
			templateUrl: 'templates/home.html', 
			controller: 'homeCtrl'
		})
		.when('/friend/:github_username', {
			template: 'templates/friend.html'
		})

});


// register the interceptor as a service
app.factory('myHttpInterceptor', function($q) {
    return {
        // optional method
        'responseError': function(rejection) {
            if (rejection.status == 403) {
                document.location = '/';
                return;
            }
            return $q.reject(rejection);
        }
    };
});


