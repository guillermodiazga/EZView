$.fn.draggable = function (opt) {
    var base = this;
    var settings = {
        handle: "",
        cursor: "move",
        axis: null,
        containParent: false
    };

    opt = $.extend(settings, opt);

    if (opt.handle === "") {
        var $el = base;
    } else {
        var $el = base.find(opt.handle);
    }



    return $el.css('cursor', opt.cursor).on("mousedown", function (e) {
        if (opt.handle === "") {
            var $drag = $(this).addClass('draggable');
        } else {
            var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
        }
        var z_idx = $drag.css('z-index'),
            drg_h = $drag.outerHeight(),
            drg_w = $drag.outerWidth(),
            pos_y = $drag.offset().top + drg_h - e.pageY,
            pos_x = $drag.offset().left + drg_w - e.pageX;


        var parent = $(this).parent();

        var parW = parent.width(),
            parH = parent.height();

        var parX1 = parseInt(parent.offset().left) + parseInt(parent.css('padding-left').replace('px', '')),
            parX2 = parX1 + parW,
            parY1 = parseInt(parent.offset().top) + parseInt(parent.css('padding-top').replace('px', '')),
            parY2 = parY1 + parH;



        $drag.css('z-index', 1000).parents().on("mousemove", function (e) {
            var off_top = e.pageY + pos_y - drg_h,
                off_left = e.pageX + pos_x - drg_w,
                offst = null;

            if (opt.containParent === true) {
                if (off_left < parX1) off_left = parX1;
                if (off_left > parX2 - drg_w) off_left = parX2 - drg_w;
                if (off_top < parY1) off_top = parY1;
                if (off_top > parY2 - drg_h) off_top = parY2 - drg_h;
            }

            if (opt.axis == "x") {
                offst = {
                    left: off_left
                };
            } else if (opt.axis == "y") {
                offst = {
                    top: off_top
                };
            } else {
                offst = {
                    left: off_left,
                    top: off_top
                };
            }

            $('.draggable').offset(offst);

            $('.draggable, html').on("mouseup", function () {
                $drag.parents().off('mousemove');
                $($el).removeClass('draggable').css('z-index', z_idx);
            });

        });
        e.preventDefault(); // disable selection
    }).on("mouseup", function () {
        if (opt.handle === "") {
            $(this).removeClass('draggable');
        } else {
            $(this).removeClass('active-handle').parent().removeClass('draggable');
        }
        $el.off('mousedown', function (e) {
            e.preventDefault()
        });
    });
}
