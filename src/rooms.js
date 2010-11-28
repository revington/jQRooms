(function($) {
    $.fn.rooms = function(options) {



        var settings = {
            'min_adults': 2,
            'max_adults': 4,
            'min_children': 0,
            'max_children': 3,
            'min_child_age': 0,
            'max_child_age': 14,
            'serilize': function() { },
            'occupationAdd': function() { },
            'occupationRemove': function() { },
            'default_room': ["aa", "aa"]
        };





        if (options) {
            $.extend(settings, options);
        }

        function setRooms(rooms, r) {
            if (!rooms) {
                rooms = [];
            }
            if (r == rooms.length) {
                return rooms;
            } else if (r < rooms.length) {
                return rooms.slice(0, r);
            } else {
                while (r != rooms.length) {
                    rooms.push(settings.default_room);
                }
                return rooms;
            }
        }

        function formhtml(rooms) {
            return "<p>the form " + rooms.length + "</p>";
        };


        function getRandomNumber(range) {
            return Math.floor(Math.random() * range);
        }

        function getRandomChar() {
            var chars = "0123456789abcdefghijklmnopqurstuvwxyz";
            return chars.substr(getRandomNumber(39), 1);
        }

        function randomID(size) {
            var str = "";
            for (var i = 0; i < size; i++) {
                str += getRandomChar();
            }
            return str;
        }


        return this.each(function(i, el) {
            var $this = $(this), data = {
                rooms: setRooms([], $this.val()),
                form_id: "pngr_rooms_" + randomID(10)
            };

            $this.data(data);

            $(this).change(function() {

                var current_data = $(this).data();
                current_data.rooms = setRooms(current_data.rooms, $(this).val());
                $(this).data(current_data);
                $("#" + current_data.form_id).html(formhtml(current_data.rooms));

            });

            $this.after('<div id="' + data.form_id + '">' + formhtml(data.rooms) + '</div>');

        });
    };
})(jQuery);
