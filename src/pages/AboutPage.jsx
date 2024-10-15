const AboutPage = () => {
    return (
        <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
            <h1 className='gold' style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '20px' }}>About My Arabic Learner</h1>

            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', textAlign: 'center', marginBottom: '30px' }}>
                Welcome to <strong>My Arabic Learner</strong>! Whether you're just starting out or want to level up your Arabic conversations, we're here to make learning Levantine Arabic easy, fun, and totally useful!
            </p>

            <section style={{ marginBottom: '40px' }}>
                <h2 className='gold' style={{ fontSize: '1.8rem', marginBottom: '10px' }}>What We Offer</h2>
                <ul style={{ fontSize: '1.1rem', lineHeight: '1.8', listStyleType: 'disc', paddingLeft: '20px' }}>
                    <li>Cheat sheets for grammar and language rules to help you build sentences easily</li>
                    <li>Flashcards covering a variety of topics to boost your vocabulary</li>
                    <li>Quizzes to practice verb conjugation and vocabulary</li>
                    <li>A handy way to review your past quizzes and track progress</li>
                    <li>An AI-powered chatbot for conversation practice soon!</li>
                </ul>
            </section>

            <section style={{ marginBottom: '40px' }}>
                <h2 className='gold' style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Why Levantine Arabic?</h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                    Levantine Arabic, spoken in Jordan, Lebanon, Palestine, and Syria, is one of the most widely understood Arabic dialects. It's ideal for travelers, students, and anyone looking to engage with native speakers in the region.
                </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
                <h2 className='gold' style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Join Us</h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                    Ready to begin your journey? Sign up today and start exploring the beauty of the Levantine dialect with <strong>My Arabic Learner</strong>!
                </p>
            </section>
        </div>
    );
};

export default AboutPage;
