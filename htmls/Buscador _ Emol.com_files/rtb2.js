var campaigns =null;
var audiences =null;
var previousClicks =null;
var bidLevels =null;
var deltaTime = 0;
var adNumber = 20;
var ssLoadDate=0;
var adCache = [];
var uuid=null;
var minBid=null;
var ss_urlServer ='//ssp.emol.com';
var tmpTxtBottomAds = '<div class="RTB_txt_bidinfo">Sube tu aviso en <a href="//ads.emol.com" target="_blank">ads.emol.com</a></div>';

// ADD CSS TEMPLATE
jQuery("<link/>", {
   rel: "stylesheet",
   type: "text/css",
   href: "//ssp.emol.com/css/rtbTmpl.css"
}).appendTo("head");

// CHECK MOBILE

RTB_IsMobile = () => {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;   
};

// TEST | WEATHER 
var queryS_EM = window.location.search;
var urlParamsEM = new URLSearchParams(queryS_EM);
var sectionEM = urlParamsEM.get('weather');

if(sectionEM == 'ok') {
    (function () {
        var u = "https://self.emol.cl/SelfService/clima/js/";
        var d = document, g = d.createElement('script'),
        s = d.getElementsByTagName('script')[0];
        g.type = 'text/javascript'; g.async = true; g.defer = true;
        g.src = u + 'weather.min.js'; s.parentNode.insertBefore(g, s);
    })();
}

// MODAL

document.addEventListener('click', function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement;

    if (target.hasAttribute('data-toggle') && target.getAttribute('data-toggle') == 'modal') {
        if (target.hasAttribute('data-target')) {
            var m_ID = target.getAttribute('data-target');
            document.getElementById(m_ID).classList.add('open');
            e.preventDefault();
        }
    }

    if ((target.hasAttribute('data-dismiss') && target.getAttribute('data-dismiss') == 'modal') || target.classList.contains('RTB_modal')) {
        var modal = document.querySelector('[class="RTB_modal open"]');
        modal.classList.remove('open');
        e.preventDefault();
    }
}, false);

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        var modal = document.querySelector('[class="RTB_modal open"]');
        if (modal) modal.classList.remove('open');
    }
});

function RTB_SendMail(S_name,S_email,S_rut,S_tel,S_question,S_adid) { 
    jQuery.ajax({
        url: 'https://self.emol.cl/SelfService/Contact',
        data: {
            action: "contact",
            name      : S_name,
            email     : S_email,
            phone     : S_tel,
            rut       : S_rut,
            message   : S_question,
            adId      : S_adid,
            format: "json"
        },
        method: "GET",
        cache: false,
        success: function(response){
            console.log("-OK-");
			$('#RTB_modal_'+S_adid).removeClass('open');
			$('#RTB_modal_'+S_adid+' .RTB_send_mail_'+S_adid).prop('disabled',false);

			//$('#RTB_modal_'+S_adid+' .RTB_send_mail_'+S_adid).prop('disabled',true);
      	    //$('#enviar_bt').prop('disabled',true);
      	    //$('#modal_atencion_cliente').modal('hide');
        },
        error: function(response){
            console.log("response form:" + response);
			$('#RTB_modal_'+S_adid+' .RTB_send_mail_'+S_adid).prop('disabled',false);
	          //$('#enviar_bt').prop('disabled',false);
	          //$('#modal_atencion_cliente').modal('hide');
            alert("Error al enviar el mail");
        }

    });
}

function ValidarRut(RutCtrl) {
  
  var Rut, DigVer;
  RutCtrl = RutCtrl.replace(/[\.]/g, "");
  RutCtrl = RutCtrl.replace(/[\-]/g, "");
  var largo = RutCtrl.length;
  if (largo == 0) {

      return false;
  } else {
      Rut = RutCtrl.substring(0, largo - 1);
      DigVer = RutCtrl.substring(largo - 1, largo);

      if (DigVer == 'K')
          DigVer = 'k';


      if (DigVer != dv(Rut)) {
          return false;
      } else {
          return true;
      }
  }
}

function dv(T) {
  var M = 0, S = 1;
  for (; T; T = Math.floor(T / 10))
      S = (S + T % 10 * (9 - M++ % 6)) % 11;
  return S ? S - 1 : 'k';
}

function formatearRut(Campo) {
  var nStr = $(Campo).val();
  if (nStr != '') {
      var RutFinal = '';
      nStr = nStr.replace(/[.]/g, "").replace(/[,]/g, "").replace(/[-]/g, "");
      var rut = nStr.substr(0, nStr.length - 1);
      var dv = nStr.charAt(nStr.length - 1);
      RutFinal = rut + '-' + dv;
  }
  $(Campo).val(RutFinal);
}

function ValFieldsForm(name,email,rut,tel,question,adid) {

    if ((name == '' && !jQuery('#RTB_nombre_'+adid).is(':disabled')) || (email == '' && !jQuery('#RTB_mail_'+adid).is(':disabled')) ||(rut == '' && !jQuery('#RTB_rut_'+adid).is(':disabled')) || (tel == '' && !jQuery('#RTB_tel_'+adid).is(':disabled')) || question == '' ) {

      if (name == '' && !jQuery('#RTB_nombre_'+adid).is(':disabled') ) {
        jQuery('#RTB_nombre_'+adid).addClass('error_check');
      } else {
        jQuery('#RTB_nombre_'+adid).removeClass('error_check');
      }

      if (!email.match(/@/) && !jQuery('#RTB_mail_'+adid).is(':disabled')) {
        jQuery('#RTB_mail_'+adid).addClass('error_check');
      } else {
        jQuery('#RTB_mail_'+adid).removeClass('error_check');
      }

      if (rut == '' && !jQuery('#RTB_rut_'+adid).is(':disabled')) {
        jQuery('#RTB_rut_'+adid).addClass('error_check');
      } else {
        jQuery('#RTB_rut_'+adid).removeClass('error_check');
      }

      if (tel == '' && !jQuery('#RTB_tel_'+adid).is(':disabled')) {
        jQuery('#RTB_tel_'+adid).addClass('error_check');
      } else {
        jQuery('#RTB_tel_'+adid).removeClass('error_check');
      }

      /* if (question == '') {
        jQuery('#RTB_mensaje_'+adid).addClass('error_check');
      } else {
        jQuery('#RTB_mensaje_'+adid).removeClass('error_check');
      }  */    
	  
	  

    } else {
      
      jQuery('#RTB_nombre_'+adid).removeClass('error_check');
      jQuery('#RTB_mail_'+adid).removeClass('error_check');
      jQuery('#RTB_rut_'+adid).removeClass('error_check');
      jQuery('#RTB_tel_'+adid).removeClass('error_check');
      //jQuery('#RTB_mensaje_'+adid).removeClass('error_check');
	  
	   var messageNotRequired = 'NO REQUERIDO';

      //$('.RTB_send_mail').prop('disabled',true);
	  	$('#RTB_modal_'+adid+' .RTB_send_mail_'+adid).prop('disabled',true);
		if (jQuery('#RTB_nombre_'+adid).is(':disabled')) {
			name = messageNotRequired;
		}

		if (jQuery('#RTB_mail_'+adid).is(':disabled')) {
			email = messageNotRequired;
		}

		if (jQuery('#RTB_rut_'+adid).is(':disabled')) {
			rut = messageNotRequired;
		}

		if (jQuery('#RTB_tel_'+adid).is(':disabled')) {
			tel = messageNotRequired;
		}
		
		question = messageNotRequired;

      // SEND MAIL 
      RTB_SendMail(name,email,rut,tel,question,adid);
      console.log(" - ENVIAMOS EL MAIL - ");
    }
}

// TEXT BANNER
function bDisplayText(div,href,text,pixel,calendar,contactForm,adid) {
	console.log("ADID TEXT:" + adid);
	tptText = '<div class="RTB_TemplText"><a href="'+href+'" target="_blank">'+text+'</a></div>';
	$('#'+div).html(tptText);
}

