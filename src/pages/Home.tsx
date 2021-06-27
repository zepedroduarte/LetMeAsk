import { useHistory} from 'react-router-dom';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import  Switch  from 'react-switch';
import { Button } from '../components/Button';
import logo_white from '../assets/images/logo_white.png';


import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useEffect, useState } from 'react';
import { database } from '../services/firebase';
import { useTheme } from '../hooks/useTheme';


export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState(''); 
     
    const { theme, toggleTheme} = useTheme()

    async function handleCreateRoom(){
        if(!user) {
          await signInWithGoogle();
        }


        history.push('/rooms/new') 
    }

    async function handleJoinRoom(evente:FormEvent)
    {
        evente.preventDefault();

        if(roomCode.trim() === ''){
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if(!roomRef.exists()){
            alert('Room not found');
            return;
        }

        if(roomRef.val().endedAt){
            alert('Room already closed');
            return;
        }

        history.push(`/rooms/${roomCode}`);
    }

    useEffect(() => {
        if (theme === "light") {
            document.body.style.backgroundColor = "#fefefe";
        } else {
            document.body.style.backgroundColor = "#223";
        }
    }, [theme]);


    return (
        <div id="page-auth" className={theme}>
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire duvidas da sua audiencia em tempo-real</p>
            </aside>
            <main>
           
                <div className="main-content">
                    <Switch
                        className="switch"
                        onChange={toggleTheme}
                        checked={theme === 'light'}
                        checkedIcon={false}
                        uncheckedIcon={false}   
                        onColor={'#835afd'}                   
                    />

                    <img src={theme === 'light' ? logoImg : logo_white} alt="Letmeask" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo do Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            className={theme}
                            type="text" 
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}