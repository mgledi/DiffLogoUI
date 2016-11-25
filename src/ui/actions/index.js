import fetch from 'isomorphic-fetch';

export const PROGRESS_UPLOAD = 'PROGRESS_UPLOAD';
export const PROGRESS_PROCESS = 'PROGRESS_PROCESS';
export const PROGRESS_STOPPED = 'PROGRESS_STOPPED';

export const progressUpload = () => ({ type: PROGRESS_UPLOAD });
export const progressProcess = () => ({ type: PROGRESS_PROCESS });
export const progressStopped = () => ({ type: PROGRESS_STOPPED });

// Files
export const UPDATE_FILES = 'UPDATE_FILES';

export const updateFiles = (filesState) => ({
    type: UPDATE_FILES,
    filesState
});

export const getFiles = () => {
    return (dispatch) => {
        fetch('/files/list', {
            credentials: 'same-origin'
        })
            .then((response) => response.json())
            .then((filesState) => dispatch(updateFiles(filesState)));
    };
};

export const renameFile = (files, name, index) => {
    files[index].name = name;

    return (dispatch) => {
        fetch('/files', {
            credentials: 'same-origin',
            method: 'PUT',
            body: JSON.stringify(files),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
            .then((response) => response.json())
            .then((state) => dispatch(updateFiles(state)));
    };
};

export const uploadFiles = (fileList) => {
    return (dispatch) => {
        const formData = new FormData();
        const length = fileList.length;

        dispatch(progressUpload());

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
            .then((state) => {
                dispatch(progressStopped());
                dispatch(updateFiles(state));
                generateSequenceLogos(dispatch);
            });
    };
};

const generateSequenceLogos = (dispatch) => {
    fetch('/seqLogo', {
            credentials: 'same-origin',
            method: 'GET'
        })
            .then((response) => response.json())
            .then((state) => dispatch(updateFiles(state)));
}
export const deleteFiles = (selection) => {
    return (dispatch) => {
        fetch('/files', {
            credentials: 'same-origin',
            method: 'DELETE',
            body: JSON.stringify(selection),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
            .then((response) => response.json())
            .then((state) => dispatch(updateFiles(state)));
    };
};

export const PUBLISH_RESULT = 'PUBLISH_RESULT';

export const publishResult = (result) => ({
    type: PUBLISH_RESULT,
    result
});

export const startAnalysis = (config) => {
    return (dispatch) => {

        dispatch(progressProcess());
        fetch('/diffLogo', {
            credentials: 'same-origin',
            method: 'POST',
            body: JSON.stringify(config),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
            .then((response) => response.json())
            .then((result) => {
                dispatch(progressStopped());
                dispatch(publishResult(result));
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
            .then((options) => dispatch(setOptions(options)));
    };
};