// IMAGE BANNER
function bDisplayPhoto(div,href,imgSrc,pixel,calendar,contactForm,adid,title,titleEvent) {
	console.log("ADID PHOTO:" + adid);
	console.log("contactForm:", contactForm);
	console.log("Calendar:", calendar);
	console.log("title AD:", title);
	console.log("title Event:", titleEvent);
	
	if (contactForm != '') {

		if (contactForm.includes('NAME')) {
			activeFieldName = ''
		} else {
			activeFieldName = 'disabled'
		}

		if (contactForm.includes('EMAIL')) {
			activeFieldEmail = ''
		} else {
			activeFieldEmail = 'disabled'
		}

		if (contactForm.includes('RUT')) {
			activeFieldRut = ''
		} else {
			activeFieldRut = 'disabled'
		}

		if (contactForm.includes('PHONE')) {
			activeFieldPhone = ''
		} else {
			activeFieldPhone = 'disabled'
		}

		//btForm = '<button data-target="RTB_modal_'+adid+'" data-toggle="modal" class="sendForm">Formulario de Contacto</button>';
		btForm = '<div class="RTB_cont_bt_modal" data-target="RTB_modal_'+adid+'" data-toggle="modal"><span class="c_title" data-target="RTB_modal_'+adid+'" data-toggle="modal">Más Información - '+title+'</span><span class="RTB_icon_mail"><img src="https://ssp.emol.com/img/icons/mail.svg" alt="iconCalendar"></span><span class="title" data-target="RTB_modal_'+adid+'" data-toggle="modal">Formulario de Contacto</span></div>';

		FormModal = '<div id="RTB_modal_'+adid+'" class="RTB_modal"><div class="RTB_modal-content"><div class="RTB_modal-content-header"><i class="fa fa-envelope"></i><h3>Formulario de Contacto</h3><span class="close" data-dismiss="modal">&times;</span></div><div class="RTB_modal-content-body"><div class="RTB_cont_input w50 '+activeFieldName+'"><input type="text" id="RTB_nombre_'+adid+'" name="RTB_nombre_'+adid+'" placeholder="Nombre" '+activeFieldName+'></div><div class="RTB_cont_input w50 '+activeFieldEmail+'"><input type="text" id="RTB_mail_'+adid+'" name="RTB_mail_'+adid+'" placeholder="E-Mail" '+activeFieldEmail+'></div><div class="RTB_cont_input w50 '+activeFieldRut+'"><input type="text" id="RTB_rut_'+adid+'" name="RTB_rut_'+adid+'" placeholder="RUT" '+activeFieldRut+'></div><div class="RTB_cont_input w50 '+activeFieldPhone+'"><input type="text" id="RTB_tel_'+adid+'" name="RTB_tel_'+adid+'" placeholder="Teléfono" '+activeFieldPhone+'></div><div class="RTB_cont_send"><button type="button" class="RTB_send_mail RTB_send_mail_'+adid+'">Enviar</button></div></div></div></div>';
	} else {
		btForm = '';
		FormModal = '';
	}

	if (calendar != false) {
		ContentEvent = '<div class="RTB_cont_event"><span class="c_title">'+titleEvent+'</span><span class="RTB_icon_calendar"><img src="https://ssp.emol.com/img/icons/calendar.svg" alt="iconCalendar"></span><span class="title">Agendar Evento</span><div class="RTB_content_icons"><span class="RTB_outlook"><a href="https://self.emol.cl/SelfService/Contact?action=calendar&calType=outlook&adId='+adid+'" target="_blank"><img src="https://ssp.emol.com/img/icons/outlook.svg" alt="Outlook Calendar"><span class="RTB_outlook_txt">Outlook</span></a></span><span class="RTB_gcalendar"><a href="https://self.emol.cl/SelfService/Contact?action=calendar&calType=gmail&adId='+adid+'" target="_blank"><img src="https://ssp.emol.com/img/icons/g_calendar.svg" alt="Google Calendar"><span class="RTB_gcalendar_txt">Calendario</span></a></span></div></div>';
	} else {
		ContentEvent = '';
	}

	tptImg = '<div class="RTB_TemplImg"><a href="'+href+'" target="_blank"><img src="'+imgSrc+'"></a>'+ContentEvent + btForm + FormModal + tmpTxtBottomAds+'</div>';

	$('#'+div).html(tptImg);

	$('.RTB_send_mail_'+adid).click(function () {
	    var val_name     = $('#RTB_nombre_'+adid).val();
	    var val_mail     = $('#RTB_mail_'+adid).val();
	    var val_RUT      = $('#RTB_rut_'+adid).val();
	    var val_tel      = $('#RTB_tel_'+adid).val();
	    var val_question = $('#RTB_mensaje_'+adid).val();
	    ValFieldsForm(val_name,val_mail,val_RUT,val_tel,val_question,adid);
	});

}

// VIDEO BANNER
function RTB_Video_Mute(el) {
    el.muted = !(el.muted);
}

function RTB_Video_Mouse(adid) {
	jQuery(document).on("mouseover", "#RTB_video_" + adid, function(e) {
		RTB_Video_Mute(this);
		jQuery('#RTB_video_'+adid+'').get(0).volume = 0.1;
	});

	jQuery(document).on("mouseout", "#RTB_video_" + adid, function(e) {
		RTB_Video_Mute(this);
	});
}

