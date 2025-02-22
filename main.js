/**
 * Processo principal
 * Estudo do CRUD com MongoDB
 */

// importação do módulo de coneção (database.js)
const {conectar, desconectar} = require('./database')

// importação do modelo de dados de clientes
const clienteModel = require('./src/models/Clientes')

// importação do pacote string-similarity para aprimorar a busca por nome
const stringSimilarity = require('string-similarity')
// CRUD Create (função para adicionar um novo cliente)
const criarCliente = async (nomeCli, foneCli, cpfCli) => {
    try {
        const novoCliente = new clienteModel(
            {
                nomeCliente: nomeCli,
                foneCliente: foneCli,
                cpf: cpfCli
            }
        )
            // a linha abaixo salva os dados do cliente no banco
            await novoCliente.save()
            console.log("Cliente adicionado com sucesso.")
       
    } catch (error) {
        //tratamento de execeções especificas
        if (error.code = 11000){
            console.log(`Erro: o CPF ${cpfCli} ja esta cadastrado`)
        }else{
        console.log(error)
    }
    }
}
// CRUD Read - Função parea listar todos os clientes cadastrados
const listarClientes = async() =>{
    try{
        // a linha abaixo lista todos os clientes cadastrados
        const clientes = await clienteModel.find().sort (
            {
                nomeCliente: 1
            }
        )
        console.log(clientes)
    } catch (error) {
        console.log(error)
    }
}
//CRUD Read - Função para buscar um cliente especifico
const buscarCliente = async (nome) => {
    try {
        // find() buscar
        // nomeClientes: new RegExp(nome) filtro pelo nome
        // 'i' insensitive (ignorar letras maiúsculas ou minúsculas)
        const cliente = await clienteModel.find (
            {
            nomeCliente: new RegExp(nome, 'i')
            }
        )
        //calcular a similaridade entre os nomes retornnados e o nome pesquisado
        const nomesClientes = cliente.map(cliente => cliente.nomeCliente)
        //validação (se não existir o cliente pesquisado)
        if (nomesClientes.length === 0) {
            console.log("Cliente não cadastrado")
        } else{
        const match = stringSimilarity.findBestMatch(nome, nomesClientes)
      
        //Cliente com melhor similaridade
        const melhorCliente = cliente.find(cliente => cliente.nomeCliente === match.bestMatch.target)
        //formatção da data 
        const clienteFormatado = {
            nomeCliente: melhorCliente.nomeCliente,
            foneCliente: melhorCliente.foneCliente,
            cpf: melhorCliente.cpf,
            dataCadastro: melhorCliente.dataCadastro.toLocaleDateString('pt-BR')
        }
        console.log(clienteFormatado)
        }
        
    } catch (error) {
        console.log(error)
    }
}


// execução da aplicação
const app = async () => {
    await conectar()
    // CRUD - create
    // await criarCliente("ibiçu" , "99999-1111","123.456.789-92")

    // CRUD - Read
    //await listarClientes()

    // CRUD - Read (Exemplo 2 - buscar)
    await buscarCliente("ibiçu")

    await desconectar()
}

console.clear()
app()