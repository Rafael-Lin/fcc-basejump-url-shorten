'use strict';

Object.prototype.getKeyByValue = function( value ) {
    for( var prop in this ) {
        if( this.hasOwnProperty( prop ) ) {
             if( this[ prop ] === value )
                 return prop;
        }
    }
}

module.exports = function( useragent, locale, app, url, bodyParser ) {

    function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
    function makeid()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    var path = process.cwd();

    var RedirectObj = (function() {
        return  {
            originalUrl : "Redirect"
        }
    })();

    var monthArr = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

    app.route('/').get(function(req, res) {
        res.sendFile(process.cwd() + '/public/index.html');
    });

    function fullUrl(req) {
      return url.format({
        protocol: req.protocol,
        host: req.get('host')
        // pathname: req.originalUrl
      });
    }

    app.route('/redirect/:originUrl')
    .get( function( req,res ){
        var path = fullUrl( req ) + "/redirect/" + req.params.originUrl ;
        var dstPath = RedirectObj.getKeyByValue( path ) ;
        console.log( "dst" + dstPath );
        res.redirect( dstPath );
    })
    app.route('/new/http://:originUrl')
    .get( function( req,res ){
            var retJson = {};
            var originUrl = "http://" + req.params.originUrl;
            var redirectUrl = "";
            redirectUrl = RedirectObj[originUrl];

            if( redirectUrl == undefined ){
               retJson.original_url = originUrl ;
               var randomID = makeid() ;
               retJson.redirect_url = fullUrl(req) + "/redirect/" + randomID;
               RedirectObj[ retJson.original_url ]= retJson.redirect_url ;
               var currStr = "/redirect/" + randomID ;
               app.get( currStr ,function( req,res ){
                  res.redirect( retJson.original_url  ) ;
               })
            }else{
               retJson.original_url = originUrl ;
               retJson.redirect_url = redirectUrl;
            }
            res.json( retJson );
        });

};
