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
     		$.ajax({
        		url:  '/api/user/list/top',
        		type: 'GET',
        		data: {'as_html' : true},
        		dataType: 'html',
        		success: function (data, status) {
            		$('#top-scores-container').html(data);
            		$('#top-scores li a').click(TROMBONE.index.selectUser);
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
    	},

    	selectUser: function(e) {
    		var slug = e.target.getAttribute('data-user-slug')
      		$('#top-scores li a').css('color', '');
      		$(e.target).css('color', '#F38630');
      		$('#to-user').val(slug);
      		$('#reasons').load('/api/demerit/list/' + slug + '?as_html=true');
    	}

  	},
  
  /*- Sign Up Page Methods
  ------------------------------------------------------------------*/
	demerit: {
		init: function(){
      		var to_user = $('#to-user');
      		var form = $('#reason');
      
      		//console.log(form);

      		$.ajax({
        		url:  '/api/user/list',
        		type: 'GET',
        		dataType: 'json',
        		data: form.serialize(),
        		success: function (data, status) {
            		$.each(data.users, function(index, user) {
                	//console.log(user);
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

     		function updateTopScores() {
         		$.ajax({
            		url:  '/api/user/list/top',
            		type: 'GET',
            		dataType: 'html',
            		data: form.serialize(),
            		success: function (response, status) {
                		$('#top-scores-container').html(response);
                		$('#top-scores li a').click(TROMBONE.demerit.selectUser);
            		},
            		error: function (errors) {

            		},
            		complete: function () {

            		}
         		});
     		}
      
      		function validation(form) {
    			var valid = true;

  				//  check if required fields are blank
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
            		var form_data = form.serialize();
            		
            		console.log(form_data);
            		
            		if ($('#to-user').val() == '')
              		return;

  					$.ajax({
  			  			url: form.attr('action'),
  			  			type: 'POST',
  			  			data: form_data,
  			  			success: function (data, status) {
  							if ( data.success ) {
                  				$('input[name=reason]').val('');
                  				var message = $('#message');
                  				var user = data.user;
                  				var noun = user.demerits == 1 ? 'demerit' : 'demerits';
                  				message.text(user.first_name + ' ' + user.last_name + ' now has ' + user.demerits + ' ' + noun + '.');
                  				updateTopScores();
                  				$('#reasons').load('/api/demerit/list/' + user.slug + '?as_html=true');
  							}
  							else {
                  				var message = $('#message');
                  				message.text(data.message);
  							}
  						},
  						error: function (error) {
  						},
  						complete: function () {
  						}
  					});
  				}
  			}

  			$('#reason').submit( submitForm );
        	updateTopScores();
    	},
    	selectUser: function(e) {
      		var slug = e.target.getAttribute('data-user-slug')
      		$('#to-user').val(slug);
      		$('#reasons').load('/api/demerit/list/' + slug + '?as_html=true');
    	},
    
    	/* when click on demerit, show excuse or ze form */
  		openDemeritForm: function(demerit_id) {
   	  		$('#demerit-' + demerit_id).load('/api/excuse/list/' + demerit_id + '?as_html=true', function (){
     	  	    TROMBONE.excuse.init(demerit_id);  	 
    	  		console.log('opening demerit form') 
 				/*$('.excuses').toggle();*/});
   		}	
   		
  	},


  /*- EXCUSES
  ----------------------------------------------------------------------*/
  	excuse: {
    	init: function (demerit_id) {
    	
    		$('#excuse-submit-button-' + demerit_id).click(function(e){
    			e.preventDefault();
				
    			var form = $(this).parents('form:first');
    			//alert('this happened');
    			submitForm();
    		});
    		
			function submitForm() {
				
				//e.preventDefault();
				
		  		var excuse = $("#note").val();
			    console.log(excuse);
			    var form = $('#excuseForm-' + demerit_id);
			    console.log(form);
            	var form_data = form.serialize();
			    var route = form.attr('action');

			    if(excuse=='')
			    {
			    	console.log('excuse is blank?');
			    }else{
			        $.ajax({
			        type: "POST",
			        url: route,
			        data: form_data,
			        success: function(data, status){
			        	if (data.success) {
			        	$('#excuseForm-' + demerit_id, function(){ 
			        		console.log('this is happening');
			        		//var demerit_id = data.excuse.to_demerit_id;
			        		console.log(demerit_id);
			        		$('#demerit-' + demerit_id).load('/api/excuse/list/' + demerit_id + '?as_html=true');
			        	}).remove();
			        	}
			        }
			        });
			    }
			    return false;     
			}
			console.log($('#excuseForm-' + demerit_id));
  			$('#excuseForm-' + demerit_id).submit( submitForm );
    	},
  		updateExcuse: function() {
  			var demerit_id = data.excuse.to_demerit_id;
			console.log(demerit_id);
			$('#demerit-' + demerit_id).load('/api/excuse/list/' + demerit_id + '?as_html=true');
	 	}	
  	}
}; /* end of TROMBONE */ 


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