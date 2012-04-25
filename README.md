React jQuery Plugin
===================

React jQuery is a conditional (form) helper. In its basic form, it will show/hide an element based on compliance with a set of conditions (rules).

React strives to be:

1. **functional** - it does what it says it does
2. **readable** - the naming is deliberately chosen to communicate exactly what it does
3. **adaptable** - creating custom rules or actions is easy

Usage
-----

### Methods

**reactIf**

sets up an element to watch with a condition

   $reactor.reactIf( element_to_watch, condition_to_test, additional_arguments );

- $reactor must be a jquery object.
- element_to_watch can either be a selector string or a jquery object.
- condition_to_test can be a function or a string matching a helper method.
- additional_arguments are passed to helper method when condition_to_test is a string.

**reactTo**

sets up an element to watch without adding a condition

**reactor**

initializes an element to be able to react to other elements


### Default Actions

**compliant**

code run when all conditions pass

default: shows the element

**uncompliant**

code run when one condition fails

default: hides the element

To change the default reaction overwrite the function. The follow dims and disables the element when not compliant:

    $.fn.reactor.defaults.compliant = function() {
        $(this).animate({opacity: 1});
        $(this).find(':disabled').attr({disabled: false});
    };

    $.fn.reactor.defaults.uncompliant = function() {
        $(this).animate({opacity: 0.25});
        $(this).find(':enabled').attr({disabled: true});
    }

### Helpers

There are a number of condition helper built-in for your use.  You can access these
directly at $.fn.reactor.helpers

    NotBlank
    true if not blank

    Blank
    true if blank

    Disabled
    true if field has been disabled

    Enabled
    true if field is enabled

    EqualTo(matchStr)
    true if matchStr and string value match

    LessThan(number)
    true if value is less than the number

    MoreThan(number)
    true if value is more than the number

    Between(min, max)
    true if value is between min and max

    BetweenSameLength(min, max)
    true if value is between min and max and also if it the digit count matches between the min and max

You can use a helper in two ways. The first is to reference it directly:

    .reactIf('#zip', $.fn.reactor.helpers.Between(19100, 19400))

and the second is to provide the string name of the

    .reactIf('#zip', 'Between', 19100, 19400)


### Beyond Helpers

You can use custom helpers too.  Helpers are just functions that return something that can be evaluated true/false.

    .reactIf('#zip', function() { return this.hasClass('some-class'); } )

Or, first add the helper to the helper list then reference it

    $.fn.reactor.helpers.HasSomeClass = function() { return this.hasClass('some-class'); }
    $('#el').reactIf('#zip', 'HasSomeClass');

### Example Rules


    var IS = $.extend({}, $.fn.reactor.helpers); // not required just makes it look fun

    $('.cities')
        .reactIf('#zip', 'Between', 19100, 19400)
        .reactIf($('#zip'), IS.NotBlank);

    $('.philly_middle_to_low_income')
        .reactIf('#income_2011', 'LessThan', 40000)
        .reactIf($('#cities_select'), IS.EqualTo('philadelphia'));

    $('.low_income_select_zips')
        .reactIf('#income_2011', IS.LessThan(15000))
        .reactIf('#zip', 'Between', 19000, 20000)
        .reactIf($('#zip'), IS.NotBlank);

    $('.reactor').trigger('change.reactor'); // triggers all events on load

License
-------

Composer is licensed under the MIT License - see the LICENSE file for details