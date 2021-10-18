import { csrfFetch } from './csrf';

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const SET_NOTE = 'session/setNote';
const ADD_NOTE = 'session/addNote';
const DEL_NOTE = 'session/delNote';
const EDIT_NOTE = 'session/editNote';
const POPULATE_LIBRARY = 'session/setLibrary';
const COMPILE_NOTES = 'session/setNotes';

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

const setNote = (note) => {
  return {
    type: SET_NOTE,
    payload: note
  };
}

const addNote = (note) => {
  return {
    type: ADD_NOTE,
    payload: note
  }
}

const delNote = (note) => {
  return {
    type: DEL_NOTE,
    payload: note
  }
}

const changeNote = (note) => {
  return {
    type: EDIT_NOTE,
    payload: note
  }
}

const setLibrary = (library) => {
  return {
    type: POPULATE_LIBRARY,
    payload: library
  };
}

const setNotes = (notes) => {
  return {
    type: COMPILE_NOTES,
    payload: notes
  }
}

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const restoreUser = () => async dispatch => {
  const response = await csrfFetch('/api/session');
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const signup = (user) => async (dispatch) => {
  const { username, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });
  dispatch(removeUser());
  return response;
};

// NOTES
export const grabNote = (noteId) => async dispatch => {
  const response = await csrfFetch(`/api/note/${noteId}`);
  const data = await response.json();
  dispatch(setNote(data));
  return response;
};

export const newNote = (note) => async (dispatch) => {
  const {title,content,notebookId} = note;
  const response = await csrfFetch("/api/note", {
    method: "POST",
    body: JSON.stringify({
      title,
      content,
      notebookId
    }),
  });
  const data = await response.json();
  dispatch(addNote(data));
  return response;
};

export const editNote = (note) => async (dispatch) => {
  const {title,content,id} = note;
  const response = await csrfFetch(`/api/note/${id}/edit`, {
    method: "POST",
    body: JSON.stringify({
      title,
      content,
      id
    }),
  });
  const data = await response.json();
  dispatch(changeNote(data));
  return response;
};

export const removeNote = (note) => async (dispatch) => {
  const {id} = note;
  const response = await csrfFetch(`/api/note/${id}/delete`);
  const data = await response.json();
  dispatch(delNote(data));
  return response;
}

export const compileNotes = (user) => async dispatch => {
  const {id} = user;
  const response = await csrfFetch(`/api/users/${id}/notes`);
  console.log('Hello from compileNotes()');
  const data = await response.json();
  dispatch(setNotes(data));
  return response;
};

export const populateLibrary = (user) => async (dispatch) => {
  const {id} = user;
  const response = await csrfFetch(`/api/users/${id}/library`);
  const data = await response.json();
  dispatch(setLibrary(data));
  return response;
}

const initialState = {
  user: null,
  note: {
    id: 0,
    title: 'Welcome',
    content: `*Welcome To EverWiki`
  },
  notes: [],
  library: [],
};

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    case ADD_NOTE:
      newState = Object.assign({}, state);
      newState.notes = [...newState.notes, action.payload]
      return newState;
    case EDIT_NOTE:
      newState = Object.assign({}, state);
      const filteredState = newState.notes.filter(note => note.id !== action.payload.id);
      newState.notes = [...filteredState, action.payload]
      return newState;
    case DEL_NOTE:
      newState = Object.assign({}, state);
      const cleansedState = newState.notes.filter(note => note.id !== action.payload.id);
      newState.notes = [...cleansedState];
      return newState;
    case SET_NOTE:
      newState = Object.assign({}, state);
      newState.note = action.payload;
      return newState;
    case POPULATE_LIBRARY:
      newState = Object.assign({}, state)
      if(newState.library.length) return newState;
      const additionalNotebooks = action.payload.library;
      const newLibrary = [...newState.library, ...additionalNotebooks]
      newState.library = newLibrary;
      return newState;
    case COMPILE_NOTES:
      newState = Object.assign({}, state)
      if(newState.notes.length) return newState;
      const additionalNotes = action.payload.notes;
      const newHeap = [...newState.notes, ...additionalNotes]
      newState.notes = newHeap;
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;
