'use strict';

// Load modules

const Code = require('code');
const Lab = require('lab');
const Penseur = require('..');


// Declare internals

const internals = {};


// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;


describe('Table', { parallel: false }, () => {

    describe('get()', () => {

        it('fails on database error', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.table('invalid');
            db.connect((err) => {

                db.invalid.get(1, (err, item) => {

                    expect(err).to.exist();
                    done();
                });
            });
        });

        it('returns the requested objects', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert([{ id: 1, a: 1 }, { id: 2, a: 2 }, { id: 3, a: 1 }], (err, keys) => {

                    expect(err).to.not.exist();

                    db.test.get([1, 3], (err, result) => {

                        expect(err).to.not.exist();
                        expect(result).to.deep.include([{ id: 3, a: 1 }, { id: 1, a: 1 }]);
                        done();
                    });
                });
            });
        });

        it('returns the requested objects found (partial)', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert([{ id: 1, a: 1 }, { id: 2, a: 2 }, { id: 3, a: 1 }], (err, keys) => {

                    expect(err).to.not.exist();

                    db.test.get([1, 3, 4], (err, result) => {

                        expect(err).to.not.exist();
                        expect(result).to.have.length(2);
                        done();
                    });
                });
            });
        });

        it('returns the requested objects found (duplicates)', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert([{ id: 1, a: 1 }, { id: 2, a: 2 }, { id: 3, a: 1 }], (err, keys) => {

                    expect(err).to.not.exist();

                    db.test.get([1, 3, 3], (err, result) => {

                        expect(err).to.not.exist();
                        expect(result).to.have.length(3);
                        done();
                    });
                });
            });
        });

        it('returns the requested objects found (none)', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert([{ id: 1, a: 1 }, { id: 2, a: 2 }, { id: 3, a: 1 }], (err, keys) => {

                    expect(err).to.not.exist();

                    db.test.get([4, 5, 6], (err, result) => {

                        expect(err).to.not.exist();
                        expect(result).to.deep.equal(null);
                        done();
                    });
                });
            });
        });
    });

    describe('query()', () => {

        it('returns the requested objects', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert([{ id: 1, a: 1 }, { id: 2, a: 2 }, { id: 3, a: 1 }], (err, keys) => {

                    expect(err).to.not.exist();

                    db.test.query({ a: 1 }, (err, result) => {

                        expect(err).to.not.exist();
                        expect(result).to.deep.include([{ id: 3, a: 1 }, { id: 1, a: 1 }]);
                        done();
                    });
                });
            });
        });
    });

    describe('single()', () => {

        it('returns the requested object', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert([{ id: 1, a: 1 }, { id: 2, a: 2 }, { id: 3, a: 1 }], (err, keys) => {

                    expect(err).to.not.exist();

                    db.test.single({ a: 2 }, (err, result) => {

                        expect(err).to.not.exist();
                        expect(result).to.deep.equal({ id: 2, a: 2 });
                        done();
                    });
                });
            });
        });

        it('returns nothing', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert([{ id: 1, a: 1 }, { id: 2, a: 2 }, { id: 3, a: 1 }], (err, keys) => {

                    expect(err).to.not.exist();

                    db.test.single({ a: 3 }, (err, result) => {

                        expect(err).to.not.exist();
                        expect(result).to.equal(null);
                        done();
                    });
                });
            });
        });

        it('errors on multiple matches', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert([{ id: 1, a: 1 }, { id: 2, a: 2 }, { id: 3, a: 1 }], (err, keys) => {

                    expect(err).to.not.exist();

                    db.test.single({ a: 1 }, (err, result) => {

                        expect(err).to.exist();
                        expect(err.message).to.equal('Database error');
                        done();
                    });
                });
            });
        });
    });

    describe('count()', () => {

        it('returns the number requested object', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert([{ id: 1, a: 1 }, { id: 2, a: 2 }, { id: 3, a: 1 }], (err, keys) => {

                    expect(err).to.not.exist();

                    db.test.count({ a: 1 }, (err, result) => {

                        expect(err).to.not.exist();
                        expect(result).to.equal(2);
                        done();
                    });
                });
            });
        });

        it('returns the number of object with given field', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert([{ id: 1, a: 1 }, { id: 2, a: 2 }, { id: 3, a: 1 }], (err, keys) => {

                    expect(err).to.not.exist();

                    db.test.count(db.fields(['a']), (err, result) => {

                        expect(err).to.not.exist();
                        expect(result).to.equal(3);
                        done();
                    });
                });
            });
        });
    });

    describe('insert()', () => {

        it('returns the generate key', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert({ a: 1 }, (err, keys) => {

                    expect(err).to.not.exist();
                    expect(keys).to.match(/\w+/);
                    done();
                });
            });
        });

        it('returns the generate key (existing)', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert({ id: 11, a: 1 }, (err, keys) => {

                    expect(err).to.not.exist();
                    expect(keys).to.equal(11);
                    done();
                });
            });
        });

        it('returns the generate keys', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert([{ a: 1 }, { a: 2 }], (err, keys) => {

                    expect(err).to.not.exist();
                    expect(keys).to.have.length(2);
                    done();
                });
            });
        });

        it('returns the generate keys when keys are present', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert([{ id: 1, a: 1 }, { a: 2 }], (err, keys) => {

                    expect(err).to.not.exist();
                    expect(keys).to.have.length(2);
                    expect(keys[0]).to.equal(1);
                    done();
                });
            });
        });

        it('returns the generate keys when keys are present (last)', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert([{ a: 1 }, { id: 1, a: 2 }], (err, keys) => {

                    expect(err).to.not.exist();
                    expect(keys).to.have.length(2);
                    expect(keys[1]).to.equal(1);
                    done();
                });
            });
        });

        it('returns the generate keys when keys are present (mixed)', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert([{ a: 1 }, { id: 1, a: 2 }, { id: 2, a: 3 }, { a: 4 }, { a: 5 }, { id: 3, a: 6 }, { id: 4, a: 7 }], (err, keys) => {

                    expect(err).to.not.exist();
                    expect(keys).to.have.length(7);
                    expect(keys[1]).to.equal(1);
                    expect(keys[2]).to.equal(2);
                    expect(keys[5]).to.equal(3);
                    expect(keys[6]).to.equal(4);
                    done();
                });
            });
        });
    });

    describe('update()', () => {

        it('updates a record', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert({ id: 1, a: 1 }, (err, keys) => {

                    expect(err).to.not.exist();

                    db.test.update(1, { a: 2 }, (err) => {

                        expect(err).to.not.exist();

                        db.test.get(1, (err, item) => {

                            expect(err).to.not.exist();
                            expect(item.a).to.equal(2);
                            done();
                        });
                    });
                });
            });
        });

        it('errors on unknown key', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();

                db.test.update(2, { a: 2 }, (err) => {

                    expect(err).to.exist();
                    done();
                });
            });
        });
    });

    describe('increment()', () => {

        it('updates a record', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert({ id: 1, a: 1 }, (err, keys) => {

                    expect(err).to.not.exist();

                    db.test.increment(1, 'a', 5, (err) => {

                        expect(err).to.not.exist();

                        db.test.get(1, (err, item) => {

                            expect(err).to.not.exist();
                            expect(item.a).to.equal(6);
                            done();
                        });
                    });
                });
            });
        });

        it('errors on unknown key', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();

                db.test.increment(1, 'a', 5, (err) => {

                    expect(err).to.exist();
                    done();
                });
            });
        });
    });

    describe('append()', () => {

        it('updates a record', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert({ id: 1, a: [1] }, (err, keys) => {

                    expect(err).to.not.exist();

                    db.test.append(1, 'a', 5, (err) => {

                        expect(err).to.not.exist();

                        db.test.get(1, (err, item) => {

                            expect(err).to.not.exist();
                            expect(item.a).to.deep.equal([1, 5]);
                            done();
                        });
                    });
                });
            });
        });

        it('errors on unknown key', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();

                db.test.append(1, 'a', 5, (err) => {

                    expect(err).to.exist();
                    done();
                });
            });
        });
    });

    describe('unset()', () => {

        it('updates a record', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert({ id: 1, a: 1 }, (err, keys) => {

                    expect(err).to.not.exist();

                    db.test.unset(1, 'a', (err) => {

                        expect(err).to.not.exist();

                        db.test.get(1, (err, item) => {

                            expect(err).to.not.exist();
                            expect(item.a).to.not.exist();
                            done();
                        });
                    });
                });
            });
        });

        it('errors on unknown key', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();

                db.test.unset(1, 'a', (err) => {

                    expect(err).to.exist();
                    done();
                });
            });
        });
    });

    describe('remove()', () => {

        it('removes a record', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert({ id: 1, a: 1 }, (err, keys) => {

                    expect(err).to.not.exist();

                    db.test.remove(1, (err) => {

                        expect(err).to.not.exist();

                        db.test.get(1, (err, item) => {

                            expect(err).to.not.exist();
                            expect(item).to.not.exist();
                            done();
                        });
                    });
                });
            });
        });

        it('removes multiple records', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert([{ id: 1, a: 1 }, { id: 2, a: 1 }], (err, keys) => {

                    expect(err).to.not.exist();

                    db.test.remove([1, 2], (err) => {

                        expect(err).to.not.exist();

                        db.test.count({ a: 1 }, (err, count) => {

                            expect(err).to.not.exist();
                            expect(count).to.equal(0);
                            done();
                        });
                    });
                });
            });
        });

        it('removes records using criteria', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert([{ id: 1, a: 1 }, { id: 2, a: 1 }], (err, keys) => {

                    expect(err).to.not.exist();

                    db.test.remove({ a: 1 }, (err) => {

                        expect(err).to.not.exist();

                        db.test.count({ a: 1 }, (err, count) => {

                            expect(err).to.not.exist();
                            expect(count).to.equal(0);
                            done();
                        });
                    });
                });
            });
        });

        it('errors on unknown key', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();

                db.test.remove(1, (err) => {

                    expect(err).to.exist();
                    done();
                });
            });
        });

        it('ignored error on unknown keys', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();

                db.test.remove([1], (err) => {

                    expect(err).to.not.exist();
                    done();
                });
            });
        });
    });

    describe('empty()', () => {

        it('removes all records', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert([{ id: 1, a: 1 }, { id: 2, a: 1 }], (err, keys) => {

                    expect(err).to.not.exist();

                    db.test.empty((err, count1) => {

                        expect(err).to.not.exist();
                        expect(count1).to.equal(2);

                        db.test.count({ a: 1 }, (err, count2) => {

                            expect(err).to.not.exist();
                            expect(count2).to.equal(0);
                            done();
                        });
                    });
                });
            });
        });

        it('errors on unknown table', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.connect((err) => {

                db.table('no_such_table_test');
                db.no_such_table_test.empty((err, count) => {

                    expect(err).to.exist();
                    expect(count).to.equal(0);
                    done();
                });
            });
        });
    });

    describe('_run()', () => {

        it('errors on invalid cursor', { parallel: false }, (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert([{ id: 1, a: 1 }, { id: 2, a: 1 }], (err, keys) => {

                    expect(err).to.not.exist();

                    db.test._table.filter({ a: 1 }).run(db._connection, (err, cursor) => {

                        const proto = Object.getPrototypeOf(cursor);
                        const orig = proto.toArray;
                        proto.toArray = function (callback) {

                            proto.toArray = orig;
                            return callback(new Error('boom'));
                        };

                        cursor.close();

                        db.test.query({ a: 1 }, (err, result) => {

                            expect(err).to.exist();
                            done();
                        });
                    });
                });
            });
        });
    });

    describe('changes()', () => {

        it('reports on a record update (*)', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();

                const changes = [];
                const each = (err, item) => changes.push(item.after.id);

                db.test.changes('*', each, (err, cursor) => {

                    expect(err).to.not.exist();

                    db.test.insert({ id: 1, a: 1 }, (err, keys) => {

                        expect(err).to.not.exist();

                        db.test.update(1, { a: 2 }, (err) => {

                            expect(err).to.not.exist();

                            expect(changes).to.deep.equal([1, 1]);
                            db.close(done);
                        });
                    });
                });
            });
        });

        it('manually closes a cursor', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();

                const changes = [];
                const each = (err, item) => changes.push(item.after.id);

                db.test.changes('*', each, (err, cursor) => {

                    expect(err).to.not.exist();

                    db.test.insert({ id: 1, a: 1 }, (err, keys) => {

                        expect(err).to.not.exist();

                        db.test.update(1, { a: 2 }, (err) => {

                            expect(err).to.not.exist();

                            expect(changes).to.deep.equal([1, 1]);
                            cursor.close();
                            db.close(done);
                        });
                    });
                });
            });
        });

        it('reports on a record update (id)', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();

                const changes = [];
                const each = (err, item) => changes.push(item.after.id);

                db.test.insert([{ id: 1, a: 1 }], (err, keys1) => {

                    expect(err).to.not.exist();

                    db.test.changes(1, each, (err, cursor) => {

                        expect(err).to.not.exist();

                        db.test.update(1, { a: 2 }, (err, keys2) => {

                            expect(err).to.not.exist();

                            db.test.insert({ id: 2, a: 2 }, (err) => {

                                expect(err).to.not.exist();

                                expect(changes).to.deep.equal([1]);
                                db.close(done);
                            });
                        });
                    });
                });
            });
        });

        it('reports on a record update (ids)', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();

                const changes = [];
                const each = (err, item) => changes.push(item.after.id);

                db.test.insert([{ id: 1, a: 1 }], (err, keys1) => {

                    expect(err).to.not.exist();

                    db.test.changes([1, 2], each, (err, cursor) => {

                        expect(err).to.not.exist();

                        db.test.update(1, { a: 2 }, (err, keys2) => {

                            expect(err).to.not.exist();

                            db.test.insert({ id: 2, a: 2 }, (err) => {

                                expect(err).to.not.exist();

                                expect(changes).to.deep.equal([1, 2]);
                                db.close(done);
                            });
                        });
                    });
                });
            });
        });

        it('reports on a record update (query)', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();

                const changes = [];
                const each = (err, item) => changes.push(item.after.id);

                db.test.insert([{ id: 1, a: 1 }], (err, keys1) => {

                    expect(err).to.not.exist();

                    db.test.changes({ a: 2 }, each, (err, cursor) => {

                        expect(err).to.not.exist();

                        db.test.update(1, { a: 2 }, (err, keys2) => {

                            expect(err).to.not.exist();

                            db.test.insert({ id: 2, a: 2 }, (err) => {

                                expect(err).to.not.exist();

                                expect(changes).to.deep.equal([1, 2]);
                                db.close(done);
                            });
                        });
                    });
                });
            });
        });

        it('reports on a record update (delete)', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();

                const changes = [];
                const each = (err, item) => changes.push(item.before.id + ':' + (item.after === null));

                db.test.insert([{ id: 1, a: 1 }], (err, keys1) => {

                    expect(err).to.not.exist();

                    db.test.changes(1, each, (err, cursor) => {

                        expect(err).to.not.exist();

                        db.test.remove(1, (err) => {

                            expect(err).to.not.exist();
                            expect(changes).to.deep.equal(['1:true']);
                            db.close(done);
                        });
                    });
                });
            });
        });

        it('reports on a record update (id missing)', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();

                const changes = [];
                const each = (err, item) => changes.push(item.after.id);

                db.test.changes(1, each, (err, cursor) => {

                    expect(err).to.not.exist();

                    db.test.insert({ id: 1, a: 1 }, (err, keys) => {

                        expect(err).to.not.exist();
                        expect(changes).to.deep.equal([1]);
                        db.close(done);
                    });
                });
            });
        });

        it('errors on bad cursor', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();

                const each = (err, item) => {

                    if (err) {
                        expect(err.message).to.equal('Database error');
                        done();
                    }
                };

                db.test.changes('*', each, (err, cursor) => {

                    expect(err).to.not.exist();

                    const orig = cursor._cursor._next;
                    cursor._cursor._next = (next) => {

                        cursor._cursor._next = orig;
                        return next(new Error('kaboom'));
                    };

                    db.test.insert({ id: 1, a: 1 }, (err, keys) => {

                        expect(err).to.not.exist();
                    });
                });
            });
        });

        it('errors on invalid table', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.table('invalid');
            db.connect((err) => {

                db.invalid.changes('*', (err, item) => {

                    expect(err).to.exist();
                    done();
                });
            });
        });
    });

    describe('sync()', () => {

        it('returns when write is complete', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.establish(['test'], (err) => {

                expect(err).to.not.exist();
                db.test.insert([{ id: 1, a: 1 }, { id: 2, a: 2 }, { id: 3, a: 1 }], (err, keys) => {

                    expect(err).to.not.exist();

                    db.test.sync((err) => {

                        expect(err).to.not.exist();
                        done();
                    });
                });
            });
        });

        it('fails on database error', (done) => {

            const db = new Penseur.Db('penseurtest');
            db.table('invalid');
            db.connect((err) => {

                db.invalid.sync((err) => {

                    expect(err).to.exist();
                    done();
                });
            });
        });
    });
});
