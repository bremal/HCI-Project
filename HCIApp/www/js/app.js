// Ionic template App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'SimpleRESTIonic' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('SimpleRESTIonic', ['ionic', 'backand', 'SimpleRESTIonic.controllers', 'SimpleRESTIonic.services'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });
    })
    .config(function (BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider) {

        BackandProvider.setAppName('hciapp'); // change here to your app name
			  BackandProvider.setSignUpToken('f5d78389-2b05-4b8d-a38a-29babbcbec54');
			  BackandProvider.setAnonymousToken('c3b29221-f9aa-4d9b-a24f-48d2fa26af5e');

        $stateProvider
            // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tabs',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })
            .state('tab.dashboard', {
                url: '/dashboard',
                views: {
                    'tab-dashboard': {
                        templateUrl: 'templates/tab-dashboard.html',
                        controller: 'DashboardCtrl as vm'
                    }
                }
            })
            .state('tab.login', {
                url: '/login',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-login.html',
                        controller: 'LoginCtrl as login'
                    }
                }
            })
            .state('tab.home', {
                url: '/home',
                views: {
                    'tab-home': {
                        templateUrl: 'templates/tab-home.html'
                    }
                }
            })
						.state('tab.preferences', {
							url: '/preferences',
							views: {
								'tab-home': {
										templateUrl: 'templates/preferences.html'
								}
							}
						})
            .state('tab.thingstodo', {
                url: '/thingstodo',
                views: {
                    'tab-thingstodo': {
                        templateUrl: 'templates/tab-things.html',
												controller: 'ThingsToDoCtrl'
                    }
                }
            })
            .state('tab.things-detail', {
                url: '/thingstodo/:businessId',
                views: {
                    'tab-thingstodo': {
                        templateUrl: 'templates/tab-things-detail.html',
											controller: 'ThingsToDoDetailCtrl'
                    }
                }
            })
            .state('tab.groups', {
                url: '/groups',
                views: {
                    'tab-groups': {
                        templateUrl: 'templates/groups.html',
											controller: 'GroupCtrl'
                    }
                }
            })
            .state('tab.groups-detail', {
                url: '/groups/:groupId',
                views: {
                    'tab-groups': {
                        templateUrl: 'templates/group-details.html',
											controller: 'GroupDetailCtrl'
                    }
                }
            })
            .state('tab.forum', {
                url: '/forum',
                views: {
                    'tab-forum': {
                        templateUrl: 'templates/forum.html'
                    }
                }
            });

        $urlRouterProvider.otherwise('/tabs/dashboard');

        $httpProvider.interceptors.push('APIInterceptor');
    })

    .run(function ($rootScope, $state, LoginService, Backand) {

        function unauthorized() {
            console.log("user is unauthorized, sending to login");
            $state.go('tab.login');
        }

        function signout() {
            LoginService.signout();
        }

        $rootScope.$on('unauthorized', function () {
            unauthorized();
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            if (toState.name == 'tab.login') {
                signout();
            }
            else if (toState.name != 'tab.login' && Backand.getToken() === undefined) {
                unauthorized();
            }
        });

    })

