import { expect } from 'chai';
import { validateAlignment } from '../../../src/server/validation/validateFile';

const { describe, it } = global;

describe('Validate: Alignment', () => {
    it('should pass if file is valid');
    it('should fail if alignments have different length');
    it('should fail if last alignment has different length');
});
