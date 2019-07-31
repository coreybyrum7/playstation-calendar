$(document).ready(function () {

    //global variables
    var monthEl = $(".c-main");
    var dataCel = $(".c-cal__cel");
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var monthText = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
    ];
    var indexMonth = month;
    var inputDate = $(this).data();
    today = year + "-" + month + "-" + day;
    currentDay();

    //set height of absolute positioned calendar on initial load. absolute div takes up no space.
    $('.c-main').each(function () {
        setCalendarHeight(this);
    });

    // ------ functions control -------

    $(".tab-slider--body").hide();
    $(".tab-slider--body:first").show();

    $(".tab-slider--nav li").click(function() {
        $(".tab-slider--body").hide();
        var activeTab = $(this).attr("id");
        $("#"+activeTab+"-content").fadeIn();
        if($(this).attr("rel") == "tab2"){
            $('.tab-slider--tabs').addClass('slide');
        } else {
            $('.tab-slider--tabs').removeClass('slide');
        }
        $(".tab-slider--nav li").removeClass("active");
        $(this).addClass("active");
    });

    $(".tab-slider--nav li").on('keypress', function(e) {
        var keycode = (e.keyCode ? e.keyCode : e.which);
        if (keycode == '13') {
            $(".tab-slider--body").hide();
            var activeTab = $(this).attr("id");
            $("#"+activeTab+"-content").fadeIn();
            if($(this).attr("rel") == "tab2"){
                $('.tab-slider--tabs').addClass('slide');
            } else {
                $('.tab-slider--tabs').removeClass('slide');
            }
            $(".tab-slider--nav li").removeClass("active");
            $(this).addClass("active");
        }
    });

    //button to get to current day
    $('.c-today__btn').on("click", function() {
        if (month < indexMonth) {
            var step = indexMonth % month;
            movePrev(step, true);
        } else if (month > indexMonth) {
            var step = month - indexMonth;
            moveNext(step, true);
        }
        currentDay();
    });
  
    //event creator
    $(".js-event__add").on("click", function() {
        $(".js-event__creator").addClass("isVisible");
        $("body").addClass("overlay");
        dataCel.each(function() {
        if ($(this).hasClass("isSelected")) {
            today = $(this).data("day");
            document.querySelector('input[type="date"]').value = today;
        } else {
            document.querySelector('input[type="date"]').value = today;
        }
        });
    });

    //create event
    $(".js-event__save").on("click", function() {
        var inputName = $("input[name=name]").val();
        var inputDate = $("input[name=date]").val();
        var inputNotes = $("textarea[name=description]").val();
        var inputTag = "default";
        var image = "assets/default.jpg";
  
        dataCel.each(function() {
            if ($(this).data("day") === inputDate) {
                if (inputName != null) {
                $(this).attr("data-name", inputName);
                }
                if (inputNotes != null) {
                    $(this).attr("data-notes", inputNotes);
                }
                $(this).addClass("event");
                if (inputTag != null) {
                    $(this).addClass("event--" + inputTag);
                }
                $(this).attr('data-image', image);
                fillEventSidebar($(this));
            }
        });

        var numEvents = $('.c-aside__eventList').children().length;
        if (numEvents == 0) {
            let noContentDiv = "<div id='noContentDiv'>No events</div>";
            $('.c-aside__eventList').append(noContentDiv);
        } else if (numEvents != 1) {
            $('#noContentDiv').remove();
        }
  
        $(".js-event__creator").removeClass("isVisible");
        $("body").removeClass("overlay");
        $("#addEvent")[0].reset();
    });

    function currentDay() {
        $('div.c-cal__cel').removeClass('isSelected');
        var currentDayCell;
        if (month > 9) {
            currentDayCell = $('div[data-day = '+today+']');
        } else {
            currentDayCell = $('div[data-day=' + year + "-0" + month + "-" + day +']');
        }
        currentDayCell.addClass('isSelected');
        newCellSelected(currentDayCell);
    }

    function setCalendarHeight(elem) {
        var position = $(elem).css('left');
        position = position.slice(0, -1);
        if (parseInt(position) > -1 && parseInt(position) < 1) {
            var className = $(elem).attr('class');
            currentMonthDisplayed = className.slice(className.length - 2, className.length);
            var height = $(elem).height();
            height = height + 35;
            $('.c-cal__container').height(height);
        }
    }
    
    //fill sidebar event info
    function fillEventSidebar(self) {
        $(".c-aside__event").remove();
        var thisName = self.attr("data-name");
        var thisNotes = self.attr("data-notes");
        var thisImage = self.attr("data-image");
        var thisDefault = self.hasClass("event--default");
        var thisEvent = self.hasClass("event");
        
        switch (true) {
        case thisDefault:
            $(".c-aside__eventList").append(
                "<p class='c-aside__event c-aside__event--important'>" +
                thisName +
                "<img class='c-aside__event-image' src='" +
                thisImage + "' />" +
                "<span>" +
                thisNotes +
                "</span></p>"
            );
            break;
        case thisEvent:
            $(".c-aside__eventList").append(
                "<p class='c-aside__event'>" +
                thisName +
                "<img class='c-aside__event-image' src='" + 
                thisImage + "' />" +
                "<span>" +
                thisNotes +
                "</span></p>"
            );
            break;
        }
    };
    dataCel.on("click", function() {
        var $this = $(this);
        newCellSelected($this);
    });

    function newCellSelected(elem) {
        var thisEl = $(elem);
        var thisDay = $(elem).attr("data-day").slice(8);
        var thisMonth = $(elem).attr("data-day").slice(5, 7);
    
        fillEventSidebar($(elem));
    
        $(".c-aside__num").text(thisDay);
        $(".c-aside__month").text(monthText[thisMonth - 1]);
        $(".selectedCell_currentDay").text(thisDay + " " + monthText[thisMonth - 1]);
    
        dataCel.removeClass("isSelected");
        thisEl.addClass("isSelected");

        var numEvents = $('.c-aside__eventList').children().length;
        if (numEvents == 0) {
            let noContentDiv = "<div id='noContentDiv'>No events</div>";
            $('.c-aside__eventList').append(noContentDiv);
        } else if (numEvents != 1) {
            $('#noContentDiv').remove();
        }
    }
    
    //function for move the months
    function moveNext(fakeClick, indexNext) {
        for (var i = 0; i < fakeClick; i++) {
        $(".c-main").css({
            left: "-=100%"
        });
        $(".c-paginator__month").css({
            left: "-=100%"
        });
        switch (true) {
            case indexNext:
            indexMonth += 1;
            break;
        }
        }
    }
    function movePrev(fakeClick, indexPrev) {
        for (var i = 0; i < fakeClick; i++) {
        $(".c-main").css({
            left: "+=100%"
        });
        $(".c-paginator__month").css({
            left: "+=100%"
        });
        switch (true) {
            case indexPrev:
            indexMonth -= 1;
            break;
        }
        }
    }
    
    //months paginator
    function buttonsPaginator(buttonId, mainClass, monthClass, next, prev) {
        switch (true) {
        case next:
            $(buttonId).on("click", function() {
            if (indexMonth >= 2) {
                $(mainClass).css({
                left: "+=100%"
                });
                $(monthClass).css({
                left: "+=100%"
                });
                indexMonth -= 1;
            }
            positionEvents(indexMonth);
            return indexMonth;
            });
            break;
        case prev:
            $(buttonId).on("click", function() {
            if (indexMonth <= 11) {
                $(mainClass).css({
                left: "-=100%"
                });
                $(monthClass).css({
                left: "-=100%"
                });
                indexMonth += 1;
            }
            positionEvents(indexMonth);
            return indexMonth;
            });
            break;
        }
    }
  
    buttonsPaginator("#next", monthEl, ".c-paginator__month", false, true);
    buttonsPaginator("#prev", monthEl, ".c-paginator__month", true, false);


    function positionEvents(indexMonth) {

        //position todays events
        if (indexMonth > 9) {
            var monthText = $('.month-' + indexMonth).text().toLowerCase();
            var calendarDiv = $('.c-main-' + indexMonth);
        } else {
            var monthText = $('.month-0' + indexMonth).text().toLowerCase();
            var calendarDiv = $('.c-main-0' + indexMonth);
        }
        //remove date until selected, set month, positionEvents.. if applicable
        $(".c-aside__num").text('');
        monthText = monthText.charAt(0).toUpperCase() + monthText.slice(1);
        $(".c-aside__month").text(monthText);
        setCalendarHeight(calendarDiv);
    }

    //launch function to set the current month
    moveNext(indexMonth - 1, false);

    //fill the sidebar with current day
    $(".c-aside__num").text(day);
    $(".c-aside__month").text(monthText[month - 1]);

});

