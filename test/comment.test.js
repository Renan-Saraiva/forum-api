//process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const db = require('../api/models');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../api/server');
const should = chai.should();


chai.use(chaiHttp);

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

    var validators = {
        shouldBeCreatedWithSuccess: (res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('id');
        },
        shouldBeUnprocessableEntity: (res) => {
            res.should.have.status(422);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
        },
        createComment: () => {
            return chai.request(server)
                .post(resourceURL)
                .send(validators.comment);
        },
        createReply: (commentId) => {
            return chai.request(server)
                    .post(`${resourceURL}/${commentId}/replies`)
                    .send(validators.comment);
        },
        fakeId: '5eb38e87dfd54b4554423eac',
        comment: {
            text: "Comentário de teste",
            user: "Usuário de teste"
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
                .get(`${resourceURL}/${validators.fakeId}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql("Comment not found");
                    done();
                });
        });
        
        it('não deve deve encontrar respostas de um comentário que não existe', (done) => {
            chai.request(server)
                .get(`${resourceURL}/${validators.fakeId}/replies`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql("Comment not found");
                    done();
                });
        });
        
        it('deve inserir um comentário e recuperar', (done) => {
            validators.createComment()
                .end((err, res) => {
                    validators.shouldBeCreatedWithSuccess(res);
                    chai.request(server)
                        .get(`${resourceURL}/${res.body.id}`)
                        .end((err, res) => {
                            validators.shouldBeCreatedWithSuccess(res);
                            done();
                        });
                });
        });


        it('deve encontrar 2 comentários', (done) => {
            validators.createComment()
                .end((err, res) => {
                    validators.shouldBeCreatedWithSuccess(res);
                    validators.createComment().end((err, res) => {
                        validators.shouldBeCreatedWithSuccess(res);
                        chai.request(server)
                            .get(resourceURL)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('array');
                                res.body.length.should.be.eql(2);
                                done();
                            });
                    });
                });
        });

        it('deve encontrar 1 resposta', (done) => {
            validators.createComment()
                .end((err, res) => {
                    validators.shouldBeCreatedWithSuccess(res);
                    var commentId = res.body.id;
                    validators.createReply(commentId).end((err, res) => {
                        validators.shouldBeCreatedWithSuccess(res);
                        chai.request(server)
                            .get(`${resourceURL}/${commentId}/replies`)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('array');
                                res.body.length.should.be.eql(1);
                                done();
                            });
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
                    validators.shouldBeUnprocessableEntity(res);
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
                    validators.shouldBeUnprocessableEntity(res);
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
                    validators.shouldBeUnprocessableEntity(res);
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
                    validators.shouldBeUnprocessableEntity(res);
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
                    validators.shouldBeUnprocessableEntity(res);
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
                    validators.shouldBeUnprocessableEntity(res);
                    res.body.errors[0].should.have.property('param').eql("user");
                    res.body.errors[0].should.have.property('msg').eql("user invalid type");
                    done();
                });
        });

        it('não deve inserir uma resposta a um comentário que não existe', (done) => {
            chai.request(server)
                .post(`${resourceURL}/${validators.fakeId}/replies`)
                .send(validators.comment)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql("Comment not found");
                    done();
                });
        });

        it('não deve dar um like no comentário que não existe', (done) => {
            chai.request(server)
                .put(`${resourceURL}/${validators.fakeId}/like`)
                .send()
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql("Comment not found");
                    done();
                });
        });

        it('deve dar um like a um comentário', (done) => {
            validators.createComment()
                .end((err, res) => {                    
                    validators.shouldBeCreatedWithSuccess(res);
                    chai.request(server)
                        .put(`${resourceURL}/${res.body.id}/like`)
                        .send()
                        .end((err, res) => {
                            res.should.have.status(204);
                            done();
                        });
                });
        });

        it('deve inserir um comentário', (done) => {
            chai.request(server)
                .post(resourceURL)
                .send(validators.comment)
                .end((err, res) => {
                    validators.shouldBeCreatedWithSuccess(res);
                    done();
                });
        });

        it('deve inserir uma resposta a um comentário', (done) => {
            validators.createComment()
                .end((err, res) => {                    
                    validators.shouldBeCreatedWithSuccess(res);
                    validators.createReply(res.body.id)
                        .end((err, res) => {
                            validators.shouldBeCreatedWithSuccess(res);
                            done();
                        });
                });
        });
    });
});