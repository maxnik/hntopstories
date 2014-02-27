var DAYS_ROWS = 10;
var DAYS_COLUMNS = 4;

var today = get_today();
var day = new Date(today.getTime());

var later_button = null;
var later_button_link = null;


$(document).ready(function () {

  later_button = $('#pagination .disabled');
  later_button_link = $('#later-button');

  later_button_link.on('click', function () {
    if (later_button_link.attr("href") === '') {
      day.setDate(day.getDate() + (2 * DAYS_ROWS * DAYS_COLUMNS));
      show_days();
    }
    return false;
  });

  $('#earlier-button').on('click', function () {
    show_days();
    return false;
  });

  show_days();
});

function get_today()
{
  var time_now = new Date();
  time_now.setHours(0);
  time_now.setMinutes(0);
  time_now.setSeconds(0);
  return time_now;
}

function show_days()
{
  change_later_button(day.getTime() < today.getTime());

  var days = [];
  for (var i = 0; i < DAYS_ROWS * DAYS_COLUMNS; i++) {
    // pur timestamp into url without milliseconds 
    days[i] = [Math.floor(day.getTime() / 1000), day.toDateString()];
    day.setDate(day.getDate() - 1);
  }

  var days_html = '';
  for (var i = 0; i < DAYS_ROWS; i++) {
    days_html += '<tr>';
    for (var j = 0; j < DAYS_COLUMNS; j++) {
      var current_day = days[i + (j * DAYS_ROWS)];
      days_html += '<td><a target="_blank" href="day.html#' + current_day[0] + '">';
      days_html += current_day[1] + '</a></td>';
    }
    days_html += '</tr>';
  }
  $('#days').html(days_html);
}

function change_later_button(activate)
{
  if (activate) {
    later_button.removeClass('disabled');
    later_button_link.attr('href', '');
  } else {
    later_button.addClass('disabled');
    later_button_link.removeAttr('href');
  }
}