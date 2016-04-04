angular.module('SimpleRESTIonic.controllers', [])

    .controller('LoginCtrl', function (Backand, $state, $rootScope, LoginService) {
        var login = this;

        function signin() {
            LoginService.signin(login.email, login.password)
                .then(function () {
                    onLogin();
                }, function (error) {
                    console.log(error)
                })
        }

        function anonymousLogin(){
            LoginService.anonymousLogin();
            onLogin();
        }

        function onLogin(){
            $rootScope.$broadcast('authorized');
            $state.go('tab.dashboard');
        }

        function signout() {
            LoginService.signout()
                .then(function () {
                    //$state.go('tab.login');
                    $rootScope.$broadcast('logout');
                    $state.go($state.current, {}, {reload: true});
                })

        }

        login.signin = signin;
        login.signout = signout;
        login.anonymousLogin = anonymousLogin;
    })

   /* .controller('DashboardCtrl', function (ItemsModel, $rootScope) {
        var vm = this;

        function goToBackand() {
            window.location = 'http://docs.backand.com';
        }

        function getAll() {
            ItemsModel.all()
                .then(function (result) {
                    vm.data = result.data.data;
                });
        }

        function clearData(){
            vm.data = null;
        }

        function create(object) {
            ItemsModel.create(object)
                .then(function (result) {
                    cancelCreate();
                    getAll();
                });
        }

        function update(object) {
            ItemsModel.update(object.id, object)
                .then(function (result) {
                    cancelEditing();
                    getAll();
                });
        }

        function deleteObject(id) {
            ItemsModel.delete(id)
                .then(function (result) {
                    cancelEditing();
                    getAll();
                });
        }

        function initCreateForm() {
            vm.newObject = {name: '', description: ''};
        }

        function setEdited(object) {
            vm.edited = angular.copy(object);
            vm.isEditing = true;
        }

        function isCurrent(id) {
            return vm.edited !== null && vm.edited.id === id;
        }

        function cancelEditing() {
            vm.edited = null;
            vm.isEditing = false;
        }

        function cancelCreate() {
            initCreateForm();
            vm.isCreating = false;
        }

        vm.objects = [];
        vm.edited = null;
        vm.isEditing = false;
        vm.isCreating = false;
        vm.getAll = getAll;
        vm.create = create;
        vm.update = update;
        vm.delete = deleteObject;
        vm.setEdited = setEdited;
        vm.isCurrent = isCurrent;
        vm.cancelEditing = cancelEditing;
        vm.cancelCreate = cancelCreate;
        vm.goToBackand = goToBackand;
        vm.isAuthorized = false;

        $rootScope.$on('authorized', function () {
            vm.isAuthorized = true;
            getAll();
        });

        $rootScope.$on('logout', function () {
            clearData();
        });

        if(!vm.isAuthorized){
            $rootScope.$broadcast('logout');
        }

        initCreateForm();
        getAll();

    })*/
		
		.directive('searchBar', [function () {
			return {
				scope: {
					ngModel: '='
				},
				require: ['^ionNavBar', '?ngModel'],
				restrict: 'E',
				replace: true,
				template: '<ion-nav-buttons side="right">'+
								'<div class="searchBar">'+
									'<div class="searchTxt" ng-show="ngModel.show">'+
								  		'<div class="bgdiv"></div>'+
								  		'<div class="bgtxt">'+
								  			'<input type="text" placeholder="Search" ng-model="ngModel.txt">'+
								  		'</div>'+
							  		'</div>'+
								  	'<i class="icon placeholder-icon" ng-click="ngModel.txt=\'\';ngModel.show=!ngModel.show"></i>'+
								'</div>'+
							'</ion-nav-buttons>',

				compile: function (element, attrs) {
					var icon=attrs.icon
							|| (ionic.Platform.isAndroid() && 'ion-android-search')
							|| (ionic.Platform.isIOS()     && 'ion-ios7-search')
							|| 'ion-search';
					angular.element(element[0].querySelector('.icon')).addClass(icon);
	
					return function($scope, $element, $attrs, ctrls) {
						var navBarCtrl = ctrls[0];
						$scope.navElement = $attrs.side === 'right' ? navBarCtrl.rightButtonsElement : navBarCtrl.leftButtonsElement;
		
					};
				},
				controller: ['$scope','$ionicNavBarDelegate', function($scope,$ionicNavBarDelegate){
					var title, definedClass;
					$scope.$watch('ngModel.show', function(showing, oldVal, scope) {
						if(showing!==oldVal) {
							if(showing) {
								if(!definedClass) {
									var numicons=$scope.navElement.children().length;
									angular.element($scope.navElement[0].querySelector('.searchBar')).addClass('numicons'+numicons);
								}
				
								title = $ionicNavBarDelegate.title;
								$ionicNavBarDelegate.title('');
							} else {
								$ionicNavBarDelegate.title(title);
							}
						} else if (!title) {
							title = $ionicNavBarDelegate.title;
						}
					});
				}]
			};
		}])
		
		
    .controller('GroupCtrl', function (GroupModel, $stateParams, $state, $scope, $rootScope) {
			$scope.vm = this;
			$scope.categories = [{category: '', groups: []}];

        function getAll() {
           	GroupModel.all()
                .then(function (result) {
                    $scope.vm.data = result.data.data;
										
                });
        }
				//need to organize into the respective categories somehow...
				function organizeCategory(group) {
					var currentGroupCategory = group.category;
					for(var i; i < $scope.categories.length; i++) {
						if($scope.categories[i].category === currentGroupCategory) {
							$scope.categories[i].groups.append(currentGroupCategory);
							return;
						}
					}
					$scope.categories.append({category: currentGroupCategory, groups: [group.name]});

				}
				
				for(object in $scope.vm.data) {
					organizeCategory(object);
				}
				
				
				$scope.viewDetails = function(object) {
					
					$state.go('tab.groups-detail', {'groupId': object.id});
				}
				
				
        $scope.vm.getAll = getAll;

        getAll();
    })
		
		.controller('GroupDetailCtrl', function (GroupModel, $stateParams, $state, $scope, $rootScope) {
			$scope.group = this;
      function fetchObject(id) {
          GroupModel.fetch(id)
              .then(function (result) {
								$scope.group = result.data;
								
              });
      }
			fetchObject($stateParams.groupId);
		})
		
		
    .controller('ThingsToDoDetailCtrl', function (BusinessModel, $stateParams, $state, $scope, $rootScope) {
			$scope.business = this;
      function fetchObject(id) {
          BusinessModel.fetch(id)
              .then(function (result) {
								$scope.business = result.data;
								console.log($scope.business);
              });
      }
			fetchObject($stateParams.businessId);
			$scope.reviews = $scope.business.reviews;
			console.log($scope.reviews);
    })
		
		
    .controller('ThingsToDoCtrl', function (BusinessModel, $state, $scope, $rootScope) {
			$scope.vm = this;

        function getAll() {
           	BusinessModel.all()
                .then(function (result) {
                    $scope.vm.data = result.data.data;

                });
        }
				

      	function clearData(){
            $scope.vm.data = null;
        }
				
				$scope.viewDetails = function(object) {
					console.log(object.id);
					
					$state.go('tab.things-detail', {'businessId': object.id});
				}


        $scope.vm.getAll = getAll;

        getAll();

    });
