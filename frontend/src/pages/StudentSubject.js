import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './StudentSubject.css';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import QuizComponent from '../components/QuizComponent';
import MaterialSection from '../components/MaterialSection';
import MaterialList from '../components/MaterialList';
import MaterialSidePanel from '../components/MaterialSidePanel';
import VideoList from '../components/VideoList';
import VideoSection from '../components/VideoSection';
import VideoModal from '../components/VideoModal';
import QuizSection from '../components/QuizSection';
import { getHighMediumTopics } from '../services/examService';
import { getStudentProgress, recordQuizAttempt, markTopicComplete } from '../services/progressService';
import { getQuizByTopic } from '../services/quizService';
import { useAuth } from '../context/AuthContext';

const StudentSubject = () => {
  const { subjectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subjectName, setSubjectName] = useState('Subject');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [userAnswered, setUserAnswered] = useState({});

  useEffect(() => {
    loadSubjectData();
  }, [subjectId]);

  const loadSubjectData = async () => {
    try {
      setLoading(true);
      const topicsResponse = await getHighMediumTopics(subjectId);
      const loadedTopics = topicsResponse.data || [];
      setTopics(loadedTopics);
      setSubjectName(loadedTopics[0]?.subject?.name || 'Subject');

      const progressResponse = await getStudentProgress();
      setProgress(progressResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading subject data:', error);
      setLoading(false);
    }
  };

  const handleSelectTopic = async (topicId) => {
    try {
      setSelectedTopic(topicId);
      setShowQuiz(false);
      setTimeout(() => {
        const materialSection = document.querySelector('.subject-main-content');
        if (materialSection) {
          materialSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

      try {
        const quizResponse = await getQuizByTopic(topicId);
        let quizData = quizResponse;
        if (quizResponse && quizResponse.data) {
          quizData = quizResponse.data.data || quizResponse.data;
        }
        setQuiz(quizData);
      } catch (quizError) {
        console.error('No quiz for this topic:', quizError);
        setQuiz(null);
      }
    } catch (error) {
      console.error('Error loading topic:', error);
    }
  };

  const openMaterialPage = (topicId) => {
    navigate(`/materials/${topicId}`);
  };

  const handleMarkComplete = async (topicId) => {
    try {
      const progressEntry = progress?.progress?.find(
        (item) => (item.topic?._id || item.topic) === topicId
      );
      const hasQuizAttempt = (progressEntry?.quizAttempts?.length || 0) > 0;
      if (!hasQuizAttempt) {
        alert('Please complete the quiz at least once before marking this topic as completed.');
        return;
      }
      await markTopicComplete(user?._id || user?.id, topicId);
      const progressResponse = await getStudentProgress();
      setProgress(progressResponse.data);
      alert('Topic marked as completed!');
    } catch (error) {
      console.error('Error marking topic:', error);
    }
  };

  const handleQuizSubmit = async (result) => {
    try {
      await recordQuizAttempt(selectedTopic, {
        score: result.score,
        totalQuestions: result.totalQuestions,
        answers: [],
      });
      const progressResponse = await getStudentProgress();
      setProgress(progressResponse.data);
    } catch (error) {
      console.error('Error recording quiz attempt:', error);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  const completedTopicIds = new Set(
    (progress?.progress || [])
      .filter((item) => item.isCompleted)
      .map((item) => item.topic?._id || item.topic)
  );

  const subjectTotalTopics = topics.length;
  const subjectCompletedTopics = topics.filter((topic) =>
    completedTopicIds.has(topic._id)
  ).length;

  return (
    <div className="dashboard-container subject-dashboard">
      <div className="subject-header">
        <div>
          <h1>{subjectName} Topics</h1>
          <p>Progress and materials for selected subject</p>
        </div>
        <button className="btn-small btn-back" onClick={() => navigate('/student-dashboard')}>
          Back to Dashboard
        </button>
      </div>

      <div className="subject-overview">
        <Card title="Subject Progress" className="subject-overview-card subject-progress-card">
          <ProgressBar completed={subjectCompletedTopics} total={subjectTotalTopics} />
          <p>
            Completed Topics: <strong>{subjectCompletedTopics}</strong> / {subjectTotalTopics}
          </p>
        </Card>

        {topics.length > 0 && (
          <Card title="Topics (High & Medium Priority)" className="subject-overview-card subject-topics-card">
            <div className="topic-list">
              {topics.map((topic) => (
                <div key={topic._id} className="topic-item">
                  <div className="topic-header">
                    <h4>{topic.name}</h4>
                    <span className={`priority-badge ${topic.priority.toLowerCase()}`}>
                      {topic.priority}
                    </span>
                  </div>
                  <div className="topic-buttons">
                    <button
                      className="btn-small btn-view"
                      onClick={() => openMaterialPage(topic._id)}
                    >
                      View Material
                    </button>
                    {completedTopicIds.has(topic._id) ? (
                      <button className="btn-small btn-complete" disabled>
                        Completed
                      </button>
                    ) : (
                      <button
                        className="btn-small btn-complete"
                        onClick={() => handleMarkComplete(topic._id)}
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <div className="subject-main-content">
        {selectedTopic && !showQuiz && (
          <>
            <VideoList
              topicId={selectedTopic}
              onVideoSelect={setSelectedVideo}
              onLoadingChange={setLoading}
            />
            <MaterialList
              topicId={selectedTopic}
              onMaterialSelect={setSelectedMaterial}
              onLoadingChange={setLoading}
            />
            <VideoSection topicId={selectedTopic} onLoadingChange={setLoading} />
            <MaterialSection topicId={selectedTopic} onLoadingChange={setLoading} />
            <QuizSection
              topicId={selectedTopic}
              userAnswered={userAnswered}
              onLoadingChange={setLoading}
            />
            {quiz && (
              <Card title="Take Quiz">
                <p>Review the material and videos above, then test your knowledge!</p>
                <button
                  className="btn-primary-full"
                  onClick={() => navigate(`/quiz/${selectedTopic}`)}
                >
                  Start Quiz
                </button>
              </Card>
            )}
          </>
        )}

        {showQuiz && quiz && (
          <QuizComponent quiz={quiz} onSubmit={handleQuizSubmit} />
        )}
      </div>

      {selectedMaterial && (
        <MaterialSidePanel
          material={selectedMaterial}
          onClose={() => setSelectedMaterial(null)}
        />
      )}

      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
};

export default StudentSubject;
