// // form.on("value", function(data) {
// //   var name = data.val() ? data.val().name : "";
// //   console.log("My name is " + name);
// // });
// (function($) {
//     $.fireform = function(element, options) {

//         var fb = new Firebase(options),
//             target = $(element);

//         target.children(':submit').on('click', function() {
//             event.preventDefault()
//             var obj = {};
//             target.find('input').each(function(key, input) {
//                 var name = $(input).attr('name'),
//                     val = $(input).val();
//                 if (name)
//                     obj[name] = val;
//                 else if ($(input).attr('type') !== 'submit')
//                     obj['unnamed' + key] = val;
//             });
//             var form = fb;
//             obj['_time'] = new Date().toString();
//             form.push(obj, function(err) {
//                 if (!err)
//                     target.addClass("submited");
//                 else
//                     target.addClass("error");
//             });
//         });
//     }

//     // add the plugin to the jQuery.fn object
//     $.fn.fireform = function(options) {

//         // iterate through the DOM elements we are attaching the plugin to
//         return this.each(function() {

//             // if plugin has not already been attached to the element
//             if (undefined == $(this).data('fireform')) {

//                 // create a new instance of the plugin
//                 // pass the DOM element and the user-provided options as arguments
//                 var plugin = new $.fireform(this, options);

//                 // in the jQuery version of the element
//                 // store a reference to the plugin object
//                 // you can later access the plugin and its methods and properties like
//                 // element.data('pluginName').publicMethod(arg1, arg2, ... argn) or
//                 // element.data('pluginName').settings.propertyName
//                 $(this).data('fireform', plugin);

//             }

//         });

//     }
// })($);


// // form.on("value", function(data) {
// //   var name = data.val() ? data.val().name : "";
// //   console.log("My name is " + name);
// // });
// (function($) {
//     $.fireform2 = function(element, selector, options) {

//         if ( !options.fireBaseRepo )
//             console.error("Please pass fireBaseRepo as a option in the 2nd parameter.")

//         Fireform(element, options.fireBaseRepo)
//     };
//     // add the plugin to the jQuery.fn object
//     $.fn.fireform2 = function(options) {

//         // iterate through the DOM elements we are attaching the plugin to
//         return this.each(function() {

//             // if plugin has not already been attached to the element
//             if (undefined == $(this).data('fireform2')) {

//                 // create a new instance of the plugin
//                 // pass the DOM element and the user-provided options as arguments
//                 var plugin = new $.fireform2(this, options);

//                 // in the jQuery version of the element
//                 // store a reference to the plugin object
//                 // you can later access the plugin and its methods and properties like
//                 // element.data('pluginName').publicMethod(arg1, arg2, ... argn) or
//                 // element.data('pluginName').settings.propertyName
//                 $(this).data('fireform2', plugin);

//             }

//         });

//     }
// })($);


