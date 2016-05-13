app.controller('ResultController', ['$scope', '$http', function($scope, $http)  {
	$scope.LoadResultList = function(){
	    $http.get('http://127.0.0.1:3000/result').then(function(res) {
	    	var tem = null;
	    	if(res.data != null){
	    		tem = res.data;
	    	}

	    	var data = [];
	    	for (var i = 0; i < tem.length; i++) {
	    		if (tem[i].was_delivered == 0)
	    		{
	    			data.push(tem[i]);
	    		}
	    	}

	    	var resultList = [];

	    	if(data != null || data.length > 0){
	    		//Create page
				var numPage = new Array();
		    	var k = 1;
		    	var t = 20;
		    	while(data.length - t > 0){
		    		k++;
		    		t+=20;
		    	}
		    	for (var i = 1; i <= k; i++) {
		    		numPage.push(i);
		    	}	
		    	if(data.length == 0)
		    		numPage = [];

				$scope.PageResultIndex = numPage;

				//Load page result
				var curResultPage = sessionStorage.curResultPage;
	    		for (var i = 20*(curResultPage-1); i < 20 * curResultPage; i++)
				{
					if(data[i] !=  null)
					{
			    		var date1 = data[i].win_date.split("-"); 
						var date2 = date1[2].split("T");
		    			var localTime = new Date(data[i].win_date).toLocaleTimeString();
						var	date3 = localTime.split(":");
						data[i].win_date = date3[0] + ":" + date3[1] + ":" + date3[2] + "  "  + date2[0]  + "-" + date1[1]  + "-" + date1[0];
						resultList.push(data[i]);
					}
				}
	    	}

	    	//If the length of result list equal 0, load again
			if(resultList.length == 0)
				$scope.LoadResultList();

	        $scope.results = resultList;
	    });
	}

	$scope.LoadResultList();

	$scope.PageResultClick = function(id){
		sessionStorage.curResultPage = id;
		LoadResultList();
	}

	$scope.PageResultActive = function(id){
		if(sessionStorage.curResultPage == null)
			sessionStorage.curResultPage = 1;

		var curPage = sessionStorage.curResultPage;
		if(id == curPage)
			return "active";
		else
			return "";
	}
}]);