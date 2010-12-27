(function($) {
    $.fn.rooms = function(options) {

        var settings = {
            'min_adults': 1,
            'max_adults': 4,
            'min_children': 0,
            'max_children': 3,
            'min_child_age': 0,
            'max_child_age': 14,
            'serilize': function() { },
            'occupationAdd': function() { },
            'occupationRemove': function() { },
            'default_room': ["a", "a"],
            'adults_label': 'adults',
            'children_label': 'children',
            'child_label': 'child age',
            'serializers': [{
                name: 'def',
                fn: function(rooms) {
                    return '<input type="hidden" name="myrooms" value="' + $.map(rooms, function(room) {
                        return $.map(room, function(pax) { return pax; }).join('');
                    }).join(";") + '" />';
                } }]
            };

            if (options) {
                $.extend(settings, options);
            }

            function randomID(size) {
                var str = "",
                chars = "0123456789abcdefghijklmnopqurstuvwxyz",
                randomChar = function() { return Math.floor(Math.random() * 39); };

                while (size--) {
                    str += chars.substr(randomChar(), 1);
                }

                return str;
            }

            function update_rooms(rooms_data, upTo) {

                var ret = [],
                currentRooms = extract_rooms(rooms_data.form_id);

                for (var i = 0; i < upTo; i++) {
                    ret.push(currentRooms[i] || settings.default_room);
                }
                console.log(ret);
                return ret;
            }

            function extract_rooms(form_id) {
                var ret = [];
                $("#" + form_id + " fieldset").each(function() {

                    var nRoom = [];

                    $(this).find("select[name='child-pax']").each(function() {
                        nRoom.push($(this).val());
                    });

                    $(this).find("select[name='adult-pax']").each(function() {
                        var amount = $(this).val();

                        $.each(new Array(amount - 0), function() {
                            nRoom.push("a");
                        });
                    });

                    ret.push(nRoom);

                });

                return ret;
            }

            function htmlTag(tag, content, attributes) {
                var serialized_attributes = '';

                for (var n in attributes) {
                    serialized_attributes += n + '="' + attributes[n] + '"';
                }
                if ((content !== undefined && content !== '')) {
                    return "<" + tag + ' ' + serialized_attributes + ">" + content + "</" + tag + ">";
                } else {
                    return "<" + tag + ' ' + serialized_attributes + "/>";
                }
            }

            function htmlSelect(name, start, end, selected) {
                if (!selected) {
                    selected = start;
                }
                var buffer = '';

                for (; start <= end; start++) {
                    if (selected == start) {
                        buffer += htmlTag("option", start, { selected: 'selected' });
                    } else {
                        buffer += htmlTag("option", start);
                    }
                }

                return htmlTag("select", buffer, { name: name });
            }

            function countAdults(room) {
                return $.grep(room, function(val) { return val == "a"; }).length;
            }

            function countChildren(room) {
                return room.length - countAdults(room);
            }

            function extract_children(room) {
                return $.grep(room, function(val) { return val !== "a"; });
            }

            function roomSerializer(room) {
                var allChildren = extract_children(room);

                var adults = htmlTag("label", settings.adults_label + htmlSelect("adult-pax", settings.min_adults, settings.max_adults, countAdults(room)));
                var childrenHTML = htmlTag("label", settings.children_label + htmlSelect("children", settings.min_children, settings.max_children, allChildren.length));

                return adults +
                        childrenHTML +
                        "<ul>" +

                        $.map(allChildren, function(a) {
                            return htmlTag("li", htmlTag("label", settings.child_label + htmlSelect("child-pax", settings.min_child_age, settings.max_child_age, a)));
                        }).join("") +
                        "</ul>";
            }

            function formhtml(rooms) {
                var htmlRooms = $.map(rooms, function(room) {
                    return htmlTag("fieldset", roomSerializer(room));
                }).join('');
                var serializedRooms = $.map(settings.serializers, function(serializer) {
                    return serializer.fn(rooms);
                }).join("");
                return htmlRooms + serializedRooms;
            }

            return this.each(function(i, el) {
                var $this = $(this), data = {
                    rooms: [settings.default_room],
                    form_id: "pngr_rooms_" + randomID(10)
                };

                $this.data(data);

                $(this).change(function() {

                    var current_data = $(this).data();
                    current_data.rooms = update_rooms(current_data, $(this).val());
                    $(this).data(current_data);
                    console.log("current data");
                    console.log(current_data);
                    $("#" + current_data.form_id).html(formhtml(current_data.rooms));

                });

                $this.after('<div id="' + data.form_id + '">' + formhtml(data.rooms) + '</div>');

                $("#" + data.form_id + " fieldset select[name='children']").live("change", function() {

                    var currentAges = [], newAges = [], desired_childrens = $(this).val();

                    $(this).parents("fieldset").find("select[name='child-pax']").each(function() {
                        currentAges.push($(this).val());
                    });

                    for (var i = 0; i < desired_childrens; i++) {
                        newAges.push(currentAges[i] || settings.min_child_age);
                    }

                    var theList = $(this).parents("fieldset").find("ul");
                    theList.children().remove();
                    theList.html($.map(newAges, function(val) {
                        return htmlTag("li", htmlTag("label", settings.child_label + htmlSelect("child-pax", settings.min_child_age, settings.max_child_age, val || settings.min_child_age)));
                    }).join(""));
                });

            });
        };
    })(jQuery);
