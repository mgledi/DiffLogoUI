import fetch from 'isomorphic-fetch';

// Files
export const UPDATE_FILES = 'UPDATE_FILES';
export const SELECT_FILES = 'SELECT_FILES';

export const updateFiles = (files) => ({
    type: UPDATE_FILES,
    files
});

export const selectFiles = (selection) => ({
    type: SELECT_FILES,
    selection
});

export const getFiles = () => {
    return (dispatch) => {
        fetch('/files/list', {
            credentials: 'same-origin'
        })
            .then((response) => response.json())
            .then((files) => dispatch(updateFiles(files)));
    };
};

export const uploadFiles = (fileList) => {
    return (dispatch) => {
        const formData = new FormData();
        const length = fileList.length;

        for (let i = 0; i < length; i++) {
            const file = fileList[i];
            formData.append('files', file, file.name);
        }

        fetch('/files', {
            credentials: 'same-origin',
            method: 'POST',
            body: formData
        })
            .then((response) => response.json())
            .then((files) => dispatch(updateFiles(files)));
    };
};

export const deleteFiles = (fileList) => {
    return (dispatch) => {
        fetch('/files', {
            credentials: 'same-origin',
            method: 'DELETE',
            body: JSON.stringify(fileList),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
            .then((response) => response.json())
            .then((files) => dispatch(updateFiles(files)));
    };
};

export const ADD_ANALYSIS = 'ADD_ANALYSIS';
export const DELETE_ANALYSIS = 'DELETE_ANALYSIS';
export const SELECT_ANALYSIS = 'SELECT_ANALYSIS';
export const EDIT_ANALYSIS = 'EDIT_ANALYSIS';

export const addAnalysis = () => ({
    type: ADD_ANALYSIS
});

export const deleteAnalysis = (index) => ({
    type: DELETE_ANALYSIS,
    index
});

export const selectAnalysis = (index) => ({
    type: SELECT_ANALYSIS,
    index
});

export const editAnalysis = (config, index) => ({
    type: EDIT_ANALYSIS,
    config,
    index
});

export const startAnalysis = (config, index) => {
    return (dispatch) => {

        dispatch(editAnalysis(config, index));
        fetch('/process', {
            credentials: 'same-origin',
            method: 'POST',
            body: JSON.stringify(config),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
            .then((response) => response.json())
            .then((result) => {
                result.isProcessing = false;
                dispatch(editAnalysis(result, index));
            });
    };
};

export const SET_OPTIONS = 'SET_OPTIONS';

export const setOptions = (options) => ({
    type: SET_OPTIONS,
    options
});

export const getOptions = () => {
    return (dispatch) => {
        fetch('/options')
            .then((response) => response.json())
            .then((options) => {
                dispatch(setOptions(options));
                dispatch(addAnalysis());
            });
    };
};
