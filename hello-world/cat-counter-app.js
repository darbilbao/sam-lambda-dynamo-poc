/*
 * TODO
 * - avoid using dynamo table until lambda deployment; local dynamo usage
 * - create layer for aws dynamo management
 *
 * - save cat counter by breedId and return a join with a breedId - breedName
 * - getCatCounter , for specific breed
 */

const DB = require('./aws-dynamo');
const Dynamo = new DB();

let CatCounterTableName = 'CatBreedTableDefault';

exports.lambdaHandler = async (event) => {

	// console.log('handler | in with event value:' + JSON.stringify(event));		
	console.log('handler | process env ' + JSON.stringify(process.env));

	// local dynamo testing
	console.log('handler | process.env.CAT_TABLENAME: ' + process.env.CAT_TABLENAME);
	console.log('handler | process.env.TABLE_NAME: ' + process.env.TABLE_NAME);
	CatCounterTableName = process.env.CAT_TABLENAME;
	if (CatCounterTableName == undefined){
		console.error('handler | error | no env TABLE_NAME');
		CatCounterTableName = 'CatBreedTable';
	}
	console.log('handler | CatCounterTableName: ' + CatCounterTableName);

	if (event.body != undefined){
		console.log('handler | event body: ' + JSON.stringify(event.body));
	}

	console.log('handler | httpMethod: ' + event.httpMethod);

	// handle request type
	if (event.httpMethod === 'PUT') {
	let response = await increaseCatCounter(CatCounterTableName, event);
	return done(response);

	} else if (event.httpMethod === 'GET') {
	let response = await getCatCounterAll(CatCounterTableName, event);
	return done(response);

	} else if (event.httpMethod === 'DEL') {
	let response = await decreaseCatCounter(CatCounterTableName, event);
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

const getCatCounter = async(CatCounterTableName, event) => {
	// TODO get counter of an specific breed
}

const getCatCounterAll = async (CatCounterTableName, event) => {
	let breed = '*'; // event.pathParameters.breed;
	let data = await Dynamo.scan('breedId', breed, CatCounterTableName);
	console.log('getCatCounterAll | data: ' + JSON.stringify(data));
	let result = data.Items.sort((a,b) => b.count - a.count);
	result = result.map(({count, ID, breed})=> { return {count, ID, breed}});
	return data;
}



const increaseCatCounter = async (CatCounterTableName, event) => {
   	let params = JSON.parse(event.body);
	let breed = params.breed;
	console.log('inc | breed: ' + breed);
    	return Dynamo.increment(breed, CatCounterTableName)
}


const decreaseCatCounter = async (CatCounterTableName, event) => {
	let params = JSON.parse(event.body);
	let breed = params.breed;
	console.log('dec | breed: ' + breed);
	return Dynamo.decrement(breed, CatCounterTableName)
}
