import { usePlayerStore } from "../src/components/store/players";

let OV;
let session;
//접속자 명단
let subscribers = [];
let participantlist = [];

function joinSession(roomCode,nickName){
    OV = new OpenVidu();

    session = OV.initSession();

    session.on('streamCreated', event => {

		// Subscribe to the Stream to receive it. HTML video will be appended to element with 'video-container' id
		const subscriber = session.subscribe(event.stream, 'video-container');

		// When the HTML video has been appended to DOM...
		subscriber.on('videoElementCreated', event => {
			console.log("videoElementCreated event");
			// Add a new <p> element for the user's nickname just below its video
			appendUserData(event.element, subscriber.stream.connection);
		});
	});

    // On every Stream destroyed...
	session.on('streamDestroyed', event => {

        subscribers = subscribers.filter(sub => sub.connectionId !== event.stream.connection.connectionId);
		// Delete the HTML element with the user's nickname. HTML videos are automatically removed from DOM
		removeUserData(event.stream.connection);
	});

	// session 초기화 후 이벤트 리스너 추가
	session.on('connectionCreated', (event) => {

		const full = event.connection.data;
		const fulljson = JSON.parse(full);
		const participantname = fulljson.clientData; 
		participantlist.push(participantname);
		console.log("Current participants:", participantlist);
		// renderWaitingRoomList(participantlist);
		const store = usePlayerStore.getState();
		store.updateParticipantList([...participantlist]);
	 });
  
	 session.on('connectionDestroyed', (event) => {
		participants = participantlist.filter(connection => connection.connectionId !== event.connection.connectionId);
		console.log("Participant left:", event.connection.data);
		// console.log("Current participants:", participantlist);

	 });
  

	// On every asynchronous exception...
	session.on('exception', (exception) => {
		console.warn(exception);
	});

    // Get a token from the OpenVidu deployment
	getToken(roomCode).then(token => {

		// First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
		// 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
		session.connect(token, { clientData: nickName })
			.then(() => {
                console.log("connect success!")
                 // 세션 접속 시에 접속자 정보를 배열에 추가
                const connection = session.connection;
                const clientData = JSON.parse(connection.data).clientData;

                // 접속자 정보를 subscribers 배열에 추가
				// subscribers.push({
				// 	connectionId: connection.connectionId,
				// 	clientData: clientData
				// });
				// console.log("New subscriber added:", subscribers);
			})
			.catch(error => {
				console.log('There was an error connecting to the session:', error.code, error.message);
			});
	});
}

// 구독자 명단 출력 함수
function getSubscribers() {
    console.log('Current subscribers:', subscribers);
    return subscribers;
}

function getParticipants() {
	console.log('Current participants:', participantlist);
	return participantlist;
}

function appendUserData(videoElement, connection) {
	var userData;
	var nodeId;
	if (typeof connection === "string") {
		userData = connection;
		nodeId = connection;
	} else {
		userData = JSON.parse(connection.data).clientData;
		nodeId = connection.connectionId;
	}
	var dataNode = document.createElement('div');
	dataNode.className = "data-node";
	dataNode.id = "data-" + nodeId;
	dataNode.innerHTML = "<p>" + userData + "</p>";
	videoElement.parentNode.insertBefore(dataNode, videoElement.nextSibling);
	addClickListener(videoElement, userData);
}

function addClickListener(videoElement, userData) {
	videoElement.addEventListener('click', function () {
		var mainVideo = $('#main-video video').get(0);
		if (mainVideo.srcObject !== videoElement.srcObject) {
			$('#main-video').fadeOut("fast", () => {
				$('#main-video p').html(userData);
				mainVideo.srcObject = videoElement.srcObject;
				$('#main-video').fadeIn("fast");
			});
		}
	});
}

function removeUserData(connection) {
	var dataNode = document.getElementById("data-" + connection.connectionId);
	dataNode.parentNode.removeChild(dataNode);
}

function removeAllUserData() {
	var nicknameElements = document.getElementsByClassName('data-node');
	while (nicknameElements[0]) {
		nicknameElements[0].parentNode.removeChild(nicknameElements[0]);
	}
}

var APPLICATION_SERVER_URL = "https://mmyopenvidu.onrender.com/";

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

export {joinSession, getSubscribers, getParticipants}