// fill the month table with column headings
function day_title(day_name) {
    document.write("<div class='c-cal__col'>" + day_name + "</div>");
}
// fills the month table with numbers
function fill_table(month, month_length, indexMonth) {
    day = 1;
    // begin the new month table
    document.write("<div class='c-main c-main-" + indexMonth + "'>");
    //document.write("<b>"+month+" "+year+"</b>")

    // column headings
    document.write("<div class='c-cal__row'>");
    day_title("Sun");
    day_title("Mon");
    day_title("Tue");
    day_title("Wed");
    day_title("Thu");
    day_title("Fri");
    day_title("Sat");
    document.write("</div>");

    // pad cells before first day of month
    document.write("<div class='c-cal__row'>");
    for (var i = 1; i < start_day; i++) {
    if (start_day > 7) {
    } else {
        document.write("<div class='c-cal__cel'></div>");
    }
    }

    // fill the first week of days
    for (var i = start_day; i < 8; i++) {
    document.write(
        "<div data-day='2019-" +
        indexMonth +
        "-0" +
        day +
        "'class='c-cal__cel' tabindex='0'><p>" +
        day +
        "</p></div>"
    );
    day++;
    }
    document.write("</div>");

    // fill the remaining weeks
    while (day <= month_length) {
    document.write("<div class='c-cal__row'>");
    for (var i = 1; i <= 7 && day <= month_length; i++) {
        if (day >= 1 && day <= 9) {
        document.write(
            "<div data-day='2019-" +
            indexMonth +
            "-0" +
            day +
            "'class='c-cal__cel' tabindex='0'><p>" +
            day +
            "</p></div>"
        );
        day++;
        } else {
        document.write(
            "<div data-day='2019-" +
            indexMonth +
            "-" +
            day +
            "' class='c-cal__cel' tabindex='0'><p>" +
            day +
            "</p></div>"
        );
        day++;
        }
    }
    document.write("</div>");
    // the first day of the next month
    start_day = i;
    }

    document.write("</div>");
}