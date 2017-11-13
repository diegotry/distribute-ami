'use strict';

const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));

// list of regions to copy
const regions = [
    'ap-northeast-1',
    'ap-south-1',
    'ap-southeast-1',
    'ap-southeast-2',
    'ca-central-1',
    'eu-central-1',
    'eu-west-2',
    'eu-west-1',
    'sa-east-1',
    'us-east-1',
    'us-east-2',
    'us-west-1',
    'us-west-2'
];

exports.handler = (event, context, callback) => {
    if (event.httpMethod === "POST") {
        var requestBody = JSON.parse(event.body);

        // current region (related to API Gateway)
        let currentRegion = process.env.AWS_REGION;
        let params = {
            Name: "Copy of " + requestBody.imageId + " from " + currentRegion,
            SourceImageId: requestBody.imageId,
            SourceRegion: currentRegion,
            Description: "Copy of " + requestBody.imageId + " from " + currentRegion,
        };

        var copyImagePromise = [];
        
        for (var i = 0; i < regions.length; i++) {
            var ec2 = new AWS.EC2({ apiVersion: '2016-11-15', region: regions[i] });
            copyImagePromise.push(
                ec2.copyImage(params).promise()
                    .then(function(data) {
                        console.log("Image " + JSON.stringify(data))
                    })
                    .catch(function(error) {
                        console.log("Error creating image: " + JSON.stringify(error))
                    })
            );
        }

        Promise.all(copyImagePromise)
        .then(function(data) {
            callback(null, { statusCode: 200 })
        })
        .catch(function(error) {
            console.log(error);
            callback(null, { statusCode: 501 })
        });

    } else {
        // Send HTTP 501: Not Implemented
        console.log("Error: unsupported HTTP method (" + event.httpMethod + ")");
        callback(null, { statusCode: 501 })
    }
}