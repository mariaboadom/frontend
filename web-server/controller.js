const texto = {}
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: 'default', filename: './environment/credentials' });

const s3 = new AWS.S3({ region: 'us-east-1' });
const bucketName = 'sold-tickets';
const sqs = new AWS.SQS({ region: 'us-east-1' }); 
const dynamodb = new AWS.DynamoDB({ region: 'us-east-1' }) 
const queueUrlRequest = 'https://sqs.us-east-1.amazonaws.com/392492183407/cola-entrada.fifo';
const queueUrlReceive = 'https://sqs.us-east-1.amazonaws.com/392492183407/cola-salida.fifo';
const sns = new AWS.SNS({ region: "us-east-1" })

async function waitForResponse(user_id){
    //Nos quedamos esperando hasta que llegue nuestra respuesta
    var notMyID = true
    //Ahora leeremos la respuesta
    paramsReceive = {
        QueueUrl: queueUrlReceive,
        AttributeNames: ['All'],
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 1
    }

    var message;
    while(notMyID){
        const sendMessageResponse = await sqs.receiveMessage(paramsReceive, (err, data) => {
            if (err) {
                console.error('Error al recibir un mensaje de la cola:', err);
            } else {
                if (data.Messages) {
                    console.log(data.Messages.length)

                    for (i = 0; i < data.Messages.length; i++) {
                        message = data.Messages[i];
                        console.log('Mensaje recibido:', message.Body);
                    
                        id = message.Body.split(";")[2]                     
                        console.log("ID DE RESPUESTA:", id)
                        console.log("ID DE PETICION:", user_id)
                        if (id == user_id) {
                            notMyID = false
                            console.log("notMyID = false")
                            break;
                        }
                        else {
                            console.log('No es mi ID.');
                        }                    
                    }
                }else {
                    console.log('No hay mensajes en la cola.');
                }
            }
        }).promise();
    }

    return message
}

texto.updateEvent = async (req, res) => {
    evento = req.body["data"]
   

    const tablaNombre = 'Eventos';
    console.log(evento);

    const clavePrimaria = {
        'eventos': { 'S': evento.trim() }
    };

    try {
        const response = await dynamodb.getItem({ TableName: tablaNombre, Key: clavePrimaria }).promise();
        const item = response.Item || {};
        console.log(item);
        const actualizacion = {
            UpdateExpression: 'SET EventState = :val1',
            ExpressionAttributeValues: {
                ':val1': { 'S': "Cancelled" }
            },
            TableName: tablaNombre,
            Key: clavePrimaria
        };

        // Realiza la actualización
        await dynamodb.updateItem(actualizacion).promise();

        await sns.publish({
            "Message": "El evento "+evento+ " ha sido cancelado.",
            "TopicArn": "arn:aws:sns:us-east-1:392492183407:EventChange"
        }).promise();

        res.send({a:"Evento cancelado con éxito."});
    } catch (error) {
        console.error("Error al consultar o actualizar el elemento:", error);
    }    


}

texto.getMyTicket = async (req,res) =>{

    id_compra = req.body["data"]
    s3Key = id_compra;
    console.log(`KEY S3:${s3Key}`)

    s3.getObject({ Bucket: bucketName, Key: s3Key }, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al obtener el archivo PDF desde S3')
            console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
            return;
        }

        else{
            // Establece los encabezados para la respuesta
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `inline; filename="${id_compra}`);
            // Envía el contenido del archivo PDF como respuesta

            const responseObj = {
                pdf: data.Body.toString('base64'),
                title: id_compra,
                idCompra: id_compra,
                };
            res.send(responseObj);
        }
    });

}
texto.getEvents = async (req, res) => {   
    const params = {
        TableName: 'Eventos', // Reemplaza con el nombre de tu tabla
      };

    dynamodb.scan(params, (error, data) => {
        if (error) {
          console.error('Error al escanear la tabla:', error);
        } else {
          items = data.Items  
          res.send(items)
        }
      });
    
}


texto.getResponse = async (req, res) => {
    console.log(req.body["data"])
    // Envía un mensaje a la cola SQS
    user_id = uuidv4()
    const paramsSend = {
        MessageBody: req.body["data"] + user_id,
        QueueUrl: queueUrlRequest,
        MessageGroupId: user_id
    };

    const sendMessageResponse = await sqs.sendMessage(paramsSend, (err, data) => {
        if (err) {
            console.error('Error al enviar el mensaje:', err);
        } else {
            console.log('Mensaje enviado con éxito:',data);
        }
    }).promise();
    
    message = await waitForResponse(user_id)

    //PROCESAMOS
    console.log("PROCESAMOOOOOOOOOOOOOOOOOOOOOOS")
    myStatus = message.Body.split(";")[0] 
    path = message.Body.split(";")[1] 
    id_compra = message.Body.split(";")[3] 
    email = message.Body.split(";")[4] 


    const deleteParams = {
        QueueUrl: queueUrlReceive,
        ReceiptHandle: message.ReceiptHandle
    };

    //SOLO BORRAMOS EL NUESTRO
    sqs.deleteMessage(deleteParams, (err, deleteData) => {
        if (err) {
            console.error('Error al eliminar el mensaje:', err);
        } else {
            console.log('Mensaje eliminado con éxito.');
        }
    });

    if(myStatus == "ok"){
        //suscripcion a sns
        sns.subscribe({
            Protocol: 'email',
            TopicArn: 'arn:aws:sns:us-east-1:392492183407:EventChange',
            Endpoint: email
          }, (err, data) => {
            if (err) {
              console.error('Error al suscribir la dirección de correo electrónico:', err);
            } else {
              console.log('Correo electrónico suscrito correctamente:', data);
            }
          });

        s3Key = path.trim() + "/" + id_compra.trim() + ".pdf";
        console.log(`KEY S3:${s3Key}`)
    
        s3.getObject({ Bucket: bucketName, Key: s3Key }, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error al obtener el archivo PDF desde S3')
                console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                return;
            }

            else{
                // Establece los encabezados para la respuesta
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Content-Disposition', `inline; filename="${s3Key};`);
                // Envía el contenido del archivo PDF como respuesta

                const responseObj = {
                    pdf: data.Body.toString('base64'),
                    title: id_compra,
                    idCompra: s3Key,
                    };
                res.send(responseObj);
            }
        
        });
    }
    else if(myStatus == "error"){
        console.log('else')
        res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
    }    
    
}
module.exports = texto