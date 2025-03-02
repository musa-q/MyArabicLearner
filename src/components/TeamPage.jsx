import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Code, Book } from 'lucide-react';
import { SocialIcon } from 'react-social-icons';
import './TeamPage.css';

const TeamPage = ({ onNavigate }) => {
    const team = [
        {
            name: "Musa",
            nameAr: "موسى",
            imageUrl: "",
            role: {
                en: "Lead Developer",
                ar: "المطوّر الرئيسي"
            },
            description: {
                en: "As the lead developer, Musa brings our vision to life through code. He's responsible for building and maintaining the platform, ensuring a smooth learning experience for all users.",
                ar: "موسى هو يلي بيحوّل فكرتنا لواقع من خلال البرمجة. هو مسؤول عن بناء المنصة وصيانتها، وبيتأكد إنو تجربة التعلم سلسة لكل المستخدمين."
            },
            icon: <Code size={32} />,
            linkedInLink: "https://www.linkedin.com/in/musa-qureshi/"
        },
        {
            name: "Mohammed",
            nameAr: "محمد",
            imageUrl: "",
            role: {
                en: "Arabic Language Expert",
                ar: "خبير اللغة العربية"
            },
            description: {
                en: "Mohammed ensures the quality and authenticity of our Arabic content. He develops our vocabulary lists and verifies that all language content accurately reflects Levantine Arabic as it's spoken today.",
                ar: "محمد بيتأكد من جودة وأصالة المحتوى العربي. هو بيطوّر قوائم المفردات وبيتحقق من إنو كل المحتوى اللغوي بيعكس بدقة اللهجة الشامية كما بتنحكى اليوم."
            },
            icon: <Book size={32} />,
            linkedInLink: "https://www.linkedin.com/in/mohammed-sa%E2%80%99deh-0a9979244/"
        }
    ];

    return (
        <Container className="py-5">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-5"
            >
                <h1 className="display-4 gold mb-1">Meet Our Team</h1>
                <h2 className="display-6 mb-4 gold noto-kufi-regular">تعرف على فريقنا</h2>
            </motion.div>

            <Row className="justify-content-center g-4">
                {team.map((member, index) => (
                    <Col key={index} md={6} className="d-flex">
                        <motion.div
                            className="w-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            <Card className="h-100  text-white border-purple">
                                <Card.Body className="d-flex flex-column">
                                    <div className="text-center mb-4">
                                        {member.imageUrl === "" ? null : (
                                            <div className="team-image-placeholder">
                                                <img
                                                    src={member.imageUrl}
                                                    alt={member.name}
                                                    className="rounded-circle team-image"
                                                    width={100}
                                                />
                                            </div>
                                        )}
                                        <div className="mt-3 mb-3">{member.icon}</div>
                                        <Card.Title className="mb-3">
                                            <div className="display-6">
                                                {member.name}
                                            </div>
                                            <div className="lead noto-kufi-regular gold">
                                                {member.nameAr}
                                            </div>
                                        </Card.Title>
                                        <div className="mb-2 text-purple-400 lead">{member.role.en}</div>
                                        <div className="mb-4 text-purple-400 lead-ar noto-kufi-regular gold">{member.role.ar}</div>
                                    </div>

                                    <div className="mb-4">
                                        <Card.Text className="mb-3 lead">
                                            {member.description.en}
                                        </Card.Text>
                                        <Card.Text className="arabic-text">
                                            <div className="lead-ar noto-kufi-regular gold">
                                                {member.description.ar}
                                            </div>
                                        </Card.Text>
                                    </div>

                                    <div className="text-center mt-auto mb-3">
                                        <a
                                            href={member.linkedInLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white transition-colors duration-200"
                                        >
                                            <SocialIcon network="linkedin" bgColor='transparent' />
                                        </a>
                                    </div>

                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default TeamPage;