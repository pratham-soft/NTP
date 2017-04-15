var app = angular.module("pratham",['ui.router','ngCookies']);
app.config(function($stateProvider, $urlRouterProvider) {
$urlRouterProvider.otherwise('/Login');
$stateProvider
    .state('/RegisterFirm', {
		url: '/RegisterFirm',
		templateUrl: 'partials/firmRegister.html',
		controller: 'firmRegister'
	})
    .state('/AdminCreation', {
		url: '/AdminCreation',
		templateUrl: 'partials/adminCreation.html',
		controller: 'adminCreation'
	})
    .state('/Login', {
		url: '/Login',
		templateUrl: 'partials/login.html',
		controller: 'login'
	})
});
app.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