function playPauseMedia(currentVideo) {
	currentVideoID = currentVideo.currentTarget.idVideo;
	//console.log('playPauseMedia', currentVideo.currentTarget.idVideo);
	media = document.querySelector('.RTB_video_'+currentVideoID+' video');
  
	if(media.paused) {
		document.querySelector('.RTB_video_'+currentVideoID+' .RTB_play_icon').classList.remove('active');
		document.querySelector('.RTB_video_'+currentVideoID+' .RTB_pause_icon').classList.add('active');
	  	media.play();
	} else {
		document.querySelector('.RTB_video_'+currentVideoID+' .RTB_play_icon').classList.add('active');
		document.querySelector('.RTB_video_'+currentVideoID+' .RTB_pause_icon').classList.remove('active');
	  	media.pause();
	}
  }
  
  function setTime(currentVideo) {
	currentVideoID = currentVideo.currentTarget.idVideo;
	media = document.querySelector('.RTB_video_'+currentVideoID+' video');
  
	timerWrapper = document.querySelector('.RTB_video_'+currentVideoID+' .RTB_timer');
	timer = document.querySelector('.RTB_video_'+currentVideoID+' .RTB_timer .RTB_time_number');
	timerBar = document.querySelector('.RTB_video_'+currentVideoID+' .RTB_timer .RTB_timer_bar');
  
	const minutes = Math.floor(media.currentTime / 60);
	const seconds = Math.floor(media.currentTime - minutes * 60);
  
	const minuteValue = minutes.toString().padStart(2, '0');
	const secondValue = seconds.toString().padStart(2, '0');
  
	const mediaTime = `${minuteValue}:${secondValue}`;
	timer.textContent = mediaTime;
  
	const barLength = timerWrapper.clientWidth * (media.currentTime/media.duration);
	timerBar.style.width = `${barLength}px`;
  }
  
  function mutedMedia(currentVideo) { 
	currentVideoID = currentVideo.currentTarget.idVideo;
	//console.log('muted Video', currentVideo.currentTarget.idVideo);
	media = document.querySelector('.RTB_video_'+currentVideoID+' video');
  
	if(media.muted) {
	  media.muted = false;
	  media.volume = 0.3;
	  //console.log('UnMuted Audio');
	  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_mute .RTB_muted_icon').classList.remove('active');
	  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_mute .RTB_unmuted_icon').classList.add('active');
  
	  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_mute.RTB_mute_b_f .RTB_muted_icon').classList.remove('active');
	  //document.querySelector('.RTB_video_'+currentVideoID+' .RTB_mute.RTB_mute_b_f .RTB_unmuted_icon').classList.add('active');
  
	} else {
	  media.muted = true;
	  //console.log('Muted Audio');
	  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_mute .RTB_muted_icon').classList.add('active');
	  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_mute .RTB_unmuted_icon').classList.remove('active');
  
	  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_mute.RTB_mute_b_f .RTB_muted_icon').classList.add('active');
	  //document.querySelector('.RTB_video_'+currentVideoID+' .RTB_mute.RTB_mute_b_f .RTB_unmuted_icon').classList.remove('active');
	}
	document.querySelector('.RTB_video_'+currentVideoID+' .RTB_play_pause_background').classList.remove('fade-in');
	document.querySelector('.RTB_video_'+currentVideoID+' .RTB_main_branding_bar .RTB_learn_more.RTB_video_clickable').classList.remove('active');
  }
  
  function mutedInitMedia(currentVideo) {
	currentVideoID = currentVideo.currentTarget.idVideo;
	//console.log('setTime', currentVideo.currentTarget.idVideo);
	media = document.querySelector('.RTB_video_'+currentVideoID+' video');
	if(media.muted) {
	  //console.log('muted - video');
	  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_mute .RTB_muted_icon').classList.add('active');
	  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_mute.RTB_mute_b_f .RTB_muted_icon').classList.add('active');
	} else {
	  //console.log('NO Muted - video');
	}
  }
  
  function OverlayMedia(currentVideo) {
	currentVideoID = currentVideo.currentTarget.idVideo;
	//console.log('setTime', currentVideo.currentTarget.idVideo);
	media = document.querySelector('.RTB_video_'+currentVideoID+' video');
  
	console.log('ClickOverVideo',media.paused);
  
	  if (!media.muted) {
		  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_play_pause_background').classList.add('fade-in');
  
		  if(media.paused) {
			  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_play_icon').classList.add('active');
			  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_pause_icon').classList.remove('active');
			  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_main_branding_bar .RTB_learn_more.RTB_video_clickable').classList.add('active');
		  } else {
			  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_play_icon').classList.remove('active');
			  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_pause_icon').classList.add('active');
			  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_main_branding_bar .RTB_learn_more.RTB_video_clickable').classList.add('active');
		  }
	  }
	 setTimeout(() => {
	  if(!media.paused) {
		document.querySelector('.RTB_video_'+currentVideoID+' .RTB_play_pause_background').classList.remove('fade-in');
		document.querySelector('.RTB_video_'+currentVideoID+' .RTB_main_branding_bar .RTB_learn_more.RTB_video_clickable').classList.remove('active');
	  }
	 }, 1800);
  }
  
  function finishedVideo(currentVideo) { 
	  currentVideoID = currentVideo.currentTarget.idVideo;
	  //console.log('finishedVideo', currentVideo.currentTarget.idVideo);
	  media = document.querySelector('.RTB_video_'+currentVideoID+' video');
  
	  document.querySelector('.RTB_video_'+currentVideoID).classList.add('RTB_end_card');
	  
	 // console.log('Finished Video', id.currentTarget.idVideo);
	 setTimeout(() => {
	  document.querySelector('.RTB_video_'+currentVideoID).classList.remove('RTB_end_card');
	  if(!media.muted) {
		  media.muted = true;
		  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_mute.RTB_mute_b_f .RTB_muted_icon').classList.add('active');
		  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_play_pause_background').classList.remove('fade-in');
		  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_main_branding_bar .RTB_learn_more.RTB_video_clickable').classList.remove('active');
	  }
	  media.play();
	 }, 3000);    
  }
  
  function replayVideo(currentVideo) { 
	  currentVideoID = currentVideo.currentTarget.idVideo;
	  //console.log('replayVideo', currentVideo.currentTarget.idVideo);
	  media = document.querySelector('.RTB_video_'+currentVideoID+' video');
	  media.play();   
  
	  document.querySelector('.RTB_video_'+currentVideoID).classList.remove('RTB_end_card');
	  //console.log('Replay Video', currentVideoID);
  }
  
  function OverVideo(currentVideo) { 
	  currentVideoID = currentVideo.currentTarget.idVideo;
	  //console.log('OverVideo', currentVideoID);
	  media = document.querySelector('.RTB_video_'+currentVideoID+' video');
	  
	  if (!media.muted) {
		  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_play_pause_background').classList.add('fade-in');
  
		  if(media.paused) {
			  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_play_icon').classList.add('active');
			  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_pause_icon').classList.remove('active');
			  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_main_branding_bar .RTB_learn_more.RTB_video_clickable').classList.add('active');
		  } else {
			  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_play_icon').classList.remove('active');
			  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_pause_icon').classList.add('active');
			  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_main_branding_bar .RTB_learn_more.RTB_video_clickable').classList.add('active');
		  }
	  }
  }
  
  function OutVideo(currentVideo) { 
	  currentVideoID = currentVideo.currentTarget.idVideo;
	  //console.log('OutVideo', currentVideoID);
	  media = document.querySelector('.RTB_video_'+currentVideoID+' video');
  
	  if (!media.muted) {
		  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_play_pause_background').classList.add('fade-in');
  
		  if(media.paused) {
			  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_play_icon').classList.add('active');
			  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_pause_icon').classList.remove('active');
			  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_play_pause_background').classList.remove('fade-in');
			  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_main_branding_bar .RTB_learn_more.RTB_video_clickable').classList.remove('active');
			  
		  } else {
			  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_play_icon').classList.remove('active');
			  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_pause_icon').classList.add('active');
			  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_play_pause_background').classList.remove('fade-in');
			  document.querySelector('.RTB_video_'+currentVideoID+' .RTB_main_branding_bar .RTB_learn_more.RTB_video_clickable').classList.remove('active');
		  }   
	  }
  }

function OverBarSpeak(currentVideo) { 
    currentVideoID = currentVideo.currentTarget.idVideo;
    media = document.querySelector('.RTB_video_'+currentVideoID+' video');
    if (!media.muted) { 
        document.querySelector('.RTB_video_'+currentVideoID+' .RTB_content_vol').classList.add('active');
    }
}

function OutBarSpeak(currentVideo) { 
    currentVideoID = currentVideo.currentTarget.idVideo;
    media = document.querySelector('.RTB_video_'+currentVideoID+' video');

    if (!media.muted) { 
        document.querySelector('.RTB_video_'+currentVideoID+' .RTB_content_vol').classList.remove('active');
    }
}
  
  function FullScreenVideo(currentVideo) { 
	  currentVideoID = currentVideo.currentTarget.idVideo;
	  //console.log('OutVideo', currentVideoID);
	  media = document.querySelector('.RTB_video_'+currentVideoID+' video');
	  media.webkitEnterFullScreen();
  }

  function SetVolume(currentVideo) { 
    currentVideoID = currentVideo.currentTarget.idVideo;
    media = document.querySelector('.RTB_video_'+currentVideoID+' video');
    media.volume = this.value / 100;

    //console.log('Volumen:', media.volume);

    /* if (media.volume == 0) {
      document.querySelector('.RTB_video_'+currentVideoID+' .RTB_mute .RTB_muted_icon').classList.add('active');
      document.querySelector('.RTB_video_'+currentVideoID+' .RTB_mute .RTB_unmuted_icon').classList.remove('active');
      document.querySelector('.RTB_video_'+currentVideoID+' .RTB_mute.RTB_mute_b_f .RTB_muted_icon').classList.add('active');
      media.muted = true;
    } else {
      document.querySelector('.RTB_video_'+currentVideoID+' .RTB_mute .RTB_muted_icon').classList.remove('active');
      document.querySelector('.RTB_video_'+currentVideoID+' .RTB_mute .RTB_unmuted_icon').classList.add('active');
      document.querySelector('.RTB_video_'+currentVideoID+' .RTB_mute.RTB_mute_b_f .RTB_muted_icon').classList.remove('active');
      media.muted = false;
    }*/
}

function SetVolumeBg(currentVideo) { 
    currentVideoID = currentVideo.currentTarget.idVideo;
    media = document.querySelector('.RTB_video_'+currentVideoID+' .RTB_vol_control');

    var color = 'linear-gradient(90deg,rgb(255,255,255)'+ media.value+'%,rgba(0,0,0,.4)'+media.value+'%)';
    media.style.background = color;

}

