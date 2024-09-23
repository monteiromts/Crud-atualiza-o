const conexao = require('../infraestrutura/conexao');

class Atendimento {
    adiciona(atendimento, res) {
        const sql = 'INSERT INTO atendimentos SET ?';

        conexao.query(sql, atendimento, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(201).json(resultados);
            }
        });
    }

    lista(res) {
        const sql = 'SELECT * FROM atendimentos';

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json(resultados);
            }
        });
    }

    buscaPorId(id, res) {
        const sql = 'SELECT * FROM atendimentos WHERE id = ?';

        conexao.query(sql, [id], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                const atendimento = resultados[0];
                res.status(200).json(atendimento);
            }
        });
    }

    altera(id,valores,res){
        const sql = 'UPDATE Atendimentos SET ? WHERE id=?'

        conexao.query(sql, [valores,id], (erro, resultados) =>{
            if (erro) {
                res.status(400).json(erro)
            } else{
                res.status(200).json(resultados)
            }
        })
    }

    delete(id,res) {
        const sql = 'DELETE FROM Atendimentos WHERE id=?'

        conexao.query(sql,id, (erro, resultados) =>{
            if (erro) {
                res.status(400).json(erro)
            } else{
                res.status(200).json(resultados)
            }
        })
    }
}
    


module.exports = new Atendimento();
