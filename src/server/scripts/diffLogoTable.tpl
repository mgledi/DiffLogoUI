library(cba)
source("<%= rsource %>/alphabet.R");
source("<%= rsource %>/preconditions.R");
source("<%= rsource %>/stackHeights.R");
source("<%= rsource %>/baseDistrs.R");
source("<%= rsource %>/utilities.R");
source("<%= rsource %>/seqLogo.R");
source("<%= rsource %>/diffSeqLogo.R");

motif_folder = "<%= motifFolder %>"
PWMs = list()

<% files.forEach((file) => { %>
    <% if (file.type === 'alignment') { %>
        lines = readLines(file("<%= motifFolder %>/<%= file.originalname %>",open="r"));
        PWMs[["<%= file.motifName %>"]] = getPwmFromAlignment(lines[grep("^[^>]",lines)],alphabet=ASN,pseudoCount=0);
    <% } else if (file.type === 'pwm') { %>
        PWMs[["<%= file.motifName %>"]] = as.matrix(read.delim(paste(motif_folder, "/", "<%= file.originalname %>", sep=""), header=F))
    <% } %>
<% }); %>

motif_names = c(
<% files.forEach((file, index) => { %>
    "<%= file.motifName %>"<%= index < files.length -1 ? ',' : '' %>
<% }); %>
)

pdf("<%= outputFolder %>/all.pdf",width=<%= files.length %>*16/10,height=<%= files.length %>); 
    diffLogoTable(
        PWMs,
        motif_names,
        ratio=16/10
    );
dev.off()
