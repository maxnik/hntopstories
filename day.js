var STORIES_PER_DAY = 40;

$(document).ready(function () {
  var start_of_the_day = window.location.hash.substr(1);
  var day = new Date(start_of_the_day * 1000);

  document.title = day.toDateString() + ' - ' + document.title;
  $('#date').html(day.toDateString());

  day.setDate(day.getDate() + 1);
  // Algolia API works with 10-digit timestamps, ingoring milliseconds
  var start_of_the_next_day = Math.floor(day.getTime() / 1000);

  var algolia_api = 'https://hn.algolia.com/api/v1/search?numericFilters=' + 
  'created_at_i>' + start_of_the_day + 
  ',created_at_i<' + start_of_the_next_day + 
  '&tagFilters=story&hitsPerPage=' + STORIES_PER_DAY;

  $.getJSON(algolia_api)
    .done(function(data) {  
      var stories = data.hits;

      var stories_html = '';
      $.each(stories, function (i, story) {
        stories_html += '<li><p class="title"><span class="badge">' + story.points + '</span> '
        stories_html += '<a href="' + get_url(story) + '">' + story.title + '</a> '
        stories_html += '<span>' + get_domain(story.url) + '</span></p>'
        stories_html += 'submitted at ' + get_time(story) + ' | '
        stories_html += '<a href="' + get_comments_url(story) + '">' + story.num_comments + ' comments</a></p></li>'; 
      });

      $('#stories').html(stories_html);
    })
    .fail(function(jqxhr, text_status, error) {
      $('.container').prepend('Request failed: ' + text_status + ', ' + error);
    });
});

function get_domain(url)
{
  // http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string/8498629#8498629
  // we cannot call match on null, only on strings
  var matches = url && url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  // domain will be null if no match is found
  var domain = matches && matches[1];
  if (domain === null) {
    domain = '';
  } 
  matches = domain.match(/^www\./);
  if (matches) {
    domain = domain.substr(4);
  }
  return domain;
}

function get_url(story)
{
  var url = '';
  if (story.url) {
    url = story.url;
  } else {
    url = get_comments_url(story);
  }
  return url;
}

function get_comments_url(story)
{
  return 'https://news.ycombinator.com/item?id=' + story.objectID;
}

function get_time(story)
{
  var created = new Date(story.created_at_i * 1000);
  var hours = created.getHours();
  if (hours < 10) {
    hours = '0' + hours;
  }
  var minutes = created.getMinutes();
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  return hours + ':' + minutes;
}