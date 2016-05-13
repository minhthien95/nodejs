app.controller('ProductDetailCtr', ['$scope', '$http', function($scope, $http) {		    	
	var htmlCode = location.href;
	var temp = htmlCode.split("=");
	var curProID = temp[1];
	sessionStorage.curProID = curProID;

	var urlView = 'http://127.0.0.1:3000/addview/' + curProID;
	$http({
	        url: urlView,
	        method: 'POST',
        }).then(function(res) {
    });

	$http.get('http://127.0.0.1:3000/product/id/' + curProID).then(function(res) {
		var dataDetail;
   		if(res.data != null)
   		{
			dataDetail = res.data[0];
			sessionStorage.dataDetail = dataDetail.content;
			sessionStorage.proEndDay = dataDetail.end_day;
			sessionStorage.proPrice = dataDetail.price;

			//Show information in information button
			$scope.content = dataDetail.content;
   		}

		if(curProID != 0)
		{
			var start_day = dataDetail.start_day;
			var end_day = dataDetail.end_day;

			var date1 = start_day.split("-");
			var date2 = date1[2].split("T");
			var date3 = new Date(start_day).toLocaleTimeString();
			dataDetail.start_day = date3 + "  "  + date2[0]  + "-" + date1[1]  + "-" + date1[0];  

			date1 = end_day.split("-");
			date2 = date1[2].split("T");
			date3 = new Date(end_day).toLocaleTimeString();
			dataDetail.end_day = date3 + "  "  + date2[0]  + "-" + date1[1]  + "-" + date1[0];  
		}

		$scope.detail = dataDetail;
	});

	$scope.pro_id = curProID;
}]);

app.controller('RateController', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
	$scope.getRatio = function(pro_id){
    	$scope.starIndex = function (htmlCode) {
       	 	return $sce.trustAsHtml(htmlCode);
		};

	    $http.get('http://127.0.0.1:3000/rate/' + pro_id).then(function(res) {
	    	var percent = 0;
	    	var count = 0;
	    	var dataRate = null;
	    	if(res.data.length != 0)
	    	{
	    		dataRate = res.data;
	    		for (var i = 0; i < dataRate.length; i++) {
	    			count += dataRate[i].ratio;
	    		}
	    	}

    		if(count != 0 && dataRate.length != 0)
				percent = Math.round(count / (dataRate.length*1.0));

	    	var star = new Array();
			for (var i = 1; i <= 5; i++) {
				if(i <= percent){
					star.push(1);
				}
				else{
					star.push(3);
				}
			}

			var content = "";
			for (var i = 0; i < star.length; i++) {
				content += '<img src="images/Stars/' + star[i] +'.png" alt=""/>'
			}
			
			if(dataRate != null)
				count = dataRate.length;
			else
				count = 0;
			$scope.count = count;			
			$scope.star = content;
	    });
	}
}]);

