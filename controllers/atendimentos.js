const express = require('express');
const path = require('path');
const consign = require('consign');
const bodyParser = require('body-parser');
const multer = require('multer');
const xlsx = require('xlsx');
const Atendimento = require('../models/atendimentos');


const app = express();

// Servir arquivos estáticos
app.use(express.static('public'));

// Rota para servir o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Configurar o bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurar o multer para upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pasta onde o arquivo será salvo
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

// Rota GET para listar todos os atendimentos
app.get('/atendimentos', (req, res) => {
    Atendimento.lista(res);
});

// Rota GET para buscar atendimento por ID
app.get('/atendimentos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    Atendimento.buscaPorId(id, res);
});

// Rota POST para adicionar um novo atendimento
app.post('/atendimentos', (req, res) => {
    const atendimento = req.body;
    Atendimento.adiciona(atendimento, res);
});

// Rota PATCH para atualizar atendimento
app.patch('/atendimentos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const valores = req.body;
    Atendimento.altera(id, valores, res);
});

// Rota DELETE para remover atendimento
app.delete('/atendimentos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    Atendimento.delete(id, res);
});

// Rota para upload de arquivo Excel
app.post('/upload', upload.single('file'), (req, res) => {
    const filePath = `uploads/${req.file.filename}`;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const resultados = [];
    let consultasPendentes = data.length;

    if (consultasPendentes === 0) {
        return res.status(200).json(resultados); // Se não houver dados no Excel
    }

    data.forEach(row => {
        const { matricula, nome, ativo } = row;

        // Verifica se o atendimento existe no banco
        Atendimento.buscaPorId(matricula, (erro, atendimento) => {
            if (erro) {
                resultados.push({ matricula, nome, ativo, status: 'Erro ao consultar' });
            } else if (atendimento) {
                resultados.push({ matricula, nome, ativo, status: 'Existente' });
            } else {
                resultados.push({ matricula, nome, ativo, status: 'Não Existente' });
            }

            consultasPendentes--;

            // Verifica se todas as consultas foram feitas
            if (consultasPendentes === 0) {
                res.status(200).json(resultados);
            }
        });
    });
});

// Inicializa o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
