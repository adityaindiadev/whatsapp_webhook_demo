const express = require("express");
const body_parser = require("body-parser");
const axios = require('axios');
// Load environment variables from .env file
require('dotenv').config();
const app = express();
app.use(body_parser.json());

app.listen(8000, () => {
    console.log("listning");
});


const token = process.env.token;
const mytoken = process.env.mytoken;

// #add ph no ex: 919876543210 where 91 in the starting is country code
const aditya_phone_number = process.env.adityaphonenumber;

app.get('/', (req, res) => {
    res.send('Hello, this is the root route!');
});

// to verify the callback url from dashboard side- cloud api side
app.get("/webhook", (req, res) => {

    // console.log(JSON.stringify(req));
    // console.log(JSON.stringify(res));
    let mode = req.query["hub.mode"];
    let challange = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];
    if (mode && token) {
        if (mode === "subscribe" && token === mytoken) {
            res.status(200).send(challange);
        } else {
            res.status(403);
        }
    }
});



app.post("/webhook", (req, res) => { //i want some
    let body_param = req.body;
    // console.log(JSON.stringify(body_param, null, 2));
    console.log(JSON.stringify(body_param));


    if (body_param.object) {

        console.log("inside body param");
        if (body_param.entry &&
            body_param.entry[0].changes &&
            body_param.entry[0].changes[0].value.messages &&
            body_param.entry[0].changes[0].value.messages[0]
        ) {


            let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.messages[0].from;
            let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;


            console.log("phone number id " + phon_no_id);
            console.log("from " + from);
            console.log("body param " + msg_body);

            // axios({
            //     method: "POST",
            //     url: "https://graph.facebook.com/v18.0/166508673223779/messages" + phon_no_id + "/messages?access_token=" + token,
            //     data: {
            //         messaging_product: "whatsapp",
            //         to: from,
            //         text: {
            //             body: "Hi.. I'm Aditya, your message is " + msg_body
            //         }
            //     },
            //     headers: {
            //         "Content-Type": "application/json"
            //     }
            // });



            const headers = {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            };

            let data = {
                messaging_product: 'whatsapp',
                to: aditya_phone_number,
                type: 'template',
                template: {
                    name: 'proh2r_test',
                    language: {
                        code: 'en_US',
                    },
                },
            };



            switch (msg_body) {
                case "Gender":
                    data = {
                        messaging_product: 'whatsapp',
                        to: '917007156770',
                        type: 'template',
                        template: {
                            name: 'proh2r_test',
                            language: {
                                code: 'en_US',
                            },
                        },
                    };
                    break;

                case "Apply Leave":
                    data = {
                        messaging_product: 'whatsapp',
                        to: '917007156770',
                        type: 'template',
                        template: {
                            name: 'apply_leave',
                            language: {
                                code: 'en_US',
                            },
                        },
                    };
                    break;

                case "Call":
                    data = {
                        messaging_product: 'whatsapp',
                        to: '917007156770',
                        type: 'template',
                        template: {
                            name: 'callme',
                            language: {
                                code: 'en_US',
                            },
                        },
                    };
                    break;

                case "hello world":
                    data = {
                        messaging_product: 'whatsapp',
                        to: '917007156770',
                        type: 'template',
                        template: {
                            name: 'hello_world',
                            language: {
                                code: 'en_US',
                            },
                        },
                    };
                    break;
                case "Doc":
                    data = {
                        messaging_product: 'whatsapp',
                        to: '917007156770',
                        type: 'document',
                        // template: {
                        //     name: 'new_temp',
                        //     language: {
                        //         code: 'en_US',
                        //     },
                        // },
                        "document": {
                            "link": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                            "caption": "Demo File",
                            "filename": "DemoFile"
                        }
                    };
                    break;

                default:

                    data = {
                        messaging_product: "whatsapp",
                        to: from,
                        text: {
                            body: "Hi.. I'm ProH2R, your message is " + msg_body
                        }
                    }

                    break;
            }


            axios.post('https://graph.facebook.com/v18.0/166508673223779/messages', data, { headers })
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.error(error);
                });
            res.sendStatus(200);
        } else {
            res.status(403);
        }
    }
})