import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';
import 'firebase/compat/auth'; 

import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyDqxqBXVnGK_xrDqR7O635RiWZi2jhiQyQ",
  authDomain: "chat-app-7e52f.firebaseapp.com",
  projectId: "chat-app-7e52f",
  storageBucket: "chat-app-7e52f.appspot.com",
  messagingSenderId: "943883171300",
  appId: "1:943883171300:web:b950f09f44d02de166c3f1",
  measurementId: "G-DWLFLFY4SM"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
// const analytics = firebase.analytics();


function App() {

  const [user] = useAuthState(auth);
  // user: The auth.User if logged in, or null if not
  // console.log(user)

  return (
    <div className="App">
      <header>
        <h1>Firechat🔥</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )

}

function SignOut() {
  const [user] = useAuthState(auth);
  // console.log(auth.currentUser.displayName)
  // console.log(auth.currentUser.email)
  // console.log(auth)
  return user && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();  // It can be used to access a DOM element directly.
  console.log(dummy)
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  // const [messages] = useCollectionData(query, { idField: 'id' });
  const [messages] = useCollectionData(query);
  // console.log(messages)

  const [formValue, setFormValue] = useState('');
  console.log(formValue)


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>Send</button>

    </form>
  </>)
}


function ChatMessage(props) {
  // const { text, uid, photoURL } = props.message;
  const text = props.message.text
  const uid = props.message.uid
  const photoURL = props.message.photoURL

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;