function ControlsVideoAD(currentVideoAdid) {
    const currentVideoId = currentVideoAdid;
    console.log('video id:', currentVideoId);
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_video_clickable').addEventListener('click', playPauseMedia);
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_video_clickable').idVideo = currentVideoId;
  
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_fullscreen_icon').addEventListener('click', FullScreenVideo);
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_fullscreen_icon').idVideo = currentVideoId;
  
    if (RTB_IsMobile()) {
        document.querySelector('.RTB_video_'+currentVideoId+' .RTB_playback_controls_overlay').addEventListener('click', OverlayMedia);
        document.querySelector('.RTB_video_'+currentVideoId+' .RTB_playback_controls_overlay').idVideo = currentVideoId;
    }
  
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_content_video').addEventListener("mouseover", OverVideo);
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_content_video').addEventListener("mouseout", OutVideo);  
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_content_video').idVideo = currentVideoId;
  
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_end_card_button').addEventListener('click', replayVideo);
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_end_card_button').idVideo = currentVideoId;
  
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_mute').addEventListener('click', mutedMedia);
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_mute').idVideo = currentVideoId;
  
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_mute.RTB_mute_b_f').addEventListener('click', mutedMedia);
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_mute.RTB_mute_b_f').idVideo = currentVideoId;
  
    document.querySelector('.RTB_video_'+currentVideoId+' video').addEventListener('timeupdate', setTime);
    document.querySelector('.RTB_video_'+currentVideoId+' video').addEventListener('loadeddata', mutedInitMedia);
    document.querySelector('.RTB_video_'+currentVideoId+' video').addEventListener('ended', finishedVideo);
    document.querySelector('.RTB_video_'+currentVideoId+' video').idVideo = currentVideoId;
  
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_vol_control').addEventListener('change',SetVolume);
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_vol_control').addEventListener('input',SetVolume);
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_vol_control').addEventListener('mousemove',SetVolumeBg);
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_vol_control').idVideo = currentVideoId;
  
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_mute').addEventListener("mouseover", OverBarSpeak);
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_mute').addEventListener("mouseout", OutBarSpeak);  
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_mute').idVideo = currentVideoId; 
  
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_vol_control').addEventListener("mouseover", OverBarSpeak);
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_vol_control').addEventListener("mouseout", OutBarSpeak);  
    document.querySelector('.RTB_video_'+currentVideoId+' .RTB_vol_control').idVideo = currentVideoId;
}

/* function RTB_Video_Test(adid) { 
	tptVideo = '<div class="RTB_TemplVideo"><a href="https://ssp.emol.com/CampaignServer/Register?i=510&amp;c=194&amp;t=c&amp;uuid=1b0c55d9-65c2-4ea1-83ed-83f7d22afa32&amp;bf=300x250v&amp;m=0.5" target="_blank"><video id="RTB_video_'+adid+'" autoplay muted loop controls><source src="https://selfvid.ecn.cl/videos/enc/File-250921-122429.994.3.webm" type="video/webm"/><source src="https://selfvid.ecn.cl/videos/enc/File-250921-122429.994.3.mp4" type="video/mp4"/></video></a></div><script>RTB_Video_Mouse('+adid+');</script>';
	$('#ba-det-1').html(tptVideo);
} */

function bDisplayVideo(div,href,vidSrc1,vidSrc2,pixel,calendar,contactForm,adid) {
	console.log("ADID VIDEO:" + adid);

	tptVideo = '<div class="RTB_TemplVideo RTB_Templ_bar_video RTB_video_'+adid+'"><div class="RTB_txt_head">Publicidad</div><div class="RTB_content_video"><video tabindex="-1" muted playsinline autoplay src="'+vidSrc1+'"></video><div class="RTB_controls"><div class="RTB_playback_controls_overlay"><div class="RTB_play_pause_background"><div class="RTB_play_pause_container"><div class="RTB_video_clickable"><div class="RTB_play_icon" aria-label="Play video" role="button"><img src="'+ss_urlServer+'/img/icons/RTB_icon_play.svg" alt="Play video"></div><div class="RTB_pause_icon" aria-label="Pause video" role="button"><img src="'+ss_urlServer+'/img/icons/RTB_icon_pause.svg" alt="Pause video"></div></div><div class="RTB_mute"><img class="RTB_muted_icon" aria-label="Unmute video" role="button" src="'+ss_urlServer+'/img/icons/RTB_icon_unmute.svg" alt="Unmute video"> <img class="RTB_unmuted_icon" aria-label="Mute video" role="button" src="'+ss_urlServer+'/img/icons/RTB_icon_mute.svg" alt="Mute video"></div><div class="RTB_content_vol"><input class="RTB_vol_control" type="range" min="0" max="100" step="1"></div><div class="RTB_timer"><div class="RTB_timer_bar"></div><span class="RTB_time_number">00:00</span></div><div class="RTB_fullscreen_icon" aria-label="FullScreen video" role="button"><img src="'+ss_urlServer+'/img/icons/RTB_icon_expand.svg" alt="FullScreen video"></div></div></div></div><div class="RTB_mute RTB_mute_b_f"><img class="RTB_muted_icon" aria-label="Unmute video" role="button" src="'+ss_urlServer+'/img/icons/RTB_icon_unmute.svg" alt="Unmute video"> <img class="RTB_unmuted_icon" aria-label="Mute video" role="button" src="'+ss_urlServer+'/img/icons/RTB_icon_mute.svg" alt="Mute video"></div><div class="RTB_end_card_overlay"><div class="RTB_end_card_controls_container"><div class="RTB_end_card_controls"><div class="RTB_end_card_button" aria-label="Volver a reproducir" role="button"><div class="RTB_video_clickable"><img src="'+ss_urlServer+'/img/icons/RTB_icon_replay.svg" alt="Replay video"></div></div><div class="RTB_full_only"><div class="RTB_end_card_button"><a href="'+href+'" target="_blank"><span class="RTB_end_card_button RTB_learn_more RTB_dark_cta RTB_video_clickable" role="button">más info</span></a></div></div></div></div></div></div><div class="RTB_main_branding_bar"><div class="RTB_learn_more_container"><a href="'+href+'" target="_blank"><div class="RTB_learn_more RTB_video_clickable" role="button">más info</div></a></div></div></div><div class="RTB_view_more"><div class="RTB_view_content_button"><a href="'+href+'" target="_blank"><div class="RTB_view_more_button">Más Información</div></a></div></div></div>';

	tptVideo += '<script>ControlsVideoAD('+adid+')</script>';

	$('#'+div).html(tptVideo);
}

jQuery('#RTB_rut').blur(function(e){
    var RUT = $(this).val();
    if (ValidarRut(RUT)) {
      formatearRut(this);
    }
});

