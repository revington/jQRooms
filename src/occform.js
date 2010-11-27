(function($) {
    $.fn.occform = function(options) {

        var settings = {
            'min-adults': 2,
            'max-adults': 4,
            'min-children': 0,
            'max-children': 3,
            'min-occupations': 1,
            'max-occupations': 4,
            'min-child-age': 0,
            'max-child-age': 14,
            'serilize': function() { },
            'occupationAdd': function() { },
            'occupationRemove': function() { }
        };

        if (options) {
            $.extend(settings, options);
        }




    };
})(jQuery);
