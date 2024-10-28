import React from "react";
import { useLocation } from "react-router-dom";
import WaitingroomTable from "../components/common/WaitingroomTable";
import HostOrGuest from "../components/HostOrGuest";
import Profile from "../components/Profile";

const GuestWaitPage = () => {
    const location = useLocation();
    const { nickname, inputCode } = location.state || {};

    // Retrieve participants from sessionStorage with error handling
    let participants;
    try {
        participants =
            JSON.parse(sessionStorage.getItem(`${inputCode}_participants`)) ||
            [];
        if (!Array.isArray(participants)) {
            throw new Error("Participants data is not an array");
        }
    } catch (error) {
        console.error("Error parsing participants from sessionStorage:", error);
        participants = []; // Set as empty array if parsing fails
    }

    // Add the nickname if it's not already in the participants array
    if (nickname && !participants.includes(nickname)) {
        participants.push(nickname);

        // Store the updated participants list back into sessionStorage
        sessionStorage.setItem(
            `${inputCode}_participants`,
            JSON.stringify(participants)
        );
    }

    console.log(participants, "----");

    return (
        <>
            <h1>방코드 : {inputCode}</h1>
            <HostOrGuest>
                <Profile
                    role={"GUEST"}
                    btnName={"시작하기"}
                    children={<WaitingroomTable participants={participants} />}
                    type={"START"}
                />
            </HostOrGuest>
        </>
    );
};

export default GuestWaitPage;
