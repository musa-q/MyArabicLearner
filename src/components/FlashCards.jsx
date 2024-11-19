import { useState } from 'react';
import './FlashCards.css';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { capitaliseWords } from '../utils';

const FlashCards = ({ flashcards }) => {
    const [flippedCards, setFlippedCards] = useState(Array(flashcards.length).fill(false));
    const [langRadioValue, setLangRadioValue] = useState('1');
    const [translitRadioValue, setTranslitRadioValue] = useState('true');

    const langRadios = [
        { name: 'Arabic', value: '1' },
        { name: 'English', value: '2' },
    ];

    const translitRadios = [
        { name: 'On', value: 'true' },
        { name: 'Off', value: 'false' },
    ];

    const flipCard = (index) => {
        setFlippedCards((prevState) => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };

    const changeLanguage = (val) => {
        setLangRadioValue(val);
        setFlippedCards(Array(flashcards.length).fill(val === '2'));
    };

    return (
        <>
            <div className='toggle-buttons'>
                <div className='toggle-group'>
                    <span className='lead'>Language:</span>
                    <ButtonGroup>
                        {langRadios.map((langRadio, idx) => (
                            <ToggleButton
                                key={idx}
                                id={`lang-radio-${idx}`}
                                type="radio"
                                variant={idx % 2 ? 'outline-danger' : 'outline-success'}
                                value={langRadio.value}
                                checked={langRadioValue === langRadio.value}
                                onChange={(e) => changeLanguage(e.currentTarget.value)}
                            >
                                {langRadio.name}
                            </ToggleButton>
                        ))}
                    </ButtonGroup>
                </div>
                <div className='toggle-group'>
                    <span className='lead'>Transliteration:</span>
                    <ButtonGroup>
                        {translitRadios.map((translitRadio, idx) => (
                            <ToggleButton
                                key={idx}
                                id={`transliteration-radio-${idx}`}
                                type="radio"
                                variant={translitRadio.value === 'true' ? 'outline-success' : 'outline-danger'}
                                value={translitRadio.value}
                                checked={translitRadioValue === translitRadio.value}
                                onChange={(e) => setTranslitRadioValue(e.currentTarget.value)}
                            >
                                {translitRadio.name}
                            </ToggleButton>
                        ))}
                    </ButtonGroup>
                </div>
            </div>

            <div className="flashcards-grid">
                {flashcards.map((flashcard, index) => (
                    <div
                        key={index}
                        className={`flashcard-tile${flippedCards[index] ? ' flipped' : ''}`}
                        onClick={() => flipCard(index)}
                    >
                        <div className="flashcard-inner">
                            <div className="flashcard-content card-front">
                                <div className="card-title display-6">{flashcard.arabic}</div>
                                {translitRadioValue === 'true' && (
                                    <div className="card-translit lead">{flashcard.transliteration}</div>
                                )}
                            </div>
                            <div className="flashcard-content card-back">
                                <div className="card-title display-6">{capitaliseWords(flashcard.english)}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default FlashCards;