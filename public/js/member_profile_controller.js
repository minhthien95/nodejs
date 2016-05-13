app.controller('profileController',['$scope', '$http', function($scope, $http){
	$scope.InfoUser = JSON.parse(sessionStorage.InfoUser);
								
	$scope.radioData = {
		value: $scope.InfoUser.sex
	}

	$scope.updateUserInfo = function(){
		var info = {
			full_name : $('#full_name').val(),
			birthday : $('#birthday').val(),
			sex : $("input:checked").val(),
			email : $('#email').val(),
			phone: $('#phone').val(),
			address: $('#address').val()
		};
		var success=true;
		//Check full name
		if(info.full_name=="")
		{
			$scope.errFullName = "Please input your full name!";
			success=false;
		}else if(full_name.length > 50){
			$scope.errFullName = "The length of 'Full Name' must less than 50";
			success=false;
		}
		else 
			$scope.errFullName = "";

		//Check email
		if(info.email=="")
		{
			$scope.errEmail = "Please input your email!";
			success=false;
		}
		else if(info.email.length > 50){
			$scope.errEmail = "The length of 'Email' must less than 50";
			success=false;
		}
		else if(info.email.indexOf("@") == -1 ){
			$scope.errEmail = "You inputted wrong email";
			success=false;
		}
		else
			$scope.errEmail = "";


		//Check phone
		if(info.phone=="")
		{
			$scope.errPhone = "Please input your phone!";
			success=false;
		}else if(info.phone.length > 12 || info.phone.length < 9 || isNaN(info.phone)){
			$scope.errPhone = "You inputted wrong phone";
			success=false;
		}
		else 
			$scope.errPhone = "";

		//Check address
		if(info.address=="")
		{
			$scope.errAddress= "Please input your address!";
			success=false;
		}else if(info.address.length > 100){
			$scope.errAddress = "The length of 'Address' must less than 100";
			success=false;
		}
		else 
			$scope.errAddress = "";
		
		if(success == true)
		{
			$http({
                url: 'http://127.0.0.1:3000/user/updateUserInfo/' + $scope.InfoUser.username,
                method: 'PUT',
                data: {
                    'full_name': info.full_name,
                    'sex': info.sex,
                    'birthday': info.birthday,
                    'phone': info.phone,
                    'email': info.email,
                    'address': info.address
            	}
	        }).then(function(res) {
	        	alert("Success update!");
	        	resetUser();
	        	location.href = "#all";

	        });
		}
	}

	$scope.updateUserPasswords = function(){
		var info = {
			newPassword: $('#newPass').val(),
			confirmPassword: $('#confirmPass').val()
		};
		var success=true;
		
		//Check Password

		if(info.newPassword.length < 6){
			alert( "The length of 'Password' must bigger than 5");
			success=false;
		}
		else if(info.confirmPassword != info.newPassword)
		{
			alert( "Password and Confirm Password don't match. Try again?");
			success= false;
		}


		if(success == true)
		{
			$http({
                url: 'http://127.0.0.1:3000/user/updateUserPassword/' + $scope.InfoUser.username,
                method: 'PUT',
                data: {
                    'password' : info.confirmPassword
            	}
	        }).then(function(res) {
	        	alert("Success update!");
	        	resetUser();
	        	location.href = "#all";
	        });
		}
	}

	function resetUser(){
		var username = $scope.InfoUser.username;
		$http.get('http://127.0.0.1:3000/user/' + username).then(function(res) {
			if(res.data != null || res.data.length != 0){
				var data = res.data[0];
				
				$http.get('http://127.0.0.1:3000/image_user/' + data.user_id).then(function(res2){
					if(res2.data !=null  || res2.data.length != 0){
						var data2 = res2.data[0];
						var infoNewUser = {
							user_id : data.user_id,
							username : data.username,
							password : data.password,
							full_name : data.full_name,
							birthday : data.birthday,
							sex : data.sex,
							email : data.email,
							phone: data.phone,
							address: data.address,
							image: "images/users/" + data2.name
						};
						sessionStorage.removeItem('InfoUser');

						sessionStorage.setItem('InfoUser', JSON.stringify( infoNewUser));
					}
				});
			}
			else
				alert("Disconnected with server!");
		});
	}
}]);