/*
 * React JQuery plugin
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
        var args = Array.prototype.slice.call( arguments, 2 );

        var _func = function() {
            if ($.isFunction(exp_func)) {
                return exp_func.apply($sel);
            } else {
                var _returned = $.fn.reactor.helpers[exp_func].apply($sel, args);

                if ($.isFunction(_returned)) {
                    return _returned.apply($sel);
                }

                return _returned;
            }
        };

        this.each(function() {
            if (!$(this).hasClass('reactor')) { $(this).reactor(); }

            var conditions_arry = $(this).data('conditions.reactor');
            if (!$.isArray(conditions_arry)) { conditions_arry = []; }

            conditions_arry.push(_func);

            $(this).data('conditions.reactor', conditions_arry);
        });

        $(this).reactTo(sel);

        return this;
    };

    $.fn.react = function() {

        this.each(function() {
            $(this).trigger('change.reactor');
        });

        return this;
    };

    $.fn.reactor = function(options) {
        var settings = $.extend({}, $.fn.reactor.defaults, options);

        this.each(function() {
            // var opts = $.meta ? $.extend({}, settings, $this.data()) : settings;

            var $element = $(this);

            if (!$.isArray($element.data('conditions.reactor'))) { $element.data('conditions.reactor', []).addClass('reactor'); }

            var isReactionary = function() {
                var conditionalArray = $(this).data('conditions.reactor');
                var r = true;

                $.each(conditionalArray, function() {
                    r = this.call();
                    return r; // short circuits the loop when any value is false
                });

                return r;
            };

            var reaction = function(evt) {
                evt.stopPropagation();
                if (isReactionary.apply(this)) {
                   settings.compliant.apply($element);
                } else {
                   settings.uncompliant.apply($element);
                }
            };

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
            return( this.val().toString() !== "" );
        },

        Blank: function() {
            return( this.val().toString() === "" );
        },

        Disabled: function() {
            return( this.filter(':disable').length > 0 );
        },

        Enabled: function() {
            return( this.filter(':enabled').length > 0 );
        },

        EqualTo: function(matchStr) {
            var _func = function() {
                var v = this.val();
                if (v) { return( v.toString() == matchStr ); }
                else { return false; }
            };
            return _func;
        },

        LessThan: function(number) {
            var _func = function() {
                var v = this.val();
                return(!(v && parseInt(v, 10) > number));
            };
            return _func;
        },

        MoreThan: function(number) {
            var _func = function() {
                var v = this.val();
                return(!(v && parseInt(v, 10) < number));
            };
            return _func;
        },

        Between: function(min, max) {
            var _func = function() {
                var v = this.val();
                return(!(v && (parseInt(v, 10) > max || parseInt(v, 10) < min)));
            };
            return _func;
        },

        BetweenSameLength: function(min, max) {
            var len = min.toString().length;
            var _func = function() {
                var v = this.val();
                return(!(v && v.length == len && (parseInt(v, 10) > max || parseInt(v, 10) < min)));
            };
            return _func;
        }
    };

})(jQuery);