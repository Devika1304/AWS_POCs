import aws from 'aws-sdk';

export async function invokeStateMachine(stepFunctionArn: string, inputRequest: any) {
    let result: any;
    console.info("inputRequest: " + JSON.stringify(inputRequest));

    let params = {
        stateMachineArn: stepFunctionArn,
        input: JSON.stringify(inputRequest)
    };

    try {
        console.info("Input params", JSON.stringify(params));

        const stepfunctions = new aws.StepFunctions();
        await stepfunctions.startExecution(params).promise()
            .then(async data => {
                console.info("State Machine invoked successfully:", data);
                // result = await checkSMExecutionStatus(data.executionArn);
            })
            .catch(err => {
                console.error('Error invoking state machine : getTime Data >>> ', err);
                throw "Could not invoke State Machine";
            });
        console.info("Execution status of statemachine:", JSON.stringify(result));
    } catch (e) {
        console.error('Error executing statemachine:', JSON.stringify(e));
        return e;
    }
    return result;

};

// export const checkSMExecutionStatus = async (execArn: string) => {
//     try {
//         const stepfunctions = new aws.StepFunctions();
//         let stateMachineArn: any = execArn
//         const executionArn = stateMachineArn + execArn
//         var execuParam = {
//             executionArn
//         };
//         console.info(execuParam);
//         return await stepfunctions.describeExecution(execuParam).promise()
//         .then(data => {
//             console.info("state Machine Data: ");
//             console.info(data);
//             return data;
//         })
//         .catch(err => {
//             console.error('Error in checking execution status of timeline state machine : getTime Data >>> ', err);
//             // throw new TechnicalException("Could not get status of State Machine");
//             return null;
//         });
//     } catch (error: any) {
//         console.error("checkSMExecutionStatus ERROR: ", error);
//         return null;
//         // throw error;
//     }

// };