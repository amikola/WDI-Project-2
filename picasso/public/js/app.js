"use strict";var App=App||{},google=google;App.init=function(){this.apiUrl="http://localhost:3000/api",this.$main=$("main"),$(".register").on("click",this.register.bind(this)),$(".login").on("click",this.login.bind(this)),$(".logout").on("click",this.logout.bind(this)),$(".seeAll").on("click",this.seeAll.bind(this)),$(".filter-form").on("submit",this.filterMap),$(".modal-content").on("submit","form",this.handleForm),this.getToken()?this.loggedInState():this.loggedOutState()},App.register=function(e){e&&e.preventDefault(),$(".modal-content").html('\n      <form method="post" action="/register">\n      <div class="modal-header">\n      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n      <h4 class="modal-title">Register</h4>\n      </div>\n      <div class="modal-body">\n      <div class="form-group">\n      <input class="form-control" type="text" name="user[username]" placeholder="Username">\n      </div>\n      <div class="form-group">\n      <input class="form-control" type="email" name="user[email]" placeholder="Email">\n      </div>\n      <div class="form-group">\n      <input class="form-control" type="password" name="user[password]" placeholder="Password">\n      </div>\n      <div class="form-group">\n      <input class="form-control" type="password" name="user[passwordConfirmation]" placeholder="Password Confirmation">\n      </div>\n      </div>\n      <div class="modal-footer">\n      <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n      <input class="btn btn-primary" type="submit" value="Register">\n      </div>\n      </form>'),$(".modal").modal("show")},App.login=function(e){e.preventDefault(),$(".modal-content").html('\n        <form method="post" action="/login">\n        <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title">Login</h4>\n        </div>\n        <div class="modal-body">\n        <div class="form-group">\n        <input class="form-control" type="email" name="email" placeholder="Email">\n        </div>\n        <div class="form-group">\n        <input class="form-control" type="password" name="password" placeholder="Password">\n        </div>\n        </div>\n        <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n        <input class="btn btn-primary" type="submit" value="Login">\n        </div>\n        </form>'),$(".modal").modal("show")},App.logout=function(e){e.preventDefault(),this.removeToken(),this.loggedOutState()},App.ajaxRequest=function(e,t,o,n){return $.ajax({url:e,method:t,data:o,beforeSend:App.setRequestHeader.bind(this)}).done(n).fail(function(e){console.log(e)})},App.setRequestHeader=function(e){return console.log("setting header"),e.setRequestHeader("Authorization","Bearer "+this.getToken())},App.setToken=function(e){return console.log("token set"),window.localStorage.setItem("token",e)},App.getToken=function(){return console.log("token got"),window.localStorage.getItem("token")},App.removeToken=function(){return console.log("token removed"),window.localStorage.clear()},App.loggedInState=function(){console.log("loggedin"),$(".loggedIn").show(),$(".loggedOut").hide(),this.$main.html('<div id="map-canvas"></div>'),App.mapSetup()},App.loggedOutState=function(){$(".loggedIn").hide(),$("#map-canvas").hide(),$(".loggedOut").show()},App.mapSetup=function(){App.apiUrl="http://localhost:3000/api",App.data=[],App.markers=[];var e=document.getElementById("map-canvas"),t={zoom:3,center:new google.maps.LatLng(51.506178,(-.088369)),mapTypeId:google.maps.MapTypeId.ROADMAP,styles:[{featureType:"water",elementType:"geometry",stylers:[{color:"#e9e9e9"},{lightness:17}]},{featureType:"landscape",elementType:"geometry",stylers:[{color:"#f5f5f5"},{lightness:20}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#ffffff"},{lightness:17}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#ffffff"},{lightness:29},{weight:.2}]},{featureType:"road.arterial",elementType:"geometry",stylers:[{color:"#ffffff"},{lightness:18}]},{featureType:"road.local",elementType:"geometry",stylers:[{color:"#ffffff"},{lightness:16}]},{featureType:"poi",elementType:"geometry",stylers:[{color:"#f5f5f5"},{lightness:21}]},{featureType:"poi.park",elementType:"geometry",stylers:[{color:"#dedede"},{lightness:21}]},{elementType:"labels.text.stroke",stylers:[{visibility:"on"},{color:"#ffffff"},{lightness:16}]},{elementType:"labels.text.fill",stylers:[{saturation:36},{color:"#333333"},{lightness:40}]},{elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"geometry",stylers:[{color:"#f2f2f2"},{lightness:19}]},{featureType:"administrative",elementType:"geometry.fill",stylers:[{color:"#fefefe"},{lightness:20}]},{featureType:"administrative",elementType:"geometry.stroke",stylers:[{color:"#fefefe"},{lightness:17},{weight:1.2}]}]};this.map=new google.maps.Map(e,t),this.addArt()},App.addArt=function(){$.get({url:App.apiUrl+"/art/",beforeSend:App.setRequestHeader.bind(App)}).done(function(e){var t=new google.maps.Geocoder;$.each(e.arts,function(e,o){setTimeout(function(){t.geocode({address:o.location},function(e,t){if(t===google.maps.GeocoderStatus.OK){o.lat=e[0].geometry.location.lat(),o.lng=e[0].geometry.location.lng();var n=new google.maps.LatLng(o.lat,o.lng),a=new google.maps.Marker({position:n,map:App.map,animation:google.maps.Animation.DROP,icon:{url:"/images/paintbrush.png",scaledSize:new google.maps.Size(50,50)}});App.markers.push(a),App.data.push(o),App.addModalWindow(o,a)}})},200*e)})})},App.addModalWindow=function(e,t){google.maps.event.addListener(t,"click",function(){$(".modal").is(":visible")&&$(".modal").modal("hide"),$(".modal-content").html('\n      <div class="modal-header">\n      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n      <p class="modal-title"><strong>'+e.artStolen.replace(/\n/g,"<br>").replace(/'G<br>'/g,"G.")+'</strong></p>\n      </div>\n      <div class="modal-body">\n      <img src="'+e.image+'"></ br>\n      <ul class="list-inline">\n      <li><strong>Where:</strong> '+e.location+"</li>\n      <li><strong>When:</strong> "+e.year+"</li>\n      <li><strong>Worth:</strong> "+e.worth+"</li>\n      </ul>\n      <p>"+e.description+'</p>\n      </div>\n      <div class="modal-footer">\n      <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n\n      </div>\n      '),$(".modal").modal("show")})},App.showArt=function(e){this.infoWindow.setContent("<h3>"+e.artStolen+"</h3>")},App.seeAll=function(){$(".filter").val(""),App.filterMap()},App.artIndex=function(e){console.log("this is runningNow"),e&&e.preventDefautl();var t=this.apiUrl+"/art";return this.ajaxRequest(t,"get",null,function(e){console.log(e)})},App.handleForm=function(e){console.log("should preventDefault"),e.preventDefault(),$(".modal").modal("hide");var t=""+App.apiUrl+$(this).attr("action"),o=$(this).attr("method"),n=$(this).serialize();return App.ajaxRequest(t,o,n,function(e){e.token&&App.setToken(e.token),App.loggedInState()})},App.removeMarkers=function(){$.each(App.markers,function(e,t){t.setMap(null)})},App.filterMap=function(e){e&&e.preventDefault();var t=void 0,o=$(".filter").val().charAt(0).toUpperCase()+$(".filter").val().slice(1);t=$(".filter").val()?App.data.filter(function(e){if(e.location.split(", ")[1]===o)return e}):App.data;var n=t;$(".filter").val(""),App.removeMarkers(),$.each(n,function(e,t){var o=new google.maps.Marker({position:new google.maps.LatLng(t.lat,t.lng),map:App.map,icon:{url:"/images/paintbrush.png",scaledSize:new google.maps.Size(50,50)}});App.markers.push(o),console.log(t),App.addModalWindow(t,o)})},$(App.init.bind(App));