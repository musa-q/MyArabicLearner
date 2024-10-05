import React from "react";
import { Table, Container } from "react-bootstrap";
import './Cheatsheet.css';

const VerbConjugationPage = () => {
    const conjugations = [
        { pronoun: "أنا", past: "نمتُ", present: "أنام", future: "رح أنام" },
        { pronoun: "إنتَ", past: "نمتَ", present: "تنام", future: "رح تنام" },
        { pronoun: "إنتِ", past: "نمتي", present: "تنامي", future: "رح تنامي" },
        { pronoun: "هو", past: "نام", present: "ينام", future: "رح ينام" },
        { pronoun: "هي", past: "نامت", present: "تنام", future: "رح تنام" },
        { pronoun: "هم", past: "ناموا", present: "يناموا", future: "رح يناموا" },
        { pronoun: "إحنا", past: "نمنا", present: "ننام", future: "رح ننام" },
    ];

    return (
        <Container className="my-5">
            <h1 className="text-center mb-4">Verb Conjugation in Jordanian Arabic</h1>

            <Table striped bordered hover className="text-center">
                <thead>
                    <tr>
                        <th>Pronoun</th>
                        <th>Past</th>
                        <th>Present</th>
                        <th>Future</th>
                    </tr>
                </thead>
                <tbody>
                    {conjugations.map((row, index) => (
                        <tr key={index}>
                            <td>{row.pronoun}</td>
                            <td>{row.past}</td>
                            <td>{row.present}</td>
                            <td>{row.future}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <h2 className="mt-5">Explanation</h2>
            <p>
                In Levantine Arabic, verbs are conjugated differently based on the pronoun and tense.
                The table above shows the conjugation of the verb "نام" (nama) meaning "to sleep" in the past, present, and future tenses.
            </p>
            <p>
                For the present tense, Levantine Arabic typically uses the prefix "بـ" (b-) attached to the verb. For example,
                "بنام" (banam) means "I sleep" or "I am sleeping". This prefix is consistent across all pronouns, but the verb stem and suffixes change slightly to match the subject.
            </p>
            <p>
                The future tense is formed by adding the particle "رح" (rah) before the present tense verb. For instance,
                "رح أنام" (rah anam) means "I will sleep", and "رح تنام" (rah tinam) means "you (masculine) will sleep".
            </p>
            <p>
                For example, "نمتُ" (namtu) is "I slept" in the past, "بنام" (banam) is "I sleep" in the present, and "رح أنام" (rah anam) is "I will sleep" in the future.
            </p>

        </Container>
    );
};

export default VerbConjugationPage;
