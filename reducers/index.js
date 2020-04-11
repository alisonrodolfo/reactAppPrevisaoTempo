import {
  ADD_TODO,
  DELETE_TODO,
  TOGGLE_TODO,
  UPDATE_TODO,
  LOAD_CIDADES,
  LOAD_FROM_FIREBASE,
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  LOGIN,
  SIGNUP,
  ERROR
} from '../actions/types.js';

const initialState = {
  cidades: [],
};

const cidadesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TODO:
      return {
        cidades: [action.item, ...state.cidades],
      };
    case TOGGLE_TODO:
      return {
        cidades: state.cidades.map(
          todo =>
            todo.key === action.key ? { ...todo, done: !todo.done } : todo
        ),
      };
    case DELETE_TODO:
      return {
        cidades: state.cidades.filter(todo => todo.key !== action.key),
      };
    case UPDATE_TODO:
      return {
        cidades: state.cidades.map(
          todo => (todo.key === action.item.key ? action.item : todo)
        ),
      };
    case LOAD_CIDADES:
      return {
        cidades: action.cidades,
      };
    case LOAD_FROM_FIREBASE:
      return {
        cidades: action.cidades,
      };
    case LOGIN:
        return { ...state, user: action.payload }
    case SIGNUP:
        return { ...state, user: action.payload }
    case UPDATE_EMAIL:
            return { ...state, email: action.payload }
    case UPDATE_PASSWORD:
      return { ...state, password: action.payload }
    case ERROR:
      return { ...state, error: action.payload }  
    
    default:
      return state;
  }
};

export default cidadesReducer;
