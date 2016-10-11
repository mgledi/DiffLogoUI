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
        case ActionTypes.SELECT_FILES: {
            return Object.assign(
                {},
                state,
                { selection: action.selection }
            );
        }
        default: {
            return state;
        }
    }
};

const ANALYSIS_DEFAULT = {
    name: 'Untitled',
    saved: false,
    processed: false,
    stackHeight: 'none',
    baseDistribution: 'none'
};

const analysis = (state = { list: [], selected: 0 }, action) => {
    switch (action.type) {
        case ActionTypes.ADD_ANALYSIS: {
            const analysisDefault = Object.assign({}, ANALYSIS_DEFAULT);
            const newList = state.list.concat([analysisDefault]);

            return Object.assign(
                {},
                state,
                { list: newList, selected: newList.length - 1 }
            );
        }
        case ActionTypes.DELETE_ANALYSIS: {
            state.list.splice(action.index, 1);

            if (state.list.length === 0) {
                state.list.push(ANALYSIS_DEFAULT);
            }

            return Object.assign(
                {},
                state,
                { list: [].concat(state.list) }
            );
        }
        case ActionTypes.SELECT_ANALYSIS: {
            return Object.assign(
                {},
                state,
                { selected: action.index }
            );
        }
        case ActionTypes.EDIT_ANALYSIS: {
            state.list[action.index] = action.config;
            const list = [].concat(state.list);
            return Object.assign(
                {},
                state,
                { list }
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
    analysis
});
