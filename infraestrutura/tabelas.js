const { query } = require("express")

class tabelas {
    init(conexao) {
        this.conexao = conexao

        this.criarAtendimento()
    }
    criarAtendimento() {
        const sql = 'CREATE TABLE IF NOT EXISTS atendimentos (id int NOT NULL AUTO_INCREMENT, cliente varchar(50) NOT NULL, pet varchar (20), serviço varchar(20) NOT NULL, status varchar(20) NOT NULL, observacoes text, PRIMARy KEY(id))'
    
        this.conexao.query(sql, (erro) =>{
            if(erro) {
                console.log(erro)
            } else{
                console.log('Tabela atendimentos criada com sucesso')
            }
        })
    
    }
}

module.exports = new tabelas