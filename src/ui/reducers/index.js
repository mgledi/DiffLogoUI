import { combineReducers } from 'redux';
import * as ActionTypes from '../actions';

const options = (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.SET_OPTIONS: {
            return Object.assign(
                {},
                state,
                action.options
            );
        }
        default: {
            return state;
        }
    }
};

const files = (state = { list: [], selection: [] }, action) => {
    switch (action.type) {
        case ActionTypes.UPDATE_FILES: {
            return Object.assign(
                {},
                state,
                { list: action.files, selection: [] }
            );
        }
        default: {
            return state;
        }
    }
};

const result = (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.PUBLISH_RESULT: {
            return Object.assign(
                {},
                state,
                action.result
            );
        }
        default: {
            return state;
        }
    }
};

export default combineReducers({
    options,
    files,
    result
});
