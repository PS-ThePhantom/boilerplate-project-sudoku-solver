const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('POST /api/solve', () => {
        test('Solve a puzzle with valid puzzle string', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.solution, '769235418851496372432178956174569283395842761628713549283657194516924837947381625');
                done();
            });
        });
    
        test('Solve a puzzle with missing puzzle string', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Required field missing');
                done();
            });
        });
    
        test('Solve a puzzle with invalid characters', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: '13576298494638125772845961369451783281293674535782419647329856158167342a269145378' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            });
        });
    
        test('Solve a puzzle with incorrect length: more characters', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '135762984946381257728459613694517832812936745357824196473298561581673429269145378154656565655' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });

        test('Solve a puzzle with incorrect length: less characters', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '135762984946381257728459613689497674675' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });
    
        test('Solve a puzzle that cannot be solved', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: '135762984946381257728459613694517832812936745357824196473298561581673429269145379' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Puzzle cannot be solved');
                done();
            });
        });

        test('check if value can be placed in cord', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                        coordinate: 'A1', 
                        value: 7 })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.valid, true);
                    done();
                });
        });

        test('check if value can be placed in cord, with row conflict', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                        coordinate: 'A2', 
                        value: 1 })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.valid, false);
                    assert.equal(res.body.conflict[0], 'row')
                    done();
                });
        });

        test('check if value can be placed in cord, with col conflict', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                        coordinate: 'A1', 
                        value: 6 })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.valid, false);
                    assert.equal(res.body.conflict[0], 'column')
                    done();
                });
        });

        test('check if value can be placed in cord, with region conflict', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                        coordinate: 'A1', 
                        value: 2 })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.valid, false);
                    assert.equal(res.body.conflict[0], 'region')
                    done();
                });
        });

        test('check if value can be placed in cord where there is already same value', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                        coordinate: 'B2', 
                        value: 5 })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.valid, true);
                    done();
                });
        });

        test('check when puzzle has invalid chars', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: 'x.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                        coordinate: 'B2', 
                        value: 5 })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "Invalid characters in puzzle");
                    done();
                });
        });

        test('check when puzzle doesnt have 81 chars', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '...9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                        coordinate: 'B2', 
                        value: 5 })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
                    done();
                });
        });

        test('check when object doesnt have puzzle', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ coordinate: 'B2', 
                        value: 5 })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "Required field(s) missing");
                    done();
                });
        });

        test('check when object doesnt have cordinate', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: 'x.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                        value: 5 })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "Required field(s) missing");
                    done();
                });
        });

        test('check when object doesnt have value', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: 'x.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                        coordinate: 'B2'})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "Required field(s) missing");
                    done();
                });
        });

        test('check when invalid coordinates are sent', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                        coordinate: 'J1', 
                        value: 5 })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "Invalid coordinate");
                    done();
                });
        });

        test('check when invalid value is sent', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                        coordinate: 'B1', 
                        value: 0 })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "Invalid value");
                    done();
                });
        });
    });
});

