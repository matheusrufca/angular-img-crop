

angular.module('demo1', ['ngImgCrop', 'ngImageCompress'])
	.controller('ngImgController', function ($scope) {
		$scope.myImage = '';
		$scope.myCroppedImage = '';

		var handleFileSelect = function (evt) {
			var file = evt.currentTarget.files[0];
			var reader = new FileReader();
			reader.onload = function (evt) {
				$scope.$apply(function ($scope) {
					$scope.myImage = evt.target.result;
				});
			};
			reader.readAsDataURL(file);
		};
		angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
	});



angular.module('demo2', ['angular-img-cropper', 'ngImageCompress'])
	.controller("angularImgController", ['$scope', function ($scope) {
		$scope.cropper = {};
		$scope.cropper.sourceImage = null;
		$scope.cropper.croppedImage = null;
		$scope.bounds = {};
		$scope.bounds.left = 0;
		$scope.bounds.right = 0;
		$scope.bounds.top = 0;
		$scope.bounds.bottom = 0;
	}]);


angular.module("app", ["ngRoute", 'demo1', 'demo2'])
    .config(function ($routeProvider) {
    	$routeProvider
            .when('/demo1', {
            	templateUrl: 'demo_1.html',
            	controller: 'ngImgController'
            })
            .when('/demo2', {
            	templateUrl: 'demo_2.html',
            	controller: 'angularImgController'
            })
            .otherwise({ redirectTo: '/demo1' });
    })
    .directive('navigation', function ($rootScope, $location) {
    	return {
    		template: '<li ng-repeat="option in options" ng-class="{active: isActive(option)}">' +
                      '    <a ng-href="{{option.href}}">{{option.label}}</a>' +
                      '</li>',
    		link: function (scope, element, attr) {
    			scope.options = [
                    { label: "ngImgCrop", href: "#/demo1" },
                    { label: "angular-image-crop", href: "#/demo2" }
    			];

    			scope.isActive = function (option) {
    				return option.href.indexOf(scope.location) === 1;
    			};

    			$rootScope.$on("$locationChangeSuccess", function (event, next, current) {
    				scope.location = $location.path();
    			});
    		}
    	};
    });