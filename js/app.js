$(document).foundation();

$('.close-button').on('click', function() {
    console.log("blah")
$('#youtube')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');    
})



$('#details').slideUp();
$('#detailed-description').slideUp();

$("#details-headers").click(function(){
    if($('#details-icons').hasClass('fa-plus-circle')){
        $('#details-icons').removeClass('fa-plus-circle').addClass('fa-minus-circle');
        $('#details').slideDown();
        console.log("more");
    } else {
        $('#details-icons').removeClass('fa-minus-circle').addClass('fa-plus-circle');
        $('#details').slideUp();
        console.log("less");
    }
})

$("#description-headers").click(function(){
    if($('#description-icons').hasClass('fa-plus-circle')){
        $('#description-icons').removeClass('fa-plus-circle').addClass('fa-minus-circle');
        $('#detailed-description').slideDown();
        console.log("more");
    } else {
        $('#description-icons').removeClass('fa-minus-circle').addClass('fa-plus-circle');
        $('#detailed-description').slideUp();
        console.log("less");
    }
})

var textToHide = $('.crop').text().substring(100);
var visibleText = $('.crop').text().substring(1, 100);

$('.crop')
    .html(visibleText + ('<span class="hid">' + textToHide + '</span>'))
    .append('<a id="read-more" title="Read More" style="display: block; cursor: pointer;">Read More&hellip;</a>')
    .click(function() {
        $(this).find('span.hid').toggle();
        $(this).find('a:last').hide();
    });

$('p.crop span').hide();
$('.phone-msg').hide();
$('.email-msg').hide();

$('#phone').click(function() {
    $(".phone-msg").toggle(this.checked);
});

$('#email').click(function() {
    $(".email-msg").toggle(this.checked);
});

$('#copy').click(function() {
    $('#email').prop('checked', true);
    $(".email-msg").show();
});

//** Gustavo's code **//

var app = angular.module('app', [])


// EVENT LISTENERS

// Submit search on button click
$('.input-group-button').click(function() {
    var searchParam = encodeURIComponent($(this).parent().find('.input-group-field').val());
    redirect('/search-results', '/' + searchParam);    
});

// Submit search on enter key press
$('.input-group-field').keypress(function (e) {
    if (e.which == 13) {
        var searchParam = encodeURIComponent($(this).parent().find('.input-group-field').val());
        redirect('/search-results', '/' + searchParam);   
    }
})

// Redirect to search page when clicking on a keyword
$('.search-term').click(function() {
    var searchParam = encodeURIComponent($(this).find('a').val());
    redirect('/search-results', '/' + searchParam);    
});


// FUNCTIONS

function redirect(root, queryString) {
    if (queryString.trim() != '') {
        window.location = root + queryString;
    }
}

function getAge(ageString) {
    if (ageString == 'N/A') {
        return null;
    }
    var age = ageString.replace(/(\d+)\sYears/g, '$1'); 
    return parseInt(age);
}

function setAll(object, value) {
    for (i in object) {
        if(object.hasOwnProperty(i)) {
            object[i] = value;
        }
    }
}

$(".radio-group input").change(function() { 
    if ($(this).is(":checked")) { 
        $(this).parent().siblings().css("border", "1px solid white");
        $(this).parent().css("border", "1px solid #f17327"); 
    }
});



