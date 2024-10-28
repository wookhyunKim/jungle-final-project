import React, { useState, useEffect, useRef, useCallback } from 'react';

const SpeechRecognitionComponent = () => {
    // 상태 관리
    const [count, setCount] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    
    // useRef로 변수 관리
    const recognitionRef = useRef(null);
    const isStoppedManuallyRef = useRef(false);

    // SpeechRecognition 초기화 및 설정
    useEffect(() => {
        // SpeechRecognition 객체 생성
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();

        const recognition = recognitionRef.current;
        recognition.lang = 'ko-KR';
        recognition.continuous = true;
        recognition.interimResults = true;

        // 이벤트 핸들러 설정
        recognition.onstart = handleStart;
        recognition.onresult = handleResult;
        recognition.onend = handleEnd;
        recognition.onerror = handleError;

        // 컴포넌트 언마운트 시 정리
        return () => {
            if (recognition) {
                recognition.stop();
            }
        };
    }, []);

    // 음성 인식 시작 핸들러
    const handleStart = useCallback(() => {
        console.log('녹음이 시작되었습니다.');
        setIsListening(true);
    }, []);

    // 음성 인식 결과 핸들러
    const handleResult = useCallback((event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const result = event.results[i];
            const transcript = result[0].transcript.trim();

            if (result.isFinal) {
                finalTranscript += transcript + ' ';
                countOccurrences(transcript);
            } else {
                interimTranscript += transcript + ' ';
            }
        }

        setTranscript(finalTranscript + interimTranscript);
    }, []);

    // 음성 인식 종료 핸들러
    const handleEnd = useCallback(() => {
        console.log('녹음이 종료되었습니다.');
        setIsListening(false);

        if (!isStoppedManuallyRef.current && recognitionRef.current) {
            console.log('자동으로 음성 인식 재시작');
            recognitionRef.current.start();
        }
    }, []);

    // 에러 핸들러
    const handleError = useCallback((event) => {
        console.error('음성 인식 오류:', event.error);
        if (event.error !== 'no-speech' && recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current.start();
        }
    }, []);

    // "아니" 단어 카운트 함수
    const countOccurrences = useCallback((transcript) => {
        const word = "아니";
        const occurrences = (transcript.match(new RegExp(word, 'g')) || []).length;
        setCount(prev => prev + occurrences);
    }, []);

    // 시작 버튼 핸들러
    const handleStartClick = useCallback(() => {
        if (recognitionRef.current) {
            isStoppedManuallyRef.current = false;
            recognitionRef.current.start();
            setIsListening(true);
        }
    }, []);

    // 정지 버튼 핸들러
    const handleStopClick = useCallback(() => {
        if (recognitionRef.current) {
            isStoppedManuallyRef.current = true;
            recognitionRef.current.stop();
            setCount(0);
            setIsListening(false);
        }
    }, []);

    return (
        <div>
            <div style={{ margin: '10px' }}>
                <button
                    onClick={handleStartClick}
                    disabled={isListening}
                >
                    게임 시작
                </button>
                <button
                    onClick={handleStopClick}
                    disabled={!isListening}
                >
                    게임 종료
                </button>
                <div id="count">
                    "금칙어(아니)" 카운트: {count}
                </div>
            </div>
            <div
                style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'white',
                    background: 'rgba(0, 0, 0, 0.7)',
                    padding: '10px',
                    borderRadius: '5px',
                    fontSize: '18px',
                    zIndex: 1000
                }}
            >
                {transcript}
            </div>
        </div>
    );
};

export default SpeechRecognitionComponent;