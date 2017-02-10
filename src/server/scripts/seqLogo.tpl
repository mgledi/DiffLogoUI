source("<%= rsource %>/alphabet.R");
source("<%= rsource %>/preconditions.R");
source("<%= rsource %>/stackHeights.R");
source("<%= rsource %>/baseDistrs.R");
source("<%= rsource %>/utilities.R");
source("<%= rsource %>/seqLogo.R");

motif_folder = "<%= motifFolder %>"
output_folder = "<%= outputFolder %>"

<% files.forEach((file) => { %>
    <% if (file.error === "" && file.seqLogoFile === "") { %>
        currentAlphabet = NULL;
        <% if (file.type === 'alignment' || file.type === 'fasta') { %>
            <% if (file.type === 'alignment') { %>
lines = getSequencesFromAlignmentFile(paste0(motif_folder, "/<%= file.originalname %>"));
            <% } %>
            <% if (file.type === 'fasta') { %>
lines = getSequencesFromFastaFile(paste0(motif_folder, "/<%= file.originalname %>"));       
            <% } %>
chars = unique(strsplit(paste(lines,collapse=""), "")[[1]]);
DNAchars = sort(unique(strsplit(gsub("-","",paste(lines,collapse="")), "")[[1]]));
ASNchars = sort(unique(strsplit(gsub("[BZX-]","",paste(lines,collapse="")), "")[[1]]));
if( length(setdiff(DNAchars, DNA$chars))==0 ) {
    currentAlphabet = DNA;
} else if ( length(setdiff(ASNchars, ASN$chars))==0 ) {
    currentAlphabet = ASN;     
} else if ( length(setdiff(RNAchars, RNA$chars))==0 ) {
    currentAlphabet = RNA;
} else {
    stop("Unsupported alphabet.")
}
pwm = getPwmFromAlignment(lines,alphabet=currentAlphabet,pseudoCount=0);
        <% } else if (file.type === 'pwm' || file.type === 'pfm' || file.type === 'homer' || file.type === 'jaspar') { %>
            <% if (file.type === 'pwm') { %> 
pwm = getPwmFromPwmFile(paste(motif_folder, "/", "<%= file.originalname %>", sep=""));
            <% } %>
            <% if (file.type === 'pfm' || file.type === 'jaspar') { %> 
pwm = getPwmFromPfmOrJasparFile(paste(motif_folder, "/", "<%= file.originalname %>", sep=""));
            <% } %>
            <% if (file.type === 'homer') { %> 
pwm = getPwmFromHomerFile(paste(motif_folder, "/", "<%= file.originalname %>", sep=""));
            <% } %>
if(nrow(pwm) == length(DNA$chars)) {
    currentAlphabet = DNA;
} else if(nrow(pwm) == length(ASN$chars)) {
    currentAlphabet = ASN;
} else {
    stop("The given PWM has an unkown size of rows.")
}
        <% } %>

        <% if (file.orientation === "backward") { %>
# switch orientation if possible
if(currentAlphabet$supportReverseComplement) pwm = rev(pwm);
        <% } %>


png(paste0(output_folder, "/seqLogo_<%= file.originalname %>_<%= file.orientation%>_sparse.png"),width=6,height=3,units="in", res=150); 
par(mar=c(0.3,1.2,0.0,0.1))
seqLogo(pwm,sparse=TRUE,alphabet=currentAlphabet);
dev.off();

png(paste0(output_folder, "/seqLogo_<%= file.originalname %>_<%= file.orientation%>.png"),width=6,height=3,units="in", res=150); 
par(mar=c(4.2,4.2,0.1,1.1))
seqLogo(pwm,sparse=FALSE,alphabet=currentAlphabet);
dev.off();
    
    <% } %>
<% }); %>
