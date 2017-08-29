
// DECLARE GLOBAL VARIABLE
// -----------------------------------------------------------------------------------------
var player;
var songList;
var currentIndex = 0;
// AJAX CALLS ON LOAD
// -----------------------------------------------------------------------------------------
$.ajax({
    method: 'GET',
    url:'/song/all',
    success: function(songs){
        console.log(songs)
        songList = songs;
        // YOUTUBE IFRAME API
        // ----------------------------------------------------------------------------------------
        
        // 2. This code loads the IFrame Player API code asynchronously.
        var tag = document.createElement('script');
        
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    }
})

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.

function onYouTubeIframeAPIReady(song) {
    player = new YT.Player('youtube-player', {
        width: '100%',
        events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
        },
        playerVars: {
            'fs': 0,
            'iv_load_policy': 3,
            'modestbranding': 1,
            'rel': 0,
            'showinfo': 0
        }
    });
}

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
    player.loadVideoById(songList[currentIndex].song_id)
    event.target.playVideo();
    loadInfo()
    
    }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    var done = false;
    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
            done = true;
        }

        if(event.data === 0){
            if(currentIndex === 0){
                $("#next-song-wrapper").css('opacity','1')
            }

            currentIndex++;

            if(currentIndex < songList.length){
                $('#next-song').text(songList[currentIndex].song_name)
                $('#youtube-player').fadeToggle();
                setTimeout(function(){
                    $('#youtube-player').fadeToggle();
                    player.loadVideoById(songList[currentIndex].song_id);
                    player.playVideo()
                    loadInfo()
                },2000)
                done = false;
            }else{
                location.replace('/')
            }
        }
    }
    function stopVideo() {
    player.stopVideo();
    }

function loadInfo(){     
    $('#song-title').text(songList[currentIndex].song_name)
    $('#song-wrapper').fadeToggle(1000, function(){
        setTimeout(function(){
            $('#song-wrapper').fadeToggle('slow')
        },5000)
    })
}
    




