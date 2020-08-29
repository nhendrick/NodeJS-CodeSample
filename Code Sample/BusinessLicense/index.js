module.exports = async function (context, req) {

    // * Import Common Functions
    const Connection = require('../.Functions/MongoConnection');
    const DataModel = require('../.DataModels/BusinessLicense-Model');
    const AddressValidation = require('../.Functions/AddressValidation');
    const ErrorHandling = require('../.Functions/ErrorHanding');
    const DefaultResponses = require('../.Functions/DefaultResponses');
    const ObjectLength = require('../.Functions/ObjectLength');

    try {
        // * Map Common Key
        const SearchKey   = req.body.license;     
        const SearchData = {
            license:   SearchKey,
        };  
    } catch (error) {
        // * Invalid Request Body
        await ErrorHandling.errorHandling(2, context);
        context.done();
    }

    switch (req.method) {
        case 'GET':
            if (req.body.license) { 
                await DataModel.findOne(SearchData)
                    .then(doc => {
                        if(doc==null){
                            // * No Results
                            ErrorHandling.errorHandling(6, context);
                        }else{
                            // * Success
                            DefaultResponses.responseMessage(0,context, doc);
                        }
                    })
                    .catch(err => {
                        context.log.error(err)
                        // * Internal Server Error
                        ErrorHandling.errorHandling(3, context);
                    });
            } else {
                // * Invalid Request Body
                await ErrorHandling.errorHandling(2, context);
            }
            break;
        case 'POST':
            // * Create a Response.
            if (req.body.address) {
                const response = await AddressValidation.validate(req.body.address);
                if(response==null){
                    await ErrorHandling.errorHandling(5, context, err);
                }

                req.body.address = response;
            
                // * Send sanitized request body to mongoDB
                await (new DataModel(req.body))
                    .save()
                    .then(doc => {
                        // * Success
                        DefaultResponses.responseMessage(1,context);
                    })
                    .catch(err => {
                        // * Mongoose/Mongo Rejection
                        ErrorHandling.errorHandling(0, context, err);
                    });
            } else {
                // * Invalid Request Body
                await ErrorHandling.errorHandling(2, context);
            }
            break;
        case 'PUT':
            var objectLength = await ObjectLength.objectLength(req);
            if(objectLength===0){
                await ErrorHandling.errorHandling(4, context);
            }
        
            if (req.body.update.address){
                const response = await AddressValidation.validate(req.body.address);
                req.body.address = response;
            }
            // * Create a Response.
            if (req.body.license && (objectLength > 0)){
                await DataModel.findOneAndUpdate(SearchData,(req.body.update),{runValidators: true})
                    .then(doc => {
                        // * Success
                        DefaultResponses.responseMessage(2,context);
                    })
                    .catch(err => {
                        // * Mongoose/Mongo Rejection
                        ErrorHandling.errorHandling(0, context, err); 
                    });
            } else {
                // * Invalid Request Body
                await ErrorHandling.errorHandling(2, context);
            }
            break;
        case 'DELETE':
            if (req.body.license) { 
                // TODO Update to try catch and set error codes
                await DataModel.findOneAndRemove(SearchData)
                    .then(doc => {
                        // * Success
                        DefaultResponses.responseMessage(3,context);
                    })
                    .catch(err => {
                        // * Mongoose/Mongo Rejection
                        ErrorHandling.errorHandling(0, context, err); 
                    });
            } else {
                // * Invalid Request Body
                await ErrorHandling.errorHandling(2, context); 
            }
            break;
        default:
            // * Invalid Request Method
            await ErrorHandling.errorHandling(21, context); 
    }
    context.done();
};