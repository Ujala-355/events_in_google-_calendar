import React,{useState} from "react";
import {useSession,useSupabaseClient,useSessionContext} from "@supabase/auth-helpers-react";
import DateTimePicker from "react-datetime-picker";

const CalendarComponent=()=>{
    const [start, setStart]=useState(new Date());
    const [end, setEnd]=useState(new Date());
    const [eventName, setEventName]=useState("");
    const [eventDescription, setEventDescription]=useState("");

    const session=useSession();// tokens, when session exists we have a user
    const supabase=useSupabaseClient();//talk to supabase
    const {isLoading}=useSessionContext();

    if (isLoading){
        return <></>
    }
    async function googleSignIn(){
        const {error}=await supabase.auth.signInWithOAuth({
            provider:"google",
            options:{
                scopes:'https://www.googleapis.com/auth/calendar'
            }
        });
        if(error){
            alert("Error logging in to Google Provider with Supabase")
            console.log(error);
        }
    }
    async function signOut(){
        await supabase.auth.signOut();
    }
    async function createCalendarEvent() {
        try {
            // Ensure the user is authenticated
            if (!session || !session.provider_token) {
                throw new Error("User not authenticated");
            }
    
            // Prepare the event data
            const event = {
                summary: eventName,
                description: eventDescription,
                start: {
                    dateTime: start.toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                end: {
                    dateTime: end.toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                }
            };
    
            // Make a POST request to create the calendar event
            const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + session.provider_token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(event)
            });
    
            // Check if the request was successful
            if (!response.ok) {
                throw new Error("Failed to create calendar event");
            }
    
            // Parse the response data
            const responseData = await response.json();
    
            // Log the created event data
            console.log("Calendar event created:", responseData);
    
            // Display a success message to the user
            alert("Event created, check your Google Calendar");
        } catch (error) {
            // Handle errors
            console.error("Error creating calendar event:", error);
            alert("Error creating calendar event. Please check the console for details.");
        }
    }
    
    
    console.log(session);
    console.log(start);
    console.log(eventName);
    console.log(eventDescription);
    return(
        <>
            <div style={{width:"400px",margin:"30px auto"}}>
                {session ?
                    <>
                        <h2>Hey there {session.user.email}</h2>
                        <p>Start of your Event</p>
                        <DateTimePicker onChange={setStart} value={start} />
                        <p>End of your Event</p>
                        <DateTimePicker onChange={setEnd} value={end}/>

                        <p>Event Name</p>
                        <input type="text" onChange={(e)=>setEventName(e.target.value)} />

                        <p>Event Description</p>
                        <input type="text" onChange={(e)=>setEventDescription(e.target.value)}/>
                        <button onClick={()=>createCalendarEvent()}>Create Calendar Event</button>
                        <hr/>
                        <br/>
                        <button onClick={()=>signOut()}>Sing Out</button>
                    </>
                    :
                    <>
                        <button onClick={()=>googleSignIn()}>Sing In with Google</button>
                    </>
                }
            </div>
        </>
    )
}
export default CalendarComponent;