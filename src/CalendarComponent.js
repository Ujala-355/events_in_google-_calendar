import React, { useState } from "react";
import { useSession, useSupabaseClient, useSessionContext } from "@supabase/auth-helpers-react";
import DateTimePicker from 'react-datetime-picker'

const CalendarComponent = () => {
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    const [eventName, setEventName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [recipientEmails, setRecipientEmails] = useState(""); // State to store recipient emails

    const session = useSession(); // tokens, when session exists we have a user
    const supabase = useSupabaseClient(); //talk to supabase
    const { isLoading } = useSessionContext();

    if (isLoading) {
        return <></>;
    }

    async function googleSignIn() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                scopes: "https://www.googleapis.com/auth/calendar",
            },
        });
        if (error) {
            alert("Error logging in to Google Provider with Supabase");
            console.log(error);
        }
    }

    async function signOut() {
        await supabase.auth.signOut();
    }

    async function createCalendarEvent() {
        try {
            if (!session || !session.provider_token) {
                throw new Error("User not authenticated");
            }

            // Split recipientEmails string by comma to get individual email addresses
            const emailsArray = recipientEmails.split(",").map(email => email.trim());

            // Prepare the event data
            const event = {
                summary: eventName,
                description: eventDescription,
                start: {
                    dateTime: start.toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
                end: {
                    dateTime: end.toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
                attendees: emailsArray.map(email => ({ email })), // Add multiple recipients to attendees
            };

            const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + session.provider_token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(event),
            });

            if (!response.ok) {
                throw new Error("Failed to create calendar event");
            }

            const responseData = await response.json();
            console.log("Calendar event created:", responseData);
            alert("Event created, check your Google Calendar");
        } catch (error) {
            console.error("Error creating calendar event:", error);
            alert("Error creating calendar event. Please check the console for details.");
        }
    }

    return (
        <>
            <div style={{ width: "400px", margin: "30px auto" }}>
                {session ? (
                    <>
                        <h2>Hey there {session.user.email}</h2>
                        <p>Start of your Event</p>
                        <DateTimePicker onChange={setStart} value={start} />
                        <p>End of your Event</p>
                        <DateTimePicker onChange={setEnd} value={end} />

                        <p>Event Name</p>
                        <input type="text" onChange={(e) => setEventName(e.target.value)} />

                        <p>Event Description</p>
                        <input type="text" onChange={(e) => setEventDescription(e.target.value)} />

                        <p>Recipient Emails (Separate multiple emails by comma)</p>
                        <input type="text" onChange={(e) => setRecipientEmails(e.target.value)} />

                        <button onClick={createCalendarEvent}>Create Calendar Event</button>
                        <hr />
                        <br />
                        <button onClick={signOut}>Sign Out</button>
                    </>
                ) : (
                    <button onClick={googleSignIn}>Sign In with Google</button>
                )}
            </div>
        </>
    );
};

export default CalendarComponent;
