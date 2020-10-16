//showing video inside JS file, access video and audio

//const { create } = require("domain");
const socket = io('/')
const videoGrid = document.getElementById('video-grid'); //links to video grid in room.ejs
const myVideo = document.createElement('video'); //creates video element
myVideo.muted = true; //ensures you are not hearing your own voice



var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443' //3030 because local host 3030
}); //create a peer


let myVideoStream //video variable
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream) //add video stream from other user
        })
    })

    socket.on('user-connected', (userId) => {

        console.log("user connected");
        setTimeout(function () {
            connecToNewUser(userId, stream);
        }, 5000)

        //connecToNewUser(userId, stream);
    });

    let text = $('input')

    $('html').keydown((e) => {
        if (e.which == 13 && text.val().length !== 0) { //only enters key function when enter is pressed
            socket.emit('message', text.val()); //socket.emit is for sending, socket.io is for receiving
            text.val('') //clears text field once enter is pressed
        }
    });

    socket.on('createMessage', message => {
        //console.log('this is coming from server', message) //message comes from the server
        $('.messages').append(`<li class = "message"><b>user</b><br/>${message}</li>`) // when every message, class message will have user and the message the user sends
        scrollToBottom()


    })
}); //get video and audio off chrome, .then accesses the function

//promise is an event in the future that will be resolved or rejected


peer.on('open', id => {
    //console.log(id);
    socket.emit('join-room', ROOM_ID, id);
});

//socket.emit('join-room', ROOM_ID); //emit room, takes reference from constant variabale ROOM_ID in room.ejs

/*socket.on('user-connected', (userId) => {
    connecToNewUser(userId, stream);
});*/

const connecToNewUser = (userId, stream) => {
    //console.log(userId); //informs when a new user has connected
    const call = peer.call(userId, stream) //call user id, send him my stream, and I will recieve his stream
    const video = document.createElement('video')
    call.on('stream', userVideoStream => { //adding others video stream
        addVideoStream(video, userVideoStream) //other persons stream
    })
};// other persons stream




function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })

    videoGrid.append(video);
} // this function is responsible for outputting my vdeo display or stream



/*let text = $('input')

$('html').keydown((e)  =>{
    if(e.which == 13 && text.val().length !==0) { //only enters key function when enter is pressed
        console.log(text.val())
        socket.emit('message', text.val()); //socket.emit is for sending, socket.io is for receiving
        text.val('') //clears text field once enter is pressed
    }
});

socket.on('createMessage', message =>{
    //console.log('this is coming from server', message) //message comes from the server
    $('ul').append(`<li class = "message"><b>user</b><br/>${message}</li>`) // when every message, class message will have user and the message the user sends
})*/

const scrollToBottom = () =>{ //function that allows chat to autoscroll downwards during overflow
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"))

}

//add a function for stop and mute buttons

//Mute our video
const muteUnmute = () =>{
    console.log(myVideoStream)
    const enabled = myVideoStream.getAudioTracks()[0].enabled; //get current enabled audo tracj
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false; //set audio to false
        setUnmuteButton(); //button icon changes depending on mute or unmute
    } else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled=true;
    }
}

const setMuteButton = () => {
    const html = `
    <i class ="fas fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
}

const playStop = () => {
    //console.log(myVideoStream)
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo() //if video is enabled, disable
    } else {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled=true; //if video is disabled, enable video
    }
}

const setStopVideo = () => { //both setPlay
    const html = `
    <i class = "fas fa-video"></i>
    <span>Stop Video</span>
    `

    document.querySelector('.main__video_button').innerHTML = html;


}


const setPlayVideo = () => {
    const html = `
    <i class = "stop fas fa-video-slash"></i>
    <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
}

