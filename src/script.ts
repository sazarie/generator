import {GenerateRandomNumbersMessage} from "./GenerateRandomNumbersMessage";
import {IComponent, Div, TextComponent, Form, Button, Label, Input} from "./Components";
import 'bootstrap/dist/css/bootstrap.min.css';

let socket: WebSocket
let resultElement: HTMLElement

window.addEventListener('DOMContentLoaded', () => {
    const app: IComponent = new Div(["container"], {style: "width: 30%;"}, [
        new Form(["m-4"], {}, [
            new Div(["mb-3"], {}, [
                new Label(["form-label"], {}, [new TextComponent("Введите количество чисел для генерации")]),
                new Input(["form-control"], {
                    style: "width: 50%;",
                    name: "limit",
                    type: "number",
                    value: "100",
                    min: 1
                })
            ]),
            new Div(["mb-3"], {}, [
                new Label(["form-label"], {}, [new TextComponent("Введите количество горутин, которые будут генерировать числа для Вас")]),
                new Input(["form-control"], {style: "width: 50%;", name: "goNum", type: "number", value: "10", min: 1})
            ]),
            new Button(["btn", "btn-primary"], {}, [
                new TextComponent("Отправить")
            ]),
        ], {onsubmit: sendForm}),
        new Div([], {id: "result"}),

        new Button(["btn", "btn-primary"], {}, [
            new TextComponent("cancel")
        ], {onclick: cancelGeneration}),
    ])

    const root = document.getElementById("root")
    app.render(root)

    resultElement = document.getElementById("result")

    socket = new WebSocket("ws://localhost:8080/ws");

    socket.onmessage = function (event: MessageEvent) {
        resultElement.innerHTML += event.data + " ";
    };

    socket.onclose = function (event: CloseEvent) {
        console.error("Unexpected socket close")
    };

    socket.onerror = function (ev) {
        console.error("Socket error")
    }

})

window.addEventListener('beforeunload', () => {
    cancelGeneration()
})

function cancelGeneration() {
    const requestData: GenerateRandomNumbersMessage = {messageType: "cancel_generation", limit: 0, goNum: 0};
    socket.send(JSON.stringify(requestData));
}

function sendForm(e: Event) {
    e.preventDefault();
    resultElement.innerHTML = "";
    const target: HTMLFormElement = e.target as HTMLFormElement;
    const formData: FormData = new FormData(target);

    const limit: number = parseInt(formData.get("limit")!.toString());
    const goNum: number = parseInt(formData.get("goNum")!.toString());
    console.log(limit);

    const requestData: GenerateRandomNumbersMessage = {messageType: "start_generation", limit, goNum};
    const jsonRequest: string = JSON.stringify(requestData); // Создаю строку вида { "limit": 1, "goNum": 1 }
    socket.send(jsonRequest);
}


// window.addEventListener('DOMContentLoaded', () => {
// // const socket: WebSocket = new WebSocket("ws://localhost:8080/ws");

// const resultElement: HTMLElement = document.getElementById("result")!;

// // socket.on("message", () => {console.log("message")})

// // socket.onmessage = function (event: MessageEvent) {
//   // resultElement.innerHTML += event.data + " ";
// // };

// // sendForm - Функция отправляет форму, получает сгенерированные числа и отображает их на странице
// function sendForm(event: SubmitEvent) {
//   event.preventDefault();
//   resultElement.innerHTML = "";
//   const target: HTMLFormElement = event.target as HTMLFormElement;
//   const formData: FormData = new FormData(target);

//   const limit: number = parseInt(formData.get("limit")!.toString());
//   const goNum: number = parseInt(formData.get("goNum")!.toString());
//   console.log(limit);

//   const requestData: GenerateRandomNumbersRequest = { limit, goNum };
//   console.log(requestData);
//   const jsonRequest: string = JSON.stringify(requestData); // Создаю строку вида { "limit": 1, "goNum": 1 }
//   console.log(jsonRequest);
//   // socket.send(jsonRequest);
// }
// }, false);


