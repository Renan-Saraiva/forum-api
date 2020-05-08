//process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const db = require('../app/models');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app/server');
let should = chai.should();


chai.use(chaiHttp);

//Our parent block
describe('Comments', () => {

    const resourceURL = '/api/comments';

    /*
    * Clear all comments
    */
    beforeEach((done) => {
        var all = {};
        db.comments.deleteMany(all, (err) => {
            done();
        });
    });

    var commentUtils = {
        shouldBeCreatedWithSuccess: (res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('id');
        }
    }

    /*
    * Test the /GET route
    */
    describe('/GET Comment', () => {
        it('não deve encontrar comentários', (done) => {
            chai.request(server)
                .get(resourceURL)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });

        it('não deve encontrar um comentário que não existe', (done) => {
            chai.request(server)
                .get(`${resourceURL}/5eb38e87dfd54b4554423eac`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql("Comment not found");
                    done();
                });
        });

        it('deve inserir um comentário e depois recuperar', (done) => {
            const comment = {
                text: "comentário de teste",
                user: "Usuário de teste"
            };
            chai.request(server)
                .post(resourceURL)
                .send(comment)
                .end((err, res) => {
                    commentUtils.shouldBeCreatedWithSuccess(res);
                    chai.request(server)
                        .get(`${resourceURL}/${res.body.id}`)
                        .end((err, res) => {
                            commentUtils.shouldBeCreatedWithSuccess(res);
                            done();
                        });
                });
        });
    });

    /*
    * Test the /POST route
    */
    describe('/POST Comment', () => {

        it('não deve inserir um comentário sem texto', (done) => {
            const comment = {
                user: "usuario.teste"
            }
            chai.request(server)
                .post(resourceURL)
                .send(comment)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors[0].should.have.property('param').eql("text");
                    res.body.errors[0].should.have.property('msg').eql("text field is required");
                    done();
                });
        });

        it('não deve inserir um comentário sem usuário', (done) => {
            const comment = {
                text: "comentário de teste",
            }
            chai.request(server)
                .post(resourceURL)
                .send(comment)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors[0].should.have.property('param').eql("user");
                    res.body.errors[0].should.have.property('msg').eql("user field is required");
                    done();
                });
        });

        it('não deve inserir um comentário com um texto vazio', (done) => {
            const comment = {
                user: "usuario.teste",
                text: ""
            }
            chai.request(server)
                .post(resourceURL)
                .send(comment)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors[0].should.have.property('param').eql("text");
                    res.body.errors[0].should.have.property('msg').eql("text field is required");
                    done();
                });
        });

        it('não deve inserir um comentário com um usuário vazio', (done) => {
            const comment = {
                text: "comentário de teste",
                user: ""
            }
            chai.request(server)
                .post(resourceURL)
                .send(comment)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors[0].should.have.property('param').eql("user");
                    res.body.errors[0].should.have.property('msg').eql("user field is required");
                    done();
                });
        });

        it('não deve inserir um comentário com texto diferente de string', (done) => {
            const comment = {
                text: 100,
                user: "usuario.teste"
            };
            chai.request(server)
                .post(resourceURL)
                .send(comment)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors[0].should.have.property('param').eql("text");
                    res.body.errors[0].should.have.property('msg').eql("text invalid type");
                    done();
                });
        });

        it('não deve inserir um comentário com usuario diferente de string', (done) => {
            const comment = {
                text: "comentário de teste",
                user: 100
            };
            chai.request(server)
                .post(resourceURL)
                .send(comment)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors[0].should.have.property('param').eql("user");
                    res.body.errors[0].should.have.property('msg').eql("user invalid type");
                    done();
                });
        });

        it('deve inserir um comentário', (done) => {
            const comment = {
                text: "comentário de teste",
                user: "Usuário de teste"
            };
            chai.request(server)
                .post(resourceURL)
                .send(comment)
                .end((err, res) => {
                    commentUtils.shouldBeCreatedWithSuccess(res);
                    done();
                });
        });

        it('deve inserir uma resposta a um comentário', (done) => {
            const comment = {
                text: "comentário de teste",
                user: "Usuário de teste"
            };
            chai.request(server)
                .post(resourceURL)
                .send(comment)
                .end((err, res) => {
                    commentUtils.shouldBeCreatedWithSuccess(res);
                    const reply = {
                        text: "resposta de um comentário",
                        user: "Usuário de teste"
                    };
                    chai.request(server)
                        .post(`${resourceURL}/${res.body.id}/replies`)
                        .send(reply)
                        .end((err, res) => {
                            commentUtils.shouldBeCreatedWithSuccess(res);
                            done();
                        });
                });
        });
    });

});