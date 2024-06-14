const express = require('express')
const uuid = require('uuid')
const port = 3000
const app = express()
app.use(express.json())
const orders = []


const checKOrdersId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if(index < 0){
        return response.status(404).json({ message: "Order not found"})
    }

    const findOrder = orders.find(order => order.id === id)

    if(!findOrder){
        return response.status(404).json({ message: "Order not found"})
    }
    request.orderIndex = index
    request.orderId = id
    request.orderFind = findOrder

    next()
}

const logRequest = (request, response, next) => {
    console.log(`Method: ${request.method}, URL: ${request.url}`)

    next()
}
app.use(logRequest)


app.post('/orders', (request, response) => {
    const { order, clientName, price } = request.body

    const newOrder = { id:uuid.v4(), order, clientName, price, status:"Em preparação"}

    orders.push(newOrder)

    return response.status(201).json(newOrder)
})

app.get('/orders', (request, response) => {
    return response.json(orders)
})

app.put('/orders/:id',checKOrdersId, (request, response) => { 
    const { order, clientName, price} = request.body
    const index = request.orderIndex 
    const id = request.orderId


    const updatedOrder = { id, order, clientName, price, status: "Em preparação"}


    orders[index] = updatedOrder

    return response.json(updatedOrder)

})

app.delete('/orders/:id',checKOrdersId, (request, response) => {
    const index = request.orderIndex 

     orders.splice(index,1)

    return response.status(204).json()
})

app.get('/orders/:id',checKOrdersId, (request, response) => {
    const { order, clientName, price} = request.body
    const findOrder = request.orderFind
    const id = request.orderId

    const updatedOrder = { id, order, clientName, price, status: "Em preparação"}

    orders[updatedOrder] = findOrder

    return response.json(findOrder)
})

app.patch('/orders/:id',checKOrdersId, (request, response) => {
    const { order, clientName, price} = request.body
    const findOrder = request.orderFind
    const id = request.orderId

    const updatedOrder = { id, order, clientName, price, status: "Pedido Pronto"}

    orders[updatedOrder] = findOrder
    findOrder.status = "Pedido Pronto"

    return response.json(findOrder)

})


app.listen(port, () =>{
    console.log(`🚀 Server started on port ${port}`)
})
