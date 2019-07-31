var jsonURL = 'https://api.myjson.com/bins/9h5cp';

function getTime(time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
        time = time.slice (1);  // Remove full string match value
        time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
}

function createCatalogEl(id, launchDate, launchTime, title, description, image, publisher) {
    var event = $("<div class='upcoming-event-container' tabindex='0'>");
    $(event).attr('id', id);
    $(event).css('background-image', 'url(' + image + ')');
    var eventDetails = $("<div class='upcoming-event-content'>");
    var eventTitle = $("<div class='upcoming-event-content-header'>");
    eventTitle.text(title);
    var eventDate = $("<div class='upcoming-event-content-date'>");
    eventDate.text(launchDate);
    var eventDescription = $("<div class='upcoming-event-content-description'>");
    eventDescription.text(description);
    var eventMore = $("<div class='event-more-link'>Click to learn more..</div>");
    eventTitle.appendTo(eventDetails);
    eventDate.appendTo(eventDetails);
    eventDescription.appendTo(eventDetails);
    eventMore.appendTo(eventDetails);
    eventDetails.appendTo(event);
    event.appendTo($('.upcoming-events-wrapper'));
}

// ------ set default events -------
function defaultEvents(dataDay,dataName,dataNotes, defaultClass, image){
    var date = $('*[data-day='+dataDay+']');
    date.attr("data-name", dataName);
    date.attr("data-notes", dataNotes);
    date.attr("data-image", image);
    date.addClass("event");
    date.addClass("event--" + defaultClass);
}

$(document).ready(function () {

    $.getJSON(jsonURL, function(data) {
        for (let event of data) {
            var id = event.id;
            var launchDate = event.launchDate.slice(0, 10);
            var launchTime = getTime(event.launchDate.slice(11, 19));
            var title = event.title;
            var description = event.description;
            var image = "/assets/" + event.imageFilename;
            var publisher = event.publisher;
    
            createCatalogEl(id, launchDate, launchTime, title, description, image, publisher);
    
            defaultEvents(launchDate, title, description,'default', image);
        }
    });

    $('.upcoming-event-container').on('focus', function () {
        $(this).addClass('hovered');
    });

    $('.upcoming-event-container').on('focusout', function () {
        $(this).removeClass('hovered');
    });

});