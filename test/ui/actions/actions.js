import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import * as actions from '../../../src/ui/actions';
import * as types from '../../../src/ui/actions/types';
import fetchMock from 'fetch-mock';

const { describe, it, afterEach, beforeEach } = global;
const mockStore = configureMockStore([thunk]);
const expectedJsonHeader = new Headers({
    'Content-Type': 'application/json'
});

function getFiles() {
    return [
        {
            type: 'PWM',
            analyzed: true,
            seqLogoFile: 'seqLogo',
            error: ''
        },
        {
            type: 'PFM',
            analyzed: true,
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

        it('should create an action to start an examples progress', () => {
            const expected = {
                type: types.PROGRESS_EXAMPLES
            };
            const actual = actions.progressExamples();

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
                analyzed: false,
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
                analyzed: true,
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

        it('should have correct request header', (done) => {
            const store = mockStore({ file: {} });

            const unsubscribe = store.subscribe(() => {
                const call = fetchMock.lastCall('/files')[1];
                const actual = call.headers;

                expect(actual).to.be.deep.equal(expectedJsonHeader);
                unsubscribe();
                done();
            });

            store.dispatch(actions.renameFile(getFiles(), '', 0));
        });
    });

    describe('Update Results', () => {
        beforeEach(() => fetchMock.put('/results', {}));

        afterEach(() => fetchMock.restore());

        it('should call correct URL', () => {
            const store = mockStore({ files: {} });
            store.dispatch(actions.updateResults({}));

            expect(fetchMock.called('/results')).to.equal(true);
        });

        it('should send JSON body with correct values', (done) => {
            const store = mockStore({ files: {} });
            const expected = {
                test: 'TEST'
            };
            const unsubscribe = store.subscribe(() => {
                const call = fetchMock.lastCall('/results')[1];
                const callBody = JSON.parse(call.body);
                const actual = callBody;

                expect(actual).to.deep.equal(expected);
                unsubscribe();
                done();
            });

            store.dispatch(actions.updateResults({ test: 'TEST' }));
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

            store.dispatch(actions.updateResults({}));
        });

        it('should have correct request header', (done) => {
            const store = mockStore({ file: {} });

            const unsubscribe = store.subscribe(() => {
                const call = fetchMock.lastCall('/results')[1];
                const actual = call.headers;

                expect(actual).to.be.deep.equal(expectedJsonHeader);
                unsubscribe();
                done();
            });

            store.dispatch(actions.updateResults({}));
        });
    });

    describe('Copy Examples', () => {
        beforeEach(() => {
            fetchMock
                .post('/files/example', {})
                .get('/seqLogo', {});
        });

        afterEach(() => fetchMock.restore());

        it('should call correct url', () => {
            const store = mockStore({ files: {} });
            store.dispatch(actions.copyExampleFilesToSession());

            expect(fetchMock.called('/files/example')).to.equal(true);
        });

        it('should create actions to start/stop progress', (done) => {
            const store = mockStore({ files: {} });
            const exampleProgress = {
                type: types.PROGRESS_EXAMPLES
            };
            const stopProgress = {
                type: types.PROGRESS_STOPPED
            };
            let callCount = 0;
            const unsubscribe = store.subscribe(() => {
                callCount++;

                if (callCount === 2) {
                    const actualActions = store.getActions();

                    expect(actualActions[0]).to.be.deep.equal(exampleProgress);
                    expect(actualActions[1]).to.be.deep.equal(stopProgress);
                    unsubscribe();
                    done();
                }

            });

            store.dispatch(actions.copyExampleFilesToSession());
        });

        it('should create an action to update files', (done) => {
            const store = mockStore({ files: {} });
            const expected = {
                type: types.UPDATE_FILES,
                filesState: {}
            };
            let callCount = 0;
            const unsubscribe = store.subscribe(() => {
                callCount++;

                if (callCount === 3) {
                    const actualActions = store.getActions();

                    expect(actualActions[2]).to.be.deep.equal(expected);
                    unsubscribe();
                    done();
                }

            });

            store.dispatch(actions.copyExampleFilesToSession());
        });

        it('should generate seq logos', (done) => {
            const store = mockStore({ files: {} });

            store.dispatch(actions.copyExampleFilesToSession());

            setTimeout(() => {
                expect(fetchMock.called('/seqLogo')).to.equal(true);
                done();
            }, 0);
        });
    });
});
