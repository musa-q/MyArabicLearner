import React from "react";
import { motion } from "framer-motion";
import { Book, CircleDot } from 'lucide-react';
import { Container, Card } from 'react-bootstrap';
import '../../fonts.css';

const PossessiveEndingsPage = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const endings = [
        { pronoun: "My", ending: "ي", example: "كتابي (kitabi) - my book" },
        { pronoun: "Your (M)", ending: "كَ", example: "كتابكَ (kitabuka) - your book (M)" },
        { pronoun: "Your (F)", ending: "كِ", example: "كتابكِ (kitabuki) - your book (F)" },
        { pronoun: "His", ending: "ه", example: "كتابُه (kitabuhu) - his book" },
        { pronoun: "Her", ending: "ها", example: "كتابُها (kitabuha) - her book" },
        { pronoun: "Their", ending: "هم", example: "كتابُهم (kitabuhum) - their book" },
        { pronoun: "Our", ending: "نا", example: "كتابُنا (kitabuna) - our book" },
    ];

    return (
        <Container className="pt-2 pb-5">
            <motion.div
                className="text-center mb-5"
                {...fadeIn}
            >
                <h1 className="gold display-4 mb-4">
                    Possessive Endings in Arabic
                </h1>
                <p className="lead">
                    Master the art of showing possession in Levantine Arabic
                </p>
            </motion.div>

            <motion.div
                className="row g-4 mb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                {endings.map((item, index) => (
                    <motion.div
                        key={index}
                        className="col-md-6"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Card className="h-100 text-white">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="d-flex align-items-center">
                                        <CircleDot className="me-2" size={20} />
                                        <h3 className="h4 mb-0 display-6">{item.pronoun}</h3>
                                    </div>
                                    <span className="h3 mb-0 h4 mb-0 display-6">{item.ending}</span>
                                </div>
                                <Card.Text className="lead">
                                    {item.example}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mb-5"
            >
                <Card className=" text-white">
                    <Card.Header className="d-flex align-items-center">
                        <Book className="me-2" size={20} />
                        <h2 className="h5 mb-0 display-6">Quick Guide</h2>
                    </Card.Header>
                    <Card.Body className="lead">
                        <p>
                            In Jordanian Arabic, possessive endings are attached to nouns to show ownership or belonging.
                            These endings change based on who owns the item.
                        </p>
                        <p>
                            For example, "كتابي" (kitābī) means "my book", where the ending "ي" (ī) indicates possession by the speaker.
                            The word "كتابُه" (kitābuhu) means "his book", with the ending "ه" (hu) showing possession by a male.
                        </p>
                        <p className="mb-0">
                            Notice how the endings change based on gender - "كتابكَ" (kitābuka) for males and "كتابكِ" (kitābuki) for females.
                        </p>
                    </Card.Body>
                </Card>
            </motion.div>
        </Container>
    );
};

export default PossessiveEndingsPage;