app.controller("AuctionBidCtrl", ['$scope', '$http', '$sce', '$timeout', function($scope, $http, $sce, $timeout) {
	var price;
	var nowDay;

	if(sessionStorage.curTablePage == null){
		sessionStorage.curTablePage = 1;
	}

	function GetData(data, type){
		//Get list bid length
	    $scope.auctionCount = data.length;

	    //Get maximum bid price
	    var max = Number(sessionStorage.proPrice);
	    var userBid = "";
	    for (var i = 0; i < data.length; i++) {
	    	var temp = Number(data[i].price) 
	    	if(temp >= max)
	    	{
	    		max = temp;
	    		userBid = data[i].username;
	    	}
	    }

	    //Save username put highest bid
	    sessionStorage.proWiner = userBid;
	    $scope.maxPrice = max;

		sessionStorage.ListUserBid = JSON.stringify(data);

		var listb = "";
		
		//Create page
		var numPage = new Array();
    	var k = 1;
    	var t = 8;
    	while(data.length - t > 0){
    		k++;
    		t+=8;
    	}
    	for (var i = 1; i <= k; i++) {
    		numPage.push(i);
    	}	
    	if(data.length == 0)
    		numPage = [];
		$scope.PageTableIndex = numPage;

		//Load page content
		var curTablePage = sessionStorage.curTablePage;
		if(data.length != 0){
			listb = '<table class="table table-striped">'+
	                    '<thead>'+
	                        '<tr>'+
	                            '<th>Username</th>'+
	                            '<th>Price</th>'+
	                            '<th class="text-center">Date</th>'+
	                        '</tr>'+
	                    '</thead>'+
	                    '<tbody>';

	    	for (var i = 8*(curTablePage-1); i < 8 * curTablePage; i++) {
		    		if(data[i] != null){ 
		    			var date1 = data[i].date.split("-"); 
						var date2 = date1[2].split("T");
						var date3;
						if(type == 0)
						{
			    			var localTime = new Date(data[i].date).toLocaleTimeString();
							date3 = localTime.split(":");
						}
						else {
							var localTime;
							if(date2[1].indexOf(".000Z") > -1){
								localTime = new Date(data[i].date).toLocaleTimeString();
								date3 = localTime.split(":");
							}
							else
								date3 = date2[1].split(":");
							
						}
										
						var date = date3[0] + ":" + date3[1] + ":" + date3[2] + "  "  + date2[0]  + "-" + date1[1]  + "-" + date1[0];
						listb += '<tr>'+
			                            '<td>'+ data[i].username +'</td>'+
			                            '<td>'+ data[i].price +'</td>'+
			                            '<td>' + date +'</td>'+
			                      '</tr>';
		    		}
    		}
	        listb +=  '</tbody></table>';
	    }
	    return listb;
	}

	GetListBid(0);

	function GetListBid(type){
		var curProID = sessionStorage.curProID;
		if(curProID == null){
			var htmlCode = location.href;
			var temp = htmlCode.split("=");
			var curProID = temp[1];
		}

		if(type == 0){
			$http.get('http://127.0.0.1:3000/list_bid/' + curProID).then(function(res) {
				var listbid = "";
				var data = null;
				if(res.data != null)
					data = res.data;

				listbid = GetData(data, 0);
				$scope.tablebid = listbid;
			});

			$timeout(function(){
				if(type == 0)
					GetListBid(0);
		    }, 1000);
		}
		else{
			data1 =  JSON.parse(sessionStorage.ListUserBid);
			var data = new Array();
			var username = sessionStorage.username;
			if(data1.length == 0)
			{
				var temp = {username: username, price: price, date:nowDay};
				data.push(temp);
			}
			else
			{
				var temp = {username: username, price: price, date:nowDay};
				data.push(temp);
				for(var i=0; i< data1.length; i++)
					data.push(data1[i]);
			}

			var listbid = GetData(data, 1);
			$scope.tablebid = listbid;
		}
	}

	$scope.ListBid = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

	$scope.PageTableClick = function(id){
		sessionStorage.curTablePage = id;
		GetListBid(0);
	}

	$scope.PageATablective = function(id){
		if(sessionStorage.curTablePage == null)
			sessionStorage.curTablePage = 1;

		var curPage = sessionStorage.curTablePage;	
		if(id == curPage)
			return "active";
		else
			return "";
	}

	$scope.PostPrice = function(){ 
		var username = sessionStorage.username;
		if(username == null || username.length == 0){
			alert("You need sign in to participate in Bid");
		}
		else{
			price = document.getElementById("bid").value;
			today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1;
			var yy = today.getFullYear();
			var hour = today.getHours();
			var minute = today.getMinutes();
			var second = today.getSeconds();
			mm =  mm < 10 ? '0' + mm : '' + mm;
			dd = dd< 10 ? '0' + dd : '' + dd;
			hour = hour < 10 ? '0' + hour : '' + hour;
			minute = minute < 10 ? '0' + minute : '' + minute;
			second = second < 10 ? '0' + second : '' + second;

			today = yy + '-' + mm + '-' + dd + 'T' + hour + ':' + minute + ':' + second + '.000Z';
	        nowDay = yy + '-' + mm + '-' + dd + 'T' + hour + ':' + minute + ':' + second;

			if(price != null && price > 0 && !isNaN (price)){
				$http({
		                url: 'http://127.0.0.1:3000/list_bid/add',
		                method: 'POST',
		                data: {
		                    'product_id': sessionStorage.curProID,
		                    'user_id': sessionStorage.user_id,
		                    'price': price,
		                    'date': today
		                }
		            }).then(function(res) {
		        });
	        	GetListBid(1);
		    }
		}
    }
}]);

