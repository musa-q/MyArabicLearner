import { useState } from 'react';
import './FlashCards.css';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { capitaliseWords } from '../utils';

const FlashCards = ({ flashcards }) => {
    const [flippedCards, setFlippedCards] = useState(Array(flashcards.length).fill(false));
    const [langRadioValue, setLangRadioValue] = useState('1');  // '1' for Arabic, '2' for English
    const [translitRadioValue, setTranslitRadioValue] = useState('true');  // 'true' for On, 'false' for Off

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

    const changeTransliteration = (val) => {
        setTranslitRadioValue(val);
    };

    const changeLanguage = (val) => {
        console.log(val, 'val1');
        setLangRadioValue(val);
        console.log(val, 'val2');
    };

    return (
        <>
            <div className='toggle-buttons'>
                <div className='toggle-group'>
                    <span>Language:</span>
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
                    <span>Transliteration:</span>
                    <ButtonGroup>
                        {translitRadios.map((translitRadio, idx) => (
                            <ToggleButton
                                key={idx}
                                id={`transliteration-radio-${idx}`}
                                type="radio"
                                variant={translitRadio.value === 'true' ? 'outline-success' : 'outline-danger'}
                                value={translitRadio.value}
                                checked={translitRadioValue === translitRadio.value}
                                onChange={(e) => changeTransliteration(e.currentTarget.value)}
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
                        <div className="flashcard-content card-front">
                            {langRadioValue === '1' ? (
                                <>
                                    <div className="card-title">{flashcard.arabic}</div>
                                    {translitRadioValue === 'true' && (
                                        <div className="card-translit">{flashcard.transliteration}</div>
                                    )}
                                </>
                            ) : (
                                <div className="card-title">{capitaliseWords(flashcard.english)}</div>
                            )}
                        </div>
                        <div className="flashcard-content card-back">
                            {langRadioValue === '1' ? (
                                <div className="card-title">{capitaliseWords(flashcard.english)}</div>
                            ) : (
                                <>
                                    <div className="card-title">{flashcard.arabic}</div>
                                    {translitRadioValue === 'true' && (
                                        <div className="card-translit">{flashcard.transliteration}</div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default FlashCards;
