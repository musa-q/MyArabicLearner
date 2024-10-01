import React from 'react';
import { motion } from 'framer-motion';

const TypingAnimation = ({ text }) => {
    const words = text.split(/\s+/);

    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const wordVariants = {
        hidden: { opacity: 0, y: 80 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1
            }
        }
    };

    return (
        <motion.h1
            style={{
                display: 'flex',
                flexDirection: 'row-reverse',
                fontSize: '4rem',
                fontWeight: 'bold',
                overflow: 'visible',
                paddingBottom: '100px',
                unicodeBidi: 'bidi-override',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '0.3em',
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {words.map((word, index) => (
                <motion.span
                    className='noto-kufi-bold gold'
                    key={`${word}-${index}`}
                    variants={wordVariants}
                    style={{
                        display: 'inline-block',
                        whiteSpace: 'pre',
                    }}
                >
                    {word}
                </motion.span>
            ))}
        </motion.h1>
    );
};

export default TypingAnimation;