app.controller("ChangeContentCtrl", ['$scope', '$http', '$sce', '$timeout', function($scope, $http, $sce, $timeout) {
	var activeBtn = 0;
	var userContent;
	var nowDay;

	if(sessionStorage.curCommentPage == null){
		sessionStorage.curCommentPage = 1;
	}

	function GetComment(data, type){
		sessionStorage.ListComment = JSON.stringify(data);
		var comment = "";
			comment = 	'<div class="panel panel-default">'+
					'<div class="panel-body">'+
						'<div class="form-group">' +
							'<textarea class="form-control" rows="3" ng-model="comment" placeholder="Your comment...."></textarea>'+
							'<button type="submit" class="btn btn-success pull-right" ng-click="PostComment()" style = "margin-top:5px;">Comment</button>'+
						'</div>'+
					'</div>'+
				'</div>';

		//Create page
		var numPage = new Array();
    	var k = 1;
    	var t = 15;
    	while(data.length - t > 0){
    		k++;
    		t+=15;
    	}
    	for (var i = 1; i <= k; i++) {
    		numPage.push(i);
    	}	
    	if(data.length == 0)
    		numPage = [];

		$scope.PageCommentIndex = numPage;

		//Load page comment
		var curCommentPage = sessionStorage.curCommentPage;
		if(data.length != 0)
		{
			for (var i = 15*(curCommentPage-1); i < 15 * curCommentPage; i++){
				if(data[i] != null){
					var date1 = data[i].date.split("-"); 
					var date2 = date1[2].split("T");
					var date3;
					if(type == 0)
					{
		    			var localTime = new Date(data[i].date).toLocaleTimeString();
						date3 = localTime.split(":");
					}
					else {
						var localTime;
						if(date2[1].indexOf(".000Z") > -1){
							localTime = new Date(data[i].date).toLocaleTimeString();
							date3 = localTime.split(":");
						}
						else
							date3 = date2[1].split(":");
					}

					var date = date3[0] + ":" + date3[1] + ":" + date3[2] + "  "  + date2[0]  + "-" + date1[1]  + "-" + date1[0];
					comment += '<div class="panel panel-default">'+
							  		'<div class="panel-heading">Username: '+ data[i].username + 
							  			'<div class = "pull-right">Date: ' + date +
							  			'</div>'+
							  		'</div>' +
								  	'<div class="panel-body">'+
								    	data[i].content +
								  	'</div>'+
								'</div>';
				}
			}
		}
		return comment;
	}

	//type is iformation or comment, commentType: Load data from server or use current data
    var isChange = false; 
	$scope.LoadContent = function(pro_id, typeData, commentType){ 
        activeBtn = typeData;

		if(typeData == 0){
			var abc = "";
			if(sessionStorage.dataDetail != null)
				abc = sessionStorage.dataDetail;
			$scope.content = abc;
			isChange = true;
		}
		else
		{
			if(commentType == 0)
			{
				$http.get('http://127.0.0.1:3000/comment/' + pro_id).then(function(res) {
					var data = null;
					if (res.data != null) {
						data = res.data;
					}

					$scope.content = GetComment(data, 0);
				});

				$timeout(function(){
					if(!isChange){
						isChange = false; 
						$scope.LoadContent(pro_id, 1, 0);
					}
				}, 1000);
			}
			else
			{
				data1 =  JSON.parse(sessionStorage.ListComment);
				var data = new Array();
				var username = sessionStorage.username;
				if(data1.length == 0)
				{
					var temp = {username: username, content: userContent, date:nowDay};
					data.push(temp);
				}
				else
				{
					var temp = {username: username, content: userContent, date:nowDay};
					data.push(temp);
					for(var i=0; i< data1.length; i++)
						data.push(data1[i]);
				}

				var liscontent = GetComment(data, 1);
				$scope.content = liscontent;
			}
		}
	}

	$scope.activeBtn = function(id){
		if(id == activeBtn)
			return "btn btn-default btn-lg active";
		else
			return "btn btn-default btn-lg";
	}

	$scope.PageCommentClick = function(id){
		sessionStorage.curCommentPage = id;
		var curProID = sessionStorage.curProID;
		$scope.LoadContent(curProID, 1, 0);
	}

	$scope.PageCommentActive = function(id){
		if(sessionStorage.curCommentPage == null)
			sessionStorage.curCommentPage = 1;

		var curPage = sessionStorage.curCommentPage;	
		if(id == curPage)
			return "active";
		else
			return "";
	}

	$scope.PostComment = function(){ 
		var username = sessionStorage.username;
		if(username==null || username.length == 0){
			alert("You need sign in to comment");
		}
		else{
			userContent = $scope.comment;
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1;
			var yy = today.getFullYear();
			var hour = today.getHours();
			var minute = today.getMinutes();
			var second = today.getSeconds();
			var curProID = sessionStorage.curProID;
			mm =  mm < 10 ? '0' + mm : '' + mm;
			dd = dd< 10 ? '0' + dd : '' + dd;
			hour = hour < 10 ? '0' + hour : '' + hour;
			minute = minute < 10 ? '0' + minute : '' + minute;
			second = second < 10 ? '0' + second : '' + second;
			today = yy + '-' + mm + '-' + dd + 'T' + hour + ':' + minute + ':' + second + '.000Z';
			nowDay = yy + '-' + mm + '-' + dd + 'T' + hour + ':' + minute + ':' + second;
			$scope.comment = "";

			if(userContent.length != 0){
				$http({
		                url: 'http://127.0.0.1:3000/comment/add',
		                method: 'POST',
		                data: {
		                    'product_id': curProID,
		                    'user_id': sessionStorage.user_id,
		                    'content': userContent,
		                    'date': today
		                }
		            }).then(function(res) {
		        });
	    	    $scope.LoadContent(curProID, 1, 1);
		    }
		}
    }	
}]);

app.directive('dir', function($compile, $parse) {
    return {
      restrict: 'E',
      link: function(scope, element, attr) {
        scope.$watch(attr.content, function() {
          element.html($parse(attr.content)(scope));
          $compile(element.contents())(scope);
        }, true);
      }
    }
})