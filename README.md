# Gerenciador de Tarefas

Este repositório contém um projeto de Gerenciador de Tarefas. Para inicializar a estrutura do banco de dados, siga as instruções abaixo:

## Script de Inicialização do Banco de Dados

Use o script SQL a seguir para criar o banco de dados e a tabela `Tasks` no momento da avaliação do teste:

```sql
CREATE DATABASE MTP;
GO

---- Selecionar o banco de dados para uso
USE MTP;
GO

---- Criação da tabela Tasks
CREATE TABLE Tasks (
    Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(MAX) NULL,
    Completed BIT NOT NULL
);
GO
