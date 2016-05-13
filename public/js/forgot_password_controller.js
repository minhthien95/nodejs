app.controller('ForgotPasswordController', ['$scope', '$http','$location', function($scope, $http,$location)  {
	$scope.hide_step1 = false;
	$scope.hide_step2 = true;
	var check_username = false;
	var check_email = false;
	var check_phone = false;

	$scope.CheckInfo=function(){
		var username=document.getElementById("username").value;
		var email=document.getElementById("email").value;
		var phone=document.getElementById("phonenumber").value;
		//Check username
		if(username=="")
			$scope.errUsername = "Please input username!";
		else {
			$http.get('http://127.0.0.1:3000/user/' + username).then(function(res) {
				if(res.data.length != 0 && username == res.data[0].username)
				{
					check_username = true;
				}
				else
				{
					$scope.errUsername = "Username không tồn tại";
				}
			});
		}
		//Check email
		if(email=="")
		{
			$scope.errEmail = "Please input your email!";
		}
		else {
			$http.get('http://127.0.0.1:3000/user/' + username).then(function(res) {
				if(res.data.length != 0 && username == res.data[0].username && email == res.data[0].email)
				{
					check_email = true;
				}
				else
				{
					$scope.errEmail = "Email is not match";
				}
			});
		}
		//Check phone
		if(phone=="")
			$scope.errPhone = "Please input your phone!";
		else {
			$http.get('http://127.0.0.1:3000/user/' + username).then(function(res) {
				if(res.data.length != 0 && username == res.data[0].username && phone == res.data[0].phone)
				{
					check_phone = true;
				}
				else
				{
					$scope.errPhone = "Phone is not match";
				}


			});
		}

	}
   $scope.Continue=function(){
		if(check_phone == true && check_username == true && check_email == true)
		{
			$scope.hide_step1 = true;
			$scope.hide_step2 = false;
		}
 	}

 	$scope.ResetPassword=function(){
		
		var username=document.getElementById("username").value;
		var new_password=document.getElementById("new_password").value;
		var confirm_password=document.getElementById("confirm_password").value;
		var success=true;
		//Check Password
		if(new_password=="")
		{
			$scope.errPassword= "Please input your password!";
			success=false;
		} else if(new_password.length < 6){
			$scope.errPassword= "The length of 'Password' must bigger than 5";
			success=false;
		}
		else if(confirm_password != new_password)
		{
			$scope.errPassword = "Password and Confirm Password don't match. Try again?";
			success= false;
		}
		else
			$scope.errPassword = "";
		if(success==true)
		{
			$http({
                url: 'http://127.0.0.1:3000/user/forgotpassword',
                method: 'PUT',
                data: {
                	'username': username,
                    'password': new_password,
            }
	        }).then(function(res) {
	        	$location.path("#/");
	        	alert("Congratulation! You can now login with your new password");
	        });
		}
 	}
}]);