suppressMessages(library(cba))
source("<%= rsource %>/alphabet.R");
source("<%= rsource %>/preconditions.R");
source("<%= rsource %>/stackHeights.R");
source("<%= rsource %>/baseDistrs.R");
source("<%= rsource %>/utilities.R");
source("<%= rsource %>/seqLogo.R");
source("<%= rsource %>/diffSeqLogoSupport.R");
source("<%= rsource %>/pwmAlignment.R");
source("<%= rsource %>/diffSeqLogo.R");


motif_folder = "<%= motifFolder %>"
output_folder = "<%= outputFolder %>"
PWMs = list()
sampleSizes = list()

alphabet = NULL;
<% files.forEach((file) => { %>
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
PWMs[["<%= file.name %>"]] = getPwmFromAlignment(lines,alphabet=currentAlphabet,pseudoCount=0);
    <% } else if (file.type === 'pwm' || file.type === 'pfm' || file.type === 'homer' || file.type === 'jaspar') { %>
        <% if (file.type === 'pwm') { %> 
PWMs[["<%= file.name %>"]] = getPwmFromPwmFile(paste(motif_folder, "/", "<%= file.originalname %>", sep=""));
        <% } %>
        <% if (file.type === 'pfm' || file.type === 'jaspar') { %> 
PWMs[["<%= file.name %>"]] = getPwmFromPfmOrJasparFile(paste(motif_folder, "/", "<%= file.originalname %>", sep=""));
        <% } %>
        <% if (file.type === 'homer') { %> 
PWMs[["<%= file.name %>"]] = getPwmFromHomerFile(paste(motif_folder, "/", "<%= file.originalname %>", sep=""));
        <% } %>
if(nrow(PWMs[["<%= file.name %>"]]) == length(DNA$chars)) {
    currentAlphabet = DNA;
} else if(nrow(PWMs[["<%= file.name %>"]]) == length(ASN$chars)) {
    currentAlphabet = ASN;
} else {
    stop("The given PWM has an unkown size of rows.")
}
    <% } %>
if( is.null(alphabet)) {
    alphabet = currentAlphabet;
} else if( all(alphabet$chars == currentAlphabet$chars) ) {

} else {
     stop("Detected at least two different alphabets.");
}
    <% if (file.orientation === "backward") { %>
# switch orientation if possible
if(currentAlphabet$supportReverseComplement) PWMs[["<%= file.name %>"]] = rev(PWMs[["<%= file.name %>"]]);
    <% } %>
    sampleSizes[["<%= file.name %>"]] = <%= file.sampleSize %>
<% }); %>


<% if (files.length < 2) { %>
# do nothing
<% } else if (files.length == 2) { %>
    <% if(configuration.enableMotifAlignment) { %>
align_pwms=TRUE;
    <% } else { %>
align_pwms=FALSE;
    <% } %> 
diffLogoObj = createDiffLogoObject(pwm1 = PWMs[[1]], pwm2 = PWMs[[2]], alphabet=alphabet, align_pwms=align_pwms)
    <% if(configuration.enablePvalue) { %>
diffLogoObj = enrichDiffLogoObjectWithPvalues(diffLogoObj, sampleSizes[[1]], sampleSizes[[2]]);
    <% } %>

png(paste0(output_folder, "/", "differenceLogo.png"),width=8,height=4, units="in", res=300); 
    diffLogo(diffLogoObj)
dev.off()

pdf(paste0(output_folder, "/", "differenceLogo.pdf"),width=8,height=4); 
    diffLogo(diffLogoObj)
dev.off()
<% } else { %>

# create configuration
configuration = list();
configuration[['ratio']] = 16/10;

<% if(configuration.enableSequenceLogos) { %>
configuration[['showSequenceLogosTop']] = TRUE;
<% } else { %>
configuration[['showSequenceLogosTop']] = FALSE;
<% } %>

<% if(!configuration.enableClusterTree) { %>
configuration[['treeHeight']] = 0;
<% } %>

<% if(!configuration.enableClustering) { %>
configuration[['enableClustering']] = FALSE;
<% } %>

<% if(!configuration.enableMotifAlignment) { %>
configuration[['align_pwms']] = FALSE
<% } %> 

<% if(configuration.stackHeightMethod === "Shannon-Divergence") { %>
configuration[['stackHeight']] = shannonDivergence;
<% } else if(configuration.stackHeightMethod === "Sum of absolute probabilitiy differences") { %>
configuration[['stackHeight']] = sumOfAbsProbabilityDifferences;
<% } else if(configuration.stackHeightMethod === "Sum of absolute IC differences") { %>
configuration[['stackHeight']] = sumOfAbsICDifferences;
<% } else if(configuration.stackHeightMethod === "Loss of absolute IC differences") { %>
configuration[['stackHeight']] = lossOfAbsICDifferences;
<% } %>

<% if(configuration.symbolHeightMethod === "Normalized difference of probabilities") { %>
configuration[['baseDistribution']] = normalizedDifferenceOfProbabilities;
<% } else if(configuration.symbolHeightMethod === "Difference of ICs") { %>
configuration[['baseDistribution']] = differenceOfICs;
<% } %>
  
diffLogoTableObj = prepareDiffLogoTable(PWMs,alphabet,configuration);

<% if(configuration.enablePvalue) { %>
diffLogoTableObj$diffLogoObjMatrix = enrichDiffLogoTableWithPvalues(diffLogoTableObj$diffLogoObjMatrix, sampleSizes, stackHeight = configuration[['stackHeight']])
<% } %>

png(paste0(output_folder, "/", "diffLogoTable.png"),width=10 * 16/10, height = 10, units="in", res=300);
    drawDiffLogoTable(diffLogoTableObj);
dev.off()

pdf(paste0(output_folder, "/", "diffLogoTable.pdf"),width=10 * 16/10, height = 10);
    drawDiffLogoTable(diffLogoTableObj);
dev.off()

<% } %>