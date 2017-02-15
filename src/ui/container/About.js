import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, CardText } from 'material-ui/Card';

class About extends Component {
    render() {
        return (
            <Card>
                <CardText style={{'height': '300px'}}>
                    <h1>About</h1>
                    <p>
                    Sequence motifs represent characteristic patterns in DNA, RNA, and protein sequences and
                    allow harnessing functional information contained in these sequences. Sequence logos are
                    the de facto standard for the visual representation of sequence motifs.    The volume of
                    sequence motifs from different databases, discovered from data under different experimental
                    conditions, or derived by different computational tools increases rapidly. However, the
                    typically subtle differences of motifs for the same transcription factor but of different
                    origins is not perceptible from traditional sequence logos. Hence, we developed the R package
                    <i>DiffLogo</i> and the webserver <i>WebDiffLogo</i> for the visual comparison of sequence
                    motifs in an efficient, accurate, and reproducible manner.
                    </p>

                    <p>
                    The user starts by uploading the input set of sequence motifs or the input set of sets of
                    aligned sequences in one of several common <a href='https://github.com/mgledi/DiffLogoUI/wiki/Supported-file-formats' target='_blank'>formats</a>.
                    WebDiffLogo converts collections of aligned sequences to sequence motifs automatically, and
                    the user is then allowed to select sequence motifs for the subsequent comparison. It then
                    computes the pairwise or multiple motif alignment by adjusting the relative shifts and
                    relative orientations based on a heuristic algorithm using the UPGMA algorithm and an
                    extension of the sum-of-pairs score from symbols to conditional probability distributions.
                    WebDiffLogo finally compares the aligned motifs in a position-wise manner and visualizes
                    the over- and under-represented symbols as difference logos based on the Bioconductor
                    package <i>DiffLogo</i>. The visualisation of the difference logo of the pairwise motif
                    alignment or a table of difference logos of the multiple motif alignment is shown in the browser
                    window. The output data are kept for 24 hours and can be downloaded by the user as PNG files and
                    publication-ready vector graphics files. The user can also download and adapt the R code that
                    generated the results.
                    </p>
                </CardText>
            </Card>
        );
    }
}

export default connect()(About);
