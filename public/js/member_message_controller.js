app.controller('messageController',['$scope', '$http', function($scope, $http){
    $scope.InfoUser = JSON.parse(sessionStorage.InfoUser);
    $scope.hideItemMessage = true;
    $http.get('http://127.0.0.1:3000/message/'+ $scope.InfoUser.user_id).then(function(res) {
        if(res.data != null || res.data.length != 0){
            $scope.Inbox = res.data;
        }
    });

    $scope.goSentInbox = function(){
        $http.get('http://127.0.0.1:3000/messageSent/'+ $scope.InfoUser.user_id).then(function(res) {
        if(res.data != null || res.data.length != 0){
            $scope.SentInbox = res.data;
        }
        });
    }
    $scope.goItemMessage = function(item){
       $scope.itemM = item;
    }

    $scope.goDeleteItemMessage= function(item){
        var success =true;
        var r = confirm("You confirm delete this message");
            if (r == false) {
               success=false;
           }

       if(success == true)
        {
            $http({
                url: 'http://127.0.0.1:3000/message/delete/'+item.message_id,
                method: 'DELETE',
            }).then(function(res) {
               alert("Success update!");
                    window.location.reload();
               
            });
        }
    }

    $scope.SendMessage = function(){
        var success = true;
        var info = {
            'sendUser_id': $scope.InfoUser.user_id,
            'receiveUser_id': -1,
            'content': $('#txtContent').val(),
            'isReceived': 0,
            'subject': $('#inputSubject').val(),
            'receiveEmail': $('#inputTo').val(),
            'sendEmail': $scope.InfoUser.email
        };
        $http.get('http://127.0.0.1:3000/user/checkEmail/'+ info.receiveEmail).then(function(res) {
            if(res.data != null || res.data.length != 0){
                if(res.data[0] != null)
                {
                   info.receiveUser_id = res.data[0].user_id;
                }
                else
                {
                     success = false;
                    alert("Wrong Email!")
                }

                if(success == true)
                {
                    $http({
                        url: 'http://127.0.0.1:3000/message/add',
                        method: 'POST',
                        data: {
                            'sendUser_id': info.sendUser_id,
                            'receiveUser_id': info.receiveUser_id,
                            'content': info.content,
                            'isReceived': info.isReceived,
                            'subject': info.subject,
                            'receiveEmail': info.receiveEmail,
                            'sendEmail': info.sendEmail
                        }
                    }).then(function(res) {
                        alert("Success update!");
                        window.location.reload();
                    });
                }
            } 
        });
             
    }
}]);