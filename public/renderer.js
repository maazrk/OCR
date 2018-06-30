const zerorpc = require("zerorpc")
window.client = new zerorpc.Client()

window.client.connect("tcp://127.0.0.1:4242")

// window.client.invoke("echo", "server ready", (error, res) => {
//   if(error || res !== 'server ready') {
//     console.error(error)
//   } else {
//     console.log("server is ready")
//   }
// })

// let formula = document.querySelector('#formula')
// let result = document.querySelector('#result')

// formula.addEventListener('input', () => {
//   window.client.invoke("calc", formula.value, (error, res) => {
//     if(error) {
//       console.error(error)
//     } else {
//       result.textContent = res
//     }
//   })
// })

// formula.dispatchEvent(new Event('input'))
