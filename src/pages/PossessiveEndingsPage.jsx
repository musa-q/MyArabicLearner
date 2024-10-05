import React from "react";
import { Table, Container } from "react-bootstrap";
import './Cheatsheet.css';

const PossessiveEndingsPage = () => {
    const endings = [
        { pronoun: "My", ending: "ي" },
        { pronoun: "Your (M)", ending: "كَ" },
        { pronoun: "Your (F)", ending: "كِ" },
        { pronoun: "His", ending: "ه" },
        { pronoun: "Her", ending: "ها" },
        { pronoun: "Their", ending: "هم" },
        { pronoun: "Our", ending: "نا" },
    ];

    const examples = [
        { pronoun: "My", example: "كتابي (kitabi) - my book" },
        { pronoun: "Your (M)", example: "كتابكَ (kitabuka) - your book (M)" },
        { pronoun: "Your (F)", example: "كتابكِ (kitabuki) - your book (F)" },
        { pronoun: "His", example: "كتابُه (kitabuhu) - his book" },
        { pronoun: "Her", example: "كتابُها (kitabuha) - her book" },
        { pronoun: "Their", example: "كتابُهم (kitabuhum) - their book" },
        { pronoun: "Our", example: "كتابُنا (kitabuna) - our book" },
    ];

    return (
        <Container className="my-5">
            <h1 className="text-center mb-4">Possessive Endings</h1>

            <Table striped bordered hover className="text-center">
                <thead>
                    <tr>
                        <th>Pronoun</th>
                        <th>Ending</th>
                    </tr>
                </thead>
                <tbody>
                    {endings.map((row, index) => (
                        <tr key={index}>
                            <td>{row.pronoun}</td>
                            <td>{row.ending}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div>
                <h2 className="mt-5">Explanation</h2>
                <p>
                    In Jordanian Arabic, possessive endings are used to indicate ownership or belonging.
                    These endings are attached to nouns to show who the noun belongs to.
                </p>
                <p>
                    For example, "كتابي" (kitābī) means "my book", where the ending "ي" (ī) indicates possession by the speaker.
                    The word "كتابُه" (kitābuhu) means "his book", with the ending "ه" (hu) showing possession by a male.
                </p>
                <p>
                    It is important to note the gender-specific endings for "your". For males, "كتابكَ" (kitābuka) is used,
                    and for females, "كتابكِ" (kitābuki) is used.
                </p>
            </div>

            <Table striped bordered hover className="text-center mt-5">
                <thead>
                    <tr>
                        <th>Example</th>
                    </tr>
                </thead>
                <tbody>
                    {examples.map((row, index) => (
                        <tr key={index}>
                            <td>{row.example}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

        </Container>
    );
};

export default PossessiveEndingsPage;
