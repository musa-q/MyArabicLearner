import { useState, useEffect } from 'react';
import axios from 'axios';


const QuizResultsPage = () => {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [resultsDetails, setResultsDetails] = useState({});

    const getUserResults = async () => {
        const response = await axios.post('http://127.0.0.1:5000/quiz/users/1/get-results', {
            quiz_type: 'VocabQuiz',
        });

        const data = response.data;
        setResultsDetails(data);
        setDataLoaded(true);
    };

    useEffect(() => {
        if (!dataLoaded) {
            getUserResults();
        }
    }, [dataLoaded]);

    if (!dataLoaded) {
        return <p>WEEE LOAAADING...</p>;
    }

    return (
        <>
        RESULTSPAGE
        {console.log(resultsDetails)}
        </>
    );
}

export default QuizResultsPage;