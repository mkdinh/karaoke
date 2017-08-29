// DECALRING GLOBAL VARIABLES
// -----------------------------------------------------------------------------------------
var favdb = [];
var list = [];
// INITIALIZING SIDENAV
// -----------------------------------------------------------------------------------------

$('.button-collapse').sideNav({
    menuWidth: 300, // Default is 300
    edge: 'right', // Choose the horizontal origin
    closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
    draggable: true, // Choose whether you can drag to open on touch screens,d
  }
);

// INITIALIZING YOUTUBE API
// -----------------------------------------------------------------------------------------

var GoogleAuth;
var SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
function handleClientLoad() {
  // Load the API's client and auth2 modules.
  // Call the initClient function after the modules load.
  gapi.load('client:auth2', initClient);
}

function initClient() {
  // Retrieve the discovery document for version 3 of YouTube Data API.
  // In practice, your app can retrieve one or more discovery documents.
  var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';

  // Initialize the gapi.client object, which app uses to make API requests.
  // Get API key and client ID from API Console.
  // 'scope' field specifies space-delimited list of access scopes.
  gapi.client.init({
      'apiKey': 'AIzaSyCzsdqKgJdDorPaNLpwkQFgcpz9VBiE9iM',
      'discoveryDocs': [discoveryUrl],
      'clientId': '9165336334-ni741e785666tse5ti249lvoc6vvjvrl.apps.googleusercontent.com',
      'scope': SCOPE
  }).then(function () {
    GoogleAuth = gapi.auth2.getAuthInstance();

    // Listen for sign-in state changes.
    GoogleAuth.isSignedIn.listen(updateSigninStatus);

    // Handle initial sign-in state. (Determine if user is already signed in.)
    var user = GoogleAuth.currentUser.get();
    setSigninStatus();

    // Call handleAuthClick function when user clicks on
    //      "Sign In/Authorize" button.
    $('#sign-in-or-out-button').click(function() {
      handleAuthClick();
    }); 
    $('#revoke-access-button').click(function() {
      revokeAccess();
    }); 
  });
}

function handleAuthClick() {
  if (GoogleAuth.isSignedIn.get()) {
    // User is authorized and has clicked 'Sign out' button.
    GoogleAuth.signOut();
  } else {
    // User is not signed in. Start Google auth flow.
    GoogleAuth.signIn();
  }
}

function revokeAccess() {
  GoogleAuth.disconnect();
}

function setSigninStatus(isSignedIn) {
  var user = GoogleAuth.currentUser.get();
  var isAuthorized = user.hasGrantedScopes(SCOPE);
  if (isAuthorized) {
    $('#sign-in-or-out-button').html('Sign out');
    $('#revoke-access-button').css('display', 'inline-block');
    $('#auth-status').html('You are currently signed in and have granted ' +
        'access to this app.');
    updateFav();
    updateSongList();
    $('#content-wrapper').fadeIn();
  } else {
    $('#sign-in-or-out-button').html('Sign In/Authorize');
    $('#revoke-access-button').css('display', 'none');
    $('#auth-status').html('You have not authorized this app or you are ' +
        'signed out.');
  }
}

function updateSigninStatus(isSignedIn) {
  setSigninStatus();
}

// After the API loads, call a function to enable the search box.
function handleAPILoaded() {
  $('#search-button').attr('disabled', false);
}

// Search for a specified string.
function search() {
  var q = $('#search').val();
  var request = gapi.client.youtube.search.list({
    q: q + "karaoke",
    maxResults: 50, 
    part: 'snippet'
  });

  request.execute(function(response){
    $("#search-display").empty();
    var results = response.items;
    console.log(favdb)
    results.forEach(function(video){

      var imgUrl = video.snippet.thumbnails.default.url;
      var title =  video.snippet.title;
      var id = video.id.videoId;

      // Declaring all DOM
      var card = $("<div class='card col s12 m3'>");
      var cardImg = $("<div class='card-image'>");
      var cardStacked = $("<div class='card-stacked'>");
      var cardContent = $("<div class='card-content'>");
      var cardAction = $( "<div class='card-action valign-wrapper'>")

      // Populate DOM w/ data
      cardImg.append("<img src='"+imgUrl+"' id='img-"+id+"' data-url='"+imgUrl+"'>");
      cardContent.append("<p class='truncate'>"+title+"</p>")
      cardAction.append("<a href='#/' class='right add-song' id='list-"+id+"' data-id='"+id+"' data-title='"+title+"'><i class='material-icons'>playlist_add</i></a>")
      console.log()
      if(favdb.indexOf(id) === -1){
        cardAction.append("<a href='#/' class='left favorite' data-state='unfavorite' id='fav-"+id+"' data-id='"+id+"' data-title='"+title+"'><i class='material-icons'>favorite_border</i></a>")
      }else{
        cardAction.append("<a href='#/' class='left favorite' data-state='favorite' id='fav-"+id+"' data-id='"+id+"' data-title='"+title+"'><i class='material-icons'>favorite</i></a>")
      }

      // Arrange in correct hierachy and append to browser
      cardStacked.append(cardContent,cardAction);
      card.append(cardImg,cardStacked);
      $('#search-display').append(card)
    })
  });
}

$("#search-form").on('submit',function(){
  search();
  return false;
})

