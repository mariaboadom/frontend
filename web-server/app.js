
//npm run dev

const express = require ('express')
const morgan = require('morgan')
const bodyparser = require('body-parser')
const cors = require ('cors')


const app = express()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false}))//entender los datos de un formulario html
app.set('port',process.env.PORT || 4000);//el process.env sirve para por si en nuestro so hay algo predefinido para eso
app.use(morgan('dev'))
app.use(cors());
app.use("/hola",require('./routes'))

// //+++++++++++++++++++++++ Crea una instancia de SQS++++++++++++++++++++++++++++//
// const sqs = new AWS.SQS({ region: 'us-east-1' }); // Cambia 'us-east-1' por tu región deseada

// // Define el nombre de la cola SQS
// const queueUrl = 'https://sqs.us-east-1.amazonaws.com/392492183407/cola-entrada.fifo';

// // Envía un mensaje a la cola SQS
// const params = {
//   MessageBody: 'Este es un mensaje de prueba',
//   QueueUrl: queueUrl,
//   MessageGroupId: 'mi-grupo-de-mensajes' 
// };

// sqs.sendMessage(params, (err, data) => {
//   if (err) {
//     console.error('Error al enviar el mensaje:', err);
//   } else {
//     console.log('Mensaje enviado con éxito:', data.MessageId);
//   }
// });


// // Recibe un mensaje de la cola SQS
// sqs.receiveMessage({ QueueUrl: queueUrl }, (err, data) => {
//   if (err) {
//     console.error('Error al recibir el mensaje:', err);
//   } else {
//     if (data.Messages) {
//       const message = data.Messages[0];
//       console.log('Mensaje recibido:', message.Body);

//       // Borra el mensaje de la cola después de procesarlo
//       sqs.deleteMessage({
//         QueueUrl: queueUrl,
//         ReceiptHandle: message.ReceiptHandle,
//       }, (err) => {
//         if (err) {
//           console.error('Error al eliminar el mensaje:', err);
//         } else {
//           console.log('Mensaje eliminado con éxito');
//         }
//       });
//     } else {
//       console.log('No hay mensajes en la cola.');
//     }
//   }
// });

module.exports = app;