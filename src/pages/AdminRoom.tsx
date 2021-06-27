import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import logo_white from '../assets/images/logo_white.png';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useHistory, useParams } from 'react-router-dom';
import  Switch  from 'react-switch';
import '../styles/room.scss';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
import { useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    //const {user} = useAuth();
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { theme, toggleTheme } = useTheme();
    const { title, questions } = useRoom(roomId);

    async function handEndRoom(){
        await database.ref(`/rooms/${roomId}`).update({
            endedAt: new Date(),
        });

        history.push('/');
    }

    async function handleDeleteQuestion(questionId: string){
       if(window.confirm('Tem certeza que voce deseja exculir esta pergunta?')) {
         await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
       }
    }

    async function handHighlightQuestion(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        });  
    }

     async function handCheckQuestionAsAnswered(questionId: string){ 
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        });  
     }

     useEffect(() => {
        if (theme === "light") {
            document.body.style.backgroundColor = "#fefefe";
        } else {
            document.body.style.backgroundColor = "#223";
        }
    }, [theme]);

    return (
        <div id="page-room" className={theme}>
            <header>
                <div className={`content ${theme}`}>
                    <img src={theme === 'light' ? logoImg : logo_white} alt="Letmeask" />
                    <div>
                        <RoomCode code={params.id}/>
                        <Button isOutlined onClick={handEndRoom}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <div className="room-title">
                        <h1 className={theme}>Sala {title}</h1>
                        { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                    </div>
                    <div>
                        <Switch
                            className="switch"
                            onChange={toggleTheme}
                            checked={theme === 'light'}
                            checkedIcon={false}
                            uncheckedIcon={false}   
                            onColor={'#835afd'}                   
                        />
                    </div> 
                </div>

               <div className={`question-list ${theme}`} >
                {questions.map(question =>{
                        return(
                            <Question 
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                {!question.isAnswered && (
                                  <>
                                    <button
                                        type="button"
                                        onClick={() => handCheckQuestionAsAnswered(question.id)}
                                    >
                                        <img src={checkImg} alt="Marcar pergunta como respondida"/> 
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={() => handHighlightQuestion(question.id)}
                                    >
                                        <img src={answerImg} alt="Dar destaque à pergunta"/> 
                                    </button>
                                </>
                                )}
                            
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                   <img src={deleteImg} alt="Remover pergunta"/> 
                                </button>

                            </Question> 

                        );
                    })}
               </div>
            </main>
        </div>
    );
}