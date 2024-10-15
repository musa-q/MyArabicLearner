import { useState } from 'react';
import './FlashCards.css';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
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

    const changeTransliteration = (val) => {
        setTranslitRadioValue(val);
    };

    const changeLanguage = (val) => {
        setLangRadioValue(val);

        let newFlipped;
        if (val === '1') {
            newFlipped = Array(flashcards.length).fill(false);
        } else {
            newFlipped = Array(flashcards.length).fill(true);
        }

        setFlippedCards(newFlipped);
    };

    const AllToggleButtons = ({ langRadios, translitRadios, langRadioValue, translitRadioValue, changeLanguage, changeTransliteration }) => (
        <>
            <div className='list-toggle-button'>
                <div className='full-toggle-button'>
                    <span>Language:</span>
                    <ButtonGroup>
                        {langRadios.map((langRadio, idx) => (
                            <ToggleButton
                                key={idx}
                                id={`lang-radio-${idx}`}
                                type="radio"
                                variant={idx % 2 ? 'outline-danger' : 'outline-success'}
                                name="lang-radio"
                                value={langRadio.value}
                                checked={langRadioValue === langRadio.value}
                                onChange={(e) => changeLanguage(e.currentTarget.value)}
                            >
                                {langRadio.name}
                            </ToggleButton>
                        ))}
                    </ButtonGroup>
                </div>
                <div className='full-toggle-button'>
                    <span>Transliteration:</span>
                    <ButtonGroup>
                        {translitRadios.map((translitRadio, translitIdx) => (
                            <ToggleButton
                                key={translitIdx}
                                id={`transliteration-radio-${translitIdx}`}
                                type="radio"
                                variant={translitRadio.value === 'true' ? 'outline-success' : 'outline-danger'}
                                name="transliteration-radio"
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
        </>
    );


    return (
        <>
            <AllToggleButtons
                langRadios={langRadios}
                translitRadios={translitRadios}
                langRadioValue={langRadioValue}
                translitRadioValue={translitRadioValue}
                changeLanguage={changeLanguage}
                changeTransliteration={changeTransliteration}
            />
            <Row xs={1} md={2} className="g-4">
                {flashcards.map((flashcard, index) => (
                    <Col key={index}>
                        <div
                            className={`flashcard${flippedCards[index] ? ' flipped' : ''}`}
                            onClick={() => flipCard(index)}
                        >
                            <Card>
                                <div className="card-front">
                                    {translitRadioValue === 'true' ? (
                                        <>
                                            <Card.Title className='front-card-title'>{flashcard.arabic}</Card.Title>
                                            <Card.Text>{flashcard.transliteration}</Card.Text>
                                        </>
                                    ) : (
                                        <>
                                            <Card.Title className='front-card-title large'>{flashcard.arabic}</Card.Title>
                                        </>
                                    )}
                                </div>
                                <div className="card-back">
                                    <Card.Title className='back-card-title'>{capitaliseWords(flashcard.english)}</Card.Title>
                                </div>
                            </Card>
                        </div>
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default FlashCards;
