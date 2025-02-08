class Filme{
    constructor(id, title, synopsis, release_year, genre, status, avaliation){
        this.id = id;
        this.title = title;
        this.synopsis = synopsis;
        this.release_year = release_year;        
        this.genre = genre;
        this.status = status;
        this.avaliation = avaliation;
    }   

    exibirInformacoes(){
        return{
            titulo: this.title,
            ano_lancamento: this.release_year,
            genero: this.genre,
            avaliacao: this.avaliation,
            status: this.status
        }
    }

    alterarStatus(novoStatus){
        this.status = novoStatus;
    }

    avaliarFilme(novaAvaliacao){
        if(novaAvaliacao >= 0 && novaAvaliacao <= 5){
            this.avaliation = novaAvaliacao;
        }else{
            throw new Error('A avaliação deve ser um valor entre 0 e 5');
        }
    }
}