import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'To create an account, click on "Sign Up" on the home page, fill in your details (name, email, password), and select your role as either a student or admin. Once you submit the form, your account will be created and you can log in.'
        },
        {
          q: 'What is the difference between student and admin accounts?',
          a: 'Student accounts are for users who want to prepare for exams using our learning materials, quizzes, and practice tests. Admin accounts are for educators or instructors who can create and manage exam content, materials, and track student progress.'
        },
        {
          q: 'Is the platform free to use?',
          a: 'Yes! The Exam Priority Portal is available to use for free. All students have access to our complete library of study materials, quizzes, and practice exams.'
        }
      ]
    },
    {
      category: 'Study Materials',
      questions: [
        {
          q: 'Can I download study materials?',
          a: 'Yes, you can access all study materials directly on the platform. Some materials may also be available for download depending on the content type. Check the specific material page for download options.'
        },
        {
          q: 'How frequently is the content updated?',
          a: 'We update our content regularly to ensure it aligns with the latest exam patterns and syllabus. Content updates are made at least once per month, with major updates before important exam seasons.'
        },
        {
          q: 'Can I access content in different languages?',
          a: 'Currently, our platform primarily offers content in English. We are working on expanding to multiple languages in the future.'
        }
      ]
    },
    {
      category: 'Quizzes & Exams',
      questions: [
        {
          q: 'How many practice exams are available?',
          a: 'We provide a comprehensive collection of practice exams covering various subjects and topics. New exams are regularly added to reflect current exam patterns. The exact number varies by subject.'
        },
        {
          q: 'Can I retake a quiz or exam?',
          a: 'Yes, you can retake any quiz or practice exam multiple times. This allows you to track your progress and identify areas that need more practice. We keep a record of all your attempts.'
        },
        {
          q: 'How are quiz results calculated?',
          a: 'Quiz results are calculated based on the number of correct answers. You receive scores and detailed feedback for each question, helping you understand where you went wrong and learn from your mistakes.'
        }
      ]
    },
    {
      category: 'Progress & Tracking',
      questions: [
        {
          q: 'How does the progress tracking work?',
          a: 'Our progress tracking system monitors your study activity, quiz performance, and exam attempts. You can view detailed analytics on your dashboard showing completed topics, accuracy scores, and areas for improvement.'
        },
        {
          q: 'Can I see my past quiz results?',
          a: 'Yes, all your quiz and exam results are saved in your account. You can view detailed reports of past attempts, including question-wise analysis and performance trends over time.'
        },
        {
          q: 'How can I compare my performance with others?',
          a: 'We provide comparative analytics showing how your performance compares to average scores. This helps you understand your standing relative to other students preparing for similar exams.'
        }
      ]
    },
    {
      category: 'Video Content',
      questions: [
        {
          q: 'Can I watch videos offline?',
          a: 'Currently, all video content must be streamed online. We recommend having a stable internet connection for the best viewing experience. Offline viewing feature is under development.'
        },
        {
          q: 'Are video lectures continuously updated?',
          a: 'Yes, our video library is regularly updated with new lectures and revised content. Old videos may be updated or replaced to ensure accuracy and relevance with current exam patterns.'
        },
        {
          q: 'What video quality options are available?',
          a: 'Videos are available in multiple quality options (360p, 480p, 720p, 1080p) allowing you to adjust based on your internet speed. The platform automatically selects the best quality for your connection.'
        }
      ]
    },
    {
      category: 'Account & Support',
      questions: [
        {
          q: 'How do I reset my password?',
          a: 'Click on "Forgot Password" on the login page, enter your registered email, and you will receive a password reset link. Click the link and set a new password.'
        },
        {
          q: 'Can I delete my account?',
          a: 'Yes, you can request account deletion by contacting our support team. Please note that deleted accounts cannot be recovered, and you will lose access to all your progress data.'
        },
        {
          q: 'How do I contact customer support?',
          a: 'You can reach our support team via email at support@exampriorityportal.com or through the contact form on our website. We typically respond within 24 hours.'
        },
        {
          q: 'What should I do if I encounter a technical issue?',
          a: 'First, try refreshing your browser or clearing your cache. If the issue persists, contact our support team with details about the problem, your browser, and device type. Screenshots are helpful too.'
        }
      ]
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  let questionIndex = 0;

  return (
    <div className="faq-container">
      {/* Hero Section */}
      <section className="faq-hero">
        <div className="faq-hero-content">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about our platform and services</p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="faq-content">
        <div className="faq-wrapper">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="faq-category">
              <h2 className="category-title">{category.category}</h2>
              <div className="accordion">
                {category.questions.map((item, itemIndex) => {
                  const globalIndex = questionIndex++;
                  return (
                    <div
                      key={itemIndex}
                      className={`accordion-item ${activeIndex === globalIndex ? 'active' : ''}`}
                    >
                      <button
                        className="accordion-header"
                        onClick={() => toggleAccordion(globalIndex)}
                      >
                        <span className="accordion-title">{item.q}</span>
                        <span className="accordion-icon">
                          {activeIndex === globalIndex ? '−' : '+'}
                        </span>
                      </button>
                      <div className="accordion-body">
                        <div className="accordion-content">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="faq-contact">
        <div className="contact-card">
          <h2>Still have questions?</h2>
          <p>Can't find the answer you're looking for? Please contact our support team.</p>
          <a href="/about" className="contact-button">Contact Us</a>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
