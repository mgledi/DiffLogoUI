import React from 'react';
import { Card, CardText } from 'material-ui/Card';

const FileFormats = () => (
    <Card>
        <CardText>
            <h1>Supported file formats</h1>

            <h2>Alignment</h2>
                Alignment files are allowed to contain several tab separated columns. The first column must
                contain the sequences representing the motif. These sequences must have equal lengths. The
                length of the first sequence is taken as the reference length and an error is reported when
                an other sequence has a different length. Empty lines are allowed. File extensions indicating
                alignment files are <b>.txt</b>, <b>.text</b>, <b>.alignment</b>, and <b>.al</b>. Example files can
                be found <a href={'https://github.com/mgledi/DiffLogo/tree/master/inst/extdata/alignments.'} target={'_blank'}>here</a>.

            <h2>Fasta</h2>
                See https://en.wikipedia.org/wiki/FASTA for a description of the popular FASTA format. WebDiffLogo
                handles FASTA files very similar to Alignments. The given sequences in the file must all be of the
                same length. The given sequences not be wrapped, i.e. each sequence is on exactly one line. The length
                of the first sequence is taken as the reference length. An error is reported when another sequence has
                a different length. File endings indicating an alignment file are .fa and .fasta. Example files can
                be found <a href={'https://github.com/mgledi/DiffLogo/tree/master/inst/extdata/alignments'} target={'_blank'}>here</a>.

            <h2>Homer</h2>
                The Homer toolbox is designed for the analysis of next-generation sequencing data and the discovery of
                sequence motifs (http://homer.salk.edu/homer/). The Homer toolbox introduces the Homer file format
                (http://homer.salk.edu/homer/ngs/formats.html). The file extension indicating Homer files
                are <b>.motif</b>, <b>.homer</b>, and <b>.hom</b>.
                Examples can be found <a href='{http://homer.salk.edu/homer/motif/HomerMotifDB/homerResults.html}' target={'_blank'}>here</a>.

            <h2>Jaspar</h2>
                The JASPAR database consists of smaller subsets of profiles known as collections. Each of these collections
                have different goals as described below. The main collection is known as JASPAR CORE and contains a curated,
                non-redundant set of TF binding profiles. All profiles are derived from published collections of
                experimentally defined transcription factor binding sites for multi-cellular eukaryotes. The user can
                download a file containing all binding sites of a TF or PFM like Jaspar file. The Jaspar motif format
                is defined here (http://jaspar.genereg.net/html/TEMPLATES/help.html#start-page). The file extension
                indicating Jaspar files are <b>.jaspar</b> and <b>.jas</b>.
                An example can be found <a href={'http://jaspar.genereg.net/html/DOWNLOAD/JASPAR_CORE/pfm/individual/MA0466.1.pfm'} target={'_blank'}>here</a>.

            <h2>PFM</h2>
                A PFM (Position Frequency Matrix) file consists A lines and M tab separated columns, where A denotes the
                number of symbols of the alphabet, M denotes the length of the motif, and the A lines are sorted
                lexicographically. Each value must be an integer value. An error is reported when a number can not be
                parsed or a value is not an integer value. The file extension indicating PFM files is <b>.pfm</b>. Examples can
                be found <a href={'https://github.com/mgledi/DiffLogo/tree/master/inst/extdata/pfm'} target={'_blank'}>here</a>.

            <h2>PWM</h2>
                A PWM file consists A lines and M tab separated columns, where A denotes the number of symbols of the
                alphabet, M denotes the length of the motif, and the A lines are sorted lexicographically. Each column
                must sum up to 1. An error is reported when a number can not be parsed or a column sums not up to one.
                The file extension indicating PWM files is <b>.pwm</b>. Examples can be found <a href={'https://github.com/mgledi/DiffLogo/tree/master/inst/extdata/pwm'} target={'_blank'}>here</a>.

        </CardText>
    </Card>
);

export default FileFormats;
