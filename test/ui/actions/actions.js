import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import * as actions from '../../../src/ui/actions';
import * as types from '../../../src/ui/actions/types';
import fetchMock from 'fetch-mock';

const { describe, it, afterEach, beforeEach } = global;
const mockStore = configureMockStore([thunk]);

function getFiles() {
    return [
        {
            type: 'PWM',
            validated: true,
            seqLogoFile: 'seqLogo',
            error: ''
        },
        {
            type: 'PFM',
            validated: true,
            seqLogoFile: 'seqLogo',
            error: 'Error'
        }
    ];
}

describe('Actions:', () => {
    describe('Progress:', () => {
        it('should create an action to start an upload progress', () => {
            const expected = {
                type: types.PROGRESS_UPLOAD
            };
            const actual = actions.progressUpload();

            expect(actual).to.be.deep.equal(expected);
        });

        it('should create an action to start an process progress', () => {
            const expected = {
                type: types.PROGRESS_PROCESS
            };
            const actual = actions.progressProcess();

            expect(actual).to.be.deep.equal(expected);
        });

        it('should create an action to stopp progress', () => {
            const expected = {
                type: types.PROGRESS_STOPPED
            };
            const actual = actions.progressStopped();

            expect(actual).to.be.deep.equal(expected);
        });
    });

    describe('Seq Logo', () => {
        beforeEach(() => fetchMock.get('/seqLogo', {}));

        afterEach(() => fetchMock.restore());

        it('should call correct URL', () => {
            const store = mockStore({ files: {} });

            actions.generateSeqLogos(store.dispatch);
            expect(fetchMock.called()).to.equal(true);
        });

        it('should create an action to update files', (done) => {
            const store = mockStore({ files: {} });
            const expected = {
                type: types.UPDATE_FILES,
                filesState: {}
            };
            const unsubscribe = store.subscribe(() => {
                const actual = store.getActions();

                expect(actual[0]).to.be.deep.equal(expected);
                unsubscribe();
                done();
            });

            actions.generateSeqLogos(store.dispatch);
        });
    });

    describe('Files List', () => {
        beforeEach(() => fetchMock.get('/files/list', {}));

        afterEach(() => fetchMock.restore());

        it('should call correct URL', () => {
            const store = mockStore({ files: {} });
            store.dispatch(actions.getFiles());

            expect(fetchMock.called()).to.equal(true);
        });

        it('should create an action to update files', (done) => {
            const store = mockStore({ files: {} });
            const expected = {
                type: types.UPDATE_FILES,
                filesState: {}
            };
            const unsubscribe = store.subscribe(() => {
                const actual = store.getActions();

                expect(actual[0]).to.be.deep.equal(expected);
                unsubscribe();
                done();
            });

            store.dispatch(actions.getFiles());
        });
    });

    describe('Change File Type', () => {
        beforeEach(() => {
            fetchMock
                .put('/files', {})
                .get('/seqLogo', {});
        });

        afterEach(() => fetchMock.restore());

        it('should call correct URL', () => {
            const store = mockStore({ files: {} });
            store.dispatch(actions.changeFileType(getFiles(), 'PFM', 0));

            expect(fetchMock.called('/files')).to.equal(true);
        });

        it('should send JSON body with correct values', (done) => {
            const store = mockStore({ files: {} });
            const expected = {
                type: 'PWM',
                validated: false,
                seqLogoFile: '',
                error: ''
            };
            const unsubscribe = store.subscribe(() => {
                const call = fetchMock.lastCall('/files')[1];
                const callBody = JSON.parse(call.body);
                const actual = callBody[1];

                expect(callBody).to.have.lengthOf(2);
                expect(actual).to.deep.equal(expected);
                unsubscribe();
                done();
            });

            store.dispatch(actions.changeFileType(getFiles(), 'PWM', 1));
        });

        it('should create an action to update files', (done) => {
            const store = mockStore({ files: {} });
            const expected = {
                type: types.UPDATE_FILES,
                filesState: {}
            };
            const unsubscribe = store.subscribe(() => {
                const actual = store.getActions();

                expect(actual[0]).to.be.deep.equal(expected);
                unsubscribe();
                done();
            });

            store.dispatch(actions.changeFileType(getFiles(), 'PWM', 0));
        });

        it('should generate new seq logo', (done) => {
            const store = mockStore({ files: {} });

            store.dispatch(actions.changeFileType(getFiles(), 'PWM', 0));

            setTimeout(() => {
                expect(fetchMock.called('/seqLogo')).to.equal(true);
                done();
            }, 0);
        });
    });

    describe('Rename File', () => {
        beforeEach(() => fetchMock.put('/files', {}));

        afterEach(() => fetchMock.restore());

        it('should call correct URL', () => {
            const store = mockStore({ files: {} });
            store.dispatch(actions.renameFile(getFiles(), 'test', 0));

            expect(fetchMock.called('/files')).to.equal(true);
        });

        it('should send JSON body with correct values', (done) => {
            const store = mockStore({ files: {} });
            const expected = {
                name: 'TEST',
                type: 'PFM',
                validated: true,
                seqLogoFile: 'seqLogo',
                error: 'Error'
            };
            const unsubscribe = store.subscribe(() => {
                const call = fetchMock.lastCall('/files')[1];
                const callBody = JSON.parse(call.body);
                const actual = callBody[1];

                expect(callBody).to.have.lengthOf(2);
                expect(actual).to.deep.equal(expected);
                unsubscribe();
                done();
            });

            store.dispatch(actions.renameFile(getFiles(), 'TEST', 1));
        });

        it('should create an action to update files', (done) => {
            const store = mockStore({ files: {} });
            const expected = {
                type: types.UPDATE_FILES,
                filesState: {}
            };
            const unsubscribe = store.subscribe(() => {
                const actual = store.getActions();

                expect(actual[0]).to.be.deep.equal(expected);
                unsubscribe();
                done();
            });

            store.dispatch(actions.renameFile(getFiles(), 'TEST', 0));
        });
    });

});
