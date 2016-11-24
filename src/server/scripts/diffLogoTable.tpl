suppressMessages(library(cba))
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
    <% if (file.type === 'alignment' || file.type === 'fasta') { %>
        con = file("<%= motifFolder %>/<%= file.originalname %>",open="r");
        lines = readLines(con);
        close(con);
        PWMs[["<%= file.motifName %>"]] = getPwmFromAlignment(lines[grep("^[^>]",lines)],alphabet=ASN,pseudoCount=0.0001);
    <% } else if (file.type === 'pwm') { %>
        PWMs[["<%= file.motifName %>"]] = as.matrix(read.delim(paste(motif_folder, "/", "<%= file.originalname %>", sep=""), header=F))
    <% } %>
<% }); %>

motif_names = c(
<% files.forEach((file, index) => { %>
    "<%= file.motifName %>"<%= index < files.length -1 ? ',' : '' %>
<% }); %>
)

prefix = format(Sys.time(), "%Y%M%d_%H%m%S")
if ( length(PWMs) < 2 ) {
   # do nothing
} else if ( length(PWMs) == 2 ) {
    
    pdf(paste0("<%= outputFolder %>/",prefix,"_differenceLogo.pdf"),width=8,height=4); 

        diffLogoObj = createDiffLogoObject(pwm1 = PWMs[[1]], pwm2 = PWMs[[2]],alphabet=ASN)
        diffLogo(diffLogoObj)

    dev.off()

} else {
    pdf(paste0("<%= outputFolder %>/",prefix,"_diffLogoTable.pdf"),width=10 * 16/10,height = 10); 
    configuration = list();
    configuration[['ratio']] = 16/10;
    diffLogoTable(
        PWMs,
        motif_names,
        alphabet=ASN
    );
    dev.off()     
}


