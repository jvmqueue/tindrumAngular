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
                    paramCallBack.call(context, paramResponse.data);
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
                var that = this;
                that.arryAlbumIds = []; // reset                
                var jsonAlbums = null;
                var interval = w.setInterval(function(){ 
                    if(typeof that.jsonAlbums != 'undefined'){
                        jsonAlbums =  that.jsonAlbums;
                        w.clearInterval(interval);
                        jsonAlbums.forEach(function(item, index){ 
                            that.arryAlbumIds.push(item.id);
                        });
                    }                    
                }, 333);
                
            },
            setAlbums:function(paramData){
                var that = this;
                var jsonAlbums = paramData;
                that.jsonAlbums = jsonAlbums;
                $scope.albums =  that.jsonAlbums; 


            },
            getPhotos:function(paramAlbumIds){
                mArryAlbumIds =  paramAlbumIds;
                var that = this;
                
            },
            setPhotos:function(){
                var jsonPhotos = null;
                var that = this;
                var arryAlbumIds = that.arryAlbumIds;        
                var strQuery = null;
                var intCounter = 0;

                var fncStorePhoto = function(paramData){
                    var strFirstAlbumThumbnailUrl = paramData[0].thumbnailUrl;
                       $scope.albums[intCounter++]['thumbnailUrl'] = strFirstAlbumThumbnailUrl;
                };

                var interval = w.setInterval(function(){
                if(that.arryAlbumIds.length > 0){ // wait for http response
                    w.clearInterval(interval);

                    for(var i = 0, len = that.arryAlbumIds.length; i < len; i++){
                        strQuery =  '?albumId=' + that.arryAlbumIds[i];
                           _fnc.httpGet('photos', strQuery, fncStorePhoto, that);
                    }
                       
                }
                }, 333); // End interval


                 

            }   
        };

        var mArryAlbumIds = [];

        var workOnAlbums = function(paramObjAlbum){
            var objAlbums = paramObjAlbum;
            var that = objAlbums;
            var strQuery =  '?userId=' + that.strUserId;
            _fnc.httpGet('albums', strQuery, objAlbums.setAlbums, that);
            that.setAlbumIds.call(that); // allows us to maintain context
            that.setPhotos.call(that); // allows us to maintain context

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