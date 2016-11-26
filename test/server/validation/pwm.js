import path from 'path';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import validate from '../../../src/server/validation/validateFile';

chai.use(chaiAsPromised);

const { describe, it } = global;
const rootFolder = process.cwd();
const pwmCorrectPath = path.join(rootFolder, 'test', 'assets', 'pwm_correct.al');
const pwmSumErrorPath = path.join(rootFolder, 'test', 'assets', 'pwm_sum_error.al');
const pwmErrorFirstLinePath = path.join(rootFolder, 'test', 'assets', 'pwm_error_first_line.al');
const pwmErrorLastLinePath = path.join(rootFolder, 'test', 'assets', 'pwm_error_last_line.al');
const pwmNanErrorPath = path.join(rootFolder, 'test', 'assets', 'pwm_nan_error.al');

describe('Validate: PWM', () => {
    it('should have empty error if file is valid', () => {
        const file = {
            type: 'pwm',
            path: pwmCorrectPath
        };

        return expect(validate(file)).to.eventually.be.empty;
    });

    it('should throw a sum error if column does not sum up to 1', () => {
        const file = {
            type: 'pwm',
            path: pwmSumErrorPath
        };

        return expect(validate(file))
            .to.eventually.equal('Elements in column 3 sum not to 1.0 (1.5)');
    });

    it('should have specific error if line have different length', () => {
        const file = {
            type: 'pwm',
            path: pwmErrorFirstLinePath
        };

        return expect(validate(file))
            .to.eventually.equal('Error in line 2. All lines in pwm_error_first_line.al must have the same length!');
    });

    it('should fail if last line has different length', () => {
        const file = {
            type: 'pwm',
            path: pwmErrorLastLinePath
        };

        return expect(validate(file))
            .to.eventually.equal('Error in line 4. All lines in pwm_error_last_line.al must have the same length!');
    });

    it('should throw error if value in line not a number', () => {
        const file = {
            type: 'pwm',
            path: pwmNanErrorPath
        };

        return expect(validate(file))
            .to.eventually.equal('Element 4 in line 3 is not a valid number.');
    });
});
