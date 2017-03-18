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
	.directive('compressImg', function ($parse) {
		return {
			restrict: 'EA',
			//require: ['imageSrc', 'imageQuality', 'imageOutput'],
			link: function (scope, element, attrs) {
				function compress() {
					var result, imageSrc, imgElement, quality;

					if (!attrs.imageSrc) { return; }


					imageSrc = $parse(attrs.imageSrc)(scope);
					quality = attrs.imageQuality || 8;

					imgElement = angular.element('<img />')
						.attr('src', imageSrc);

					result = window.compressImage(imgElement[0], quality);
					scope[attrs.imageOutput] = result;
					element.attr('src', result);
				};

				scope.$watch(attrs.imageSrc, function (newValue, oldValue) {
					if (newValue == oldValue) {
						return;
					}
					compress();
				});
			}
		};
	})
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
            	templateUrl: 'demo_2.html',
            	controller: 'angularImgController'
            })
            .when('/demo2', {
            	templateUrl: 'demo_1.html',
            	controller: 'ngImgController'
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








/**
* Receives an Image Object (can be JPG OR PNG) and returns a new Image Object compressed
* @param {Image} source_img_obj The source Image Object
* @param {Integer} quality The output quality of Image Object
* @param {String} output format. Possible values are jpg and png
* @return {Image} result_image_obj The compressed Image Object
*/
window.compressImage = function (sourceImgElement, quality, outputFormat) {
	var output, canvas, canvasContext, mimeType;

	mimeType = outputFormat || "image/png";

	var canvas = document.createElement('canvas');
	canvas.width = sourceImgElement.naturalWidth;
	canvas.height = sourceImgElement.naturalHeight;
	canvasContext = canvas.getContext("2d").drawImage(sourceImgElement, 0, 0);
	output = canvas.toDataURL(mimeType, quality / 100);

	return output;
};
