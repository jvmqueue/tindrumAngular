require(['jQuery', 'angular', 'http'], function($, ng, http){
    var w = window, d = document;
    var tdApp = angular.module('tdApp', []);
    tdApp.controller('tdCtrl', function($scope, $http){

        var _fnc = {
            httpGet:function(paramDirectory, paramQuery, paramCallBack){
                var strDir = paramDirectory;
                var strQuery = ( !!paramQuery ? '?' + paramQuery : '' );
                $http({
                    method:'GET',
                    async:false,
                    url:'http://jsonplaceholder.typicode.com/' + strDir + strQuery,
                }).then(function(paramResponse){ // promise
                    paramCallBack.call(this, paramResponse.data);
                });                
            }


        }; // End _fnc

        var mArryAlbumIds = [];
        var setAlbumIds = function(paramData){
            var jsonAlbums =  paramData;
            var arryAlbumIds = [];
            jsonAlbums.forEach(function(item, index){
                arryAlbumIds.push(item.id);
            });
            getPhotos(arryAlbumIds);      
        };        
        var setUsers = function(paramData){
            $scope.users =  paramData;
        };
        var setAlbums = function(paramData){
            var jsonAlbums = paramData;
            $scope.albums =  jsonAlbums;
            setAlbumIds(jsonAlbums);
        };
        var setPhotos = function(paramData){
             var jsonPhotos = paramData;
             $scope.thumbnailUrls = [];
             jsonPhotos.forEach(function(item, index){
               for(var i = 0, len = mArryAlbumIds.length; i < len; i++){
                if(mArryAlbumIds[i] == item.id){
                    $scope.thumbnailUrls.push(item.thumbnailUrl);
                }
               }                
             });
        };        
        var getPhotos = function(paramAlbumIds){
            mArryAlbumIds =  paramAlbumIds;
            _fnc.httpGet('photos', '', setPhotos);
        };                

        _fnc.httpGet('users', '', setUsers);


        $scope.getAlbums = function(paramUserId){
            var strUserId = paramUserId
            var strQuery = 'userId=' + paramUserId;
            _fnc.httpGet('albums', strQuery, setAlbums);
        }; // End $scope.getAlbums


    }); // End tdApp.controller


});
