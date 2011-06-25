/*
 * Reactor JQuery plugin
 *
 * Copyright 2011, Nathan Davis Olds
 * Distributed under the MIT license.
*/
 
 (function($){
    
    $.fn.reactTo = function(selector) {
    	var $elements = $(selector),
         	$reactor_element = $(this),
		 	_proxy_event = function() {
				$reactor_element.trigger('change.reactor');
			};

		$elements.filter('select').bind('change.reactor', _proxy_event);
		$elements.filter('input').bind('keyup.reactor', _proxy_event);	
			
		return this;
    };

	$.fn.reactIf = function(sel, exp_func) {
	
	    var $sel = $(sel);
        var _func = function() {
            return exp_func.apply($sel);                               
        };
        
		this.each(function() {
		    if (!$(this).hasClass('reactor')) { $(this).reactor(); }
		    
		    var conditions_arry = $(this).data('conditions.reactor');
		    if (!$.isArray(conditions_arry)) { conditions_arry = []};
		   
		    conditions_arry.push(_func);

			$(this).data('conditions.reactor', conditions_arry);
		});	

		$(this).reactTo(sel);
		
		return this;
    };
    
    $.fn.react = function() {
        
		this.each(function() {
		   $(this).trigger('change.reactor')
		});	

		return this;
    };
    
    $.fn.reactor = function(options) {
        var settings = $.extend({}, $.fn.reactor.defaults, options);
        
        this.each(function() {
            // var opts = $.meta ? $.extend({}, settings, $this.data()) : settings;
            
            var $element = $(this);
            
            if (!$element.hasClass('reactor')) { $element.data('conditions.reactor', []).addClass('reactor'); }
                        
            var is_reactionary = function() {  
                var conditionalArray = $(this).data('conditions.reactor'); 
                var r = true;
                                
                $.each(conditionalArray, function() {
                	r = (r && this.call());
                });
                
                
                
                return r;                                
            }
            
            var reaction = function(evt) {
            	evt.stopPropagation();
            	if (is_reactionary.apply(this)) {
                   settings.compliant.apply($element);
                } else {
                   settings.uncompliant.apply($element);
                }
            }
        
			$element.bind('change.reactor', reaction);
        });
                    
        return this;  
    };

    $.fn.reactor.defaults = {
        compliant: function() {
            $(this).show();
        },
        uncompliant: function() {
            $(this).hide();    
        }        
    };
    
    $.fn.reactor.helpers = {
    
        NotBlank: function() {
            return( $(this).val().toString() != "" )
        },
        
        Blank: function() {
            return( $(this).val().toString() == "" )
        },
        
        EqualTo: function(matchStr) {
            var _func = function() { 
                var v = $(this).val();
                if (v) { return( v.toString() == matchStr ); } 
				else { return false; }
            } 
            return _func;
        },
            
        LessThan: function(number) {
            var _func = function() {
                var v = $(this).val();
                return(!(v && parseInt(v) > number));
            }
            return _func;   
        },
            
        MoreThan: function(number) {
            var _func = function() {
                var v = $(this).val();
                return(!(v && parseInt(v) < number));
            }
            return _func;  
        },
                
        Between: function(min, max) {
            var _func = function() {
                var v = $(this).val();
                return(!(v && (parseInt(v) > max || parseInt(v) < min)));
            }
            return _func;
        },
            
        BetweenSameLength: function(min, max) {
            var len = min.toString().length;
            var _func = function() {
                var v = $(this).val();
                return(!(v && v.length == len && (parseInt(v) > max || parseInt(v) < min)));
            }
            return _func;
        }
    };

})(jQuery);