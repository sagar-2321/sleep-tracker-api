const assert = require('assert');
const request = require('supertest');
const app = require('../app');

describe('Sleep API', () => {
    let recordId;

    it('should create a new sleep record', (done) => {
        request(app)
            .post('/sleep')
            .send({
                userId: 'user1',
                hours: 7,
                timestamp: '2023-05-19 22:00:01'
            })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                assert(res.body.id);
                recordId = res.body.id;
                done();
            });
    });

    it('should get sleep records for a user', (done) => {
        request(app)
            .get('/sleep/user1')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert(Array.isArray(res.body));
                done();
            });
    });

    it('should update a sleep record', (done) => {
        request(app)
            .put(`/sleep/${recordId}`)
            .send({
                userId: 'user1',
                hours: 8,
                timestamp: '2023-05-19 23:00:10'
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.hours, 8);
                done();
            });
    });

    it('should delete a sleep record', (done) => {
        request(app)
            .delete(`/sleep/${recordId}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.body.id, recordId);
                done();
            });
    });
});