Fireform = function (selector, fireBaseRepo, options){
            that=this;


            this.error=function(text){console.error(text)};
            var formDOMObject,
                inputs, 
                submitElement,
                successClass= options && options.successClass? options.successClass:"submit-success",
                failedClass=options && options.failedClass? options.failedClass:"submit-failed",
                formValidationClass=options && options.formValidationClass? options.formValidationClass:"form-validation-failed",
                inputValidationClass=options && options.inputValidationClass? options.inputValidationClass:"input-validation-failed",
                simpleValidation=options && options.simpleValidation? options.simpleValidation:false;
                that.emailNotification=options && options.emailNotification? options.emailNotification:undefined;


            if (typeof selector!=="string"){
                formDOMObject = selector;
            }else if ( selector.search(/^\./)===0 ) {
                formDOMObject = document.getElementsByClassName(selector.slice(1))[0]
                console.warn("We will default to the first form matching this class selector");
            }
            else if ( selector.search(/^\#/)===0 ){
                formDOMObject = document.getElementById(selector.slice(1));
            }else if (!formDOMObject){
                this.error('Please use a Class or Id Selector. This mean your string should begin with a "." or "#".  You man also pass in a Dom elment object')
                return
            }
            if (!formDOMObject.tagName){
                this.error('No DOM object found!')
                return
            }else if(formDOMObject.tagName!=="FORM"){
                this.error('DOM elments is not a <form>')
                return
            }
            this.formDOMObject=formDOMObject

            this.inputs=inputs=formDOMObject.elements

            for (var i = this.inputs.length - 1; i >= 0; i--) {
                var type;
                type = inputs[i].getAttribute('type');
                if (type==="submit"){ submitElement=inputs[i]; break;}
            };
            if (!submitElement){this.error('Please add a submit button with a <input type="submit"> attr"'); return;} 
            
            this.submitElement=submitElement;


            this.submit = function(e){
                var validation=true;
                var validationRadio;
                if (event) event.preventDefault();
                else if (e && e.preventDefault) event.preventDefault();

                var payLoad={};
                payLoad._time={}
                payLoad._time.name = '_time';// add the time
                payLoad._time.type = '_time';// add the time
                payLoad._time.value = new Date().toString();// add the time
                for (var i = that.inputs.length - 1; i >= 0; i--) {
                    var name, type;
                    name = that.inputs[i].name ? inputs[i].name : 'input_'+String(i);
                    type = inputs[i].type
                    value=inputs[i].value;

                    
                    if (inputs[i].getAttribute("email-confirmation")==='true')
                        that.emailConfirmation = value;

                    if (inputs[i].getAttribute("email-confirmation-from")==='true')
                        that.emailConfirmationFrom = value;


                    if (inputs[i].getAttribute("email-confirmation-from")==='true')
                        that.emailConfirmationFrom = value;


                    if (inputs[i].getAttribute("email-confirmation-subject")==='true')
                        that.emailConfirmationSubject = value;

                    if (inputs[i].getAttribute("email-confirmation-body-html")==='true')
                        that.emailConfirmationBodyHTML = value;


                    if (inputs[i].getAttribute("email-confirmation-body-text")==='true')
                        that.emailConfirmationBodyText = value;

                    if (inputs[i].getAttribute("email-notification")==='true' && !that.emailNotification)
                        that.emailNotification = value;


                    if (type==="radio" && inputs[i].checked===true){
                        payLoad[name]={};
                        payLoad[name].value = inputs[i].checked? value:"";
                        payLoad[name].type=inputs[i].type;
                        payLoad[name].name=inputs[i].name;
                        validationRadio= (inputs[i].checked || validationRadio)? true:false;//flip it to true if checked or keep it true
                    } else if (type!=="submit" && type!=="radio"){
                        payLoad[name]={};
                        payLoad[name].value=value
                        payLoad[name].type=inputs[i].type
                        payLoad[name].name=inputs[i].name
                        payLoad[name].checked=inputs[i].checked
                    }

                    // if (type==="text" || type==="" ) payLoad[name]= {value:inputs[i].value,type:inputs[i].type};
                    // else if (type==="checkbox") payLoad[name]={value:inputs[i].value,type:inputs[i].type} 
                    // else if (type==="radio") payLoad[name]=inputs[i].value+":"+inputs[i].type;
                    // else if (type==="select-one") payLoad[name]=inputs[i].value+":"+inputs[i].type;
                    
                    if (type==="radio" && !validationRadio && simpleValidation)
                        inputs[i].className += " "+inputValidationClass;
                    else if (type!=="submit" && value==="" && simpleValidation) 
                        inputs[i].className += " "+inputValidationClass, validation=false;
                    else if(simpleValidation)
                        inputs[i].className=inputs[i].className.replace(new RegExp(inputValidationClass, 'g'),"");
                }
                if ( (validation && validationRadio)|| !simpleValidation)
                    that.submitForm(fireBaseRepo, payLoad),
                    formDOMObject.className=formDOMObject.className.replace(new RegExp(formValidationClass, 'g'),"");
                else
                    formDOMObject.className += " "+formValidationClass,
                    that.error('Validation Failed. Classname '+formValidationClass+' Added to inputs');
                    


            }

            this.getRepo=function(url){
                if ( url.match("fireform.org/publicexample") || url.match("fireform/publicexample") ) {return "https://fireform.firebaseio.com/example/formPosts.json" }//check for example url
                source_tuple=url.split("://")[1].split('/list/')
                source=source_tuple[0].split('.org')[0]//split the .com
                user_repo_tuple=source_tuple[1].split('/')
                user= that.user = user_repo_tuple[0]
                repo=that.repo=user_repo_tuple[1]
                return "https://"+source+".firebaseio.com/users/simplelogin:"+user+"/lists/"+repo+"/formPosts.json"
            }

            this.getEmailRepo=function(url){
                if ( url.match("fireform.org/publicexample") ) {return null }//check for example url
                source_tuple=url.split("://")[1].split('/list/')
                source=source_tuple[0].split('.org')[0]//split the .com
                user_repo_tuple=source_tuple[1].split('/')
                user=user_repo_tuple[0]
                repo=user_repo_tuple[1]
                return "https://"+source+".firebaseio.com/users/simplelogin:"+user+"/"
            }


            this.submitForm=function(fireBaseRepo, payLoad){
                var xmlhttp = new XMLHttpRequest, url=this.getRepo(fireBaseRepo);
                xmlhttp.open("POST",url,true);
                xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xmlhttp.send( JSON.stringify(payLoad) );



                
                var emailPayload={};
                emailPayload.form=payLoad;
                payloadText='';
                payloadHTML="<table>"
                for (var key in emailPayload.form) {
                    payloadText+=' \r\n '+key+" : "+emailPayload.form[key].value
                    payloadHTML+=' <tr><td> '+key+" </td> <td>"+emailPayload.form[key].value+'</td> </tr>'
                };
                payloadText+='</table>'


               // emailPayload.confirmation = emailPayload.form[key]

                emailPayload.fireBaseRepo=fireBaseRepo;
                emailPayload.payloadText=payloadText;
                emailPayload.payloadHTML=payloadHTML;
                emailPayload.uid = "simplelogin:"+user
                emailPayload.fireFormRepo=that.repo;
                emailPayload.emailConfirmation= that.emailConfirmation? that.emailConfirmation:undefined;
                emailPayload.emailConfirmationFrom=that.emailConfirmationFrom? that.emailConfirmationFrom:'no-reply@'+window.location.host;
                emailPayload.emailConfirmationSubject=that.emailConfirmationSubject? that.emailConfirmationSubject:'Confirming your submition to'+window.location.host;
                emailPayload.emailConfirmationBodyText=that.emailConfirmationBodyText? that.emailConfirmationBodyText:'Thanks for you submition!';
                emailPayload.emailConfirmationBodyHTML=that.emailConfirmationBodyHTML? that.emailConfirmationBodyHTML:'<p>Thanks for your submition!<p>';


                emailPayload.emailNotification= that.emailNotification? that.emailNotification:undefined;



                var urlEmailC = 'https://fireform.firebaseio.com/emailQConfirmation.json'//this.getEmailRepo(fireBaseRepo)
                var xmlhttpEmailC = new XMLHttpRequest;  //this.getRepo(fireBaseRepo);
                xmlhttpEmailC.open("POST",urlEmailC,true);
                xmlhttpEmailC.setRequestHeader("Content-type", "application/x-www-form-urlencoded");


                var urlEmailN = 'https://fireform.firebaseio.com/emailQNotification.json'//this.getEmailRepo(fireBaseRepo)
                var xmlhttpEmailN = new XMLHttpRequest;  //this.getRepo(fireBaseRepo);
                xmlhttpEmailN.open("POST",urlEmailN,true);
                xmlhttpEmailN.setRequestHeader("Content-type", "application/x-www-form-urlencoded");


                // var xmlhttpEmailConfirmation = new XMLHttpRequest;  //this.getRepo(fireBaseRepo);
                // xmlhttpEmailConfirmation.open("PUT",urlEmail+'emailConfirmationContent.json',true);
                // xmlhttpEmailConfirmation.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                // emailPayload.email = emailPayload.email? emailPayload.email:{value:null};
                // xmlhttpEmailConfirmation.send( JSON.stringify(emailPayload) );


                // xmlhttpEmailConfirmation.onreadystatechange=function(){
                //     if (xmlhttpEmailConfirmation.readyState == 4) {
                //         //email updated
                //         xmlhttpEmailConfirmationDel.send( JSON.stringify({uid:"simplelogin:"+user, fireFormRepo:that.repo}) );//defined below
                //     }
                // }  
                // var xmlhttpEmailConfirmationDel = new XMLHttpRequest
                // xmlhttpEmailConfirmationDel.open("PUT",urlEmail+'emailConfirmationContent.json',true);
                // xmlhttpEmailConfirmationDel.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                // xmlhttpEmailConfirmationDel.onreadystatechange=function(){
                //     if (xmlhttpEmailConfirmationDel.readyState == 4) {
                //         //email updated

                //     }
                // }   
                
                 xmlhttpEmailC.send( JSON.stringify(emailPayload) );
                 xmlhttpEmailN.send( JSON.stringify(emailPayload) );
                // xmlhttpEmail.onreadystatechange=function(){
                //     if (xmlhttpEmail.readyState == 4) {
                //         //email updated
                //      xmlhttpEmailDel.send( JSON.stringify({uid:"simplelogin:"+user, fireFormRepo:that.repo}) );//defined below

                //     }
                // }    
                // var xmlhttpEmailDel = new XMLHttpRequest
                // xmlhttpEmailDel.open("PUT",urlEmail+'emailNotificationContent.json',true);
                // xmlhttpEmailDel.setRequestHeader("Content-type", "application/x-www-form-urlencoded");


                // xmlhttpEmailDel.onreadystatechange=function(){
                //     if (xmlhttpEmail.readyState == 4) {
                //         //email updated
                //     }
                // }    

                xmlhttp.onreadystatechange=function(){
                    if (xmlhttp.readyState == 4) {
                        formDOMObject.className += " "+successClass
                        if (!options || !options.disableInput) that.disableInput(that.submitElement);
                        if (options && options.callback) options.callback(null,{url:url});
                    }
                }                
            }

            this.disableInput=function(submit){
                var att=document.createAttribute("disabled");
                        att.value="true";
                        submit.setAttributeNode(att);
            }

            submitElement.onclick=this.submit;
            return this;


    };