function showRtb (pos,urlContent,append,w,h,lat,lng) {

	var url = "https://ssp.emol.com/open-ssp/GetData?site=1&test=0&url="+urlContent;
	if (typeof lat != 'undefined' && lat!=null && typeof lng!='undefined' && lng!=null) url = url + "&lat="+lat+"&lng="+lng;
	width = 300; height = 250;
	if (typeof h != 'undefined') height = h;
	if (typeof w != 'undefined') width = w;
	
		url = url + "&h="+height+"&w="+width;

	jQuery.ajax({
        url: url,
        jsonp: "callback",
		// Tell jQuery we're expecting JSONP
        dataType: "jsonp",

        success: function(respuesta) {
                respuesta = respuesta.replace(/\\/g,"");
                respuesta = respuesta.replace(/&amp;/g,"&");
                respuesta = respuesta.replace(/DIV/,pos);
                //console.log(respuesta);
				//console.log(pos);
			if (!append) { 
				$("#"+pos).html(respuesta);
			} else {
				$("#"+pos).append(respuesta);

			}
        },
	        error: function() {
	        console.log("No se ha podido obtener la información");
    	}
	});
}
function ss_read_cookie(key)
{
    var result;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
}
function ss_processQueue() {
	var boostedCampaign = ss_read_cookie("boost");
	if (boostedCampaign) console.log("boosted:"+boostedCampaign);
	var newAd = _ssq.shift();
	var idq=[]; var creativeq=[];	var moneyq=[]; formatq=[];	
	cs = "https://ssp.emol.com/CampaignServer/Register";
	while (newAd!=null) {
		console.log("new ad:"+newAd);
		candidates = [];
		day = 3600*24*1000;
		session = 15*60*1000;
		page = 10*1000;
		if (window.location.href.indexOf("mercadomayorista")>0) page = 5*1000;
		cached = false;
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
		if (newAd[5]) {
			//use cache
			if (adCache[newAd[0]]) {
				if (newAd[4]) {
					$('#'+newAd[0]).html(adCache[newAd[0]]);		
				} else {
					$('#'+newAd[0]).append(adCache[newAd[0]]);		
				}
				cached = true;
			} 
		
			
		}
					bidLevel = 0;
					minBid = 6000;
					//console.log("pageType:"+bannerPageType);
					//console.log("posLevel:"+posLevel);
					//console.log("section:"+section);
				 	for ( bl = bidLevels.length-1; bl >= 0; bl--) {
						siteOk = false;
						for ( si = 0; si<bidLevels[bl].sites.length; si++) {
							if (site== bidLevels[bl].sites[si].id) siteOk=true;
						}
						pageTypeOk = false;
						//console.log(","+bidLevels[bl].pageTypes+",");
						if ((","+bidLevels[bl].pageTypes+",").indexOf(","+bannerPageType+",") >=0 ) pageTypeOk = true;
						positionOk = false;
						//console.log(","+bidLevels[bl].positions+",");
						if ((","+bidLevels[bl].positions+",").indexOf(","+posLevel+",") >=0 ) positionOk = true;
						categoryOk = false;
						for ( si = 0; si<bidLevels[bl].contents.length; si++) {
							if (section.toUpperCase()== bidLevels[bl].contents[si].id.toUpperCase()) categoryOk=true;
						}
						//formatOk = false;
						//if ((","+bidLevels[bl].formats+",").indexOf(","+format+",") >=0 ) formatOk = true;
						//console.log ("siteOK:"+siteOk+" pageTypeOK :"+pageTypeOk+ " positionOk: "+positionOk);
						if (siteOk && pageTypeOk && categoryOk ) {
							bidLevel = bl;	
							minBid = bidLevels[bl].minBid;
							//console.log ("bl:"+bl);
						}
					}
					//console.log ("minBid:"+minBid);
		if (!cached) campaigns.forEach( function(c,cindex) {
			c.banners.forEach(function (b,bindex) {
				validSize = false;
				if (b.width==newAd[1] && b.height==newAd[2]) validSize =true;
				if (newAd[1]==300 && newAd[2]==250 && b.url && b.url.indexOf("mp4")>0) validSize = true;
				if (validSize) {
					format = newAd[1] + "x" + newAd[2];
					if (b.url) {
							if (b.url.indexOf("mp4")>0) format = "video"; 
					} else format = "text";
					valid = false;
					timeSince = 10000000000000;
					if (!c.audience.repetition) c.audience.repetition = 3;
					ssLoadDate =  Date.now();
					if (c.lastImpression) {
						timeSince = ssLoadDate - c.lastImpression	+ deltaTime;
						//console.log("deltaTime:"+deltaTime+" timeSince:"+timeSince+" page:"+page+" session:"+session);
						repetition = c.audience.repetition;
						if (typeof c.fixedCpm !=='undefined') {
							repetition=3;// for fixedCpm contracts, use always one per page
							if (format=="300x250") repetition=2;
						}
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
						b.html = "";
						hasEvent = false;
						titleCampaingAd = c.description;
						titleEventAd = c.audience.eventTitle;
						contactFormFieldsTxt="";
						if (c.audience.contactFormFields) contactFormFieldsTxt = c.audience.contactFormFields.toString();
						if (c.audience.eventDate) hasEvent = true;
						if (b.url) {
							if (b.url.indexOf("mp4")>0) {
							b.url = b.url.replace("self.emol.cl","selfvid.ecn.cl");
							b.format=b.width+"x"+b.height+"v";
							var supportedFormat="webm";
							var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
							if (isSafari) supportedFormat="mp4";
							if (isSafari) console.log("safari");
							b.html="<script>bDisplayVideo('"+newAd[0]+"','"+cs+"?i="+c.id+"&c="+b.creativeId+"&t=c&uuid="+uuid+"&bf="+b.format+"&m="+"_BID_"+"',";
							b.html=b.html+"'"+b.url.replace("mp4",supportedFormat)+"','"+b.url+"','"+cs+"?i="+c.id+"&c="+b.creativeId+"&t=i&m="+"_BID_"+"&uuid="+uuid+"',"+hasEvent+",'"+contactFormFieldsTxt+"','"+c.id+"')</script>";

							} else {
							b.url = b.url.replace("self.emol","selfcdn.emol");
							b.format=b.width+"x"+b.height+"p";
							b.html="<script>bDisplayPhoto('"+newAd[0]+"','"+cs+"?i="+c.id+"&c="+b.creativeId+"&t=c&uuid="+uuid+"&bf="+b.format+"&m="+"_BID_"+"',";
							b.html=b.html+"'"+b.url+"','"+cs+"?i="+c.id+"&c="+b.creativeId+"&t=i&m="+"_BID_"+"&uuid="+uuid+"',"+hasEvent+",'"+contactFormFieldsTxt+"','"+c.id+"','"+titleCampaingAd+"','"+titleEventAd+"')</script>";

							}
						} else {
							//text ad
							b.format=b.width+"x"+b.height+"t";
							b.html="<script>bDisplayText('"+newAd[0]+"','"+cs+"?i="+c.id+"&c="+b.creativeId+"&t=c&uuid="+uuid+"&bf="+b.format+"&m="+"_BID_"+"','"+ss_cleanText(b.bannerText)+"',";
							b.html=b.html+"'"+cs+"?i="+c.id+"&c="+b.creativeId+"&t=i&m="+"_BID_"+"&uuid="+uuid+"',"+hasEvent+",'"+contactFormFieldsTxt+"','"+c.id+"')</script>";
						}
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
			console.log("candidates") ;
			console.log(candidates);
			console.log("winner");
			console.log (candidates[0]);
			campaigns[candidates[0].cindex].lastImpression=Date.now()-deltaTime;
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
			adHtml = candidates[0].html.replace("_BID_",bid);
			if (newAd[4]) {
				$('#'+newAd[0]).html(adHtml);		
			} else {
				console.log(adHtml);
				$('#'+newAd[0]).append(adHtml);		
			}
			idq.push(candidates[0].campaignId);
			creativeq.push(candidates[0].creativeId);
			moneyq.push(bid);
			formatq.push(candidates[0].format);
			//adCache[newAd[0]]=candidates[0].html;
			adCache[newAd[0]]=adHtml;
		}
		newAd = _ssq.shift();
		adNumber--;
	}
		// add pixel to mark impressions
		if (idq.length>0) {
			pixelUrl = cs+"?i="+idq.toString()+"&c="+creativeq.toString()+"&t=i&m="+moneyq.toString()+"&bf="+formatq.toString()+"&uuid="+uuid+"&rand="+Math.random();
			var image = document.createElement('img');
			image.width=1;
			image.height=1;
			image.src = pixelUrl;
			document.body.appendChild(image);	
		}
	
	setTimeout(function() {ss_processQueue();},2000);
}
function ss_getData() {
currentPage = window.location.href;
if (currentPage.indexOf("www.emol.com")>0 || currentPage.indexOf("emol50.gen.emol.cl")>0 || currentPage.indexOf("tv.emol.com")>0) {
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
}
if (currentPage.indexOf("www.economicos.")>0) {
	site = "EC";
	section = econoData[ssSectionId].c;
	subsection = econoData[ssSectionId].n;
	pageType = "Artículo";
}
if (currentPage.indexOf("mayorista.")>0) {
	site = "LM";
	section = "nacional";
	subsection = "nacional";
	if (currentPage.split("/").length==4) {
		pageType="Portada de Sitio";
	} else {
		pageType = "Artículo";
	}
}
if (currentPage.indexOf("https://www.guioteca.com")==0) {
	site = "GT";
	parts = currentPage.split("/");
	if (parts.length>=5) {
		blog = "https://www.guioteca.com/"+parts[3]+"/";
		console.log(blog);
		console.log(guiotecaData);
		console.log(guiotecaData[blog].n);
		console.log(guiotecaData[blog].c);
		section = guiotecaData[blog].c;
		subsection = guiotecaData[blog].n;
		pageType = "Portada de Tema";
		if (parts.length>=6) {
			pageType = "Artículo";
	
		}
	} else {
		pageType = "Portada de Sitio";

	}
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
url  = "https://ssp.emol.com/CampaignServer/Campaigns?action=getCampaigns&site="+site+"&category="+sectionStr.toUpperCase()+"&subcategory="+subsection+"&pageType="+pageType+coords+"&rand="+Math.random();
 jQuery.ajax({
        url: url,
        //jsonp: "callback",
                // Tell jQuery we're expecting JSONP
        dataType: "json",
	xhrFields : {
		withCredentials: true 
	},
        success: function(respuesta) {
		uuid = respuesta.uuid;	
		campaigns = respuesta.campaigns;
		audiences = respuesta.audiences;
		if (typeof respuesta.previousClicks!== 'undefined') previousClicks = respuesta.previousClicks;
		if (campaigns.length==0) return;
		window.deltaTime = Date.now() - campaigns[0].currentTime;
		window.ssLoadDate = Date.now();
		console.log(campaigns);
		console.log(deltaTime);
		url = "https://ssp.emol.com/js/bidlevels.json";
		 jQuery.ajax({
			         url: url,
			         dataType: "json",
			         success: function(bidlevelsData) {
					bidLevels = bidlevelsData;
					 console.log(bidLevels);
					ss_processQueue();
				}
		 });
		
        },
                error: function() {
                console.log("No se ha podido obtener la informaci~C³n");
        }
        });
}

function ss_cleanText(text) {
	clean=text.replace(/<(.*)>/g,"");
	clean=clean.replace(/_(.*?)_/g,"<em>$1</em>");
	clean=clean.replace(/\*(.*?)\*/g,"<strong>$1</strong>");
	clean=clean.replace(/~(.*?)~/g,"<strike>$1</strike>");
	return clean;
}

guiotecaData = {
	"https://www.guioteca.com/arte-y-diseno-creativo/": {"n":"Arte y Diseño Creativo","c":"ARTE Y CULTURA"},
	"https://www.guioteca.com/anime/": {"n":"Animé","c":"ARTE Y CULTURA"},
	"https://www.guioteca.com/cultura-chilena/": {"n":"Cultura Chilena","c":"ARTE Y CULTURA"},
	"https://www.guioteca.com/cultura-china/": {"n":"Cultura China","c":"ARTE Y CULTURA"},
	"https://www.guioteca.com/cultura-india/": {"n":"Cultura India","c":"ARTE Y CULTURA"},
	"https://www.guioteca.com/cultura-japonesa/": {"n":"Cultura Japonesa","c":"ARTE Y CULTURA"},
	"https://www.guioteca.com/instrumentos-musicales/": {"n":"Instrumentos Musicales","c":"ARTE Y CULTURA"},
	"https://www.guioteca.com/literatura-fantastica/": {"n":"Literatura Fantástica","c":"ARTE Y CULTURA"},
	"https://www.guioteca.com/manualidades-y-artesania/": {"n":"Manualidades y Artesanía","c":"ARTE Y CULTURA"},
	"https://www.guioteca.com/series-de-tv/": {"n":"Series de TV","c":"ESPECTÁCULOS"},
	"https://www.guioteca.com/literatura-contemporanea/": {"n":"Literatura Contemporánea","c":"ARTE Y CULTURA"},
	"https://www.guioteca.com/arquitectura-y-ciudad/": {"n":"Arquitectura y Ciudad","c":"ARTE Y CULTURA"},
	"https://www.guioteca.com/mecanica-automotriz/": {"n":"Mecánica Automotriz","c":"AUTOS"},
	"https://www.guioteca.com/motos/": {"n":"Motos","c":"AUTOS"},
	"https://www.guioteca.com/feng-shui/": {"n":"Feng Shui","c":"CASA Y FAMILIA"},
	"https://www.guioteca.com/mascotas/": {"n":"Mascotas","c":"CASA Y FAMILIA"},
	"https://www.guioteca.com/maternidad/": {"n":"Maternidad","c":"CASA Y FAMILIA"},
	"https://www.guioteca.com/millennials/": {"n":"Millennials","c":"CASA Y FAMILIA"},
	"https://www.guioteca.com/parejas/": {"n":"Parejas","c":"CASA Y FAMILIA"},
	"https://www.guioteca.com/ser-padre/": {"n":"Ser Padre","c":"CASA Y FAMILIA"},
	"https://www.guioteca.com/nutricion/": {"n":"Nutrición","c":"COCINA Y NUTRICIÓN"},
	"https://www.guioteca.com/postres/": {"n":"Postres","c":"COCINA Y NUTRICIÓN"},
	"https://www.guioteca.com/vinos/": {"n":"Vinos","c":"COCINA Y NUTRICIÓN"},
	"https://www.guioteca.com/artes-marciales/": {"n":"Artes Marciales","c":"DEPORTES"},
	"https://www.guioteca.com/basquetbol/": {"n":"Básquetbol","c":"DEPORTES"},
	"https://www.guioteca.com/boxeo/": {"n":"Boxeo","c":"DEPORTES"},
	"https://www.guioteca.com/ciclismo-urbano/": {"n":"Ciclismo Urbano","c":"DEPORTES"},
	"https://www.guioteca.com/colo-colo/": {"n":"Colo Colo","c":"DEPORTES"},
	"https://www.guioteca.com/deportes-extremos/": {"n":"Deportes Extremos","c":"DEPORTES"},
	"https://www.guioteca.com/formula-1/": {"n":"Fórmula 1","c":"DEPORTES"},
	"https://www.guioteca.com/futbol-argentino/": {"n":"Fútbol Argentino","c":"DEPORTES"},
	"https://www.guioteca.com/futbol-internacional/": {"n":"Fútbol Internacional","c":"DEPORTES"},
	"https://www.guioteca.com/futbol-total/": {"n":"Fútbol Total","c":"DEPORTES"},
	"https://www.guioteca.com/la-u/": {"n":"La U","c":"DEPORTES"},
	"https://www.guioteca.com/la-uc/": {"n":"La UC","c":"DEPORTES"},
	"https://www.guioteca.com/lucha-libre/": {"n":"Lucha Libre","c":"DEPORTES"},
	"https://www.guioteca.com/mountainbike/": {"n":"Mountainbike","c":"DEPORTES"},
	"https://www.guioteca.com/pesca-con-mosca/": {"n":"Pesca con Mosca","c":"DEPORTES"},
	"https://www.guioteca.com/running/": {"n":"Running","c":"DEPORTES"},
	"https://www.guioteca.com/seleccion-chilena/": {"n":"Selección Chilena","c":"DEPORTES"},
	"https://www.guioteca.com/e-business/": {"n":"E-Business","c":"ECONOMÍA Y NEGOCIOS"},
	"https://www.guioteca.com/publicidad/": {"n":"Publicidad","c":"ECONOMÍA Y NEGOCIOS"},
	"https://www.guioteca.com/rse/": {"n":"RSE","c":"ECONOMÍA Y NEGOCIOS"},
	"https://www.guioteca.com/educacion-para-ninos/": {"n":"Educación para Niños","c":"EDUCACIÓN"},
	"https://www.guioteca.com/educacion-secundaria/": {"n":"Educación Secundaria","c":"EDUCACIÓN"},
	"https://www.guioteca.com/ingles/": {"n":"Inglés","c":"EDUCACIÓN"},
	"https://www.guioteca.com/matematicas/": {"n":"Matemáticas","c":"EDUCACIÓN"},
	"https://www.guioteca.com/celebridades/": {"n":"Celebridades","c":"ESPECTÁCULOS"},
	"https://www.guioteca.com/cortos-y-documentales/": {"n":"Cortos y Documentales","c":"ESPECTÁCULOS"},
	"https://www.guioteca.com/discos/": {"n":"Discos","c":"ESPECTÁCULOS"},
	"https://www.guioteca.com/espectaculo-argentino/": {"n":"Espectáculo Argentino","c":"ESPECTÁCULOS"},
	"https://www.guioteca.com/farandula/": {"n":"Farándula","c":"ESPECTÁCULOS"},
	"https://www.guioteca.com/los-2000/": {"n":"Los 2000","c":"ESPECTÁCULOS"},
	"https://www.guioteca.com/los-80/": {"n":"Los 80","c":"ESPECTÁCULOS"},
	"https://www.guioteca.com/los-90/": {"n":"Los 90","c":"ESPECTÁCULOS"},
	"https://www.guioteca.com/musica-indie/": {"n":"Música Indie","c":"ESPECTÁCULOS"},
	"https://www.guioteca.com/musica-pop/": {"n":"Música Pop","c":"ESPECTÁCULOS"},
	"https://www.guioteca.com/paparazzis/": {"n":"Paparazzis","c":"ESPECTÁCULOS"},
	"https://www.guioteca.com/realeza/": {"n":"Realeza","c":"ESPECTÁCULOS"},
	"https://www.guioteca.com/rock/": {"n":"Rock","c":"ESPECTÁCULOS"},
	"https://www.guioteca.com/tv-chilena/": {"n":"TV chilena","c":"ESPECTÁCULOS"},
	"https://www.guioteca.com/tv-internacional/": {"n":"TV Internacional","c":"ESPECTÁCULOS"},
	"https://www.guioteca.com/tv-mexicana/": {"n":"TV Mexicana","c":"ESPECTÁCULOS"},
	"https://www.guioteca.com/adolescencia/": {"n":"Adolescencia","c":"CASA Y FAMILIA"},
	"https://www.guioteca.com/adulto-mayor/": {"n":"Adulto Mayor","c":"CASA Y FAMILIA"},
	"https://www.guioteca.com/bodas/": {"n":"Bodas","c":"CASA Y FAMILIA"},
	"https://www.guioteca.com/crecimiento-personal/": {"n":"Crecimiento Personal","c":"CASA Y FAMILIA"},
	"https://www.guioteca.com/comics/": {"n":"Cómics","c":"JUEGOS Y HOBBIES"},
	"https://www.guioteca.com/entretencion-para-ninos/": {"n":"Entretención para niños","c":"JUEGOS Y HOBBIES"},
	"https://www.guioteca.com/fotografia/": {"n":"Fotografía","c":"JUEGOS Y HOBBIES"},
	"https://www.guioteca.com/videojuegos/": {"n":"Videojuegos","c":"JUEGOS Y HOBBIES"},
	"https://www.guioteca.com/medio-ambiente/": {"n":"Medio Ambiente","c":"ECOLOGÍA"},
	"https://www.guioteca.com/proteccion-animal/": {"n":"Protección Animal","c":"ECOLOGÍA"},
	"https://www.guioteca.com/vida-salvaje/": {"n":"Vida Salvaje","c":"ECOLOGÍA"},
	"https://www.guioteca.com/accesorios-y-zapatos/": {"n":"Accesorios y Zapatos","c":"MODA Y BELLEZA"},
	"https://www.guioteca.com/belleza/": {"n":"Belleza","c":"MODA Y BELLEZA"},
	"https://www.guioteca.com/maquillaje/": {"n":"Maquillaje","c":"MODA Y BELLEZA"},
	"https://www.guioteca.com/moda/": {"n":"Moda","c":"MODA Y BELLEZA"},
	"https://www.guioteca.com/amor/": {"n":"Amor","c":"RELACIONES Y CONSEJOS"},
	"https://www.guioteca.com/autoayuda/": {"n":"Autoayuda","c":"RELACIONES Y CONSEJOS"},
	"https://www.guioteca.com/coaching/": {"n":"Coaching","c":"RELACIONES Y CONSEJOS"},
	"https://www.guioteca.com/psicologia-animal/": {"n":"Psicología Animal","c":"RELACIONES Y CONSEJOS"},
	"https://www.guioteca.com/psicologia-y-tendencias/": {"n":"Psicología y Tendencias","c":"RELACIONES Y CONSEJOS"},
	"https://www.guioteca.com/rankings/": {"n":"Rankings","c":"RELACIONES Y CONSEJOS"},
	"https://www.guioteca.com/sexualidad/": {"n":"Sexualidad","c":"RELACIONES Y CONSEJOS"},
	"https://www.guioteca.com/solteras/": {"n":"Solteras","c":"RELACIONES Y CONSEJOS"},
	"https://www.guioteca.com/alma/": {"n":"Alma","c":"RELIGIÓN Y CREENCIAS"},
	"https://www.guioteca.com/astrologia-y-destino/": {"n":"Astrología y Destino","c":"RELIGIÓN Y CREENCIAS"},
	"https://www.guioteca.com/espiritualidad/": {"n":"Espiritualidad","c":"RELIGIÓN Y CREENCIAS"},
	"https://www.guioteca.com/fenomenos-paranormales/": {"n":"Fenómenos Paranormales","c":"RELIGIÓN Y CREENCIAS"},
	"https://www.guioteca.com/grandes-misterios/": {"n":"Grandes Misterios","c":"RELIGIÓN Y CREENCIAS"},
	"https://www.guioteca.com/mitos-y-enigmas/": {"n":"Mitos y Enigmas","c":"RELIGIÓN Y CREENCIAS"},
	"https://www.guioteca.com/ovnis/": {"n":"Ovnis","c":"RELIGIÓN Y CREENCIAS"},
	"https://www.guioteca.com/tarot-y-suenos/": {"n":"Tarot y Sueños","c":"RELIGIÓN Y CREENCIAS"},
	"https://www.guioteca.com/diabetes/": {"n":"Diabetes","c":"SALUD"},
	"https://www.guioteca.com/kinesiologia/": {"n":"Kinesiología","c":"SALUD"},
	"https://www.guioteca.com/odontologia/": {"n":"Odontología","c":"SALUD"},
	"https://www.guioteca.com/pilates/": {"n":"Pilates","c":"SALUD"},
	"https://www.guioteca.com/vida-sana/": {"n":"Vida Sana","c":"SALUD"},
	"https://www.guioteca.com/ciencia/": {"n":"Ciencia","c":"TECNOLOGÍA"},
	"https://www.guioteca.com/exploracion-espacial/": {"n":"Exploración Espacial","c":"TECNOLOGÍA"},
	"https://www.guioteca.com/internet/": {"n":"Internet","c":"TECNOLOGÍA"},
	"https://www.guioteca.com/curiosidades/": {"n":"Curiosidades","c":"TENDENCIAS"},
	"https://www.guioteca.com/esoterismo/": {"n":"Esoterismo","c":"TENDENCIAS"},
	"https://www.guioteca.com/humor/": {"n":"Humor","c":"TENDENCIAS"},
	"https://www.guioteca.com/inclusion/": {"n":"Inclusión","c":"TENDENCIAS"},
	"https://www.guioteca.com/lujo/": {"n":"Lujo","c":"TENDENCIAS"},
	"https://www.guioteca.com/mujer/": {"n":"Mujer","c":"TENDENCIAS"},
	"https://www.guioteca.com/redes-sociales/": {"n":"Redes Sociales","c":"TENDENCIAS"},
	"https://www.guioteca.com/virales/": {"n":"Virales","c":"TENDENCIAS"},
	"https://www.guioteca.com/economia-domestica/": {"n":"Economía Doméstica","c":"TRABAJO Y FINANZAS"},
	"https://www.guioteca.com/emprendimiento/": {"n":"Emprendimiento","c":"TRABAJO Y FINANZAS"},
	"https://www.guioteca.com/finanzas-aplicadas/": {"n":"Finanzas Aplicadas","c":"TRABAJO Y FINANZAS"},
	"https://www.guioteca.com/temas-legales/": {"n":"Temas Legales","c":"TRABAJO Y FINANZAS"},
	"https://www.guioteca.com/voluntariado/": {"n":"Voluntariado","c":"TRABAJO Y FINANZAS"},
	"https://www.guioteca.com/argentina/": {"n":"Argentina","c":"VIAJES Y TURISMO"},
	"https://www.guioteca.com/mexico/": {"n":"México","c":"VIAJES Y TURISMO"},
	"https://www.guioteca.com/vida-en-inglaterra/": {"n":"Vida en Inglaterra","c":"VIAJES Y TURISMO"},
	"https://www.guioteca.com/espana/": {"n":"España","c":"VIAJES Y TURISMO"},
	"https://www.guioteca.com/nueva-york/": {"n":"Nueva York","c":"VIAJES Y TURISMO"},
	"https://www.guioteca.com/patagonia/": {"n":"Patagonia","c":"VIAJES Y TURISMO"},
	"https://www.guioteca.com/viajes-en-avion/": {"n":"Viajes en Avión","c":"VIAJES Y TURISMO"},
	"https://www.guioteca.com/viajes-por-chile/": {"n":"Viajes por Chile","c":"VIAJES Y TURISMO"},
	"https://www.guioteca.com/viajes-por-el-mundo/": {"n":"Viajes por el Mundo","c":"VIAJES Y TURISMO"},
	"https://www.guioteca.com/vida-en-santiago/": {"n":"Vida en Santiago","c":"VIAJES Y TURISMO"}};
econoData = {
	"100":{"n":"","c":"AUTOS"},
	"101":{"n":"Acoplado/Casa Rodante","c":"AUTOS"},
	"102":{"n":"Automóviles","c":"AUTOS"},
	"103":{"n":"Bus/Microbus","c":"AUTOS"},
	"104":{"n":"Camiones","c":"AUTOS"},
	"105":{"n":"Camioneta","c":"AUTOS"},
	"106":{"n":"Furgón","c":"AUTOS"},
	"107":{"n":"Motos","c":"AUTOS"},
	"108":{"n":"Otros Tipos de Vehículos","c":"AUTOS"},
	"109":{"n":"Accesorios para Vehículos","c":"AUTOS"},
	"110":{"n":"Maquinaria Pesada","c":"AUTOS"},
	"111":{"n":"Todo Terreno","c":"AUTOS"},
	"112":{"n":"Taxis y Taxis Colectivos","c":"AUTOS"},
	"200":{"n":"","c":"PROPIEDADES"},
	"201":{"n":"Hotel/Apart Hotel","c":"PROPIEDADES"},
	"203":{"n":"Casa Amoblada","c":"PROPIEDADES"},
	"204":{"n":"Casa","c":"PROPIEDADES"},
	"205":{"n":"Departamento","c":"PROPIEDADES"},
	"206":{"n":"Departamento Amoblado","c":"PROPIEDADES"},
	"212":{"n":"Local o Casa comercial","c":"PROPIEDADES"},
	"213":{"n":"Negocio/Patentes/Derechos de llave","c":"PROPIEDADES"},
	"214":{"n":"Oficina o Casa Oficina","c":"PROPIEDADES"},
	"215":{"n":"Parcela o Chacra","c":"PROPIEDADES"},
	"217":{"n":"Residencial/Pieza","c":"PROPIEDADES"},
	"218":{"n":"Propiedad industrial","c":"PROPIEDADES"},
	"251":{"n":"Bodega/Galpón","c":"PROPIEDADES"},
	"252":{"n":"Estacionamiento","c":"PROPIEDADES"},
	"254":{"n":"Sitio o Terreno","c":"PROPIEDADES"},
	"501":{"n":"Empleo","c":"TRABAJO Y EMPLEO"},
	"502":{"n":"Oferta de Empleo ","c":"TRABAJO Y EMPLEO"},
	"503":{"n":"Busco Empleo ","c":"TRABAJO Y EMPLEO"},
	"600":{"n":"Servicios","c":"SERVICIOS"},
	"601":{"n":"Servicios Domésticos ","c":"CASA Y FAMILIA"},
	"602":{"n":"Capacitación ","c":"EDUCACIÓN"},
	"603":{"n":"Ferias, Exposiciones y Eventos ","c":"ECONOMÍA Y NEGOCIOS"},
	"604":{"n":"Freelance ","c":"TRABAJO Y EMPLEO"},
	"605":{"n":"Niñera ","c":"TRABAJO Y EMPLEO"},
	"606":{"n":"Construcción / Reparación ","c":"SERVICIOS"},
	"607":{"n":"Salud / Belleza ","c":"MODA Y BELLEZA"},
	"608":{"n":"Informática ","c":"TECNOLOGIA"},
	"609":{"n":"Traducción ","c":"SERVICIOS"},
	"610":{"n":"Transportes, Mudanza, Fletes y Carga Aérea ","c":"CASA Y FAMILIA"},
	"611":{"n":"Viajes y Tours ","c":"VIAJES Y TURISMO"},
	"612":{"n":"Industria, Negocios y Oficinas ","c":"ECONOMÍA Y NEGOCIOS"},
	"613":{"n":"Construcción, Maquinarias ","c":"ECONOMÍA Y NEGOCIOS"},
	"614":{"n":"Agrícolas y forestales ","c":"CAMPO"},
	"615":{"n":"Autoconocimiento y Desarrollo Personal","c":"TRABAJO Y EMPLEO"},
	"616":{"n":"Esparcimiento y Diversión","c":"JUEGOS Y HOBBIES"},
	"701":{"n":"Avisos Legales","c":"LEGALES"},
	"710":{"n":"Legales","c":"REMATES"},
	"711":{"n":"Remates de propiedades - El Mercurio","c":"REMATES"},
	"712":{"n":"Otros Remates - El Mercurio","c":"REMATES"},
	"713":{"n":"Remates - Diarios Regionales","c":"REMATES"},
	"900":{"n":"","c":"CASA Y FAMILIA"},
	"901":{"n":"Computadores","c":"TECNOLOGIA"},
	"902":{"n":"Computadores y Accesorios ","c":"TECNOLOGIA"},
	"903":{"n":"Consolas y Videojuegos ","c":"TECNOLOGIA"},
	"1000":{"n":"Comunicaciones, Imagen y Video","c":"TECNOLOGIA"},
	"1001":{"n":"Teléfonos y Celulares ","c":"TECNOLOGIA"},
	"1002":{"n":"Audio, TV, Video y Fotografía ","c":"TECNOLOGIA"},
	"1100":{"n":"Hogar y Mascota","c":"CASA Y FAMILIA"},
	"1101":{"n":"Muebles y Artículos del Hogar ","c":"CASA Y FAMILIA"},
	"1102":{"n":"Línea Blanca y Electrodomésticos ","c":"CASA Y FAMILIA"},
	"1103":{"n":"Jardín y Herramientas ","c":"CASA Y FAMILIA"},
	"1104":{"n":"Moda y Vestuario ","c":"MODA Y BELLEZA"},
	"1105":{"n":"Juguetes y Artículos Infantiles","c":"JUEGOS Y HOBBIES"},
	"1106":{"n":"Bolsos, Joyería y Accesorios ","c":"MODA Y BELLEZA"},
	"1107":{"n":"Antiguedades y Objetos de Arte ","c":"ARTE Y CULTURA"},
	"1108":{"n":"Mascotas y Accesorios","c":"CASA Y FAMILIA"},
	"1109":{"n":"Agrícolas y Forestales","c":"CAMPO"},
	"1200":{"n":"Deportes y Pasatiempos","c":"DEPORTES"},
	"1201":{"n":"Artículos para Deportes y Gimnasia ","c":"DEPORTES"},
	"1202":{"n":"Bicicletas y Ciclismo ","c":"DEPORTES"},
	"1203":{"n":"Implementos para Camping y Deporte Aventura ","c":"DEPORTES"},
	"1204":{"n":"Instrumentos Musicales, Amplificadores y Accesorios ","c":"ARTE Y CULTURA"},
	"1205":{"n":"Música y Películas ","c":"ESPECTACULOS"},
	"1206":{"n":"Libros y Revistas ","c":"JUEGOS Y HOBBIES"},
	"1207":{"n":"Salud y Belleza ","c":"MODA Y BELLEZA"}};
ss_getData();
