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
            this.arryPhotoIds = [];
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
                var that = this;                
                console.group('ALBUM GET PHOTOS');
                    console.log('that:\t', that);
                   console.groupEnd(); 
            },
            setPhotos:function(){
                var jsonPhotos = null;
                var that = this;
                var arryAlbumIds = that.arryAlbumIds;        
                var strQuery = null;
                var intCounter = 0;
                that.arryPhotoIds = []; // clear photo array                

                var fncStorePhoto = function(paramData){
                    var strFirstAlbumThumbnailUrl = paramData[0].thumbnailUrl;
                    var strFirstAlbumId = paramData[0].albumId;
                    that.arryPhotoIds.push(paramData.url);
                    $scope.albums[intCounter]['thumbnailUrl'] = strFirstAlbumThumbnailUrl;
                    $scope.albums[intCounter]['albumId'] = strFirstAlbumId;
                    intCounter++;
                };

                var interval = w.setInterval(function(){
                    if(that.arryAlbumIds.length > 0){ // wait for http response
                        w.clearInterval(interval);

                        for(var i = 0, len = that.arryAlbumIds.length; i < len; i++){
                            strQuery =  '?albumId=' + that.arryAlbumIds[i];
                            _fnc.httpGet('photos', strQuery, fncStorePhoto, that);
                        }                           
                    } // End if
                }, 333); // End interval
                    
            } // End setPhotos   
        }; // End Albums.prototype


        Albums.albums = null;
        Albums.setUsers = (function(){ // IIFE Initialize page's first column
            var fncStoreUsers = function(paramData){
                $scope.users =  paramData;
            };
            _fnc.httpGet('users', '', fncStoreUsers); // request with local callback
        })();

        var render = function(options){
            var obj = options.obj;
            var that = obj;
            var strId = options.id;

            switch(options.callee){
                case 'onClickGetAlbums':
                    var strQuery =  '?userId=' + strId;
                    _fnc.httpGet('albums', strQuery, obj.setAlbums, that);
                    that.setAlbumIds.call(that); // allows us to maintain context
                    that.setPhotos.call(that); // allows us to maintain context
                    break;
                case 'onClickGetPhotos':
                    var strAlbumId = strId;
                    $scope.photoUrls = []; // reset
                    var fncGetPhotosForAlbum = function(paramData){
                        var jsonPhotos = paramData;
                        for(key in jsonPhotos){
                            $scope.photoUrls.push(jsonPhotos[key]);
                        }
                    };

                    var strQuery =  '?albumId=' + strAlbumId;
                    _fnc.httpGet('photos', strQuery, fncGetPhotosForAlbum, that);                             
                    break;
                case 'onClickShowAlbumInPlay':
                    var strUrl = obj.url;
                    var strTitle = obj.title;
                    $scope.showAlbumInPlay = 'show';
                    $scope.albumInPlayUrl = strUrl;
                    $scope.albumInPlayTitle = strTitle;
                    break;
                default:
                    //  TODO: throw exception
            }
        };             


        $scope.onClickGetAlbums = function(paramUserId){
            var strUserId = paramUserId;
            Albums.albums = new Albums(strUserId);
            render({obj:Albums.albums, callee:'onClickGetAlbums', id:strUserId});
        }; // End $scope.onClickGetAlbums

        $scope.onClickGetPhotos = function(paramAlbumId){
            var strAlbumId = paramAlbumId;
            render({obj:Albums.albums, callee:'onClickGetPhotos', id:strAlbumId});
        }; // End $scope.onClickGetPhotos
        $scope.onClickShowAlbumInPlay = function(paramObjPhoto){
            var objPhotos = paramObjPhoto;
            var strId = objPhotos.id;
            render({obj:objPhotos, callee:'onClickShowAlbumInPlay', id:strId});
        }; // End $scope.onClickShowAlbumInPlay        


    }); // End tdApp.controller


});