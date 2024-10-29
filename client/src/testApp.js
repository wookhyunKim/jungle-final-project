function joinSession(sessionId, myUserName) {
    // --- 1) Get an OpenVidu object ---
    OV = new OpenVidu();

    // --- 2) Init a session ---
    session = OV.initSession();

    // --- 3) Specify the actions when events take place in the session ---
    session.on('streamCreated', event => {
        let subscriber = session.subscribe(event.stream, 'video-container');
        subscriber.on('videoElementCreated', event => {
            appendUserData(event.element, subscriber.stream.connection);
        });
    });

    session.on('streamDestroyed', event => {
        removeUserData(event.stream.connection);
    });

    session.on('exception', (exception) => {
        console.warn(exception);
    });

    // --- 4) Connect to the session with a valid user token ---
    getToken(sessionId).then(token => {
        session.connect(token, { clientData: myUserName })
            .then(() => {
                document.getElementById('session-title').innerText = sessionId;
                document.getElementById('join').style.display = 'none';
                document.getElementById('session').style.display = 'block';

                let publisher = OV.initPublisher('video-container', {
                    audioSource: undefined,
                    videoSource: undefined,
                    publishAudio: true,
                    publishVideo: true,
                    resolution: '640x480',
                    frameRate: 30,
                    insertMode: 'APPEND',
                    mirror: false,
                });

                publisher.on('videoElementCreated', function (event) {
                    initMainVideo(event.element, myUserName);
                    appendUserData(event.element, myUserName);
                    event.element['muted'] = true;
                });

                session.publish(publisher);
            })
            .catch(error => {
                console.log('There was an error connecting to the session:', error.code, error.message);
            });
    });
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
