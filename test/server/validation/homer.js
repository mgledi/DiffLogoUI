import path from 'path';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import analyze from '../../../src/server/validation/analyzeFile';

chai.use(chaiAsPromised);

const { describe, it } = global;
const rootFolder = process.cwd();
const homerCorrectPath = path.join(rootFolder, 'test', 'assets', 'homer_correct.homer');

describe('Analyze: Homer', () => {
    it('should have empty error if file is valid', () => {
        const file = {
            type: 'homer',
            path: homerCorrectPath
        };

        return expect(analyze(file)).to.eventually.be.empty;
    });
});
