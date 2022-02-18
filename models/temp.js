/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [{
    '$match': {
        'product': new ObjectId('620d2e0ef311a507f161552b')
    }
}, {
    '$group': {
        '_id': null,
        'averageRating': {
            '$avg': '$rating'
        },
        'numberOfReviews': {
            '$sum': 1
        }
    }
}];

