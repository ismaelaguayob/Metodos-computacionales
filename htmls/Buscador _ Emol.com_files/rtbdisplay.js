var _nmq = [];
var my_device = "desktop";
//OA_zones_sizes={POR_300x560_A:'300x560',POR_300x560_B:'300x560',POR_300x560_C:'300x560',POR_690_226:'710x323',POR_ITT_690x0:'960x680',POR_SUPER_1:'710x88',POR_SUPER_2:'710x88',POR_SUPER_3:'710x88',POR_SUPER_4:'710x88',POR_SUPER_5:'710x88',POR_OREJA_1:'175x80',POR_OREJA_2:'175x80',POR_PUSH_DOWN:'930x60',POR_300x560_D:'300x560',POR_300x560_E:'300x560',POR_300X250:'300x250',POR_TGR:'200x210',POR_BOTTOM_CLOSE:'930x90'};
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) 
    my_device = "mobile";
if (prefijoSeccion=="ESP")  rts_cat ="especiales";
rts_cat_adjusted = rts_cat;
if (rts_cat=="chile") rts_cat_adjusted="nacional";
if (rts_cat=="mundo") rts_cat_adjusted="internacional";
if (rts_cat=="ciencia y tecnologia") rts_cat_adjusted="tecnologia";
const desktopAds = zonas[rts_cat_adjusted.toUpperCase()].filter(ad => ad.device === my_device);
const OA_zones_sizes = desktopAds.reduce((acc, { description, size }) => {
    const key = description
    acc[key] = size;
    return acc;
  }, {});
//console.log("rts_size : " , OA_zones_sizes);
function call_pu_json (param1,divId,blockCampaignState,keywordEspecial,subId) {
   zoneId = OA_zones[param1];
   size = OA_zones_sizes [param1]; 
   //console.log("size:"+size);
   if (!size) { console.log("error en  "+param1); return;}
   var dimensions = size.split("x");

// Assigning the split values to width and height respectively
   var width = dimensions[0];
   var height = dimensions[1];
   divBanner = divId ;
   //console.log(zoneId);
   //console.log(divBanner);
   //console.log(size);
   //console.log(width);
   //console.log(height);
   _nmq.push([divId, width, height, 2, true, false, zoneId]);
}
if (typeof fechaHoraServer == "undefined") {
    var day_of_week = new Date().getDay().toString();
    var hour_of_day = new Date().getHours()
} else {
    var fechaHoraSplit = fechaHoraServer.split(" ");
    var fechaSplit = fechaHoraSplit[0].split("/");
    var day_of_week = new Date(fechaSplit[1] + "/" + fechaSplit[0] + "/" + fechaSplit[2] + " " + fechaHoraSplit[1]).getDay().toString();
    var hour_of_day = new Date(fechaSplit[1] + "/" + fechaSplit[0] + "/" + fechaSplit[2] + " " + fechaHoraSplit[1]).getHours()
}
var page_url = window.location.href;
var nm_empty_zones = [1,1,1,1,1];
var Sitio = document.location.href;
var domain = (Sitio.indexOf("emol.com") > -1) ? ".emol.com" : ".emol.cl";
if (page_url.indexOf("economicos.cl") > 0) {
    prefijoSeccion = "EC"
}
if (/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    //if (domain == ".emol.com") {
    //   var script_vw = document.createElement("script");
    //   script_vw.src = "//mediaserver.emol.cl/other/lleison/pbli_vw.js";
    //    document.getElementsByTagName("head")[0].appendChild(script_vw)
    //}
}
var url_base_rv = "//newsm.emol.com/www/noticias/purple.php?beatles=";
var country = "CL";
var block_campaign = [];
var bimp = [];
var cimp = [];
var zimp = [];
var bimp_ceros = [];
var cimp_ceros = [];
var zimp_ceros = [];
var statusimp = 0;
var zones_full = [1, 2, 3, 301, 425];
var restriction_zones = [1, 2, 3, 301, 425, 34, 314, 202, 39, 40, 104, 105];
var check_zones_full = 0;
var display_banners_prob;
var exist_companion = 0;

function getRandomInt(b, a) {
    return Math.floor(Math.random() * (a - b + 1)) + b
}
function a_full_p(zone) {
	console.log("a_full_p : "+zone);
	if (parseInt(zone) == 1 || parseInt(zone) == 651) {
		nm_empty_zones[0] = 0;
	} else if (parseInt(zone) == 2 || parseInt(zone) == 652) {
		nm_empty_zones[1] = 0;
	} else if (parseInt(zone) == 3 || parseInt(zone) == 667) {
		nm_empty_zones[2] = 0;
	} else if (parseInt(zone) == 301 || parseInt(zone) == 668) {
		nm_empty_zones[3] = 0;
	} else if (parseInt(zone) == 425 || parseInt(zone) == 669) {
		nm_empty_zones[4] = 0;
	} else if (parseInt(zone) == 670) {
		nm_empty_zones[5] = 0;
	}
}
function displaysticky() {
    domain=".emol.com";
    if (prefijoSeccion == "POR" && my_device == "desktop") {
        var f = document.createElement("script");
        f.src = "//mediaserver.emol.cl/other/pbli_sticky.js";
        document.getElementsByTagName("head")[0].appendChild(f);
        if (domain == ".emol.com") {
            //var e = document.createElement("script");
            //e.src = "//mediaserver.emol.cl/other/lleison/pbli_vw.js";
            //document.getElementsByTagName("head")[0].appendChild(e)
        }
        if (prefijoSeccion == "POR") {
            var c = document.getElementsByClassName("nm_zones"),
                d;
            for (var d = 0; d < c.length; d++) {
                c[d].style.display = ""
            }
            var a = document.querySelector("#nm_zone_1");
            a.setAttribute("onmouseenter", "nm_slowDownDelay(this);");
            a.setAttribute("onmouseleave", "nm_speedUpDelay();");
            var g = document.querySelector("#nm_zone_2");
            g.setAttribute("onmouseenter", "nm_slowDownDelay(this);");
            g.setAttribute("onmouseleave", "nm_speedUpDelay();");
            var h = document.querySelector("#nm_zone_3");
            if(h){
	    h.setAttribute("onmouseenter", "nm_slowDownDelay(this);");
            h.setAttribute("onmouseleave", "nm_speedUpDelay();");
	    }
	    var j = document.querySelector("#nm_zone_4");
            if(j){
	    j.setAttribute("onmouseenter", "nm_slowDownDelay(this);");
            j.setAttribute("onmouseleave", "nm_speedUpDelay();");
	    }
	    var b = document.querySelector("#nm_zone_5");
            if(b){
	    b.setAttribute("onmouseenter", "nm_slowDownDelay(this);");
            b.setAttribute("onmouseleave", "nm_speedUpDelay();")
	    }
	    var p = document.querySelector("#nm_zone_6");
	    if(p){
	    p.setAttribute("onmouseenter", "nm_slowDownDelay(this);");
            p.setAttribute("onmouseleave", "nm_speedUpDelay();");
	    }
	    
        }
    }
}


