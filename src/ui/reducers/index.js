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

const files = (state = { list: [], selection: [], timestamp: 0 }, action) => {
    switch (action.type) {
        case ActionTypes.UPDATE_FILES: {
            return Object.assign(
                {},
                state,
                { list: action.files, selection: [], timestamp: new Date().getTime() }
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

const progress = (state = { active: false, message: '' }, action) => {
    switch (action.type) {
        case ActionTypes.PROGRESS_UPLOAD: {
            return Object.assign(
                {},
                state,
                { active: true, message: 'Uploading Files' }
            );
        }
        case ActionTypes.PROGRESS_PROCESS: {
            return Object.assign(
                {},
                state,
                { active: true, message: 'Processing …' }
            );
        }
        case ActionTypes.PROGRESS_STOPPED: {
            return Object.assign(
                {},
                state,
                { active: false, message: '' }
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
    result,
    progress
});
