var Cookie = {

    getItem: function (name) {
        var pattern = new RegExp(name + '=([^;]+)'),
            matches = document.cookie.match(pattern);
    
        return (matches !== null) ? matches[1] : false;        
    },
    
    setItem: function (name, value, seconds, path, domain) {
        var params = [], 
        expires = new Date();
        
        expires.setTime(expires.getTime() + seconds * 1000);
        
        params.push(name + '=' + encodeURIComponent(value));
        params.push('expires=' + expires.toGMTString());
                
        if(path) params.push('path=' + path);
        if(domain) params.push('domain=' + domain);    
        
        document.cookie = params.join('; ');
    }
};

function JSONP (url, params, callback) {

    var qs = [],
        fx = 'json' + new Date().getTime();
    
    window[fx] = callback;
    params['callback'] = fx;
    
    for(var key in params) {
        qs.push(key + '=' + encodeURIComponent(params[key]));
    }

    var s   = document.createElement('script');
    s.type  = 'text/javascript';
    s.async = true;
    s.src   = url + '?' + qs.join('&');
    
    var ss = document.getElementsByTagName('script')[0];
    ss.parentNode.insertBefore(s, ss);
}

function trackAnalytics() {
    if('_gaq' in window) {
		_gaq.push(['t._setAccount', 'UA-31222350-1']);
		_gaq.push(['t._setDomainName', '.emol.com']);
 
 		var rdb = Cookie.getItem('RDB'),
 			pram = Cookie.getItem('PRID'),
 			gen = parseInt(rdb.substring(48, 50), 16), 
 			sus = parseInt(rdb.substring(50, 52), 16),
 			age = [parseInt(rdb.substring(56, 58), 16), parseInt(rdb.substring(58, 60), 16)].join('-');
			ageMin = parseInt(rdb.substring(56, 58), 16);
			ageMax = parseInt(rdb.substring(58, 60), 16);
			agePiwik = null;
			if (ageMax>0 && ageMax<100) {
				agePiwik = Math.round((ageMax+ageMin)/2);
			}
		
		var SUBS = ['NO', 'SI', 'FB', 'SI+FB'];
		
		gen = (gen == 0) ?   3  :  gen;
    		
		// add variables to piwik
		
	//	_paq.push(['setCustomDimension', 1,  gen]);
		if (agePiwik) {
//			_paq.push(['setCustomDimension', 2,  agePiwik]);
		}
//		_paq.push(['setCustomDimension', 3,  SUBS[sus]]);
//		_paq.push(['setCustomDimension', 4,  pram]);
 

		_gaq.push(['t._setCustomVar', 1, 'gen',  gen,  1]);
		_gaq.push(['t._setCustomVar', 2, 'age',  age,  2]);
		_gaq.push(['t._setCustomVar', 3, 'sus',  SUBS[sus], 2]);
		_gaq.push(['t._setCustomVar', 4, 'pram', pram, 1]);
 
 		if(!('GA_Permalink' in window)) {
 			GA_Permalink = document.location.href.substring(document.location.href.indexOf('/', 7));
 		}
 
		_gaq.push(['t._trackPageview', GA_Permalink]);
	}
}

RDBTest = '3';

if(Cookie.getItem('RDBT') != RDBTest) {
    var start = new Date().getTime();
        
    JSONP('https://pram.elmercurio.com/API/User/Status', {'ApplicationName': 'CLUBWP'}, function(res) {
    
        if(res && res.encryptedData) {    
            var duration = Math.floor(new Date().getTime() - start);
                
            JSONP('https://apps.emol.com/bt/SetRDB', {'data': res.encryptedData, 'timing': duration}, function(data) {
                Cookie.setItem('RDBT', RDBTest, 86400 * 7, '/', '.emol.com');
            });
            
        } else {
            //Cookie.setItem('RDBT', RDBTest, 86400, '/', '.emol.com');
        }
    
    });
    
}

/*******/

var img = document.createElement('img');
var src = document.location.protocol + "//apps.emol.com/bt/ping";

img.src = src;
img.width = 0; 
img.height = 0;

var ss = document.getElementsByTagName('script')[0];
ss.parentNode.insertBefore(img, ss);
 
 
if(Cookie.getItem('RDB')) {
	trackAnalytics();
	//var imgAdxion = document.createElement('img');
	//var srcAdxion = document.location.protocol + "//delivery.adxion.com/pixel/pixel.gif?RDB=" + Cookie.getItem('RDB');
	//imgAdxion.src = srcAdxion;
	//imgAdxion.width = 0;
	//imgAdxion.height = 0; 
                        
	//var ssAdxion = document.getElementsByTagName('script')[0];
	//ssAdxion.parentNode.insertBefore(imgAdxion, ssAdxion);
}

/*******/

if(document.location.href.indexOf("error=access_denied") >= 0) {
    _gaq.push(['_trackEvent', 'Facebook', 'Deny Access', 'yes']);
}

/*******/

var state = Cookie.getItem('ip_loc_state');

if (state === false || (state.length && state.length !== 2)) {
  
  window.onGeoLookup = function (country, region) {
    Cookie.setItem('ip_loc_country', country, 86400 * 5, '/', '.emol.com');
    Cookie.setItem('ip_loc_state',   region,  86400 * 5, '/', '.emol.com');
  }

  JSONP('https://geo.emol.cl/social/geo/lookup.js?' + Math.random(), {});
}
