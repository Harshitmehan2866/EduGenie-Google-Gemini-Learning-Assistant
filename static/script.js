/* ==========================================================
   EduGenie
   Google Gemini Learning Assistant
========================================================== */

// ==========================================================
// Global Language
// ==========================================================

function getLanguage() {

    return document
        .getElementById("global-lang")
        .value;

}

// ==========================================================
// Helper Functions
// ==========================================================

function show(id) {

    document
        .getElementById(id)
        .classList
        .remove("hidden");

}

function hide(id) {

    document
        .getElementById(id)
        .classList
        .add("hidden");

}

function escapeHTML(text){

    const div=document.createElement("div");

    div.innerText=text;

    return div.innerHTML;

}

function setLoading(buttonId,isLoading){

    const button=document.getElementById(buttonId);

    const loader=button.querySelector(".btn-loader");

    const text=button.querySelector(".btn-text");

    if(isLoading){

        button.disabled=true;

        loader.classList.remove("hidden");

        text.style.display="none";

    }

    else{

        button.disabled=false;

        loader.classList.add("hidden");

        text.style.display="inline";

    }

}

// ==========================================================
// ASK AI
// ==========================================================

async function submitAsk(){

    const question=document
    .getElementById("ask-input")
    .value
    .trim();

    if(question===""){

        alert("Please enter a question.");

        return;

    }

    setLoading("ask-btn",true);

    try{

        const response=await fetch("/ask",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                question:question,

                lang:getLanguage()

            })

        });

        const data=await response.json();

        const output=document.getElementById("ask-output");

        show("ask-output");

        if(data.answer){

            output.innerHTML=data.answer;

        }

        else{

            output.innerHTML=data.error;

        }

    }

    catch(error){

        alert(error);

    }

    setLoading("ask-btn",false);

}
// ==========================================================
// Chat Helpers
// ==========================================================

function appendMessage(text,type){

    const window=document.getElementById("chat-window");

    const bubble=document.createElement("div");

    bubble.className=

        "message "+

        (type==="user"

        ?"user-message"

        :"bot-message");

    bubble.innerHTML=text;

    window.appendChild(bubble);

    window.scrollTop=window.scrollHeight;

    return bubble;

}



// ==========================================================
// Streaming Chat
// ==========================================================

async function submitChat(){

    const input=document

    .getElementById("chat-input");

    const message=input.value.trim();

    if(message===""){

        return;

    }

    appendMessage(

        escapeHTML(message),

        "user"

    );

    input.value="";

    setLoading(

        "chat-btn",

        true

    );

    const botBubble=

        appendMessage(

            "",

            "bot"

        );

    try{

        const response=

        await fetch(

            "/chat",

            {

                method:"POST",

                headers:{

                    "Content-Type":

                    "application/json"

                },

                body:JSON.stringify({

                    message:message

                })

            }

        );

        const reader=

        response.body.getReader();

        const decoder=

        new TextDecoder();

        let buffer="";

        while(true){

            const {value,done}

            =await reader.read();

            if(done){

                break;

            }

            buffer+=

            decoder.decode(

                value,

                {

                    stream:true

                }

            );

            const lines=

            buffer.split("\n");

            buffer=

            lines.pop();

            for(const line of lines){

                if(

                    line.startsWith(

                        "data: "

                    )

                ){

                    const chunk=

                    line.replace(

                        "data: ",

                        ""

                    );

                    if(

                        chunk==="[DONE]"

                    ){

                        continue;

                    }

                    if(

                        chunk.startsWith(

                            "[ERROR]"

                        )

                    ){

                        botBubble.innerHTML=

                        chunk;

                        continue;

                    }

                    botBubble.innerHTML+=chunk;

                    const window=

                    document.getElementById(

                        "chat-window"

                    );

                    window.scrollTop=

                    window.scrollHeight;

                }

            }

        }

    }

    catch(error){

        botBubble.innerHTML=

        "<b>Error:</b> "+

        error;

    }

    setLoading(

        "chat-btn",

        false

    );

}



// ==========================================================
// Clear Chat
// ==========================================================

async function clearChat(){

    await fetch(

        "/clear",

        {

            method:"POST"

        }

    );

    document

    .getElementById(

        "chat-window"

    ).innerHTML=

    `

    <div class="chat-welcome">

    👋 Hi! I'm EduGenie.

    Ask me anything about your studies.

    </div>

    `;

}
// ==========================================================
// Quiz Generator
// ==========================================================

async function submitQuiz(){

    const formData=new FormData();

    const topic=document
        .getElementById("quiz-topic")
        .value
        .trim();

    const file=document
        .getElementById("quiz-file")
        .files[0];

    formData.append(

        "lang",

        getLanguage()

    );

    if(topic!==""){

        formData.append(

            "topic",

            topic

        );

    }

    if(file){

        formData.append(

            "file",

            file

        );

    }

    if(topic==="" && !file){

        alert(

            "Enter a topic or upload a file."

        );

        return;

    }

    setLoading(

        "quiz-btn",

        true

    );

    try{

        const response=

        await fetch(

            "/quiz",

            {

                method:"POST",

                body:formData

            }

        );

        const data=

        await response.json();

        const output=

        document.getElementById(

            "quiz-output"

        );

        output.innerHTML="";

        show("quiz-output");

        if(data.error){

            output.innerHTML=

            "<b>"+

            data.error+

            "</b>";

            setLoading(

                "quiz-btn",

                false

            );

            return;

        }

        data.quiz.forEach(

            (question,index)=>{

                const card=

                document.createElement(

                    "div"

                );

                card.className=

                "question-card";

                let html=`

                <div class="question-title">

                ${index+1}. ${question.question}

                </div>

                `;

                Object.entries(

                    question.options

                ).forEach(

                    ([key,value])=>{

                        html+=`

                        <div

                        class="option"

                        onclick="checkAnswer(this,'${key}','${question.correct}','${question.explanation}')">

                        <b>${key}.</b>

                        ${value}

                        </div>

                        `;

                    }

                );

                card.innerHTML=html;

                output.appendChild(card);

            }

        );

    }

    catch(error){

        alert(error);

    }

    setLoading(

        "quiz-btn",

        false

    );

}



