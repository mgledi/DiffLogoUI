suppressMessages(library(cba))
source("<%= rsource %>/alphabet.R");
source("<%= rsource %>/preconditions.R");
source("<%= rsource %>/stackHeights.R");
source("<%= rsource %>/baseDistrs.R");
source("<%= rsource %>/utilities.R");
source("<%= rsource %>/seqLogo.R");
source("<%= rsource %>/diffSeqLogoSupport.R");
source("<%= rsource %>/diffSeqLogo.R");

saveToPDF <- function(...) {
    d = dev.copy(pdf,...)
    dev.off(d)
}

saveToPNG <- function(...) {
    d = dev.copy(png,...)
    dev.off(d)
}


motif_folder = "<%= motifFolder %>"
PWMs = list()

alphabet = NULL;
<% files.forEach((file) => { %>
    <% if (file.type === 'alignment' || file.type === 'fasta') { %>
        con = file("<%= motifFolder %>/<%= file.originalname %>",open="r");
        lines = as.vector(read.delim(con)[,1]);
        lines = lines[grep("^[^>]",lines)]
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
        close(con);
        PWMs[["<%= file.name %>"]] = getPwmFromAlignment(lines[grep("^[^>]",lines)],alphabet=currentAlphabet,pseudoCount=0);
    <% } else if (file.type === 'pwm') { %>

        PWMs[["<%= file.name %>"]] = as.matrix(read.delim(paste(motif_folder, "/", "<%= file.originalname %>", sep=""), header=F))
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
<% }); %>

motif_names = c(
<% files.forEach((file, index) => { %>
    "<%= file.name %>"<%= index < files.length -1 ? ',' : '' %>
<% }); %>
)

if ( length(PWMs) < 2 ) {
   # do nothing
} else if ( length(PWMs) == 2 ) {
    png(paste0("<%= outputFolder %>/","differenceLogo.png"),width=8,height=4, units="in", res=150); 

        diffLogoObj = createDiffLogoObject(pwm1 = PWMs[[1]], pwm2 = PWMs[[2]],alphabet=alphabet)
        diffLogo(diffLogoObj)

    dev.off()

} else {
    #pdf(paste0("<%= outputFolder %>/","diffLogoTable.pdf"),width=10 * 16/10,height = 10); 
    png(paste0("<%= outputFolder %>/","diffLogoTable.png"),width=10 * 16/10,height = 10, units="in", res=150); 
    configuration = list();
    configuration[['ratio']] = 16/10;
    diffLogoTable(
        PWMs,
        motif_names,
        alphabet=alphabet
    );
    dev.off()      
}


