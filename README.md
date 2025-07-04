# Projeto Backend

Este projeto backend foi desenvolvido como parte do Curso de Desenvolvedor Web Full Stack - Online 2.0, promovido pelo programa Geração Tech 2025. O objetivo principal é a criação de uma API RESTful completa para um sistema de e-commerce, atendendo aos seguintes requisitos:

- Autenticação segura utilizando JWT

- Operações completas de CRUD para usuários, categorias e produtos

- Sistema de busca avançada com filtros dinâmicos e personalizados

- Gerenciamento de imagens associado aos produtos

- Validação rigorosa de dados e uso apropriado de códigos de status HTTP

> Projeto colaborativo desenvolvido por:
- [Érico Freitas](https://github.com/EricofreitasNeto)
- [Kelsen Rian Araujo Pinho](https://github.com/Kelsen-Rian) [Contato](https://wa.me/5585991534299?text=Ol%C3%A1%2C%20tudo%20bem%3F%0A%0AEntrei%20em%20contato%20porque%20vi%20seu%20projeto%20no%20GitHub%3A%20https%3A%2F%2Fgithub.com%2FLeymarck%2Fdripfrontend%20e%20achei%20muito%20interessante.%0A%0AGostaria%20de%20conversar%20com%20voc%C3%AA%20sobre%20uma%20ideia%20de%20projeto%20que%20tenho%3A%0A%0A%5BDIGITE%20SUA%20IDEIA%20AQUI%5D%0A%0AFico%20no%20aguardo%20para%20saber%20se%20podemos%20conversar%20melhor%20sobre%20isso.%0AGrande%20abra%C3%A7o!)
- [Hudson Lopes da Silva](https://github.com/Leymarck) [Contato](https://wa.me/5585986404503?text=Ol%C3%A1%2C%20tudo%20bem%3F%0A%0AEntrei%20em%20contato%20porque%20vi%20seu%20projeto%20no%20GitHub%3A%20https%3A%2F%2Fgithub.com%2FLeymarck%2Fdripfrontend%20e%20achei%20muito%20interessante.%0A%0AGostaria%20de%20conversar%20com%20voc%C3%AA%20sobre%20uma%20ideia%20de%20projeto%20que%20tenho%3A%0A%0A%5BDIGITE%20SUA%20IDEIA%20AQUI%5D%0A%0AFico%20no%20aguardo%20para%20saber%20se%20podemos%20conversar%20melhor%20sobre%20isso.%0AGrande%20abra%C3%A7o!)

---

## 🛠 Tecnologias Utilizadas

- ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
- ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
- ![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
- ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
- ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

## 📚 Documentação da API

### Status Codes

| Código | Status       | Descrição                          |
|--------|--------------|------------------------------------|
| 200    | OK           | Requisição bem sucedida            |
| 201    | Created      | Recurso criado com sucesso         |
| 204    | No Content   | Sucesso sem corpo de resposta      |
| 400    | Bad Request  | Dados inválidos                    |
| 401    | Unauthorized | Token JWT inválido ou ausente      |
| 404    | Not Found    | Recurso não encontrado             |

### Endpoints Principais

#### 👤 Usuários
- `GET /v1/user/` - Lista todos usuário
- `GET /v1/user/:id` - Obter usuário
- `POST /v1/user` - Criar usuário
- `PUT /v1/user/:id` - Atualizar usuário
- `DELETE /v1/user/:id` - Remover usuário

#### 📦 Categorias
- `GET /v1/category/search` - Buscar com filtros
- `POST /v1/category` - Criar categoria

#### 🛍️ Produtos
- `GET /v1/product/search` - Busca avançada
- `POST /v1/product` - Criar produto

#### 🔐 Autenticação
- `POST /v1/user/token` - Gerar token JWT

## 🏗️ Estrutura do Projeto
```text
projeto-backend/
├── src/
│ ├── config/ # Configurações
│ ├── controllers/ # Lógica dos endpoints
│ ├── middleware/ # Autenticação
│ ├── models/ # Modelos do banco
│ ├── routes/ # Definição de rotas
│ ├── app.js # Config Express
│ └── server.js # Inicialização
├── tests/ # Testes
├── .env # Variáveis
└── package.json
```
## 🚀 Configuração

### Pré-requisitos
- Node.js 18.x+
- MySQL 8.x+

### Instalação
1. Clone o repositório:
```bash
git clone https://github.com/EricofreitasNeto/projeto-backend.git
cd projeto-backend
```
2. Instale as dependências:
```bash
npm install
```
## 📄 Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo [LICENSE](/LICENSE.md) para obter os detalhes completos.

