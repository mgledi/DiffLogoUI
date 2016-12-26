import path from 'path';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import validate from '../../../src/server/validation/validateFile';

chai.use(chaiAsPromised);

const { describe, it } = global;
const rootFolder = process.cwd();
const alignmentCorrectPath = path.join(rootFolder, 'test', 'assets', 'allignment_correct.al');
const alignmentErrorFirstLinePath = path.join(rootFolder, 'test', 'assets', 'allignment_error_first_line.al');
const alignmentErrorLastLinePath = path.join(rootFolder, 'test', 'assets', 'allignment_error_last_line.al');

describe('Validate: Alignment', () => {
    it('should have empty error if file is valid', () => {
        const file = {
            type: 'alignment',
            path: alignmentCorrectPath
        };

        return expect(validate(file)).to.eventually.be.empty;
    });

    it('should have specific error if alignments have different length', () => {
        const file = {
            type: 'alignment',
            path: alignmentErrorFirstLinePath
        };

        return expect(validate(file))
            .to.eventually.equal('Error in line 2. All lines in allignment_error_first_line.al must have the same length! Is the file type alignment correct?');
    });

    it('should fail if last alignment has different length', () => {
        const file = {
            type: 'alignment',
            path: alignmentErrorLastLinePath
        };

        return expect(validate(file))
            .to.eventually.equal('Error in line 3. All lines in allignment_error_last_line.al must have the same length! Is the file type alignment correct?');
    });

    it('should ignore scoring');
});
