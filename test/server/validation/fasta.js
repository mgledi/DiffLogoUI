import path from 'path';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import validate from '../../../src/server/validation/validateFile';

chai.use(chaiAsPromised);

const { describe, it } = global;
const rootFolder = process.cwd();
const fastaCorrectPath = path.join(rootFolder, 'test', 'assets', 'fasta_correct.fasta');
const fastaErrorFirstLinePath = path.join(rootFolder, 'test', 'assets', 'fasta_error_first_line.fasta');
const fastaErrorLastLinePath = path.join(rootFolder, 'test', 'assets', 'fasta_error_last_line.fasta');

describe('Validate: Fasta', () => {
    it('should have empty error if file is valid', () => {
        const file = {
            type: 'fasta',
            path: fastaCorrectPath
        };

        return expect(validate(file)).to.eventually.be.empty;
    });

    it('should have specific error if alignments have different length', () => {
        const file = {
            type: 'fasta',
            path: fastaErrorFirstLinePath
        };

        return expect(validate(file))
            .to.eventually.equal('Error in line 6. All lines in fasta_error_first_line.fasta must have the same length! Is the file type fasta correct?');
    });

    it('should fail if last line has different length', () => {
        const file = {
            type: 'fasta',
            path: fastaErrorLastLinePath
        };

        return expect(validate(file))
            .to.eventually.equal('Error in line 11. All lines in fasta_error_last_line.fasta must have the same length! Is the file type fasta correct?');
    });

    it.skip('should ignore scoring');
});
