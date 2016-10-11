library(cba)
source("<%= rsource %>/alphabet.R");
source("<%= rsource %>/preconditions.R");
source("<%= rsource %>/stackHeights.R");
source("<%= rsource %>/baseDistrs.R");
source("<%= rsource %>/utilities.R");
source("<%= rsource %>/seqLogo.R");
source("<%= rsource %>/diffSeqLogo.R");

## import PWMs
motif_folder = "<%= motifFolder %>"
motifs = list()

m1 = as.matrix(read.delim(paste(motif_folder, "/", "<%- files[0] %>", sep=""), header=F))
m2 = as.matrix(read.delim(paste(motif_folder, "/", "<%- files[1] %>", sep=""), header=F))

pdf("<%= outputFolder %>/<%- name %>.pdf",width=4,height=6,compress=<%= pdfCompress %>); 
    diffLogoFromPwm(
        m1,
        m2,
        <% if (!_.isUndefined(stackHeight) && stackHeight !== 'none') { %>
            stackHeight=<%= stackHeight %>,
        <% } %>
        <% if (!_.isUndefined(baseDistribution) && baseDistribution !== 'none') { %>
           baseDistribution=<%= baseDistribution  %>
       <% } %>
   )
dev.off()
