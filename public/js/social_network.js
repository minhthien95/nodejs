app.controller('SocialController', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
	var currentURL = encodeURIComponent(location.href);

	var fbURL = "https://www.facebook.com/plugins/share_button.php?href=";
	var fbOptions = "&layout=button_count&mobile_iframe=true&width=119&height=20&appId";
	
	var twitURL = "http://platform.twitter.com/widgets/tweet_button.html?url=";
	var twitOptions = "&count=horizontal";

	var ggURL = "https://plus.google.com/share?url=";
	var linkURL = "https://www.linkedin.com/cws/share?url=";
	var zingURL = "http://link.apps.zing.vn/share?url=";
	$scope.fbshareURL = $sce.trustAsResourceUrl(fbURL + currentURL + fbOptions);
	$scope.twitshareURL = $sce.trustAsResourceUrl(twitURL + currentURL + twitOptions);
	$scope.ggshareURL = $sce.trustAsResourceUrl(ggURL + currentURL);
	$scope.linkshareURL = $sce.trustAsResourceUrl(linkURL + currentURL);
	$scope.zingshareURL = $sce.trustAsResourceUrl(zingURL + currentURL);
	$scope.ggClick = function(){
		window.open($scope.ggshareURL,'','menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
	}

	$scope.linkClick = function(){
		window.open($scope.linkshareURL,'','menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
	}

	$scope.zingClick = function(){
		window.open($scope.zingshareURL,'','menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
	}
}]);