require(['jQuery', 'angular', 'http'], function($, ng, http){
    var w = window, d = document;
    var tdApp = angular.module('tdApp', []);
    tdApp.controller('tdCtrl', function($scope, $http){
        $scope.firstName = 'Harow';

        $http({
            method:'GET',
            url:'http://jsonplaceholder.typicode.com/users',
        }).then(function(paramResponse){ // promise
            $scope.users = paramResponse.data;
        });

        $scope.getAlbums = function(paramUserId){
            var strUserId = paramUserId;
            $http({
                method:'GET',
                url:'http://jsonplaceholder.typicode.com/albums?userId=' + strUserId,
            }).then(function(paramResponse){ // promise
                $scope.albums = paramResponse.data;
                $scope.albumIds = [];
                $scope.photos = null;
                var data = paramResponse.data;
                data.forEach(function(item){
                    $scope.albumIds.push(item.id);
                });

                $http({
                    method:'GET',
                    url:'http://jsonplaceholder.typicode.com/photos',
                }).then(function(paramResponse){ // promise
                    $scope.photos = paramResponse.data;
                    $scope.thumbnailUrls = [];
                    $scope.photos.forEach(function(item){
                           for(var i = 0, len = $scope.albumIds.length; i < len; i++){
                            if($scope.albumIds[i] == item.id){
                                $scope.thumbnailUrls.push(item.thumbnailUrl);
                            }
                           }
                    }); // End $scope.photos.forEach
                    
                });                

                
            });

        }; // End $scope.getAlbums


    }); // End tdApp.controller


});