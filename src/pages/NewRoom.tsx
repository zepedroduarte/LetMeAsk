import { Link, useHistory } from 'react-router-dom';
import { FormEvent, useEffect } from 'react';
import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import logo_white from '../assets/images/logo_white.png';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';

import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';



export function NewRoom() { 
    const { user } = useAuth();
    const history = useHistory();
    const [newRoom, setNewRoom] = useState('');
    const { theme } = useTheme();

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        if(newRoom.trim() === '') {
            return;
        }

        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        })

        history.push(`/admin/rooms/${firebaseRoom.key}`);
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
                    <img src={theme === 'light' ? logoImg : logo_white} alt="Letmeask" />
                    <h2>Criar uma nova sala</h2>
                   
                    <form onSubmit={handleCreateRoom}>
                        <input 
                            className={theme}
                            type="text" 
                            placeholder="Nome da sala" 
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}    
                        />
                        <Button type="submit">
                           Criar sala
                        </Button>
                    </form>
                    <p className={theme}>
                        Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}