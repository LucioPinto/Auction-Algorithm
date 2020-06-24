var rows;
var columns;
var flagMin = false;

function random () { 
    N = rows-1;   
    let position = 1;
    let id = "";
    id = "pos"+position;
    for(let i = 0; i < N; i++){
        for(let j = 0; j < N; j++){            
            id = "pos"+position;
            document.getElementById(id).value = Math.floor(Math.random() * 10) + 1;
            position++;            
        }
    }
}

function minimize() {
    flagMin = true;
    main();
}

function createTable (){
    rows = parseInt(document.getElementById("inputPeople").value) + 1;
    columns = parseInt(document.getElementById("inputObjects").value) + 1;

    if (rows == columns){
        document.getElementById("inputDivParagraph").style.display = 'block';
        document.getElementById("inputDivInput").style.display = 'block';

        var table = document.getElementById("table");
        var row = table.insertRow();
        var cell;
        let position = 1;

        cell = row.insertCell(0);
        cell.innerHTML = "---";
        for (let i = 1; i < columns; i++){
            cell  = row.insertCell(i);
            cell.innerHTML = "Objeto " + i;
        } 
        
        row = table.insertRow();

        for (let i = 1; i < rows; i++){
            cell = row.insertCell(0);
            cell.innerHTML = "Pessoa " + i;
            for (let i = 1; i < columns; i++){
                cell  = row.insertCell(i);
                cell.innerHTML = '<input type="number" id="pos'+position+'">';
                position++;
            }
            row = table.insertRow();
        }       
        
        document.getElementById("table").style.display = 'block';
        document.getElementById("maxBt").style.display = 'block';
        document.getElementById("minBt").style.display = 'block';
        document.getElementById("randomBt").style.display = 'block';
    }else{
        alert("Número de Pessoas deve ser igual ao Número de Objetos.");
    }
}

//Algoritmo de Leilão
var N;

function valorReal(i, j, a, p) {
    return a[i][j] - p[j];
}


function melhorObjeto(pessoa, a, p) {

    let melhor = 0;
    let valor_real = a[pessoa][melhor] - p[melhor];

    for (let j = 1; j < N; j++) {
        if (a[pessoa][j] - p[j] > valor_real) {
            valor_real = valorReal(pessoa, j, a, p);
            melhor = j;
        }
    }
    return melhor;
}


function segundoMelhorObjeto(pessoa, melhorObjeto, a, p)
{
    let segundoMelhor = 0;

    while (segundoMelhor == melhorObjeto) {
        segundoMelhor++;
    }

    let valor_real = a[pessoa][segundoMelhor] - p[segundoMelhor];

    for (let j = 1; j < N; j++) {
        if (a[pessoa][j] - p[j] > valor_real && j != melhorObjeto) {
            valor_real = valorReal(pessoa, j, a, p);
            segundoMelhor = j;
        }
    }
    return segundoMelhor;
}


function getPessoaAlocada(objeto, alocacao) {
    for (let i = 0; i < N; i++) {
        if (alocacao[i] == objeto) {
            return i;
        }
    }
    return -1;
}


function existemPessoasNaoAtribuiaos(alocacao) {
    for (let i = 0; i < N; i++) {
        if (alocacao[i] == -1) {
            return true;
        }
    }
    return false;
}


async function main()
{
    N = rows-1;    
    
    if (parseFloat(document.getElementById("inputDivInput").value)){
        var paragraph = "";
        let E = parseFloat(document.getElementById("inputDivInput").value);
        // Matriz de Interesse a[nxn] (linha = agente | coluna = região de interesse    
        let a = new Array(N);
        for(let i = 0; i < N; i++){
            a[i] = new Array(N);
        }

        let position = 1;
        let id = "";
        id = "pos"+position;
        for(let i = 0; i < N; i++){
            for(let j = 0; j < N; j++){
                if(flagMin){
                    id = "pos"+position;
                    a[i][j] = -parseFloat(document.getElementById(id).value);
                    position++;
                }else {
                    id = "pos"+position;
                    a[i][j] = parseFloat(document.getElementById(id).value);
                    position++;
                }
            }
        }    

        paragraph = paragraph + '<br>';
        paragraph = paragraph + "Matriz de interesse: " + '<br>';
        
        for(let i = 0; i < N; i++){
            paragraph = paragraph + " | ";
            for(let j = 0; j < N; j++){
                paragraph = paragraph + a[i][j] + " | ";                
            }
            paragraph = paragraph + '<br>';
        }  

        paragraph = paragraph + '<br>';
        
        // Vetor de preços p[n]. (inicializa com 0 em todas as posições)    
        let p = new Array(N);
        for(let i = 0; i < N; i++){
            p[i] = 0;
        }

        // Vetor alocacao[n] (inicializa com -1 em todas as posições >> linha = agente | coluna = objeto)
        let alocacao = new Array(N);
        for(let i = 0; i < N; i++){
            alocacao[i] = -1;
        }

        let contIteracao = 0;    

        // Enquanto existirem pessoas não atribuidas
        while (existemPessoasNaoAtribuiaos(alocacao))
        {
            paragraph = paragraph + "Iteracao: " + contIteracao++ + '<br>';

            // Para cada pessoa nao atribuída, faça:
            for (let i = 0; i < N; i++)
            {
                if (alocacao[i] == -1)
                {
                    // Escolhe o melhor, segundo melhor e calcula o incremento.
                    let v = melhorObjeto(i, a, p);
                    let w = segundoMelhorObjeto(i, v, a, p); // v <> w
                    let incremento = valorReal(i, v, a, p) - valorReal(i, w, a, p) + E;
                    
                    paragraph = paragraph + "Atribuicao = (" + i + ", " + v + ")\t v = " + v + " | Vi = " + valorReal(i, v, a, p);
                    paragraph = paragraph + " | w = " + w + " | Wi = " + valorReal(i, w, a, p) + " | Incremento = " + incremento;

                    // Aumenta o valor do novo objeto.
                    p[v] = p[v] + incremento;

                    // Desatribui o objeto a quem estava atribuído
                    let perdedor = getPessoaAlocada(v, alocacao);
                    if (perdedor >= 0) {
                        alocacao[perdedor] = -1;
                    }

                    // Atribui o objeto ao agente i.
                    alocacao[i] = v;
                    
                    paragraph = paragraph + " | Novo Preco = " + p[v] + " | Desatribuicao = ";

                    if (perdedor >= 0) {                    
                        paragraph = paragraph + " (" + perdedor + ", " + v + ")" + '<br>';
                    }
                    else {
                        paragraph = paragraph + " --- " + '<br>';
                    }
                }
            }
            paragraph = paragraph + '<br>';
        }

        paragraph = paragraph + "Custo final:" + '<br>';

        let custo = 0;

        
        for(let i = 0; i < N; i++){
            let pos = parseInt(alocacao[i]);
            if (flagMin){
                custo = custo + (-1*parseInt(a[i][pos]));
            }else{
                custo = custo + parseInt(a[i][pos]);
            }
        }
        
        
        paragraph = paragraph + custo + '<br>';

        document.getElementById("paragraph").innerHTML = paragraph;
        document.getElementById("paragraphDiv").style.backgroundColor = "#FAFAFA";

        document.getElementById("createTableBt").style.display = 'none'; 
        document.getElementById("randomBt").style.display = 'none'; 
        document.getElementById("maxBt").style.display = 'none';
        document.getElementById("minBt").style.display = 'none'; 
    }else {
        alert("Favor preencher o campo ε.");
    }
    
}