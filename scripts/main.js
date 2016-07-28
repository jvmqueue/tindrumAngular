require(['jQuery', 'angular', 'http'], function($, ng, http){
    var w = window, d = document;
    var tdApp = angular.module('tdApp', []);
    tdApp.controller('tdCtrl', function($scope, $http){

        var _fnc = {
            httpGet:function(paramDirectory, paramQuery, paramCallBack, paramThat){
                var strDir = paramDirectory;
                var strQuery = ( !!paramQuery === true ? paramQuery : '' );
                var context = null;
                if(typeof paramThat != 'undefined'){
                    context = paramThat; // pass context to callee         
                }
                $http({
                    method:'GET',
                    async:false,
                    url:'http://jsonplaceholder.typicode.com/' + strDir + strQuery,
                }).then(function(paramResponse){ // promise
                    paramCallBack.call(this, paramResponse.data, context);
                });                
            }


        }; // End _fnc

        function Albums(paramUserId){
            this.strUserId = paramUserId;
            this.jsonAlbums = null;
            this.arryAlbumIds = [];
            this.toString = function(){ return 'Albums'; };
        }; // End Albums
        Albums.prototype = {
            constructor:Albums,
            setAlbumIds:function(){
                var jsonAlbums =  this.jsonAlbums;
                var that = this;
                that.arryAlbumIds = []; // reset
                jsonAlbums.forEach(function(item, index){ 
                    that.arryAlbumIds.push(item.id);
                });

                that.getPhotos.call(that, that.arryAlbumIds);      
            },
            setAlbums:function(paramData, paramContext){
                var that = paramContext;
                var jsonAlbums = paramData;
                that.jsonAlbums = jsonAlbums;
                $scope.albums =  that.jsonAlbums; 
                that.setAlbumIds.call(that); // allows us to maintain context
            },
            getPhotos:function(paramAlbumIds){
                mArryAlbumIds =  paramAlbumIds;
                var that = this;
                _fnc.httpGet('photos', '', that.setPhotos, that);
            },
            setPhotos:function(paramData){
                 var jsonPhotos = paramData;             
                 $scope.thumbnailUrls = [];
                 jsonPhotos.forEach(function(item, index){  
                   for(var i = 0, len = mArryAlbumIds.length; i < len; i++){
                    if(mArryAlbumIds[i] == item.id){
                        $scope.thumbnailUrls.push(item.thumbnailUrl);
                    }
                   }                
                 });
            }   
        };

        var mArryAlbumIds = [];

        var workOnAlbums = function(paramObjAlbum){
            var objAlbums = paramObjAlbum;
            var that = objAlbums;
            var strQuery =  '?userId=' + that.strUserId;
            _fnc.httpGet('albums', strQuery, objAlbums.setAlbums, that);
        };

        var setUsers = function(paramData){
            $scope.users =  paramData;
        };                       

        _fnc.httpGet('users', '', setUsers);


        $scope.getAlbums = function(paramUserId){
            var strUserId = paramUserId
            var strQuery = 'userId=' + paramUserId;
            var albums = new Albums(paramUserId);
            workOnAlbums(albums);
            
            
        }; // End $scope.getAlbums


    }); // End tdApp.controller


});
