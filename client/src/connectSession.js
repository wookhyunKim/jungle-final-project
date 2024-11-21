let OV;
let session;


/* OPENVIDU METHODS */

function joinSession(roomCode,nickName) {
	console.log("첫번째 방 코드:", roomCode);
	// --- 1) Get an OpenVidu object ---

	OV = new OpenVidu();

	// --- 2) Init a session ---

	session = OV.initSession();

	// --- 3) Specify the actions when events take place in the session ---

	// On every new Stream received...
	session.on('streamCreated', event => {

		// Subscribe to the Stream to receive it. HTML video will be appended to element with 'video-container' id
		let subscriber = session.subscribe(event.stream, 'video-container');

		// When the HTML video has been appended to DOM...
		subscriber.on('videoElementCreated', event => {

			// Add a new <p> element for the user's nickname just below its video
			appendUserData(event.element, subscriber.stream.connection);
		});
	});

	// On every Stream destroyed...
	session.on('streamDestroyed', event => {

		// Delete the HTML element with the user's nickname. HTML videos are automatically removed from DOM
		removeUserData(event.stream.connection);
	});

	// On every asynchronous exception...
	session.on('exception', (exception) => {
		console.warn(exception);
	});


	// --- 4) Connect to the session with a valid user token ---

	// Get a token from the OpenVidu deployment
	getToken(roomCode).then(token => {
		console.log("방코드:",roomCode);

		// First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
		// 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
		session.connect(token, { clientData: nickName })
			.then(() => {
				// --- 6) Get your own camera stream with the desired properties ---

				let publisher = OV.initPublisher('video-container', {
					audioSource: undefined, // The source of audio. If undefined default microphone
					videoSource: undefined, // The source of video. If undefined default webcam
					publishAudio: true,  	// Whether you want to start publishing with your audio unmuted or not
					publishVideo: true,  	// Whether you want to start publishing with your video enabled or not
					resolution: '640x480',  // The resolution of your video
					frameRate: 30,			// The frame rate of your video
					insertMode: 'APPEND',	// How the video is inserted in the target element 'video-container'
					mirror: false       	// Whether to mirror your local video or not
				});

				// --- 7) Specify the actions when events take place in our publisher ---

				// When our HTML video has been added to DOM...
				publisher.on('videoElementCreated', function (event) {
					initMainVideo(event.element, nickName);
					appendUserData(event.element, nickName);
					event.element['muted'] = true;
				});

				// --- 8) Publish your stream ---

				session.publish(publisher);
				console.log("publish success");
			})
			.catch(error => {
				console.log('There was an error connecting to the session:', error.code, error.message);
			});
	});
}

function setPageLayout(){
	// --- 5) Set page layout for active call ---

	document.getElementById('session-title').innerText = roomCode;
	document.getElementById('join').style.display = 'none';
	document.getElementById('session').style.display = 'block';

}

function leaveSession() {

	// --- 9) Leave the session by calling 'disconnect' method over the Session object ---

	session.disconnect();

	// Removing all HTML elements with user's nicknames.
	// HTML videos are automatically removed when leaving a Session
	removeAllUserData();

	// Back to 'Join session' page
	document.getElementById('join').style.display = 'block';
	document.getElementById('session').style.display = 'none';
}

window.onbeforeunload = function () {
	if (session) session.disconnect();
};


/* APPLICATION SPECIFIC METHODS */

// window.addEventListener('load', function () {
// 	generateParticipantInfo();
// });

