var nm_campaigns =null;
//var nm_usedBanners = [];
var nm_audiences =null;
var nm_loadDate=0;
var nm_uuid=null;
var nm_adCache = [];
var nm_urlServer ='https://sspnm.emol.com';
//var nm_urlServer ='//ssplab.emol.com';
var nm_deltaTime = 0;
var nm_firstRun = true;
//var previousClicks =null;


var nm_adNumber = 20;


//var uuid=null;
//var minBid=null;











  
function nm_read_cookie(key)
{
    var result;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
}
function nm_processQueue() {
	var boostedCampaign = nm_read_cookie("boost");
	if (boostedCampaign) console.log("boosted:"+boostedCampaign);
	var newAd = _nmq.shift();
	var idq=[]; var creativeq=[];	var moneyq=[]; formatq=[];	
	var externalq=[]; var zoneq=[]; var externalCreativeq=[];
	cs = nm_urlServer+"/CampaignServer/Register";
	while (newAd!=null) {
		//console.log("new ad:"+newAd);
		candidates = [];
		day = 3600*24*1000;
		session = 15*60*1000;
		page = 10*1000;
		
		cached = false;
		var zoneId=null;
		// get div position and estimate if is high, low or mid position
		var w = window.innerWidth;
		var h = window.innerHeight;
		var p = $( "#"+newAd[0] ).first();
		var position = p.offset();
		//console.log(position);
		//console.log(h);
		var posLevel = "alta";
		if (h<position.top) posLevel="media";
		if (h*2 < position.top) posLevel="baja";
		//console.log(posLevel);
		bannerPageType = pageType;
		if (newAd[0].indexOf ("ta-comment")==0) {
			bannerPageType="Comentarios";
			posLevel="baja";
		}
		if (newAd[6]) {
			// zoneID
			zoneId=Number(newAd[6]);
		} else {
			console.log ("OJO no viene zoneId como 7o parámetro");
		} 
		if (newAd[5]) {
			//use cache
			if (nm_adCache[newAd[0]]) {
				if (newAd[4]) {
					$('#'+newAd[0]).html(nm_adCache[newAd[0]]);		
				} else {
					$('#'+newAd[0]).append(nm_adCache[newAd[0]]);		
				}
				cached = true;
			} 
		
			
		}
		bidLevel = 0;
		minBid = 6000;
		//console.log("pageType:"+bannerPageType);
		//console.log("posLevel:"+posLevel);
		//console.log("section:"+section);

		
		//console.log ("minBid:"+minBid);
		
		
		nm_campaigns_instance = JSON.parse(JSON.stringify(window.nm_campaigns));
		//console.log (nm_campaigns_instance);
		if (!cached) nm_campaigns_instance.forEach( function(c,cindex) {
			
			c.banners.forEach(function (b,bindex) {
				validSize = false;
				validZone = true;
				if (b.width==newAd[1] && b.height==newAd[2]) validSize =true;
				if (c.audience.zoneId) {
					zones = JSON.parse(c.audience.zoneId);
					if (!zones.includes(zoneId)) validZone = false;
				}
				if (newAd[1]==300 && newAd[2]==250 && b.url && b.url.indexOf("mp4")>0) validSize = true;
				if (validSize && validZone) {
					format = newAd[1] + "x" + newAd[2];
					//if (b.url) {
					//			if (b.url.indexOf("mp4")>0) format = "video"; 
					//} else format = "text";
					if (b.html && zoneId!=null) {
						//b.html=b.html.replace("{zoneid}",zoneId);
					}
						//b.html=b.html.replace("{zoneid}",zoneId);
						b.html=b.html.replace(/%7Bzoneid%7D/g,zoneId);
						b.html=b.html.replace(/{zoneid}/g,zoneId);
					b.html=b.html.replace("externalId=%7BenternalId%7D","extCreativeId="+b.externalId);
					b.html=b.html.replace(/%7Brvvid%7D/g,b.externalId);
					b.html = b.html.replace(/{uuid}/g,nm_uuid);	
					b.html = b.html.replace(/%7Buuid%7D/g,nm_uuid);	
					//b.html = b.html.replace("__oadest","&__oadest");	
					b.html = b.html.replace(/{bannerid}/g,b.creativeId);	// arreglar es b.id
					b.html = b.html.replace(/%7Bbannerid%7D/g,b.creativeId);	// arreglar es b.id
					b.html = b.html.replace(/{campaignid}/g,c.id);	
					randomNum = Math.floor(Math.random()*10000);
					b.html = b.html.replace(/{random}/g,randomNum);	
					b.html = b.html.replace(/%7Brandom%7D/g,randomNum);	
					if (nm_urlServer.indexOf("sspnm")>0) {
						b.html = b.html.replace(/ssplab.emol.cl/g,"sspnm.emol.com");
						b.html = b.html.replace(/ssplab.emol.com/g,"sspnm.emol.com");
					}
					//console.log(b.html);
					b.format=format; 
					valid = false;
					timeSince = 10000000000000;
					if (!c.audience.repetition) c.audience.repetition = 3;
					nm_loadDate =  Date.now();
					if (c.lastImpression) {
						timeSince = nm_loadDate - c.lastImpression	+ nm_deltaTime;
						if (typeof c.lastImpressionUpdated !== 'undefined') {
							timeSince = c.lastImpressionUpdated-nm_loadDate;

						}
						//console.log("cindex:"+cindex+" lastImpression:"+c.lastImpression+" deltaTime:"+nm_deltaTime+" timeSince:"+timeSince+" page:"+page+" session:"+session);
						repetition = c.audience.repetition;
						//if (typeof c.fixedCpm !=='undefined') {
						//	repetition=3;// for fixedCpm contracts, use always one per page
						//	if (format=="300x250") repetition=2;
						//}
						if (repetition==1 && timeSince> day) valid = true;
						if (repetition==2 && timeSince> session) valid = true;
						if (repetition==3 && timeSince> page) valid = true;
						if (repetition==4 ) valid = true;
					} else {
						valid = true;
					}
					if (boostedCampaign && boostedCampaign==c.id) valid=true;
					//console.log(c);
					//console.log(minBid);
					//if (c.audience.bid<(minBid/1000)) valid = false;
					if (c.audience.bid<(minBid)) valid = false;
					// now check if the campaign has specific targeting rules like audience cookies or specific subcategory
					//
					if (valid) {	
						b.campaignId = c.id;
						b.sector = c.audience.sector;
						if (typeof c.fixedCpm !=='undefined') b.fixedCpm = c.fixedCpm;
						if (c.audience.bid) {
							b.priority = c.audience.bid;
							if (boostedCampaign && boostedCampaign==c.id) {
								b.priority=10000;
								b.fixedCpm=10000;
							}
						} else {
							if (c.audience.campaignPriority) {
								b.priority = c.audience.campaignPriority;
							} else b.priority = 1;
							//if (!b.timeSince) {
							//	b.timeSince = timeSince;	
							//}
						}
						b.cindex=cindex;
						b.bindex=bindex;
						if (c.extId) {
							b.campaignExternalId=c.extId;
						}
						//b.html = "";
						hasEvent = false;
						titleCampaingAd = c.description;
						titleEventAd = c.audience.eventTitle;
						contactFormFieldsTxt="";
						if (c.audience.contactFormFields) contactFormFieldsTxt = c.audience.contactFormFields.toString();
						if (c.audience.eventDate) hasEvent = true;
						
						//if (b.priority>= newAd[3]) candidates.push(b);		
						candidates.push(b);		
					}
				}

			}); 
		});
		//console.log(candidates);
		var optimizeSector = Math.random() < 0.5;
		if (candidates.length>0) {
			candidates.sort(function(a,b) { 
				//console.log("comparing a,b");
				//console.log(a);
				//console.log(b);
				//console.log("a.priority="+a.priority);
				//console.log("b.priority="+b.priority);
				//console.log("a.timeSince="+a.timeSince);
				//console.log("b.timeSince="+b.timeSince);
				//console.log("optimizeSector:"+optimizeSector);
				a_priority = a.priority;
				b_priority = b.priority;
				if (typeof a.fixedCpm!=='undefined' && a.fixedCpm>0) a_priority=a.fixedCpm;
				if (typeof b.fixedCpm!=='undefined' && b.fixedCpm>0) b_priority=b.fixedCpm;
				previousClicks=null;
				if (previousClicks!=null && previousClicks[a.sector] !=='undefined' && optimizeSector) {
					//console.log("sector :"+a.sector);
					a_priority = a_priority + 2000;
				}
				if (previousClicks!=null && previousClicks[b.sector] !=='undefined' && optimizeSector) {
					//console.log("sector :"+b.sector);
					b_priority = b_priority + 2000;
				}
				if (a_priority<b_priority) {
					//console.log(1);
					return 1;
				}
				if (a_priority>b_priority) {
					//console.log(-1);
					return -1;
				}
				//console.log(-b.timeSince+a.timeSince);
				return (b.timeSince-a.timeSince);
			});
			
			
			d = Date.now()-nm_deltaTime;
			
			//console.log("changing element #"+candidates[0].cindex +"  of nm_campaings.  new value:"+d)
			window.nm_campaigns[candidates[0].cindex].lastImpression=d;
			window.nm_campaigns[candidates[0].cindex].lastImpressionUpdated=Date.now();
			//nm_usedBanners[nm_campaigns[candidates[0].cindex].id]=d;
			
			
			
			
			//console.log("lastImpression:"+window.nm_campaigns[candidates[0].cindex].lastImpression);
			if (candidates.length>1 ) {
				if (candidates[1].priority<candidates[0].priority) {
					//candidates[0].bid = candidates[1].priority/1000+0.001;
					bid = candidates[1].priority/1000+0.001;
				} else {
					//candidates[0].bid = candidates[0].priority/1000;	
					bid = candidates[0].priority/1000;	
				}
				if (bid<(minBid/1000)) bid = minBid/1000;
			} else {
				//candidates[0].bid=minBid/1000;
				bid=minBid/1000;
			}
			//campaigns[candidates[0].cindex].banners[candidates[0].bindex].timeSince=1;
			//console.log (campaigns[candidates[0].cindex].banners[candidates[0].bindex]);
			adHtml = candidates[0].html.replace(/{cpm}/g,bid);
			adHtml = candidates[0].html.replace(/%7Bcpm%7D/g,bid);
			if (newAd[4]) {
				//console.log("reemplazando el contenido del div "+newAd[0]+" con "+adHtml);
				randomNum = Math.floor(Math.random()*100000);
				//$('#'+newAd[0]).html('<div id="'+'pbli_vwbl_'+candidates[0].creativeId+'_'+candidates[0].campaignId+'">'+adHtml+'</div>');
				$('#'+newAd[0]).html('<div id="'+'pbli_vwbl_'+candidates[0].externalId+'_'+candidates[0].campaignExternalId+'" class="'+'pbli_vwbl_'+candidates[0].externalId+'_'+candidates[0].campaignExternalId+'">'+adHtml+'</div>');		
				$('#'+newAd[0]).addClass("vwl");
				if (zoneId && adHtml.search("videonoimpresion")==-1) {
					a_full_p(zoneId);
				}
				//$('#'+newAd[0]).html(adHtml);		
			} else {
				//console.log("agregando al contenido del div "+newAd[0]+" esto "+adHtml);
				$('#'+newAd[0]).append(adHtml);		
			}
			document.getElementById(newAd[0]).id = newAd[0] + '_' + zoneId
			idq.push(candidates[0].campaignId);
			creativeq.push(candidates[0].creativeId);
			externalq.push(candidates[0].campaignExternalId);
			externalCreativeq.push(candidates[0].externalId);
			moneyq.push(bid);
			zoneq.push (zoneId);
			formatq.push(candidates[0].format);
			//adCache[newAd[0]]=candidates[0].html;
			nm_adCache[newAd[0]]=adHtml;
		}
		newAd = _nmq.shift();
		nm_adNumber--;
	}
		// add pixel to mark impressions
		if (idq.length>0) {
			pixelUrl = cs+"?i="+idq.toString()+"&c="+creativeq.toString()+"&t=i&m="+moneyq.toString()+"&bf="+formatq.toString()+"&uuid="+nm_uuid+"&rand="+Math.random();
			if (zoneq!=null && zoneq.length>0) pixelUrl = pixelUrl + "&zoneId="+zoneq.toString();
			if (externalq!=null && externalq.length>0) pixelUrl = pixelUrl + "&extId="+externalq.toString();
			if (externalCreativeq!=null && externalCreativeq.length>0) pixelUrl = pixelUrl + "&extCreativeId="+externalCreativeq.toString();
			var image = document.createElement('img');
			image.width=1;
			image.height=1;
			image.src = pixelUrl;
			document.body.appendChild(image);	
			// neomedia
			//pixelnmUrl = "https://newsm.emol.com/www/noticias/purple.php"+"?clapton="+externalq.toString().replace(/,/g,"|")+"&beatles="+idq.toString().replace(/,/g,"|")+"&zeppelin="+zoneq.toString().replace(/,/g,"|");
			pixelnmUrl = "https://newsm.emol.com/www/noticias/purple.php"+"?clapton="+externalq.toString().replace(/,/g,"|")+"&beatles="+externalCreativeq.toString().replace(/,/g,"|")+"&zeppelin="+zoneq.toString().replace(/,/g,"|");
			var image2 = document.createElement('img');
			image2.width=1;
			image2.height=1;
			image2.src = pixelnmUrl;
			document.body.appendChild(image2);	

			
		}
       	if (nm_firstRun) {
		if (my_device=='desktop') {
			if (document.querySelector("#nm_zone_1")) {
				displaysticky(); 	
				nm_firstRun = false;
			} else {
				console.log("no habia nm_zone_1");	
			}

				
		} else {
			nm_firstRun = false;
		}
	}
	setTimeout(function() {nm_processQueue();},2000);
}
function nm_getData() {
currentPage = window.location.href;
if (currentPage.indexOf("www.emol.com")>0 || currentPage.indexOf("emol50.gen.emol.cl")>0 || currentPage.indexOf("ssplab.emol.com")>0 || currentPage.indexOf("tv.emol.com")>0) {
	site="EM";
	if (currentPage.indexOf("tv.emol.com")>0) site = "ET";
	section = secMer;
	subsection = subSecMer;
	if (typeof (Temas) != 'undefined' ) {
		tags = Temas;
	} else {
		tags = null;
	}
	if (section=="especiales" && seccionCMV) section=seccionCMV;
	if (prefijoSeccion=="ESP") section="especiales";
	if (section) {
		section=section.toLowerCase();
	} else {
		section="nacional";
	}	
	if (subsection) {
		subsection=subsection.toLowerCase();
	}
	console.log("section:"+section+" subsection:"+subsection);
	if (subsection==section) subsection="";

	if (subsection=="educacion") {subsection="";section="EDUCACIÓN";}
	if (subsection=="futbol") subsection="Fútbol";
	if (subsection=="tenis") subsection="Tenis";
	if (subsection=="golf") subsection="Golf";
	if (subsection=="motores") subsection="Motores";
	if (subsection=="otros") subsection="Otros deportes";
	if (subsection=="espectaculos") {section="ESPECTÁCULOS";subsection="";}
	if (subsection=="cine") subsection="Cine";
	if (subsection=="television") subsection="Televisión";
	if (subsection=="cultura") subsection="Cultura";
	if (subsection=="actualidad") subsection="";
	if (subsection=="salud") { section="SALUD";subsection="";}
	if (subsection=="cocina") { section="COCINA Y NUTRICIÓN";subsection="";}
	pageType = "Portada de Sitio";
	if (currentPage.split("/").length>3) pageType = "Portada de Categoría";
	if (currentPage.split("/").length>4) pageType = "Portada de Tema";
	if (currentPage.split("/").length>9) pageType = "Artículo";
	if (currentPage.indexOf("portada.html")>=0) pageType = "Portada de Sitio";
}
if (currentPage.indexOf("www.economicos.")>0) {
	site = "EC";
	section = econoData[ssSectionId].c;
	subsection = econoData[ssSectionId].n;
	pageType = "Artículo";
}

if (currentPage.indexOf("comentarista.emol.com")>0) { site="ES"; section="nacional";}
coords = "";
weatherStr = localStorage.getItem("lastWeather");
if (weatherStr) {
	weatherData = JSON.parse(weatherStr);
	coords = "&lat="+weatherData.coord.lat+"&lng="+weatherData.coord.lon;
}
sectionStr = section.toUpperCase();
if (sectionStr=="ECONOMIA") sectionStr="ECONOMÍA Y NEGOCIOS";
if (sectionStr=="ESPECTACULOS") sectionStr="ESPECTÁCULOS";
keywords = "";
if (typeof keywordEspecial!=='undefined' && keywordEspecial!='') {
	keywords = "&keywords="+keywordEspecial;
}
url  = nm_urlServer+"/CampaignServer/Campaigns?action=getCampaigns&site="+site+"&category="+sectionStr.toUpperCase()+"&subcategory="+subsection+"&pageType="+pageType+coords+keywords+"&rand="+Math.random();
//url  = nm_urlServer+"/CampaignServer/Campaigns?action=getCampaigns&site="+site+"&category="+"Portada"+"&subcategory="+subsection+"&pageType="+pageType+coords+"&rand="+Math.random();
 jQuery.ajax({
        url: url,
        //jsonp: "callback",
                // Tell jQuery we're expecting JSONP
        dataType: "json",
	xhrFields : {
		withCredentials: true 
	},
        success: function(respuesta) {
		nm_uuid = respuesta.uuid;	
		window.nm_campaigns = respuesta.campaigns;
		window.nm_audiences = respuesta.audiences;
		if (typeof respuesta.previousClicks!== 'undefined') previousClicks = respuesta.previousClicks;
		if (nm_campaigns.length==0) return;
		window.nm_deltaTime = Date.now() - nm_campaigns[0].currentTime;
		window.nm_loadDate = Date.now();
		//console.log(nm_campaigns);
		//console.log("deltaTime:"+nm_deltaTime);
		// load bidlevels on programmatic, but not on neomedia
		nm_processQueue();
        },
                error: function() {
                console.log("No se ha podido obtener la informaci~C³n");
        }
        });
}

function nm_cleanText(text) {
	clean=text.replace(/<(.*)>/g,"");
	clean=clean.replace(/_(.*?)_/g,"<em>$1</em>");
	clean=clean.replace(/\*(.*?)\*/g,"<strong>$1</strong>");
	clean=clean.replace(/~(.*?)~/g,"<strike>$1</strike>");
	return clean;
}

nm_getData();
