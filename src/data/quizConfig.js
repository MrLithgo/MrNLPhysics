import { questions as momentumQuestions } from './questions/momentum.js'

export const quizConfigs = {
  momentum: {
    id: 'momentum',
    title: 'Momentum',
    subtitle: 'Quick Quiz',
    questions: momentumQuestions,
    iconId: 'momentum',
    accentColor: 'teal-accent',
    buttonClass: 'teal-btn',
    available: true
  },
  // ... your other quizzes
}

export const getQuizConfig = (quizId) => {
  const config = quizConfigs[quizId]
  return config ? { ...config, icon: getIcon(config.iconId) } : null
}
