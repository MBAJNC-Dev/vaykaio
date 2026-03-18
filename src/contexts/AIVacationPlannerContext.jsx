
import React, { createContext, useContext, useReducer } from 'react';
import { ScenarioAwareAIService } from '@/services/ScenarioAwareAIService.js';

const PlannerContext = createContext(null);

const initialState = {
  planData: {
    destination: '',
    trip_type: '',
    dates_raw: '',
    travelers_raw: '',
    budget_level: '',
    interests: '',
    accommodation_type: '',
    transportation_type: '',
    dining_preferences: '',
    special_requests: '',
    stepIndex: 0
  },
  currentScenario: null,
  scenarioDetected: false,
  scenarioDetails: {},
  chatHistory: [
    { 
      role: 'ai', 
      text: "Hello! I'm your AI Vacation Planner. To give you the best experience, what best describes your travel situation?", 
      options: [
        "Large Group/Party (10+ people)", 
        "Family Trip (2-8 people)", 
        "Solo Traveler", 
        "Planning & Organization Tool"
      ] 
    }
  ],
  searchResults: null,
  selectedItems: {
    flights: [],
    accommodations: [],
    activities: [],
    restaurants: [],
    transportation: []
  },
  isGenerating: false
};

function plannerReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_PLAN_DATA':
      return { ...state, planData: { ...state.planData, ...action.payload } };
    case 'SET_SCENARIO':
      return { 
        ...state, 
        currentScenario: action.payload.scenario,
        scenarioDetected: true,
        scenarioDetails: { ...state.scenarioDetails, ...action.payload.details }
      };
    case 'UPDATE_SCENARIO_DETAILS':
      return {
        ...state,
        scenarioDetails: { ...state.scenarioDetails, ...action.payload }
      };
    case 'ADD_MESSAGE':
      return { ...state, chatHistory: [...state.chatHistory, action.payload] };
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    case 'SELECT_ITEM':
      return {
        ...state,
        selectedItems: {
          ...state.selectedItems,
          [action.payload.category]: [...state.selectedItems[action.payload.category], action.payload.item]
        }
      };
    case 'DESELECT_ITEM':
      return {
        ...state,
        selectedItems: {
          ...state.selectedItems,
          [action.payload.category]: state.selectedItems[action.payload.category].filter(i => i.id !== action.payload.itemId)
        }
      };
    case 'RESET_PLAN':
      return initialState;
    default:
      return state;
  }
}

export const AIVacationPlannerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(plannerReducer, initialState);

  const updatePlanData = (data) => dispatch({ type: 'UPDATE_PLAN_DATA', payload: data });
  const setScenario = (scenario, details = {}) => dispatch({ type: 'SET_SCENARIO', payload: { scenario, details } });
  const updateScenarioDetails = (details) => dispatch({ type: 'UPDATE_SCENARIO_DETAILS', payload: details });
  const addMessage = (msg) => dispatch({ type: 'ADD_MESSAGE', payload: msg });
  const setGenerating = (isGen) => dispatch({ type: 'SET_GENERATING', payload: isGen });
  const setSearchResults = (results) => dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
  const selectItem = (category, item) => dispatch({ type: 'SELECT_ITEM', payload: { category, item } });
  const deselectItem = (category, itemId) => dispatch({ type: 'DESELECT_ITEM', payload: { category, itemId } });
  const resetPlan = () => dispatch({ type: 'RESET_PLAN' });

  const getScenarioSpecificFeatures = () => {
    return ScenarioAwareAIService.adaptFeaturesForScenario(state.currentScenario);
  };

  return (
    <PlannerContext.Provider value={{
      state,
      updatePlanData,
      setScenario,
      updateScenarioDetails,
      addMessage,
      setGenerating,
      setSearchResults,
      selectItem,
      deselectItem,
      resetPlan,
      getScenarioSpecificFeatures
    }}>
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) throw new Error('usePlanner must be used within AIVacationPlannerProvider');
  return context;
};
