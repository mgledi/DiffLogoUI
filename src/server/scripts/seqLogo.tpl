source("<%= rsource %>/alphabet.R");
source("<%= rsource %>/preconditions.R");
source("<%= rsource %>/stackHeights.R");
source("<%= rsource %>/baseDistrs.R");
source("<%= rsource %>/utilities.R");
source("<%= rsource %>/seqLogo.R");

motif_folder = "<%= motifFolder %>"

<% files.forEach((file) => { %>
    <% if (file.error === "" && file.seqLogoFile === "") { %>
        currentAlphabet = NULL;
        <% if (file.type === 'alignment' || file.type === 'fasta') { %>
            con = file("<%= motifFolder %>/<%= file.originalname %>",open="r");
            lines = as.vector(read.delim(con)[,1]);
            lines = lines[grep("^[^>]",lines)]
            lines = toupper(lines);
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
            pwm = getPwmFromAlignment(lines[grep("^[^>]",lines)],alphabet=currentAlphabet,pseudoCount=0);
        <% } else if (file.type === 'pwm' || file.type === 'pfm') { %>

            pwm = as.matrix(read.delim(paste(motif_folder, "/", "<%= file.originalname %>", sep=""), header=F))
            pwm = pwm / apply(pwm,2,sum); # normalize pwm
            if(nrow(pwm) == length(DNA$chars)) {
                currentAlphabet = DNA;
            } else if(nrow(pwm) == length(ASN$chars)) {
                currentAlphabet = ASN;
            } else {
                stop("The given PWM has an unkown size of rows.")
            }
        <% } %>

            png("<%= outputFolder %>/seqLogo_<%= file.originalname %>.png",width=400,height=200); 
            par(mar=c(0.3,1.2,0.0,0.1))
            seqLogo(pwm,sparse=TRUE,alphabet=currentAlphabet);
            dev.off();
    <% } %>
<% }); %>
