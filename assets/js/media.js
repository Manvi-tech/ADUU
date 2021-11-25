
const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const roomUsers = document.getElementById('participants');

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '9000'
});

let myVideoStream;
const myVideo = document.createElement('video');
myVideo.muted = true;
const peers={};

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            if(!peers[call.peer]){
                addVideoStream(video, userVideoStream);
            }
        });
    });

    socket.on('user-connected',(userId)=>{
        setTimeout(() => {
            connectToNewUser(userId, stream)
          }, 1000)
    });

    // input value
    let text = $("#chat_message");

    // when press enter send message
    $('html').keydown(function (e) {
        if (e.which == 13 && text.val().length !== 0) {
            socket.emit('message', text.val(), USER_NAME, USER_EMAIL);
            text.val('')
        }
    });

    socket.on("createMessage", (message,username,useremail) => {
        $(".messages").append(`<li class="message">
                                 <div style="text-transform: capitalize;">
                                   ${username}: ${message}
                                 </div>
                                </li>`);
        scrollToBottom();
    });
})

peer.on('open', id =>{
    socket.emit('join-room', ROOM_ID, id);
});

function connectToNewUser(userId, stream){
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    video.setAttribute('id')= userId;
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
      video.remove();
    })
  
    peers[userId] = call;
}

// displaying video and appending it to grid
function addVideoStream(video, stream){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', ()=>{
         video.play();
    })
    videoGrid.append(video);
}

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
});


// chat messages
const scrollToBottom = () => {
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

// audio: mute or unmute check
const muteUnmute = () => {
const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}
  
// video: stop or play 
const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    } else {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}


// mute audio
const setMuteButton = () => {
    const html = `
        <i class="fas fa-microphone"></i>
        <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
}

// unmute audio
const setUnmuteButton = () => {
    const html = `
        <i class="unmute fas fa-microphone-slash"></i>
        <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
}

// stop video
const setStopVideo = () => {
    const html = `
        <i class="fas fa-video"></i>
        <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
}

// start video
const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
        <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
}


// displaying video and appending it to grid
function addScreenStream(video, stream){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', ()=>{
         video.play();
    })

    // append it here
}


// share screen
const shareScreen = async () => {
  
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;

    let captureStream = null;
  
    try {
      captureStream = await navigator.mediaDevices.getDisplayMedia();
    } catch (err) {
      console.error("Error: " + err);
    }
    if (captureStream) {
      peer.call(USER_ID, captureStream);
      const video = document.createElement("video");
      addScreenStream(video, captureStream);
  
      // somebody clicked on "Stop sharing"
      captureStream.getVideoTracks()[0].onended = function () {
  
        video.remove();
  
        alert("Screen Sharing stopped");
      };
    }
}


//show current participants in call
const showParticipants = () => {
    var list = document.getElementById("main__right__participants");
    if (list.style.display == "none" || list.style.display=='') {
       list.style.display = "flex";
    } else {
       list.style.display = "none";
    }
};
  
//show chat and chat messages in call
const chatShow = () => {
    var chat = document.getElementById("main__right__chat");
    if (chat.style.display =='' || chat.style.display === "none") {
        console.log('yes')
        chat.style.display = "flex";
    } else {
        console.log('no')
        chat.style.display = "none";
    }
};


/*==============================================================================================
======================================   White-board   =========================================
================================================================================================
*/


let pencilColor = 'black';
let pencilWidth = 5;
let isWhiteBoard=false;

// ---------------------------      creating a white board        ----------------------------

function whiteBoard() {

    isWhiteBoard = true;

    const div = document.createElement('div');
    div.style.padding = '5px';
    div.setAttribute('id', 'canvas');

    const div1 = document.createElement('div');
    div1.classList.add('box-position');


    div1.innerHTML = `<div class="white-board-icons" style="" id="" onclick="cross()">
    <i class="fas fa-times"></i>
        </div>
        <div class="white-board-icons" style="top:50px;" id="" onclick="pencil()">
        <i class="fas fa-pencil-alt"></i>
        </div>
        <div class="white-board-icons" style="top:100px;" id="" onclick="eraser()">
        <i class="fas fa-eraser"></i>
        </div>
        <div class="white-board-icons colour" style="top:150px; background-color:red;" id="" onclick="red()">
        </div>
        <div class="white-board-icons colour" style="top:200px; background-color:green;" id="" onclick="green()">
        </div>
        <div class="white-board-icons colour" style="top:250px; background-color:blue;" id="" onclick="blue()">
        </div>
        <div class="white-board-icons colour" style="top:300px; background-color:yellow;" id="" onclick="yellow()">
        </div>`;

    const canvas = document.createElement('canvas');

    div1.appendChild(canvas);
    div.appendChild(div1);

    for (let i = 0; i < videoGrid.childNodes.length; i++) {
        videoGrid.childNodes[i].style.display = 'none';
    }

    div.classList.add('resize');

    videoGrid.appendChild(div);

    const ctx = canvas.getContext('2d');

    let painting = false;
    let lastX = 0;
    let lastY = 0;

    canvas.style.width = '100%';
    canvas.style.height = '100%';

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    function startPosition(e) {
        painting = true;
        lastX = e.offsetX;
        lastY = e.offsetY;
    }

    function finishPosition(e) {
        painting = false;
    }

    // drawing the design and sending the coordinates, pencil-color and pencil-width immediately to other users.

    function draw(e) {

        if (!painting) return;

        ctx.strokeStyle = pencilColor;
        ctx.lineWidth = pencilWidth;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);

        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();

        socket.emit('draw', lastX, lastY, e.offsetX, e.offsetY, pencilColor, pencilWidth);

        lastX = e.offsetX;
        lastY = e.offsetY;
    }

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', finishPosition);
    canvas.addEventListener('mouseout', finishPosition);
    canvas.addEventListener('mousemove', draw);
}


// --------------------     other users getting coordinates via socket        ---------------------

socket.on('drawing', (lastX, lastY, offsetX, offsetY, pencilColor, pencilWidth) => {

    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    ctx.strokeStyle = pencilColor;
    ctx.lineWidth = pencilWidth;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);

    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
});
 

// ----------------      remove the white board and make all videos visible        -----------------

function cross() {
    isWhiteBoard = false;

    for (let i = 0; i < videoGrid.childNodes.length; i++) {
        const tempId = videoGrid.childNodes[i].getAttribute('id');
        if (tempId !== 'canvas') {
            videoGrid.childNodes[i].style.display = 'block';
        } else {
            videoGrid.removeChild(videoGrid.childNodes[i]);
            i--;
        }
    }

}
  


// ---------------------------      use pencil        ----------------------------

function pencil() {
    pencilColor = 'black';
    pencilWidth = 5;
}

function red() {
    pencilColor = 'red';
    pencilWidth = 5;
}

function green() {
    pencilColor = 'green';
    pencilWidth = 5;
}

function blue() {
    pencilColor = 'blue';
    pencilWidth = 5;
}

function yellow() {
    pencilColor = 'yellow';
    pencilWidth = 5;
}

// ---------------------------      use eraser        ----------------------------

function eraser() {
    pencilColor = 'white';
    pencilWidth = 10;
}