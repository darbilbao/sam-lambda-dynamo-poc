const DB = require('./aws-dynamo');
const Dynamo = new DB();

let CatCounterTableName = 'CatBreedTable';

exports.lambdaHandler = async (event) => {

	// console.log('handler | in with event value:' + JSON.stringify(event));		
	console.log('handler | process env ' + JSON.stringify(process.env));

	if (event.body != undefined){
		console.log('handler | event body: ' + JSON.stringify(event.body));
	}

	console.log('handler | httpMethod: ' + event.httpMethod);

	// handle request type
	if (event.httpMethod === 'DEL') {
	let response = await deleteCatBreed(CatCounterTableName, event);
	return done(response);
	}
};

const done = response => {
    return {
        statusCode: '200',
        body: JSON.stringify(response),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*'
        }
    }
}

const cats = {
    SIA: 'Siamese',
    EU:  'European',
    BYS: 'Abyssinian',
    ENG: 'Bengal'	
}


/*
 * dummy retturn
 */ 
const getCatSimple = event => {
	return cats;
}

const deleteCatBreed = async (CatCounterTableName, event) => {
	let params = JSON.parse(event.body);
	let breed = params.breed;
	console.log('dec | breed: ' + breed);
	return Dynamo.del(breed, CatCounterTableName)
}
