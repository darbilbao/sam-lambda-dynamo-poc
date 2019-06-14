const DB = require('./aws-dynamo');
const Dynamo = new DB();


let CatCounterTableName = 'CatBreedTableDefault';

exports.lambdaHandler = async (event) => {
    console.log('handler | in with event value:' + JSON.stringify(event));		
	console.log('handle | process env ' + JSON.stringify(process.env));
	
	console.log('handle | process.env.CAT_TABLENAME: ' + process.env.CAT_TABLENAME);
	console.log('handle | process.env.TABLE_NAME: ' + process.env.TABLE_NAME);
	
	CatCounterTableName = process.env.CAT_TABLENAME;
	if (CatCounterTableName == undefined){
		console.error('handler | error | no env TABLE_NAME');
		CatCounterTableName = 'CatBreedTable';
	}
	console.log('handler | CatCounterTableName: ' + CatCounterTableName);
	
    if (event.httpMethod === 'PUT') {
        let response = await putCat(CatCounterTableName, event);
        return done(response);
		
    } else if (event.httpMethod === 'GET') {
        // let response = await getCatSimple(event);
		let response = await getCatAll(CatCounterTableName, event);
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
	EU:'European',
	ABYS: 'Abyssinian',
	BENG: 'Bengal'	
}


const getCatSimple = event => {
	return cats;
}

const getCat = (CatCounterTableName, event) => {
    //let breed = event.pathParameters.breed;
    //return cats[breed];
	return cats;
}

const getCatAll = async (CatCounterTableName, event) => {
    let breed = '*'; // event.pathParameters.breed;
    let data = await Dynamo.scan('breedId', breed, CatCounterTableName);
    let result = data.Items.sort((a,b) => b.count - a.count);
    result = result.map(({count, ID, breed})=> { return {count, ID, breed}});
    return data;
}




const putCat = async (CatCounterTableName, event) => {
	console.log(event.body);
    let params = JSON.parse(event.body);
	let breed = params.breed;
	console.log('param breed: ' + breed);
	
	// let ID = event.pathParameters["breed"];
    // console.log(ID);	
    return Dynamo.increment(breed, CatCounterTableName)
}