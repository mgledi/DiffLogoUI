import { expect } from 'chai';
import { files, progress } from '../../../src/ui/reducers';
import * as ActionTypes from '../../../src/ui/actions/types';

const { describe, it } = global;
const undefinedState = void 0;
const randomProgressState = { active: 123, message: {} };

describe('Reducer:', () => {

    describe('Progress Reducer', () => {
        it('should return default state if no action type or state is defined', () => {
            const expected = { active: false, message: '' };
            const actual = progress(undefinedState, {});

            expect(actual).to.deep.equal(expected);
        });

        it('should return given state if no action type is defined', () => {
            const actual = progress(randomProgressState, {});

            expect(actual).to.deep.equal(randomProgressState);
        });

        it('should return correct state if action type is `PROGRESS_UPLOAD`', () => {
            const expected = { active: true, message: 'Uploading Files' };
            const actual = progress(undefinedState, { type: ActionTypes.PROGRESS_UPLOAD });

            expect(actual).to.deep.equal(expected);
        });

        it('should alter to correct state if action type is `PROGRESS_UPLOAD`', () => {
            const expected = { active: true, message: 'Uploading Files' };
            const actual = progress(randomProgressState, { type: ActionTypes.PROGRESS_UPLOAD });

            expect(actual).to.deep.equal(expected);
        });

        it('should return correct state if action type is `PROGRESS_PROCESS`', () => {
            const expected = { active: true, message: 'Processing …' };
            const actual = progress(undefinedState, { type: ActionTypes.PROGRESS_PROCESS });

            expect(actual).to.deep.equal(expected);
        });

        it('should alter to correct state if action type is `PROGRESS_PROCESS`', () => {
            const expected = { active: true, message: 'Processing …' };
            const actual = progress(randomProgressState, { type: ActionTypes.PROGRESS_PROCESS });

            expect(actual).to.deep.equal(expected);
        });

        it('should return correct state if action type is `PROGRESS_EXAMPLES`', () => {
            const expected = { active: true, message: 'Prepare Examples' };
            const actual = progress(undefinedState, { type: ActionTypes.PROGRESS_EXAMPLES });

            expect(actual).to.deep.equal(expected);
        });

        it('should alter to correct state if action type is `PROGRESS_EXAMPLES`', () => {
            const expected = { active: true, message: 'Prepare Examples' };
            const actual = progress(randomProgressState, { type: ActionTypes.PROGRESS_EXAMPLES });

            expect(actual).to.deep.equal(expected);
        });

        it('should return correct state if action type is `PROGRESS_STOPPED`', () => {
            const expected = { active: false, message: '' };
            const actual = progress(undefinedState, { type: ActionTypes.PROGRESS_STOPPED });

            expect(actual).to.deep.equal(expected);
        });

        it('should alter to correct state if action type is `PROGRESS_STOPPED`', () => {
            const expected = { active: false, message: '' };
            const actual = progress(randomProgressState, { type: ActionTypes.PROGRESS_STOPPED });

            expect(actual).to.deep.equal(expected);
        });
    });

    describe('Files Reducer', () => {
        it('should return default state if no action type or state is defined', () => {
            const expected = {
                list: [],
                selection: [],
                results: [],
                timestamp: 0
            };
            const actual = files(undefinedState, {});

            expect(actual).to.deep.equal(expected);
        });

        it('should return correct state if action type is `UPDATE_FILES`', () => {
            const timestamp = new Date().getTime();
            const filesState = {
                files: [1, 2, 3],
                results: [4, 5, 6]
            };
            const actual = files(undefinedState, { type: ActionTypes.UPDATE_FILES, filesState: filesState });

            expect(actual).to.have.property('list').to.equal(filesState.files);
            expect(actual).to.have.property('results').to.equal(filesState.results);
            expect(actual).to.have.property('timestamp').to.be.at.least(timestamp);
        });

    });
});