// ==========================================================
// Quiz Answer Checker
// ==========================================================

function checkAnswer(

    element,

    selected,

    correct,

    explanation

){

    const options=

    element.parentElement

    .querySelectorAll(

        ".option"

    );

    options.forEach(

        option=>{

            option.style.pointerEvents=

            "none";

        }

    );

    if(selected===correct){

        element.classList.add(

            "correct"

        );

    }

    else{

        element.classList.add(

            "incorrect"

        );

        options.forEach(

            option=>{

                if(

                    option.innerHTML

                    .startsWith(

                        "<b>"+

                        correct+

                        "."

                    )

                ){

                    option.classList.add(

                        "correct"

                    );

                }

            }

        );

    }

    const note=

    document.createElement(

        "div"

    );

    note.style.marginTop="15px";

    note.style.fontWeight="600";

    note.innerHTML=

    "Explanation: "+

    explanation;

    element.parentElement

    .appendChild(note);

}
// ==========================================================
// Summarizer
// ==========================================================

async function submitSummary(){

    const formData=new FormData();

    const text=document
        .getElementById("summary-content")
        .value
        .trim();

    const file=document
        .getElementById("summary-file")
        .files[0];

    formData.append(

        "lang",

        getLanguage()

    );

    if(text!==""){

        formData.append(

            "content",

            text

        );

    }

    if(file){

        formData.append(

            "file",

            file

        );

    }

    if(text==="" && !file){

        alert(

            "Please enter text or upload a file."

        );

        return;

    }

    setLoading(

        "summary-btn",

        true

    );

    try{

        const response=

        await fetch(

            "/summary",

            {

                method:"POST",

                body:formData

            }

        );

        const data=

        await response.json();

        const output=

        document.getElementById(

            "summary-output"

        );

        show("summary-output");

        if(data.summary){

            output.innerHTML=data.summary;

        }

        else{

            output.innerHTML=

            "<b>"+

            data.error+

            "</b>";

        }

    }

    catch(error){

        alert(error);

    }

    setLoading(

        "summary-btn",

        false

    );

}



// ==========================================================
// File Selection
// ==========================================================

function handleFileSelect(section){

    const input=document.getElementById(

        section+"-file"

    );

    if(!input.files.length){

        return;

    }

    const file=input.files[0];

    const label=document.getElementById(

        section+"-file-name"

    );

    label.classList.remove(

        "hidden"

    );

    label.innerHTML=

        "✅ "+file.name;

}



// ==========================================================
// Tabs
// ==========================================================

function switchTab(section,type){

    const tabs=document

        .querySelectorAll(

            "#" +

            section +

            "-tabs .tab"

        );

    tabs.forEach(

        tab=>tab.classList.remove(

            "active"

        )

    );

    if(type==="topic"||type==="text"){

        tabs[0].classList.add(

            "active"

        );

    }

    else{

        tabs[1].classList.add(

            "active"

        );

    }

    if(section==="quiz"){

        document

        .getElementById(

            "quiz-topic-panel"

        )

        .classList.toggle(

            "hidden",

            type!=="topic"

        );

        document

        .getElementById(

            "quiz-file-panel"

        )

        .classList.toggle(

            "hidden",

            type!=="file"

        );

    }

    if(section==="summary"){

        document

        .getElementById(

            "summary-text-panel"

        )

        .classList.toggle(

            "hidden",

            type!=="text"

        );

        document

        .getElementById(

            "summary-file-panel"

        )

        .classList.toggle(

            "hidden",

            type!=="file"

        );

    }

}
// ==========================================================
// Keyboard Shortcuts
// ==========================================================

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        const askInput=

        document.getElementById(

            "ask-input"

        );

        if(askInput){

            askInput.addEventListener(

                "keydown",

                function(event){

                    if(

                        event.ctrlKey &&

                        event.key==="Enter"

                    ){

                        event.preventDefault();

                        submitAsk();

                    }

                }

            );

        }



        const chatInput=

        document.getElementById(

            "chat-input"

        );

        if(chatInput){

            chatInput.addEventListener(

                "keydown",

                function(event){

                    if(

                        event.ctrlKey &&

                        event.key==="Enter"

                    ){

                        event.preventDefault();

                        submitChat();

                    }

                }

            );

        }



        const summaryInput=

        document.getElementById(

            "summary-content"

        );

        if(summaryInput){

            summaryInput.addEventListener(

                "keydown",

                function(event){

                    if(

                        event.ctrlKey &&

                        event.key==="Enter"

                    ){

                        event.preventDefault();

                        submitSummary();

                    }

                }

            );

        }



        // Auto Resize Textareas

        document

        .querySelectorAll(

            "textarea"

        )

        .forEach(

            textarea=>{

                textarea.addEventListener(

                    "input",

                    function(){

                        this.style.height="auto";

                        this.style.height=

                        this.scrollHeight+

                        "px";

                    }

                );

            }

        );



        console.log(

            "🎓 EduGenie Loaded Successfully"

        );

    }

);



// ==========================================================
// Utility
// ==========================================================

window.addEventListener(

    "load",

    ()=>{

        console.log(

            "Google Gemini Learning Assistant Ready."

        );

    }

);