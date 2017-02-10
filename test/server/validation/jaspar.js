import path from 'path';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import validate from '../../../src/server/validation/validateFile';

chai.use(chaiAsPromised);

const { describe, it } = global;
const rootFolder = process.cwd();
const jasparCorrectPath = path.join(rootFolder, 'test', 'assets', 'jaspar_correct.jaspar');
const jasparNumberParserErrorPath = path.join(rootFolder, 'test', 'assets', 'jaspar_number_parse_error.jaspar');
const jasparColumnsDifferErrorPath = path.join(rootFolder, 'test', 'assets', 'jaspar_2nd_row_count_error.jaspar');

describe('Validate: Jaspar', () => {
    it('should have empty error if file is valid', () => {
        const file = {
            type: 'jaspar',
            path: jasparCorrectPath
        };

        return expect(validate(file)).to.eventually.be.empty;
    });

    it('should have specific error if a number can not be parsed', () => {
        const file = {
            type: 'jaspar',
            path: jasparNumberParserErrorPath
        };

        return expect(validate(file))
            .to.eventually.equal('Element 2 (o) in line 4 is not a valid number. Is the file type jaspar correct?');
    });

    it('should have specific error if a two lines have a different number of columns', () => {
        const file = {
            type: 'jaspar',
            path: jasparColumnsDifferErrorPath
        };

        return expect(validate(file))
            .to.eventually.equal('Error in line 3. Expected 11 columns, but saw 10. Is the file type jaspar correct?');
    });
});
