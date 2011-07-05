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
        dataType: 'html',
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

     function updateTopScores() {
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
     }
      
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
                            var noun = user.demerits == 1 ? 'demerit' : 'demerits';
                            message.text(user.first_name + ' ' + user.last_name + ' now has ' + user.demerits + ' ' + noun + '.');
                            updateTopScores();
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
		
  		$('form').submit( submitForm );
        updateTopScores();
    }
  },
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
