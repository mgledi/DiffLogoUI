import path from 'path';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import validate from '../../../src/server/validation/validateFile';

chai.use(chaiAsPromised);

const { describe, it } = global;
const rootFolder = process.cwd();
const homerCorrectPath = path.join(rootFolder, 'test', 'assets', 'homer_correct.homer');

describe('Validate: Homer', () => {
    it('should have empty error if file is valid', () => {
        const file = {
            type: 'homer',
            path: homerCorrectPath
        };

        return expect(validate(file)).to.eventually.be.empty;
    });
});
