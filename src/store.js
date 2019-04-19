import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

import schedulerMiddleware from './js/schedulerMiddleware'
import saveMiddleware from './js/saveMiddleware'

const initialState = {};


const middleware = [thunk, schedulerMiddleware, saveMiddleware];

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