// UPDATE FAVORITE FROM DB
// -----------------------------------------------------------------------------------------
function updateFav(){
  $.ajax({
    method: "GET",
    url: 'fav/all',
    success: function(res){
      favdb = [];
      $('#table-favorites').empty()
      res.forEach(function(song){

        favdb.push(song.song_id)

        var item = $('<li>');
        item.addClass('dismissable collection-item row');
        item.attr('id','fav-list-'+song.song_id)
    
        var col1 = $("<div class='col s2'>")
        var col2 = $("<div class='col s8'>")
        var col3 = $("<div class='col s2'>") 
      
        col1.append("<a href='#/' class='add-song' data-id='"+song.song_id+"' data-title='"+song.song_name+"'><i class='material-icons left'>add_circle</i></a>");
        col2.append("<span class='truncate'>"+song.song_name+"</span>");
        col3.append("<a href='#/'><i class='material-icons left fav-list-delete' data-id='"+song.song_id+"'>delete</i></a>")

        item.append(col1,col2,col3);
        $('#table-favorites').append(item)
      })
    }
  })
}


// SAVING FAVORTIE SONG ONTO DATABASE
// -----------------------------------------------------------------------------------------
$("#search-display").on('click', '.favorite', function(ev){
  ev.preventDefault();

  // Grab Necessary data from click
  var state = $(this).attr('data-state');
  var id = $(this).attr('data-id');
  var title = $(this).attr('data-title');
  var imgURL = $("#img-" + id).attr('data-url') 

  // logics depend of state of favorite
  if(state === 'unfavorite'){
    $(this).attr('data-state', "favorite");
    $(this).html("<i class='material-icons'>favorite</i>")

    var newFavorite = {
      song_name: title,
      song_id: id,
      img_url: imgURL
    }

    $.ajax({
      method: 'POST',
      url: '/fav/',
      dataType: 'json',
      data: newFavorite,
      success: function(res){
        Materialize.toast('favorited!', 1000,'',function(){}) // 4000 is the duration of the toast
        updateFav()
      }
    })

  }else{
    $(this).attr('data-state', "unfavorite");
    $(this).html("<i class='material-icons'>favorite_border</i>")

    $.ajax({
      method: 'POST',
      url: 'fav/'+id+'?_method=DELETE',
      success: function(){
        Materialize.toast('unfavorited!', 1000) // 4000 is the duration of the toast
        updateFav()
      }
    })
  }
})

// REMOVE FROM FAVORITE LIST
// -----------------------------------------------------------------------------------------
$('#table-favorites').on('click','.fav-list-delete', function(ev){
  ev.preventDefault();

  var id = $(this).attr('data-id');
  var favIndex = favdb.indexOf(id);

  $.ajax({
    method: 'POST',
    url: 'fav/'+id+'?_method=DELETE',
    success: function(){
      $('#fav-list-' + id).remove();
      $('#fav-'+id).html("<i class='material-icons'>favorite_border</i>");
      $('#fav-'+id).attr('data-state','unfavorite')

      favdb.splice(favIndex,1)
    }
  })
})

// UPDATE SONG LIST
// -----------------------------------------------------------------------------------------
function createSongItem(song){  
  list.push(song)
  
  var item = $('<li>');
  item.addClass('collapsible-header song-list-item');
  item.attr('id','song-list-'+song.song_id)

  var col1 = $("<div class='col s2'>")
  var col2 = $("<div class='col s10'>")


  col1.append("<a href='#/'><i class='material-icons left song-list-delete' data-id='"+song.song_id+"'>delete</i></a>");
  col2.append("<span class='truncate'>"+song.song_name+"</span>");

  item.append(col1,col2);
  $('#table-song-list').append(item)
  item.fadeIn()
}


function updateSongList (){

  $('#table-song-list').empty()

  $.ajax({
    method: 'GET',
    url: '/song/all',
    success: function(songs){
      console.log(songs)
      songs.forEach(function(song){
        createSongItem(song)
      })
    } 
  })
}

// ADD TO SONG LIST
// -----------------------------------------------------------------------------------------
$('#search-display').on('click','.add-song', function(ev){
  ev.preventDefault();

  var id = $(this).attr('data-id');
  var title = $(this).attr('data-title');

  var song = {
    "song_id": id,
    "song_name": title
  }

  $.ajax({
    method: 'POST',
    url: '/song/'+id,
    dataType: 'json',
    data: song,
    success: function(){
      Materialize.toast('added!', 1000,'',function(){}) // 4000 is the duration of the toast
      createSongItem(song)
    }
  })
})

$('.side-nav').on('click','.add-song', function(ev){
  ev.preventDefault();

  var id = $(this).attr('data-id');
  var title = $(this).attr('data-title');

  var song = {
    song_id: id,
    song_name: title,
  }

  $.ajax({
    method: 'POST',
    url: '/song/'+id,
    dataType: 'json',
    data: song,
    success: function(){
      Materialize.toast('added!', 1000,'',function(){}) // 4000 is the duration of the toast
      createSongItem(song)
    }
  })
})

// REMOVE FROM SONG LIST
// -----------------------------------------------------------------------------------------
$("#table-song-list").on('click', '.song-list-delete', function(ev){
  ev.preventDefault();
  var id = $(this).attr('data-id');
  $('#song-list-'+id).remove();
  console.log(id)

  $.ajax({
    method: 'POST',
    url: '/song/'+id+'?_method=DELETE',
    success: function(){
      $('#song-list-'+id).remove();
    }
  })
})

// CLEAR ALL SONG LIST
// -----------------------------------------------------------------------------------------
$("#clear-song-list").on('click', function(ev){
  ev.preventDefault();
  console.log('cleared list')
  $.ajax({
    method: 'POST',
    url: '/song/all?_method=DELETE',
    success: function(){
      updateSongList();
    }
  })
})



      