function appendUserData(videoElement, connection) {
	// let userData;
	// let nodeId;
	// if (typeof connection === "string") {
	// 	userData = connection;
	// 	nodeId = connection;
	// } else {
	// 	userData = JSON.parse(connection.data).clientData;
	// 	nodeId = connection.connectionId;
	// }
	// let dataNode = document.createElement('div');
	// dataNode.className = "data-node";
	// dataNode.id = "data-" + nodeId;
	// dataNode.innerHTML = "<p>" + userData + "</p>";
	// videoElement.parentNode.insertBefore(dataNode, videoElement.nextSibling);
	// addClickListener(videoElement, userData);

	let userData;
    let nodeId;
    if (typeof connection === "string") {
        userData = connection;
        nodeId = connection;
    } else {
        userData = JSON.parse(connection.data).clientData;
        nodeId = connection.connectionId;
    }

	console.log("userData: ",userData);
	console.log("nodeId: ",nodeId);

    // 비디오 아래에 닉네임 표시
    let dataNode = document.createElement('div');
    dataNode.className = "data-node";
    dataNode.id = "data-" + nodeId;
    dataNode.innerHTML = "<p>" + userData + "</p>";
    videoElement.parentNode.insertBefore(dataNode, videoElement.nextSibling);

    // player-table에 닉네임 추가
    const playerTable = document.querySelector('.player-table');
    const playerSlot = document.createElement('div');
    playerSlot.className = `player-slot occupied`;
    playerSlot.id = "slot-" + nodeId;
    playerSlot.innerHTML = `<div class="player-info">
                                <span>플레이어</span>
                                <span>${userData}</span>
                            </div>`;
    playerTable.appendChild(playerSlot);
}

function removeUserData(connection) {
	// let dataNode = document.getElementById("data-" + connection.connectionId);
	// dataNode.parentNode.removeChild(dataNode);
	// 비디오 아래의 닉네임 제거
    let dataNode = document.getElementById("data-" + connection.connectionId);
    if (dataNode) {
        dataNode.parentNode.removeChild(dataNode);
    }

    // player-table에서 닉네임 제거
    let playerSlot = document.getElementById("slot-" + connection.connectionId);
    if (playerSlot) {
        playerSlot.parentNode.removeChild(playerSlot);
    }
}

function removeAllUserData() {
	let nicknameElements = document.getElementsByClassName('data-node');
	while (nicknameElements[0]) {
		nicknameElements[0].parentNode.removeChild(nicknameElements[0]);
	}
}

function addClickListener(videoElement, userData) {
	videoElement.addEventListener('click', function () {
		let mainVideo = $('#main-video video').get(0);
		if (mainVideo.srcObject !== videoElement.srcObject) {
			$('#main-video').fadeOut("fast", () => {
				$('#main-video p').html(userData);
				mainVideo.srcObject = videoElement.srcObject;
				$('#main-video').fadeIn("fast");
			});
		}
	});
}

function initMainVideo(videoElement, userData) {
	document.querySelector('#main-video video').srcObject = videoElement.srcObject;
	document.querySelector('#main-video p').innerHTML = userData;
	document.querySelector('#main-video video')['muted'] = true;
}


/**
 * --------------------------------------------
 * GETTING A TOKEN FROM YOUR APPLICATION SERVER
 * --------------------------------------------
 * The methods below request the creation of a Session and a Token to
 * your application server. This keeps your OpenVidu deployment secure.
 *
 * In this sample code, there is no user control at all. Anybody could
 * access your application server endpoints! In a real production
 * environment, your application server must identify the user to allow
 * access to the endpoints.
 *
 * Visit https://docs.openvidu.io/en/stable/application-server to learn
 * more about the integration of OpenVidu in your application server.
 */

let APPLICATION_SERVER_URL = "https://mmyopenvidu.onrender.com/";

function getToken(roomCode) {
	return createSession(roomCode).then(sessionId => createToken(sessionId));
}

function createSession(sessionId) {
	return new Promise((resolve, reject) => {
		$.ajax({
			type: "POST",
			url: APPLICATION_SERVER_URL + "api/sessions",
			data: JSON.stringify({ customSessionId: sessionId }),
			headers: { "Content-Type": "application/json" },
			success: response => resolve(response), // The sessionId
			error: (error) => reject(error)
		});
	});
}

function createToken(sessionId) {
	return new Promise((resolve, reject) => {
		$.ajax({
			type: 'POST',
			url: APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections',
			data: JSON.stringify({}),
			headers: { "Content-Type": "application/json" },
			success: (response) => resolve(response), // The token
			error: (error) => reject(error)
		});
	});
}