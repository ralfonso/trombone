if (typeof window["console"] == 'undefined') {
    var console = {};
    console.log = function () {};
}
/*
*************************************************

CHOSEN
Master Javascript

*************************************************

/*- STATIC GLOBALS
----------------------------------------------------------------------*/


/*- MAIN APPLICATION
----------------------------------------------------------------------*/

var TROMBONE = {
  
  server: function(method, type, data, success) {
      $.ajax({
          type: type,
          url: '/extensions/'+ method,
          dataType: 'json',
          data: data,
          success: function(result) {
              if (success) success(result);  
          }
      });
  },
  
  common: {
        
    init: function(){
    }
        
  },
    
  /*- Login Page Methods
  ------------------------------------------------------------------*/
  index: {  	
  	init: function() {
      function validation(form) {
    			var valid = true;

    			// check if required fields are blank
    			$(form).find('input.required').each( function (i, el) {
    				if (!el.value) {
  						valid = false;
  						$(el).addClass('error');
  					} else {
  						$(el).removeClass('error');
  					}
    			});

    			return valid;
    		}

    	function submitForm (e) {
    			var form = $(this);

    			e.preventDefault();

    			if (validation(form)) {
    				form.removeClass('ok').addClass('loading');
    				$('#errors').empty().hide();

    				$.ajax({
    					url: form.attr('action'),
    					type: 'POST',
    					data: form.serialize(),
    					success: function (data, status) {
    						if ( data.success ) {
    						  form.removeClass('show-errors').addClass('ok');
      						  window.location="/demerit";
    						}
    						else {
    						  $('#errors').append('<p>'+data.message+'</p>'); 
      						form.addClass('show-errors');
      						$('#errors').show();
    						}
    					},
    					error: function (error) {
    						form.children('#errors').html('<p>'+error.responseText+'</p>');
    						form.addClass('show-errors');
    						$('#errors').show();
    					},
    					complete: function () {
    						form.removeClass('loading');
    					}
    				});
    			}
    		}
    		
    		$('form').submit( submitForm );
    }


  },
  
  /*- Sign Up Page Methods
  ------------------------------------------------------------------*/
  demerit: {
    init: function(){
      var to_user = $('#to-user');
      var form = $('form');

      $.ajax({
        url:  '/api/user/list',
        type: 'GET',
        dataType: 'json',
        data: form.serialize(),
        success: function (data, status) {
            $.each(data.users, function(index, user) {
                console.log(user);
                var option = $('<option/>');
                option.attr('value', user.slug);
                option.text(user.first_name + ' ' + user.last_name);
                to_user.append(option);
            });
        },
        error: function (errors) {

        },
        complete: function () {

        }
     });

     $.ajax({
        url:  '/api/user/list/top',
        type: 'GET',
        dataType: 'html',
        data: form.serialize(),
        success: function (data, status) {
            $('#top-scores-container').html(data);
        },
        error: function (errors) {

        },
        complete: function () {

        }
     });
      
      function validation(form) {
    		var valid = true;

  			// check if required fields are blank
  			$(form).find('input.required').each( function (i, el) {
  				if (!el.value) {
						valid = false;
						$(el).addClass('error');
					} else {
						$(el).removeClass('error');
					}
  			});

  			return valid;
  		}

    	function submitForm (e) {
    	  var form = $(this);

  			e.preventDefault();

  			if (validation(form)) {
  				$.ajax({
  					url: form.attr('action'),
  					type: 'POST',
  					data: form.serialize(),
  					success: function (data, status) {
  						if ( data.success ) {
                            var message = $('#message');
                            var user = data.user;
                            var noun = user.demerits == 0 ? 'demerit' : 'demerits';
                            message.text(user.first_name + ' ' + user.last_name + ' now has ' + user.demerits + ' ' + noun);
  						}
  						else {
  						}
  					},
  					error: function (error) {
  					},
  					complete: function () {
  					}
  				});
  			}
  		}
		
  		$('form').submit( submitForm );
    }
  },
  
  crew_info: {
    init: function(){
      
      //initialize uniform js
      $(function(){
        $("select, input:radio, input:checkbox").uniform();
      });
      
      function validation(form) {
    		var valid = true;

  			// check if required fields are blank
  			$(form).find('input.required').each( function (i, el) {
  				if (!el.value) {
						valid = false;
						$(el).addClass('error');
					} else {
						$(el).removeClass('error');
					}
  			});

  			return valid;
  		}

    	function submitForm (e) {
    	  var form = $(this);

  			e.preventDefault();

  			if (validation(form)) {
  				form.removeClass('ok').addClass('loading');
  				$('#errors').empty().hide();

  				$.ajax({
  					url: form.attr('action'),
  					type: 'POST',
  					data: form.serialize(),
  					success: function (data, status) {
  						if ( data.success ) {
  						  form.removeClass('show-errors').addClass('ok');
  						  window.location="/confirmation?crew_id="+data.crew.id;
  						}
  						else {
  						  $('#errors').append('<ul></ul>'); 
  						  for (m in data.message){
  						    var errorMessage = data.message[m];
  						    var field = errorMessage.slice(0, errorMessage.indexOf(":"));
  						    var message = errorMessage.slice(errorMessage.indexOf(":")+1);
  						    $('#errors ul').append('<li>'+ message +'</li>');
  						    
  						    $('input[name='+field+']').addClass('error');
  						  }
  						  $('#errors').show();
    						form.addClass('show-errors');
  						}
  					},
  					error: function (error) {
  						form.children('#errors').html('<p>'+error.responseText+'</p>');
  						form.addClass('show-errors');
  					},
  					complete: function () {
  						form.removeClass('loading');
  					}
  				});
  			}
  		}
		
  		$('form').submit( submitForm );
  		
  		$('#agree').click( function(){
  		  if ( $(this).attr('checked') )
  		    $('.submission button').removeAttr('disabled').removeClass('disabled');
  		  else
  		    $('.submission button').attr('disabled','disabled').addClass('disabled');
  		});

			$('button.agree, .button.agree').attr('disabled','disabled').addClass('disabled');
			
    }
  },
  
  /*- About Page Methods
  ------------------------------------------------------------------*/
  about: {
    init: function(){
      function showTip(e){
        $(this).find('.reveal').stop(true,true).fadeToggle(300);
      }
      
      function hideTip(e){
        $(this).find('.reveal').stop(true,true).fadeToggle(300);
      }
   
      $('#steps li').mouseenter(showTip).mouseleave(hideTip);
    }
  },
  
  /*- FAQ Page Methods
  ------------------------------------------------------------------*/
  faq: {
    init: function(){
      
      Cufon.replace('dt', { fontFamily: 'Knockout_27', hover: true, hoverables: { dt: true }  });
      
      $('dt').click( function(){
        if ( !$(this).hasClass('current') ) {
          $('dt.current').toggleClass('current').next('dd').slideToggle('fast','easeInOutCirc');
        }
        $(this).toggleClass('current');
        $(this).next('dd').slideToggle('fast','easeInOutCirc');
        Cufon.refresh('dt');
      });
      
    }
  },
  
  /*- Rules Page Methods
   ------------------------------------------------------------------*/
   rules: {
    init: function(){
      Cufon.replace('h2, h3', { fontFamily: 'Knockout_27' });
    }
  },
  
  /*- Crew Page Methods
   ------------------------------------------------------------------*/
   crew: {
     init: function(){
       // initiate all colorbox overlays
       $(".no-image").colorbox({width:"660px", inline:true, href:"#overlay-profile-pic", top: "100px", onOpen:clearFile});
       $(".change-photo").colorbox({width:"660px", inline:true, href:"#overlay-profile-pic", top: "100px", onOpen:clearFile});
       $("#add-asset").colorbox({width:"660px", height:"900px", inline:true, href:"#overlay-add-asset", top:"100px", onOpen:clearFile});
       $("#no-asset").colorbox({width:"660px", height:"900px", inline:true, href:"#overlay-add-asset", top: "100px", onOpen:clearFile});
       $(".delete-btn").colorbox({width:"660px", inline:true, href:"#overlay-confirm", top: "100px", onOpen:clearFile});
       
			var shareheight = $.browser.msie && $.browser.version == '7.0' ? '214px' : '174px';
			$("#share-trigger").colorbox({width:"660px", height:shareheight, inline:true, href:"#overlay-share", top: "100px", onComplete:initClipboard, scrolling: false });
        
       $(".filename").attr("disabled", "disabled");
			
			$('.upload-container').delegate('object', 'hover', function (e) {
				$(this).siblings('button').toggleClass('hover');
			});

			// select url in input
			$('.selectable').click(function () {				
				$(this).get(0).select();				
			});
   
      $('#share').bind('mouseenter mouseleave', toggleTip);	

        function clearFile(){
          $(".filename").val("");
          assetTitle.val("");
          assetDescription.val("");
          uploadAssetBtn.hide();
          uploadAvatarBtn.css({display:"none"});
          clearErrors();
          progressContainer.css({display:"none"});
          $(featureCheck).attr("checked", false);
          $("form").show();
          $("#thanks").hide();
          
          $(".profile-wrap").show();
          $("#avatar-thanks").hide();
          
          FB.Canvas.scrollTo(0,0);
        }
        
       //initialize swfuploaders
       var avatarUploader;
       var assetUploader;
       
       var progressContainer= $("div.progress");
       //progressContainer.css({display:"none"});
       
       var progressBar = progressContainer.find(".progress-value");
       var progressText = progressContainer.find(".progress-text");
       
       var avatarSettings = {
        				              // Backend Settings
        				              flash_url : "/swf/swfupload.swf",
               		            upload_url: "/extensions/change_crew_avatar",
                           		file_size_limit : "3 MB",
                           		file_types : "*.jpg;*.jpeg;*.png;*.gif",
                           		file_types_description : "Image Files",
                           		file_upload_limit : 500,
                           		file_queue_limit : 0,
                           		debug: false,

                           		// Button Settings
                           		button_placeholder_id : "avatarUploadBtn",
                           		button_width: 120,
                           		button_height: 35,
                           		button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
                           		button_cursor: SWFUpload.CURSOR.HAND,

                           		// The event handlers
                           		swfupload_loaded_handler : swfUploadLoaded,
                           		file_queued_handler : fileQueuedAvatar,
                           		file_queue_error_handler : fileQueueError,
                           		file_dialog_complete_handler : fileDialogComplete,
                           		upload_start_handler : uploadStart,
                           		upload_progress_handler : uploadProgress,
                           		upload_error_handler : uploadError,
                           		upload_success_handler : uploadAvatarSuccess,
                           		upload_complete_handler : uploadComplete,
                           		queue_complete_handler : queueComplete,	// Queue plugin event
                   
                           		// SWFObject settings
                           		minimum_flash_version : "9.0.28"
             		            };
             
      var assetSettings = {
            	                // Backend Settings
              	              flash_url : "/swf/swfupload.swf",
               		            upload_url: "/extensions/upload_file",
                           		file_size_limit : "500 MB",
                           		file_types : "*.wmv;*.mov;*.avi;*.mpg;*.mp4;*.jpg;*.jpeg;*.png;*.gif",
                           		file_types_description : "All Files",
                           		file_upload_limit : 500,
                           		file_queue_limit : 0,
                           		debug: false,

                           		// Button Settings
                           		button_placeholder_id : "assetUploadBtn",
                           		button_width: 120,
                           		button_height: 35,
                           		button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
                           		button_cursor: SWFUpload.CURSOR.HAND,

                           		// The event handlers
                           		swfupload_loaded_handler : swfUploadLoaded,
                           		file_queued_handler : fileQueuedAsset,
                           		file_queue_error_handler : fileQueueError,
                           		file_dialog_complete_handler : fileDialogComplete,
                           		upload_start_handler : uploadStart,
                           		upload_progress_handler : uploadProgress,
                           		upload_error_handler : uploadError,
                           		upload_success_handler : uploadAssetSuccess,
                           		upload_complete_handler : uploadComplete,
                           		queue_complete_handler : queueComplete,	// Queue plugin event

                           		// SWFObject settings
                           		minimum_flash_version : "9.0.28"
            		            };
       
        //SWFUpload.onload = function () {
          setTimeout(function(){
            //alert("onload called");
            avatarUploader = new SWFUpload(avatarSettings);
             assetUploader = new SWFUpload(assetSettings);
          }, 1000);
        //}
        
        function swfUploadLoaded(){
          console.log("swfUploadLoaded");
        }

        function fileQueuedAvatar(file) {
         $("#overlay-profile-pic .filename").val(file.name);
          uploadAvatarBtn.css({display:"inline"});
        }
        
        function fileQueuedAsset(file) {
         assetFileName.val(file.name);
         console.log(checkAssetType(file.name));
         
         if(checkAssetType(file.name) == "video"){
           $("label#feature-label").show();
         }else{
           $("label#feature-label").hide();
         }
         
         progressContainer.find("h2").text("Uploading " + file.name);
         progressBar.css({width: "0"});
         progressText.text("0%");
         clearErrors();
         uploadAssetBtn.show();
         //$("#add-asset").colorbox.resize();
        }

        function fileQueueError(file, errorCode, message) {
          console.log("fileQueueError");
          console.log(file);
          console.log(errorCode);
          console.log(message);
          
          displayErrors([message]);
        }

        function fileDialogComplete(numFilesSelected, numFilesQueued) {
          console.log("fileDialogComplete");
          console.log(numFilesSelected);
          console.log(numFilesQueued);
        }

        function uploadStart(file) {
          console.log("uploadStart");
          console.log(file);
          progressContainer.css({display:"block"});
          uploadAssetBtn.hide();
          //$("#add-asset").colorbox.resize();
        }

        function uploadProgress(file, bytesLoaded, bytesTotal) {
          var percentage = Math.ceil((bytesLoaded / bytesTotal) * 100);
          progressBar.css({width: percentage+"%"});
          progressText.text(percentage+"%");
        }

        function uploadError(file, errorCode, message) {
          console.log("uploadError");
          console.log(file);
          console.log("errorCode: " + errorCode);
          console.log("errorMessage " + message);
          assetTitle.val("");
          assetDescription.val("");
          assetFileName.val("");
          displayErrors([message]);
        }

        function uploadAvatarSuccess(file, serverData) {
          serverData = $.parseJSON(serverData);
          if(serverData.success != true){
            //display errors
            displayErrors(serverData.message);
            return false;
          }
          
          /****************************/
          if(!serverData.avatar){
            //inject placeholder image
            if($("a.no-image").length > 0){
              $("a.no-image").remove();

              var crop = $("<div></div>")
              crop.addClass("avatar-crop");
              crop.html('<img>');

              $("#crew-avatar").append(crop);
              $("div.avatar-crop img").attr("src", "/img/default_crew.jpg");
            }
          }else{
            $("a.change-photo").remove();
          }
          
          //inject moderation message
          /***************************/
          var modMessage = $("<p></p>");
          modMessage.addClass("moderation");
          modMessage.html("Your avatar is pending approval");
          $("#crew-avatar").append(modMessage);
          
          /*
          if($("a.no-image").length > 0){
            $("a.no-image").remove();
          
            var crop = $("<div></div>")
            crop.addClass("avatar-crop");
            crop.html('<img>');
        
            var a = $("<a></a>");
            a.attr("href", "#");
            a.addClass("change-photo");
            a.text("Change Photo");
            a.click(function(e){
              e.preventDefault();
              $(".change-photo").colorbox({width:"660px", inline:true, href:"#overlay-profile-pic", top: "100px", onOpen:clearFile});
            })
          
            $("#crew-avatar").append(crop);
            $("#crew-avatar").append(a);
          }
          
          $("div.avatar-crop img").attr("src", "/image_cache" + serverData.crew.picture.path + "?w=210");
          */
          
          $(".profile-wrap").hide();
          $("#avatar-thanks").show();
          FB.Canvas.scrollTo(0,0);
          $("#overlay-profile-pic").colorbox.resize();
        }
        
        function uploadAssetSuccess(file, serverData) {
          console.log(serverData);
          serverData = $.parseJSON(serverData);
          progressBar.css({width: "100%"});
          progressText.text("100%");
          //createAsset(serverData);
          
          if(serverData.success == true){
            //$(".no-image").colorbox.close();
            
            if(checkAssetType(file.name) == "video"){
              console.log("video uploaded successfully");
             }else{
               console.log("image uploaded successfully");
             }
            
            $("form").hide();
            $("#thanks").show();
            FB.Canvas.scrollTo(0,0);
            $("#add-asset").colorbox.resize();
						
						setTimeout(function() { $.colorbox.close(); }, 4000);

          }else{
            //display errors
            displayErrors(serverData.message);
          }
        }

        function uploadComplete(file) {
          console.log("uploadComplete");
        }

        function queueComplete(numFilesUploaded) {
          console.log("queueComplete");
        }
        /*END SWFUPLOADERS-----------------------------------------------------*/
        
        /*- VARS
        ----------------------------------------------------------------------*/
        var _toDelete;
        
        /*- Assets
        ----------------------------------------------------------------------*/
        var addAvatar = $("a.no-image");
        var addAsset = $("a#add-asset");
        var uploadAvatarBtn = $("#avatar-upload-btn");
        
        var editDescBtn = $("#crew div#crew-info #info a#description");
        var saveDescBtn = $("#info a#save-description")
        
        var assetFileName = $("#overlay-add-asset .filename");
        var assetTitle = $("#asset-title");
        var assetDescription = $("#asset-description");
        var uploadAssetBtn = $("#asset-upload-btn");
        var deleteAssetBtn = $("#gallery li a.delete-btn");
        var featureCheck = $("#overlay-add-asset input[name='featured']");
        
        var cancelBtn = $("#delete-cancel");
        var confirmBtn = $("#delete-confirm");
        
        var cancelUpload = $(".cancel");
        
        /*- Handlers
        ----------------------------------------------------------------------*/
        addAvatar.click(function(e){
          e.preventDefault();
          avatarUploader.addPostParam("crew_id", CREW_ID);
          avatarUploader.addPostParam("session_id", SESSION_ID);
          avatarUploader.addPostParam("authenticity_token", AUTHENTICITY_TOKEN);
          uploadAvatar();
        });
        
        addAsset.click(function(e){
          e.preventDefault();
          addToGallery();
        });
        
        uploadAvatarBtn.click(function(e){
          e.preventDefault();
          avatarUploader.addPostParam("crew_id", CREW_ID);
          avatarUploader.addPostParam("session_id", SESSION_ID);
          avatarUploader.addPostParam("authenticity_token", AUTHENTICITY_TOKEN);
          uploadAvatar();
        });
        
        uploadAssetBtn.click(function(e){
          e.preventDefault();
          
          assetUploader.addPostParam("crew_id", CREW_ID);
          assetUploader.addPostParam("session_id", SESSION_ID);
          assetUploader.addPostParam("authenticity_token", AUTHENTICITY_TOKEN);
          
          assetUploader.addPostParam("name", assetTitle.val());
          assetUploader.addPostParam("description", assetDescription.val());
          
          var featured = featureCheck.attr("checked");
          assetUploader.addPostParam("featured", featured);
          uploadAsset();
        });
        
        editDescBtn.click(function(e){
          e.preventDefault();
          editDescription();
        });
        
        saveDescBtn.click(function(e){
          e.preventDefault();
          saveCrewDescription();
        });
        
        deleteAssetBtn.click(function(e){
          e.preventDefault();
          var li = $(this).closest("li")  
          _toDelete = li;
        });
        
        cancelBtn.click(function(){
           $(".delete-btn").colorbox.close();
         });
         
         confirmBtn.click(function(){
           id = _toDelete.attr("data-id");
           console.log("id: " + id);
           _toDelete.remove();
           _toDelete = null;
           deleteAsset(id);
         });
         
         
         cancelUpload.click(function(){
           cancelAsset();
         });
         
         $("#overlay-add-asset").keyup(function(e){
           e.preventDefault();
         });
        
        /*- Helpers
        ----------------------------------------------------------------------*/
        function uploadAvatar(){
          try{
            avatarUploader.refreshCookies();
            avatarUploader.startUpload();
          }catch(e){
            console.log(e);
          }
        }
        
        function uploadAsset(){
          clearErrors();
          var e = checkForErrors();
          if(e.length > 0){
            displayErrors(e);
            return
          }
          
          try{
            assetUploader.refreshCookies();
            assetUploader.startUpload();
          }catch(e){
            console.log(e);
          }
        }
        
        function cancelAsset(){
          assetUploader.cancelUpload();
          clearFile();
        }
        
        function editDescription(){
          var description = $("<textarea></textarea>").attr("id", "edit-description"),
							placeholder = $("#description span"),
          		dText = placeholder.html().replace(/<br>/g, '\n');

          description.text(placeholder.is('.default-text') ? '' : dText);
          $("#description").remove();
          
          saveDescBtn = $("<a></a>").attr({href:"#", id:"save-description", "data-tracking_page_name":"about>save"});
          saveDescBtn.text("SAVE");
          saveDescBtn.click(function(e){
            e.preventDefault();
            saveCrewDescription();
          });
          $("#about").append(description);
          $("#about").append(saveDescBtn);
					$('#edit-description').focus();
        }
        
        function saveCrewDescription(){
          
          var dText = escape($("#edit-description").val().toString()).replace(/%0A/g,"<br>");
          
          CHOSEN.server("update_crew", "post", {description:unescape(dText), crew_id:CREW_ID}, function(result){
            var description = $("<a></a>").attr({href:"#", id:"description"});
            
            var wrapper = $("<span></span>");
            wrapper.html(unescape(dText));
            description.append(wrapper);
            
            var pencil = $("<img></img>").attr("src", "/img/pencil.png");
            description.append(pencil);
      
            description.click(function(e){
              e.preventDefault();
              editDescription();
            });
            
            $("#about").append(description);
            $("#edit-description").remove();
            saveDescBtn.remove();
          });
        }
        
        function addToGallery(){
          console.log("add asset");
        }
        
        function createAsset(data){
          console.log(data);
          var li = $("<li></li>").attr("data-id", data.asset.id);
          
          var a = $("<a></a>").attr("href", "/crews/"+CREW_SLUG+"/"+data.asset.id)
          li.append(a);
          
          var div = $("<div></div>").addClass("thumb-crop");
          a.append(div);
          
          var imagePath = "";
          
          if(data.asset.video){
            imagePath = "/img/transcoding_th.jpg";
          }else{
            try{
             imagePath = "/image_cache"+data.asset.image.path;
            }catch(e){
              console.log("ERROR TRYING TO GET IMAGE FROM OBJECT WITH NO IMAGE: " + e);
              imagePath = "/img/transcoding_th.jpg";
            }
          }
          
          var img = $("<img></img>").attr({src: imagePath, width:"210"});
          img.addClass("thumb");
          div.append(img);
          
          var p = $("<p></p>").text(data.asset.name);
          a.append(p);
          
          var del =  $("<a></a>").attr("href", "#");
          del.addClass("delete-btn")
          del.text("Delete");
          del.colorbox({width:"660px", inline:true, href:"#overlay-confirm", top: "100px"});
          del.click(function(e){
            e.preventDefault();
            var li = $(this).closest("li")  
            _toDelete = li;
          })
          
          li.append(del);
          
          $("#gallery ul").append(li);
        }
        
        function deleteAsset(id){
          CHOSEN.server("remove_asset", "post", {asset_id:id}, function(result){
            console.log(result);
            $(".delete-btn").colorbox.close();
          });
        }
        
        function checkForErrors(){
          var errors = new Array();
          
          var title = $("#overlay-add-asset #asset-title").val();
          if(title == "" || title == undefined){
            errors.push("Please fill out a title.")
          }
          
          var description = $("#overlay-add-asset #asset-description").val();
          if(description == "" || description == undefined){
            errors.push("Please enter a description.");
          }
          
          return errors;
          
        }
        
        function displayErrors(arr){
          progressContainer.css({display:"none"});
          
          for(var i=0; i< 1; i++){
            $("div.errors p").text(arr[i])
          }
          
          $("div.errors").show();
        }
        
        function clearErrors(){
          $("div.errors ul").html("");
          $("div.errors").hide();
        }
        
        function checkAssetType(name){
          var arr = name.split(".");
          var ext = arr[arr.length-1]
          if(ext != "jpeg" && ext != "jpg" && ext != "gif" && ext != "png") {
            return "video";
          }
          
          return "image";
        }

				function toggleTip(e){
	        $(this).find('.reveal').stop(true,true).fadeToggle(300);
	      }
	
				function initClipboard () {

					if (!$('#button-wrap div').length) {
						ZeroClipboard.setMoviePath( '/swf/ZeroClipboard.swf' );
						var clip = new ZeroClipboard.Client();
						clip.setText($('#overlay-share .selectable').val());
						clip.setHandCursor( true );
						clip.glue('share-copy', 'button-wrap');
						clip.addEventListener( 'onComplete', clipSuccess );
					}
				}				

        function clipSuccess( client, text ) {
					var obj = $('#overlay-share .container'),
							text = obj.find('button').data('success');
					if(!obj.find('.success').length) {
						obj.append('<p class="success">' + text + '</p>')
					}
				}
	
     }
   },
   
   /*- FAQ Page Methods
   ------------------------------------------------------------------*/
   asset_detail: {
     init: function(){        
        /*- ASSETS
         ----------------------------------------------------------------------*/
         var assetName = $("#asset-name");
         var description = $("#asset-description");
         var infoContainer = $("#info");
         var featureCheck = $("input[name='featured']");
         
         var cancelBtn = $("#delete-cancel");
         var confirmBtn = $("#delete-confirm");
        
        /*- HANDLERS
         ----------------------------------------------------------------------*/
         
         $(".delete-btn").colorbox({width:"660px", inline:true, href:"#overlay-confirm", top: "100px"});
         
         assetName.click(function(e){
           e.preventDefault();
           editName();
         });

         description.click(function(e){
           e.preventDefault();
           editDescription();
         });
         
         featureCheck.click(function(e){
           saveInfo();
         });
         
         cancelBtn.click(function(){
           $(".delete-btn").colorbox.close();
         });
         
         confirmBtn.click(function(){
           CHOSEN.server("remove_asset", "post", {asset_id:ASSET_ID}, function(result){
             console.log(result);
             window.location = "/crews/" + CREW_SLUG + "/" ;
           });
         });

        /*- HELPERS
         ----------------------------------------------------------------------*/
       function editName(){
         
         var container = $("<div></div");
         container.css({position: "relative"});
         
         var name = $("<textarea></textarea>").attr("id", "edit-name");
         name.text(assetName.text());
         assetName.remove();
         
         var save = $("<a>SAVE</a>").attr("href", "#");
         save.addClass("save-btn");
        
         save.click(function(e){
           e.preventDefault();
           var h = $("<h3></h3>").attr("id", "asset-name");
           h.addClass("adminable");
           
           if(name.val() == "") name.val("Untitled");
           
           h.text(name.val());
           h.prependTo(infoContainer);
           assetName = h;
           h.click(function(e){
            e.preventDefault();
            editName();
          });
          
           container.remove();
           saveInfo();
         });
         
         container.append(name);
         container.append(save);
         container.prependTo(infoContainer);
        
       }
       
       function editDescription(){
          var container = $("<div></div");
          container.css({position: "relative"});

          var desc = $("<textarea></textarea>").attr("id", "edit-description");
          desc.val(description.html().replace(/<br>/g, '\n'));
          description.remove();

          var save = $("<a>SAVE</a>").attr("href", "#");
          save.addClass("save-btn");

          save.click(function(e){
            e.preventDefault();
            var p = $("<p></p>").attr("id", "asset-description");
            p.addClass("adminable");
            
            if(desc.val() == "") desc.val("No Description");
            
            var dText = escape(desc.val().toString()).replace(/%0A/g,"<br>");
            p.html(unescape(dText));
            
            if(featureCheck.length > 0){
              p.insertBefore(featureCheck);
            }else{
              p.appendTo(infoContainer);
            }
            
            description = p;
            p.click(function(e){
             e.preventDefault();
             editDescription();
           });

            container.remove();
            saveInfo();
          });

          container.append(desc);
          container.append(save);
          
          if(featureCheck.length > 0){
            console.log(featureCheck)
            container.insertBefore(featureCheck);
          }else{
            container.appendTo(infoContainer);
          }
          
       }
       
       function saveInfo(){
         console.log("Save");
          var featured = featureCheck.attr("checked");
          CHOSEN.server("update_asset", "post", {name:$("#asset-name").text(), description:$("#asset-description").html(), featured: featured, asset_id: ASSET_ID, crew_id:CREW_ID}, function(result){
             console.log(result)
           });
       }
       
       function deleteAsset(id){
         CHOSEN.server("remove_asset", "post", {asset_id:id}, function(result){
           console.log(result);
         });
       }
       
     }
   },
   
   /*- Crew Archive Page Methods
   ------------------------------------------------------------------*/
   
   crews: {
     init: function(){
       
       
       
       // Gimme them search results
       // REMEMBER: this code is also running on the tab pages! Test it there, too!  
       function searchCrews(){
					$('#crew-list').addClass('loading');
         $('#load-more').remove();
         $.ajax({
           url: '/extensions/search_crews',
  				 type: 'POST',
  				 data: $('#search-crews').serialize(),
  				 success: function(data){
	
  				   $('#crew-list').append(data.content);
  				   $('#crew-list li.new').each( function(){
  				     $(this).fadeIn(1000, 'easeOutCubic').removeClass('new');
  				   });
  					 
						$('#crew-list').removeClass('loading');

  					 var crewLabel = data.crew_count + ((data.crew_count === 1) ? ' crew': ' crews');
  					 
  					 $('#total-crews').html(crewLabel);
  					 
  					 $('#load-more a').click( function(){ searchCrews() });
  					 $('#page-num').val( $('#load-more a').attr('id') );
  					 
  					 Cufon.replace('.crew-link h3', { fontFamily: 'Knockout_27', hover: true, hoverables: { h3: true }  });
  					 Cufon.refresh();
  					 
  					 $('#tab .crew-link').click(function(){
								// ie7 includes full url in href property. split it out.
								var appurl = $(this).data('app_url'),
										href = $(this).attr('href').split('/crews');
                window.top.location.href = appurl + '/crews' + href[1];
              });
  				 },
					 error: function () {
							$('#crew-list').removeClass('loading');						
					}
  			 });
       }
       
       function resetForm() {
         $('#crew-list').empty();
         $('#page-num').val( 1 );
       }
       
       $('#search-text').keypress(function(event){
         if (event.keyCode == 10 || event.keyCode == 13) {
          event.preventDefault();
          resetForm();
          searchCrews();
        }
       });
       

       // initialize uniform js
       $(function(){
         $("select").uniform();
       });
       
       $('#show-search').click( function(){
         $('#search-hide').show();
         $('#search-text').focus();
         $(this).hide();
       });
       
       $('#filters select').change( function(){
         resetForm();
         searchCrews();
       }).hover(function () {
				 $(this).parents('div.selector').toggleClass('hover');
			 });
       
       // clear out everything, we want it all
       $('#view-all').click( function(){
          $('#crew-list').empty();
          $('#page-num').val( 'all' );
          searchCrews();
        });
        
       $('#page-num').val( 1 );
       
				// fake hovers
				$('#crew-list').delegate('li > .crew-link', 'hover', function () {
					$(this).siblings('.info').find('.crew-link').toggleClass('hover');
					Cufon.refresh();					
				});
			
       searchCrews();
     }
   },

   /*- Tab Page Methods
   ------------------------------------------------------------------*/
    tab: {
      init: function () {
        // call the crews js to setup crew search
        CHOSEN.crews.init();
        countdown();
        
        $('a[target*=_top]').click(function(){
          window.top.location.href = $(this).attr('href');
        });
      }
    },

  /*- Tab Page Methods
  ------------------------------------------------------------------*/
  tab_fangate: {
   init: function () {
     $('a[target*=_top]').click(function(){
       window.top.location.href = $(this).attr('href');
     });
   }
  },
     
  /*- Essentials Archive Page Methods
  ------------------------------------------------------------------*/ 
  essentials: {
    init: function(){
    }

  } 
};

/*- UTIL
----------------------------------------------------------------------*/

var UTIL = {
  
  exec: function( controller, action ) {
    var ns = TROMBONE;
      
    action = ( action === undefined ) ? "init" : action;
        
    if ( controller !== "" && ns[controller] && typeof ns[controller][action] == "function" ) {
        ns[controller][action]();
    }
  },
    
  init: function() {
    var body = document.body,
        controller = body.getAttribute( "data-controller" ),
        action = body.getAttribute( "data-action" );
        
    UTIL.exec( "common" );
    UTIL.exec( action );
  }  

};

// kick it all off here 
$( document ).ready( UTIL.init );
