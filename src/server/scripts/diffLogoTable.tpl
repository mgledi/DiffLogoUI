suppressMessages(library(cba))
source("<%= rsource %>/alphabet.R");
source("<%= rsource %>/preconditions.R");
source("<%= rsource %>/stackHeights.R");
source("<%= rsource %>/baseDistrs.R");
source("<%= rsource %>/utilities.R");
source("<%= rsource %>/seqLogo.R");
source("<%= rsource %>/diffSeqLogoSupport.R");
source("<%= rsource %>/diffSeqLogo.R");

motif_folder = "<%= motifFolder %>"
PWMs = list()

alphabet = NULL;
<% files.forEach((file) => { %>
    <% if (file.type === 'alignment' || file.type === 'fasta') { %>
        con = file("<%= motifFolder %>/<%= file.originalname %>",open="r");
        lines = as.vector(read.delim(con)[,1]);
        lines = lines[grep("^[^>]",lines)]
        chars = unique(strsplit(gsub("-","",paste(lines,collapse="")), "")[[1]]);
        if( length(DNA$chars) == length(chars) && all(sort(DNA$chars) == sort(chars)) ) {
            currentAlphabet = DNA;
        } else if ( length(ASN$chars) == length(chars) && all(sort(ASN$chars) == sort(chars)) ) {
            currentAlphabet = ASN;     
        } else if ( length(RNA$chars) == length(chars) && all(sort(RNA$chars) == sort(chars)) ) {
            currentAlphabet = RNA;
        } else {
            stop("Unsupported alphabet.")
        }
        close(con);
        PWMs[["<%= file.motifName %>"]] = getPwmFromAlignment(lines[grep("^[^>]",lines)],alphabet=currentAlphabet,pseudoCount=0 );
    <% } else if (file.type === 'pwm') { %>

        PWMs[["<%= file.motifName %>"]] = as.matrix(read.delim(paste(motif_folder, "/", "<%= file.originalname %>", sep=""), header=F))
        if(nrow(PWMs[["<%= file.motifName %>"]]) == length(DNA$chars)) {
            currentAlphabet = DNA;
        } else if(nrow(PWMs[["<%= file.motifName %>"]]) == length(ASN$chars)) {
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
<% }); %>

motif_names = c(
<% files.forEach((file, index) => { %>
    "<%= file.motifName %>"<%= index < files.length -1 ? ',' : '' %>
<% }); %>
)

prefix = format(Sys.time(), "%Y%m%d_%H%M%S")
if ( length(PWMs) < 2 ) {
   # do nothing
} else if ( length(PWMs) == 2 ) {
    
    pdf(paste0("<%= outputFolder %>/",prefix,"_differenceLogo.pdf"),width=8,height=4); 

        diffLogoObj = createDiffLogoObject(pwm1 = PWMs[[1]], pwm2 = PWMs[[2]],alphabet=alphabet)
        diffLogo(diffLogoObj)

    dev.off()

} else {
    pdf(paste0("<%= outputFolder %>/",prefix,"_diffLogoTable.pdf"),width=10 * 16/10,height = 10); 
    configuration = list();
    configuration[['ratio']] = 16/10;
    diffLogoTable(
        PWMs,
        motif_names,
        alphabet=alphabet
    );
    dev.off()     
}


