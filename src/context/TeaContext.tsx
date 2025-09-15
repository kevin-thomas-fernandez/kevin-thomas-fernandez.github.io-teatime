import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { TeaNote, WeeklyQuiz } from '../types';
import { useAuth } from './AuthContext';

interface TeaState {
  teaNotes: TeaNote[];
  weeklyQuizzes: WeeklyQuiz[];
}

type TeaAction =
  | { type: 'ADD_TEA_NOTE'; payload: TeaNote }
  | { type: 'UPDATE_TEA_NOTE'; payload: TeaNote }
  | { type: 'DELETE_TEA_NOTE'; payload: string }
  | { type: 'ADD_QUIZ'; payload: WeeklyQuiz }
  | { type: 'UPDATE_QUIZ'; payload: WeeklyQuiz };

// Load initial state from localStorage - shared between all users
const loadInitialState = (): TeaState => {
  try {
    const savedTeaNotes = localStorage.getItem('shared-tea-notes');
    const savedQuizzes = localStorage.getItem('shared-tea-quizzes');
    
    return {
      teaNotes: savedTeaNotes ? JSON.parse(savedTeaNotes).map((note: any) => ({
        ...note,
        timestamp: new Date(note.timestamp),
        reminderTime: note.reminderTime ? new Date(note.reminderTime) : undefined
      })) : [],
      weeklyQuizzes: savedQuizzes ? JSON.parse(savedQuizzes).map((quiz: any) => ({
        ...quiz,
        weekStart: new Date(quiz.weekStart)
      })) : []
    };
  } catch (error) {
    console.error('Error loading tea data from localStorage:', error);
    return {
      teaNotes: [],
      weeklyQuizzes: []
    };
  }
};

const initialState: TeaState = loadInitialState();

function teaReducer(state: TeaState, action: TeaAction): TeaState {
  switch (action.type) {
    case 'ADD_TEA_NOTE':
      return {
        ...state,
        teaNotes: [...state.teaNotes, action.payload]
      };
    case 'UPDATE_TEA_NOTE':
      return {
        ...state,
        teaNotes: state.teaNotes.map(note =>
          note.id === action.payload.id ? action.payload : note
        )
      };
    case 'DELETE_TEA_NOTE':
      return {
        ...state,
        teaNotes: state.teaNotes.filter(note => note.id !== action.payload)
      };
    case 'ADD_QUIZ':
      return {
        ...state,
        weeklyQuizzes: [...state.weeklyQuizzes, action.payload]
      };
    case 'UPDATE_QUIZ':
      return {
        ...state,
        weeklyQuizzes: state.weeklyQuizzes.map(quiz =>
          quiz.id === action.payload.id ? action.payload : quiz
        )
      };
    default:
      return state;
  }
}

const TeaContext = createContext<{
  state: TeaState;
  dispatch: React.Dispatch<TeaAction>;
  currentUser: 'gf' | 'bf';
} | null>(null);

export function TeaProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(teaReducer, initialState);
  const { state: authState } = useAuth();

  const currentUser = authState.user?.role || 'gf';

  // Save to localStorage whenever state changes - shared between all users
  useEffect(() => {
    try {
      localStorage.setItem('shared-tea-notes', JSON.stringify(state.teaNotes));
      localStorage.setItem('shared-tea-quizzes', JSON.stringify(state.weeklyQuizzes));
    } catch (error) {
      console.error('Error saving tea data to localStorage:', error);
    }
  }, [state.teaNotes, state.weeklyQuizzes]);

  return (
    <TeaContext.Provider value={{ state, dispatch, currentUser }}>
      {children}
    </TeaContext.Provider>
  );
}

export function useTea() {
  const context = useContext(TeaContext);
  if (!context) {
    throw new Error('useTea must be used within a TeaProvider');
  }
  return context;
}
